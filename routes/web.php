<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\MasjidController;
use App\Http\Controllers\PurposeController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SquadController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VolunteerController;
use App\Http\Controllers\VolunteerImportController;
use App\Http\Controllers\VolunteerTypeController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => to_route('login'))->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->middleware('permission:view dashboard')
        ->name('dashboard');

    Route::middleware('permission:import volunteers')->group(function () {
        Route::get('volunteers/import', [VolunteerImportController::class, 'create'])->name('volunteers.import');
        Route::post('volunteers/import', [VolunteerImportController::class, 'store'])->name('volunteers.import.store');
        Route::get('volunteers/import/template', [VolunteerImportController::class, 'template'])->name('volunteers.import.template');
    });

    Route::middleware('permission:manage volunteers')->group(function () {
        Route::resource('volunteers', VolunteerController::class);
        Route::get('volunteers/{volunteer}/card', [VolunteerController::class, 'card'])->name('volunteers.card');
        Route::get('volunteers/{volunteer}/card/download', [VolunteerController::class, 'cardDownload'])->name('volunteers.card.download');
    });

    Route::middleware('permission:manage events')->group(function () {
        Route::resource('events', EventController::class);
        Route::post('events/{event}/volunteers', [EventController::class, 'register'])->name('events.register');
        Route::post('events/{event}/volunteers/bulk', [EventController::class, 'bulkRegister'])->name('events.register.bulk');
        Route::patch('events/{event}/volunteers/{volunteer}', [EventController::class, 'updateRegistration'])->name('events.registration.update');
        Route::delete('events/{event}/volunteers/{volunteer}', [EventController::class, 'unregister'])->name('events.unregister');
        Route::get('events/{event}/volunteers/{volunteer}/badge', [EventController::class, 'badge'])->name('events.badge');
        Route::get('events/{event}/badges', [EventController::class, 'badges'])->name('events.badges');
    });

    Route::middleware('permission:manage purposes')->group(function () {
        Route::resource('purposes', PurposeController::class)->except('show');
    });

    Route::middleware('permission:manage lookups')->group(function () {
        Route::resource('squads', SquadController::class)->except('show');
        Route::patch('squads/{squad}/toggle', [SquadController::class, 'toggle'])->name('squads.toggle');

        Route::resource('masjids', MasjidController::class)->except('show');
        Route::patch('masjids/{masjid}/toggle', [MasjidController::class, 'toggle'])->name('masjids.toggle');

        Route::resource('volunteer-types', VolunteerTypeController::class)->except('show');
        Route::patch('volunteer-types/{volunteer_type}/toggle', [VolunteerTypeController::class, 'toggle'])->name('volunteer-types.toggle');
    });

    Route::middleware('permission:manage users')->group(function () {
        Route::resource('users', UserController::class)->except('show');
    });

    Route::middleware('permission:manage roles')->group(function () {
        Route::resource('roles', RoleController::class)->except('show');
    });

    Route::middleware('permission:view activity logs')->group(function () {
        Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
    });

    Route::middleware('permission:view reports')->group(function () {
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    });

    Route::middleware('permission:manage reports')->group(function () {
        Route::get('reports/create', [ReportController::class, 'create'])->name('reports.create');
        Route::post('reports', [ReportController::class, 'store'])->name('reports.store');
    });

    Route::middleware('permission:view reports')->group(function () {
        Route::get('reports/{report}', [ReportController::class, 'show'])->name('reports.show');
    });

    Route::middleware('permission:export reports')->group(function () {
        Route::get('reports/{report}/export/csv', [ReportController::class, 'exportCsv'])->name('reports.export.csv');
        Route::get('reports/{report}/export/pdf', [ReportController::class, 'exportPdf'])->name('reports.export.pdf');
    });

    Route::middleware('permission:manage reports')->group(function () {
        Route::get('reports/{report}/edit', [ReportController::class, 'edit'])->name('reports.edit');
        Route::match(['put', 'patch'], 'reports/{report}', [ReportController::class, 'update'])->name('reports.update');
        Route::delete('reports/{report}', [ReportController::class, 'destroy'])->name('reports.destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
