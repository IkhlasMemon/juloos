<?php

namespace App\Http\Controllers;

use App\Http\Requests\AreaRequest;
use App\Models\Area;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AreaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('areas/index', [
            'areas' => Area::withCount('volunteers')->orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('areas/create');
    }

    public function store(AreaRequest $request): RedirectResponse
    {
        Area::create($request->validated());

        return to_route('areas.index')->with('success', 'Area created.');
    }

    public function edit(Area $area): Response
    {
        return Inertia::render('areas/edit', [
            'area' => $area,
        ]);
    }

    public function update(AreaRequest $request, Area $area): RedirectResponse
    {
        $area->update($request->validated());

        return to_route('areas.index')->with('success', 'Area updated.');
    }

    public function destroy(Area $area): RedirectResponse
    {
        if ($area->volunteers()->exists()) {
            return back()->with('error', 'This area is assigned to volunteers and cannot be deleted. Deactivate it instead.');
        }

        $area->delete();

        return to_route('areas.index')->with('success', 'Area deleted.');
    }

    public function toggle(Area $area): RedirectResponse
    {
        $area->update(['is_active' => ! $area->is_active]);

        return back()->with('success', $area->is_active ? 'Area activated.' : 'Area deactivated.');
    }
}
