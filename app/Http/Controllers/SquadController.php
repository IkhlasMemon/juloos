<?php

namespace App\Http\Controllers;

use App\Http\Requests\SquadRequest;
use App\Models\Squad;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SquadController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('squads/index', [
            'squads' => Squad::withCount('registrations as volunteers_count')->orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('squads/create');
    }

    public function store(SquadRequest $request): RedirectResponse
    {
        Squad::create($request->validated());

        return to_route('squads.index')->with('success', 'Squad created.');
    }

    public function edit(Squad $squad): Response
    {
        return Inertia::render('squads/edit', [
            'squad' => $squad,
        ]);
    }

    public function update(SquadRequest $request, Squad $squad): RedirectResponse
    {
        $squad->update($request->validated());

        return to_route('squads.index')->with('success', 'Squad updated.');
    }

    public function destroy(Squad $squad): RedirectResponse
    {
        if ($squad->registrations()->exists()) {
            return back()->with('error', 'This squad is used in event registrations and cannot be deleted. Deactivate it instead.');
        }

        $squad->delete();

        return to_route('squads.index')->with('success', 'Squad deleted.');
    }

    public function toggle(Squad $squad): RedirectResponse
    {
        $squad->update(['is_active' => ! $squad->is_active]);

        return back()->with('success', $squad->is_active ? 'Squad activated.' : 'Squad deactivated.');
    }
}
