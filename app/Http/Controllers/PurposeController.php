<?php

namespace App\Http\Controllers;

use App\Http\Requests\PurposeRequest;
use App\Models\Purpose;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PurposeController extends Controller
{
    public function index(Request $request): Response
    {
        $purposes = Purpose::query()
            ->withCount('events')
            ->selectSub(function ($query) {
                $query->from('event_volunteer')
                    ->join('events', 'events.id', '=', 'event_volunteer.event_id')
                    ->whereColumn('events.purpose_id', 'purposes.id')
                    ->selectRaw('count(distinct event_volunteer.volunteer_id)');
            }, 'volunteers_count')
            ->when($request->string('search')->toString(), fn ($query, $search) => $query->where('name', 'like', "%{$search}%")
            )
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('purposes/index', [
            'purposes' => $purposes,
            'filters' => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('purposes/create');
    }

    public function store(PurposeRequest $request): RedirectResponse
    {
        Purpose::create($request->validated());

        return to_route('purposes.index')->with('success', 'Purpose created.');
    }

    public function edit(Purpose $purpose): Response
    {
        return Inertia::render('purposes/edit', [
            'purpose' => $purpose,
        ]);
    }

    public function update(PurposeRequest $request, Purpose $purpose): RedirectResponse
    {
        $purpose->update($request->validated());

        return to_route('purposes.index')->with('success', 'Purpose updated.');
    }

    public function destroy(Purpose $purpose): RedirectResponse
    {
        $purpose->delete();

        return to_route('purposes.index')->with('success', 'Purpose deleted.');
    }
}
