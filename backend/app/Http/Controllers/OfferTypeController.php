<?php

namespace App\Http\Controllers;

use App\Models\OfferType;
use Illuminate\Http\JsonResponse;

class OfferTypeController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(OfferType::all());
    }
}
