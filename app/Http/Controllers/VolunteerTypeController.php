<?php

namespace App\Http\Controllers;

use App\Http\Requests\VolunteerTypeRequest;
use App\Models\VolunteerType;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VolunteerTypeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('volunteer-types/index', [
            'volunteerTypes' => VolunteerType::withCount('registrations as volunteers_count')->orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('volunteer-types/create');
    }

    public function store(VolunteerTypeRequest $request): RedirectResponse
    {
        VolunteerType::create($request->validated());

        return to_route('volunteer-types.index')->with('success', 'Volunteer type created.');
    }

    public function edit(VolunteerType $volunteerType): Response
    {
        return Inertia::render('volunteer-types/edit', [
            'volunteerType' => $volunteerType,
        ]);
    }

    public function update(VolunteerTypeRequest $request, VolunteerType $volunteerType): RedirectResponse
    {
        $volunteerType->update($request->validated());

        return to_route('volunteer-types.index')->with('success', 'Volunteer type updated.');
    }

    public function destroy(VolunteerType $volunteerType): RedirectResponse
    {
        if ($volunteerType->registrations()->exists()) {
            return back()->with('error', 'This volunteer type is used in event registrations and cannot be deleted. Deactivate it instead.');
        }

        $volunteerType->delete();

        return to_route('volunteer-types.index')->with('success', 'Volunteer type deleted.');
    }

    public function toggle(VolunteerType $volunteerType): RedirectResponse
    {
        $volunteerType->update(['is_active' => ! $volunteerType->is_active]);

        return back()->with('success', $volunteerType->is_active ? 'Volunteer type activated.' : 'Volunteer type deactivated.');
    }
}
