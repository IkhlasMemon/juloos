<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VolunteerTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $volunteerType = $this->route('volunteer_type');

        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('volunteer_types', 'name')->ignore($volunteerType?->id)],
            'is_active' => ['boolean'],
        ];
    }
}
