<?php

namespace App\Http\Controllers;

use App\Models\Localidad;
use Illuminate\Http\JsonResponse;

class LocalidadController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Localidad::all());
    }
}
