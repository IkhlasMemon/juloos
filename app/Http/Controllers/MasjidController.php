<?php

namespace App\Http\Controllers;

use App\Http\Requests\MasjidRequest;
use App\Models\Masjid;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MasjidController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('masjids/index', [
            'masjids' => Masjid::withCount('registrations as volunteers_count')->orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('masjids/create');
    }

    public function store(MasjidRequest $request): RedirectResponse
    {
        Masjid::create($request->validated());

        return to_route('masjids.index')->with('success', 'Masjid created.');
    }

    public function edit(Masjid $masjid): Response
    {
        return Inertia::render('masjids/edit', [
            'masjid' => $masjid,
        ]);
    }

    public function update(MasjidRequest $request, Masjid $masjid): RedirectResponse
    {
        $masjid->update($request->validated());

        return to_route('masjids.index')->with('success', 'Masjid updated.');
    }

    public function destroy(Masjid $masjid): RedirectResponse
    {
        if ($masjid->registrations()->exists()) {
            return back()->with('error', 'This masjid is used in event registrations and cannot be deleted. Deactivate it instead.');
        }

        $masjid->delete();

        return to_route('masjids.index')->with('success', 'Masjid deleted.');
    }

    public function toggle(Masjid $masjid): RedirectResponse
    {
        $masjid->update(['is_active' => ! $masjid->is_active]);

        return back()->with('success', $masjid->is_active ? 'Masjid activated.' : 'Masjid deactivated.');
    }
}
