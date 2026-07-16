<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SquadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $squad = $this->route('squad');

        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('squads', 'name')->ignore($squad?->id)],
            'is_active' => ['boolean'],
        ];
    }
}
