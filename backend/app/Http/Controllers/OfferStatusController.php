<?php

namespace App\Http\Controllers;

use App\Models\OfferStatus;
use Illuminate\Http\JsonResponse;

class OfferStatusController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(OfferStatus::all());
    }
}
