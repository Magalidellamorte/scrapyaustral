<?php

namespace App\Http\Controllers;

use App\Models\Condition;
use Illuminate\Http\JsonResponse;

class ConditionController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Condition::all());
    }
}
