<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MasjidRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $masjid = $this->route('masjid');

        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('masjids', 'name')->ignore($masjid?->id)],
            'is_active' => ['boolean'],
        ];
    }
}
