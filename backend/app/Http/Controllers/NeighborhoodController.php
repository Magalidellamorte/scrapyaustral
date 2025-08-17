<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Neighborhood;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NeighborhoodController extends Controller
{
    public function index(City $city, Request $request): JsonResponse
    {
        $includes = $request->query('include') ?? [];

        $cities = Neighborhood::where('city_id', $city->id);

        if (!in_array('unused', $includes)) {
            $cities->used();
        }

        return response()->json($cities->get());
    }
}
