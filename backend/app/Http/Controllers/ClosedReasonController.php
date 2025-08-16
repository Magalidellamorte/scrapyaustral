<?php

namespace App\Http\Controllers;

use App\Models\ClosedReason;
use Illuminate\Http\JsonResponse;

class ClosedReasonController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(ClosedReason::all());
    }
}
