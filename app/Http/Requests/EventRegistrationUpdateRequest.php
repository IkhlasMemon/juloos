<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventRegistrationUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'attendance_status' => ['required', 'in:registered,attended,no_show'],
            'squad_id' => ['required', 'exists:squads,id'],
            'masjid_id' => ['required', 'exists:masjids,id'],
            'volunteer_type_id' => ['required', 'exists:volunteer_types,id'],
        ];
    }
}
