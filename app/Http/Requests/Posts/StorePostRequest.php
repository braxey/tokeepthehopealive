<?php

namespace App\Http\Requests\Posts;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'body' => 'required|array|min:1',
            'body.*.section_title' => 'nullable|string|max:255',
            'body.*.section_text' => 'nullable|string',
            'summary' => 'required|string',
            'preview_image' => 'required|file|mimes:jpg,png,gif|max:10240',
            'preview_caption' => 'nullable|string|max:255',
            'media.*' => 'nullable|file|mimes:jpg,png,gif,mp4,webm|max:10240',
            'media_positions' => 'nullable|array',
            'media_positions.*' => 'integer',
            'media_captions' => 'nullable|array',
            'media_captions.*' => 'string|nullable|max:255',
        ];
    }
}
