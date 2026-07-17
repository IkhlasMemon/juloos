<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventBulkRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'volunteer_ids' => ['required', 'array', 'min:1'],
            'volunteer_ids.*' => ['integer', 'distinct', 'exists:volunteers,id'],
            'squad_id' => ['required', 'exists:squads,id'],
            'masjid_id' => ['required', 'exists:masjids,id'],
            'volunteer_type_id' => ['required', 'exists:volunteer_types,id'],
        ];
    }
}
