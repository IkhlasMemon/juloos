<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $logs = Activity::query()
            ->with('causer:id,name')
            ->when($request->string('log_name')->toString(), fn ($query, $logName) => $query->where('log_name', $logName)
            )
            ->when($request->string('search')->toString(), fn ($query, $search) => $query->where('description', 'like', "%{$search}%")
            )
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('activity-logs/index', [
            'logs' => $logs,
            'logNames' => Activity::query()->distinct()->orderBy('log_name')->pluck('log_name'),
            'filters' => $request->only('search', 'log_name'),
        ]);
    }
}
