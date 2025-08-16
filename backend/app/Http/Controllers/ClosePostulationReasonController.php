<?php

namespace App\Http\Controllers;

use App\Models\ClosePostulationReason;
use Illuminate\Http\JsonResponse;

class ClosePostulationReasonController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(ClosePostulationReason::all());
    }
}
