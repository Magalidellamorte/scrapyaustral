<?php

namespace App\Http\Requests;

use App\Models\City;
use App\Models\Province;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateOfferHogarRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {

        return [
            'address.street' => 'required|max:255',
            'address.street_number' => 'required|max:255',
            'address.postal_code' => 'max:255',
            'address.floor' => 'sometimes|max:255',
            'address.apartment' => 'sometimes|max:255',
            'torky_pickup_at' => 'required|date',
            'torky_pickup_range' => 'required|string',
        ];
    }
}
