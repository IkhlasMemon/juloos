<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VolunteerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $volunteer = $this->route('volunteer');

        return [
            'name' => ['required', 'string', 'max:255'],
            'father_name' => ['required', 'string', 'max:255'],
            'phone' => [
                'required',
                'regex:/^\d{4}-\d{7}$/',
                Rule::unique('volunteers', 'phone')->ignore($volunteer?->id),
            ],
            'cnic' => [
                'nullable',
                'regex:/^\d{5}-\d{7}-\d{1}$/',
                Rule::unique('volunteers', 'cnic')->ignore($volunteer?->id),
            ],
            'photo' => ['nullable', 'image', 'max:2048'],
            'status' => ['required', 'in:active,inactive'],
            'joined_date' => ['required', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'phone.regex' => 'Phone must be in the format 0333-3333333.',
            'cnic.regex' => 'CNIC must be in the format 99999-9999999-9.',
        ];
    }
}
