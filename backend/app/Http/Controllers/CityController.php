<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Province;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function index(Province $province, Request $request): JsonResponse
    {
        $includes = $request->query('include') ?? [];

        $cities = City::where('province_id', $province->id);

        if (! in_array('unused', $includes)) {
            $cities->used();
        }

        return response()->json($cities->get());
    }
}
