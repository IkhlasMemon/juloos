<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventRegistrationRequest;
use App\Http\Requests\EventRegistrationUpdateRequest;
use App\Http\Requests\EventRequest;
use App\Models\Event;
use App\Models\Masjid;
use App\Models\Purpose;
use App\Models\Squad;
use App\Models\Volunteer;
use App\Models\VolunteerType;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(Request $request): Response
    {
        $events = Event::query()
            ->with('purpose:id,name')
            ->withCount('volunteers')
            ->when($request->string('search')->toString(), fn ($query, $search) => $query->where('name', 'like', "%{$search}%")
            )
            ->when($request->string('status')->toString(), fn ($query, $status) => $query->where('status', $status)
            )
            ->when($request->integer('purpose_id'), fn ($query, $purposeId) => $query->where('purpose_id', $purposeId)
            )
            ->orderByDesc('start_date')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('events/index', [
            'events' => $events,
            'purposes' => Purpose::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only('search', 'status', 'purpose_id'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('events/create', [
            'purposes' => Purpose::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(EventRequest $request): RedirectResponse
    {
        Event::create($request->validated());

        return to_route('events.index')->with('success', 'Event created.');
    }

    public function show(Event $event): Response
    {
        $event->load(['purpose:id,name', 'volunteers' => function ($query) {
            $query->orderBy('name');
        }]);

        (new Collection($event->volunteers->pluck('pivot')))
            ->load(['squad:id,name', 'masjid:id,name', 'volunteerType:id,name']);

        $registeredIds = $event->volunteers->pluck('id');

        return Inertia::render('events/show', [
            'event' => $event,
            'availableVolunteers' => Volunteer::where('status', 'active')
                ->whereNotIn('id', $registeredIds)
                ->orderBy('name')
                ->get(['id', 'name', 'phone']),
            ...$this->lookupOptions(),
        ]);
    }

    public function edit(Event $event): Response
    {
        return Inertia::render('events/edit', [
            'event' => $event,
            'purposes' => Purpose::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(EventRequest $request, Event $event): RedirectResponse
    {
        $event->update($request->validated());

        return to_route('events.index')->with('success', 'Event updated.');
    }

    public function destroy(Event $event): RedirectResponse
    {
        $event->delete();

        return to_route('events.index')->with('success', 'Event deleted.');
    }

    public function register(EventRegistrationRequest $request, Event $event): RedirectResponse
    {
        $event->volunteers()->attach($request->validated('volunteer_id'), [
            'registered_at' => now(),
            'squad_id' => $request->validated('squad_id'),
            'masjid_id' => $request->validated('masjid_id'),
            'volunteer_type_id' => $request->validated('volunteer_type_id'),
        ]);

        return back()->with('success', 'Volunteer registered.');
    }

    public function updateRegistration(EventRegistrationUpdateRequest $request, Event $event, Volunteer $volunteer): RedirectResponse
    {
        $event->volunteers()->updateExistingPivot($volunteer->id, $request->validated());

        return back()->with('success', 'Registration updated.');
    }

    public function unregister(Event $event, Volunteer $volunteer): RedirectResponse
    {
        $event->volunteers()->detach($volunteer->id);

        return back()->with('success', 'Volunteer removed from event.');
    }

    public function badge(Event $event, Volunteer $volunteer): HttpResponse
    {
        $event->load('purpose:id,name');

        $registered = $event->volunteers()->where('volunteers.id', $volunteer->id)->firstOrFail();
        $registered->pivot->load(['squad:id,name', 'masjid:id,name', 'volunteerType:id,name']);

        $pdf = Pdf::loadView('pdf.volunteer-badge', ['event' => $event, 'volunteer' => $registered])
            ->setPaper([0, 0, 560, 340]);

        return $pdf->download("badge-{$event->id}-{$volunteer->id}.pdf");
    }

    public function badges(Event $event): HttpResponse
    {
        $event->load(['purpose:id,name', 'volunteers' => function ($query) {
            $query->orderBy('name');
        }]);

        (new Collection($event->volunteers->pluck('pivot')))
            ->load(['squad:id,name', 'masjid:id,name', 'volunteerType:id,name']);

        $pdf = Pdf::loadView('pdf.volunteer-badges-bulk', ['event' => $event, 'volunteers' => $event->volunteers])
            ->setPaper('a4', 'portrait');

        return $pdf->download("badges-{$event->id}.pdf");
    }

    private function lookupOptions(): array
    {
        return [
            'squads' => Squad::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'masjids' => Masjid::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'volunteerTypes' => VolunteerType::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ];
    }
}
