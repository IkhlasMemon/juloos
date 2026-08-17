<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AreaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $area = $this->route('area');

        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('areas', 'name')->ignore($area?->id)],
            'is_active' => ['boolean'],
        ];
    }
}
