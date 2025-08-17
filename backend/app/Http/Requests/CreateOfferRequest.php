<?php

namespace App\Http\Requests;

use App\Models\City;
use App\Models\Province;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateOfferRequest extends FormRequest
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
            'offer_type_id' => 'required|exists:offer_types,id',
            'client_type_id' => 'sometimes|exists:client_types,id',
            'category_id' => 'required|exists:categories,id',
            'condition_id' => 'required|exists:conditions,id',
            'title' => 'required|max:255',
            'description' => 'required|max:2000',
            'quantity' => 'required|max:2000',
            'measure_type_id' => 'required|exists:measure_types,id',
            'value_with_shipping' => 'sometimes|integer',
            'value_without_shipping' => 'sometimes|integer',
            // 'pick_by_scraper' => 'sometimes|boolean',
            // 'send_by_client' => 'sometimes|boolean',
            'address.street' => 'required|max:255',
            'address.street_number' => 'required|max:255',
            'address.postal_code' => 'max:255',
            'address.floor' => 'sometimes|max:255',
            'address.apartment' => 'sometimes|max:255',

        ];
    }
}
