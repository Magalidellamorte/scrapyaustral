<?php

namespace App\Http\Controllers;

use App\Models\Province;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProvinceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $includes = $request->query('include') ?? [];

        $provinces = Province::query();

        if (!in_array('unused', $includes)) {
            $provinces->used();
        }

        return response()->json($provinces->get());
    }
}
