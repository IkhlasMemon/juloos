<?php

namespace App\Http\Requests;

use App\Models\Report;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'purpose_id' => ['nullable', 'exists:purposes,id'],
            'event_id' => ['nullable', 'exists:events,id'],
            'squad_id' => ['nullable', 'exists:squads,id'],
            'masjid_id' => ['nullable', 'exists:masjids,id'],
            'volunteer_type_id' => ['nullable', 'exists:volunteer_types,id'],
            'columns' => ['nullable', 'array', 'min:1'],
            'columns.*' => ['string', Rule::in(array_keys(Report::COLUMNS))],
        ];
    }
}
