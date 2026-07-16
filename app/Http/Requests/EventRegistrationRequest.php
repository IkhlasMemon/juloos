<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EventRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $event = $this->route('event');

        return [
            'volunteer_id' => [
                'required',
                'exists:volunteers,id',
                Rule::unique('event_volunteer', 'volunteer_id')->where('event_id', $event?->id),
            ],
            'squad_id' => ['required', 'exists:squads,id'],
            'masjid_id' => ['required', 'exists:masjids,id'],
            'volunteer_type_id' => ['required', 'exists:volunteer_types,id'],
        ];
    }
}
