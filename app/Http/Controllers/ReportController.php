<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReportRequest;
use App\Models\Event;
use App\Models\EventVolunteer;
use App\Models\Masjid;
use App\Models\Purpose;
use App\Models\Report;
use App\Models\Squad;
use App\Models\VolunteerType;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $reports = Report::query()
            ->with(['purpose:id,name', 'event:id,name', 'squad:id,name', 'masjid:id,name', 'volunteerType:id,name', 'creator:id,name'])
            ->when($request->string('search')->toString(), fn ($query, $search) => $query->where('name', 'like', "%{$search}%")
            )
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('reports/index', [
            'reports' => $reports,
            'filters' => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('reports/create', $this->lookupOptions());
    }

    public function store(ReportRequest $request): RedirectResponse
    {
        Report::create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        return to_route('reports.index')->with('success', 'Report created.');
    }

    public function show(Request $request, Report $report): Response
    {
        $report->load(['purpose:id,name', 'event:id,name', 'squad:id,name', 'masjid:id,name', 'volunteerType:id,name', 'creator:id,name']);

        $filters = $this->resolveFilters($request, $report);

        $registrations = $this->registrationsQuery($filters)
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('reports/show', [
            'report' => $report,
            'registrations' => $registrations,
            'filters' => $filters,
            'columns' => $report->visibleColumns(),
            ...$this->lookupOptions(),
        ]);
    }

    public function exportCsv(Request $request, Report $report): StreamedResponse
    {
        $filters = $this->resolveFilters($request, $report);
        $registrations = $this->registrationsQuery($filters)->get();
        $orderedKeys = array_intersect(array_keys(Report::COLUMNS), $report->visibleColumns());
        $definitions = $this->columnDefinitions();

        $filename = Str::slug($report->name).'-'.now()->format('Y-m-d').'.csv';

        return response()->streamDownload(function () use ($registrations, $orderedKeys, $definitions) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, array_map(fn ($key) => Report::COLUMNS[$key], $orderedKeys));

            foreach ($registrations as $registration) {
                fputcsv($handle, array_map(fn ($key) => $definitions[$key]($registration), $orderedKeys));
            }

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    public function exportPdf(Request $request, Report $report): HttpResponse
    {
        $filters = $this->resolveFilters($request, $report);
        $registrations = $this->registrationsQuery($filters)->get();
        $orderedKeys = array_intersect(array_keys(Report::COLUMNS), $report->visibleColumns());
        $definitions = $this->columnDefinitions();

        $columns = collect($orderedKeys)->map(fn ($key) => [
            'label' => Report::COLUMNS[$key],
            'value' => $definitions[$key],
        ])->values();

        $filterLabels = collect([
            $filters['purpose_id'] ? 'Purpose: '.Purpose::find($filters['purpose_id'])?->name : null,
            $filters['event_id'] ? 'Event: '.Event::find($filters['event_id'])?->name : null,
            $filters['squad_id'] ? 'Squad: '.Squad::find($filters['squad_id'])?->name : null,
            $filters['masjid_id'] ? 'Masjid: '.Masjid::find($filters['masjid_id'])?->name : null,
            $filters['volunteer_type_id'] ? 'Volunteer Type: '.VolunteerType::find($filters['volunteer_type_id'])?->name : null,
        ])->filter()->values();

        $pdf = Pdf::loadView('pdf.report', [
            'report' => $report,
            'registrations' => $registrations,
            'filterLabels' => $filterLabels,
            'columns' => $columns,
        ])->setPaper('a4', 'landscape');

        return $pdf->stream(Str::slug($report->name).'-'.now()->format('Y-m-d').'.pdf');
    }

    public function edit(Report $report): Response
    {
        return Inertia::render('reports/edit', [
            'report' => $report,
            'columns' => $report->visibleColumns(),
            ...$this->lookupOptions(),
        ]);
    }

    public function update(ReportRequest $request, Report $report): RedirectResponse
    {
        $report->update($request->validated());

        return to_route('reports.index')->with('success', 'Report updated.');
    }

    public function destroy(Report $report): RedirectResponse
    {
        $report->delete();

        return to_route('reports.index')->with('success', 'Report deleted.');
    }

    private function lookupOptions(): array
    {
        return [
            'purposes' => Purpose::orderBy('name')->get(['id', 'name']),
            'events' => Event::orderByDesc('start_date')->get(['id', 'name']),
            'squads' => Squad::orderBy('name')->get(['id', 'name']),
            'masjids' => Masjid::orderBy('name')->get(['id', 'name']),
            'volunteerTypes' => VolunteerType::orderBy('name')->get(['id', 'name']),
        ];
    }

    private function resolveFilters(Request $request, Report $report): array
    {
        return [
            'purpose_id' => $request->has('purpose_id') ? $request->integer('purpose_id') ?: null : $report->purpose_id,
            'event_id' => $request->has('event_id') ? $request->integer('event_id') ?: null : $report->event_id,
            'squad_id' => $request->has('squad_id') ? $request->integer('squad_id') ?: null : $report->squad_id,
            'masjid_id' => $request->has('masjid_id') ? $request->integer('masjid_id') ?: null : $report->masjid_id,
            'volunteer_type_id' => $request->has('volunteer_type_id') ? $request->integer('volunteer_type_id') ?: null : $report->volunteer_type_id,
        ];
    }

    private function registrationsQuery(array $filters): Builder
    {
        return EventVolunteer::query()
            ->with([
                'volunteer:id,name,father_name,phone,cnic,status,joined_date',
                'event:id,name,location,start_date,end_date,status,purpose_id',
                'event.purpose:id,name',
                'squad:id,name',
                'masjid:id,name',
                'volunteerType:id,name',
            ])
            ->when($filters['event_id'], fn ($query, $eventId) => $query->where('event_id', $eventId))
            ->when($filters['purpose_id'], fn ($query, $purposeId) => $query->whereHas('event', fn ($query) => $query->where('purpose_id', $purposeId))
            )
            ->when($filters['squad_id'], fn ($query, $squadId) => $query->where('squad_id', $squadId))
            ->when($filters['masjid_id'], fn ($query, $masjidId) => $query->where('masjid_id', $masjidId))
            ->when($filters['volunteer_type_id'], fn ($query, $volunteerTypeId) => $query->where('volunteer_type_id', $volunteerTypeId)
            )
            ->orderByDesc('registered_at');
    }

    /**
     * @return array<string, \Closure(EventVolunteer): string>
     */
    private function columnDefinitions(): array
    {
        return [
            'volunteer_name' => fn (EventVolunteer $r) => $r->volunteer->name ?? '',
            'volunteer_father_name' => fn (EventVolunteer $r) => $r->volunteer->father_name ?? '',
            'volunteer_phone' => fn (EventVolunteer $r) => $r->volunteer->phone ?? '',
            'volunteer_cnic' => fn (EventVolunteer $r) => $r->volunteer->cnic ?? '',
            'volunteer_status' => fn (EventVolunteer $r) => $r->volunteer->status ? ucfirst($r->volunteer->status) : '',
            'volunteer_joined_date' => fn (EventVolunteer $r) => $r->volunteer->joined_date?->format('Y-m-d') ?? '',
            'event_name' => fn (EventVolunteer $r) => $r->event->name ?? '',
            'event_location' => fn (EventVolunteer $r) => $r->event->location ?? '',
            'event_start_date' => fn (EventVolunteer $r) => $r->event->start_date?->format('Y-m-d H:i') ?? '',
            'event_end_date' => fn (EventVolunteer $r) => $r->event->end_date?->format('Y-m-d H:i') ?? '',
            'event_status' => fn (EventVolunteer $r) => $r->event->status ? ucfirst($r->event->status) : '',
            'purpose_name' => fn (EventVolunteer $r) => $r->event->purpose->name ?? '',
            'squad_name' => fn (EventVolunteer $r) => $r->squad->name ?? '',
            'masjid_name' => fn (EventVolunteer $r) => $r->masjid->name ?? '',
            'volunteer_type_name' => fn (EventVolunteer $r) => $r->volunteerType->name ?? '',
            'attendance_status' => fn (EventVolunteer $r) => ucfirst(str_replace('_', ' ', $r->attendance_status)),
            'attendance_registered_at' => fn (EventVolunteer $r) => $r->registered_at?->format('Y-m-d H:i') ?? '',
        ];
    }
}
