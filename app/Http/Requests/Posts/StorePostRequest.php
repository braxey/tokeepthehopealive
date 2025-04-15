<?php

declare(strict_types=1);

namespace App\Http\Requests\Posts;

use Illuminate\Foundation\Http\FormRequest;

final class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'preview_image' => ['nullable', 'image', 'max:5120'],
            'preview_caption' => ['nullable', 'string', 'max:255'],
            'summary' => ['required', 'string'],
            'body' => ['required', 'string'],
        ];
    }
}
