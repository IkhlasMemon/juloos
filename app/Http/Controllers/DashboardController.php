<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Purpose;
use App\Models\Volunteer;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $volunteersPerPurpose = Purpose::query()
            ->select('purposes.name')
            ->selectSub(function ($query) {
                $query->from('event_volunteer')
                    ->join('events', 'events.id', '=', 'event_volunteer.event_id')
                    ->whereColumn('events.purpose_id', 'purposes.id')
                    ->selectRaw('count(distinct event_volunteer.volunteer_id)');
            }, 'volunteers_count')
            ->orderByDesc('volunteers_count')
            ->limit(8)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'totalVolunteers' => Volunteer::count(),
                'activeVolunteers' => Volunteer::where('status', 'active')->count(),
                'totalEvents' => Event::count(),
                'upcomingEvents' => Event::where('status', 'upcoming')->count(),
                'totalPurposes' => Purpose::count(),
                'totalRegistrations' => DB::table('event_volunteer')->count(),
            ],
            'volunteersPerPurpose' => $volunteersPerPurpose,
            'recentActivity' => Activity::with('causer:id,name')->latest()->limit(8)->get(),
            'upcomingEventsList' => Event::with('purpose:id,name')
                ->where('status', 'upcoming')
                ->orderBy('start_date')
                ->limit(5)
                ->get(),
        ]);
    }
}
