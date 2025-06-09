<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductFormRequest extends FormRequest
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
            'name'=>'required|string|max:255',
            'description'=>'required|string|max:1000',
            'price'=>'required|numeric|min:0',
            'featured_image'=>'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ];
    }
    public function messages(): array
{
    return [
        'name.required' => 'The product name is required.',
        'name.string' => 'The product name must be a valid string.',
        'name.max' => 'The product name may not be greater than 255 characters.',

        'description.required' => 'The product description is required.',
        'description.string' => 'The product description must be a valid string.',
        'description.max' => 'The product description may not be greater than 1000 characters.',

        'price.required' => 'The price is required.',
        'price.numeric' => 'The price must be a valid number.',
        'price.min' => 'The price must be at least 0.',

        'featured_image.image' => 'The featured image must be an image file.',
        'featured_image.mimes' => 'The featured image must be a file of type: jpeg, png, jpg, gif.',
        'featured_image.max' => 'The featured image must not be larger than 2MB.',
    ];
}

}
