<?php

namespace App\Http\Controllers;

use App\Http\Requests\VolunteerRequest;
use App\Models\Volunteer;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VolunteerController extends Controller
{
    private const SORTABLE_COLUMNS = ['name', 'phone', 'cnic', 'events_count', 'status'];

    public function index(Request $request): Response
    {
        $sort = in_array($request->string('sort')->toString(), self::SORTABLE_COLUMNS, true)
            ? $request->string('sort')->toString()
            : 'name';
        $direction = $request->string('direction')->toString() === 'desc' ? 'desc' : 'asc';

        $volunteers = Volunteer::query()
            ->withCount('events')
            ->when($request->string('search')->toString(), function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('father_name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('cnic', 'like', "%{$search}%");
                });
            })
            ->when($request->string('status')->toString(), fn ($query, $status) => $query->where('status', $status)
            )
            ->orderBy($sort, $direction)
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('volunteers/index', [
            'volunteers' => $volunteers,
            'filters' => $request->only('search', 'status'),
            'sort' => $sort,
            'direction' => $direction,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('volunteers/create');
    }

    public function store(VolunteerRequest $request): RedirectResponse
    {
        $data = $request->safe()->except('photo');

        if ($request->hasFile('photo')) {
            $data['photo_path'] = $request->file('photo')->store('volunteers', 'public');
        }

        Volunteer::create($data);

        return to_route('volunteers.index')->with('success', 'Volunteer created.');
    }

    public function show(Volunteer $volunteer): Response
    {
        $volunteer->load(['events' => function ($query) {
            $query->with('purpose:id,name')->orderByDesc('start_date');
        }]);

        $this->loadPivotDetails($volunteer->events);

        return Inertia::render('volunteers/show', [
            'volunteer' => $volunteer,
            'eventsAttended' => $volunteer->events->where('pivot.attendance_status', 'attended')->count(),
        ]);
    }

    public function edit(Volunteer $volunteer): Response
    {
        return Inertia::render('volunteers/edit', [
            'volunteer' => $volunteer,
        ]);
    }

    public function update(VolunteerRequest $request, Volunteer $volunteer): RedirectResponse
    {
        $data = $request->safe()->except('photo');

        if ($request->hasFile('photo')) {
            if ($volunteer->photo_path) {
                Storage::disk('public')->delete($volunteer->photo_path);
            }
            $data['photo_path'] = $request->file('photo')->store('volunteers', 'public');
        }

        $volunteer->update($data);

        return to_route('volunteers.index')->with('success', 'Volunteer updated.');
    }

    public function destroy(Volunteer $volunteer): RedirectResponse
    {
        if ($volunteer->photo_path) {
            Storage::disk('public')->delete($volunteer->photo_path);
        }

        $volunteer->delete();

        return to_route('volunteers.index')->with('success', 'Volunteer deleted.');
    }

    public function card(Volunteer $volunteer): Response
    {
        $volunteer->load(['events' => function ($query) {
            $query->orderByDesc('event_volunteer.registered_at');
        }]);

        $this->loadPivotDetails($volunteer->events);

        return Inertia::render('volunteers/card', [
            'volunteer' => $volunteer,
            'eventsAttended' => $volunteer->events->where('pivot.attendance_status', 'attended')->count(),
            'latestAssignment' => $this->latestAssignment($volunteer),
        ]);
    }

    public function cardDownload(Volunteer $volunteer): HttpResponse
    {
        $volunteer->load(['events' => function ($query) {
            $query->orderByDesc('event_volunteer.registered_at');
        }]);

        $this->loadPivotDetails($volunteer->events);

        $data = [
            'volunteer' => $volunteer,
            'eventsAttended' => $volunteer->events->where('pivot.attendance_status', 'attended')->count(),
            'latestAssignment' => $this->latestAssignment($volunteer),
        ];

        $pdf = Pdf::loadView('pdf.volunteer-card', $data)->setPaper([0, 0, 350, 550]);

        return $pdf->download("volunteer-card-{$volunteer->id}.pdf");
    }

    /**
     * BelongsToMany doesn't support eager loading a custom pivot's own relations via
     * dot notation (e.g. 'pivot.squad'), so pivot relations are loaded as a separate pass.
     */
    private function loadPivotDetails(\Illuminate\Support\Collection $events): void
    {
        (new Collection($events->pluck('pivot')))
            ->load(['squad:id,name', 'masjid:id,name', 'volunteerType:id,name']);
    }

    /**
     * Squad/Masjid/Volunteer Type from the volunteer's most recent event registration,
     * since these are captured per-event rather than as fixed volunteer attributes.
     */
    private function latestAssignment(Volunteer $volunteer): ?array
    {
        $latest = $volunteer->events->first();

        if (! $latest) {
            return null;
        }

        return [
            'squad' => $latest->pivot->squad,
            'masjid' => $latest->pivot->masjid,
            'volunteer_type' => $latest->pivot->volunteerType,
        ];
    }
}
