<?php

namespace App\Http\Controllers;

use App\Models\MeasureType;
use Illuminate\Http\JsonResponse;

class MeasureTypeController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(MeasureType::all());
    }
}
