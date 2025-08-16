<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Plan;
use Illuminate\Http\JsonResponse;

class InvoiceController extends Controller
{
    public function index(): JsonResponse
    {
        return response()
            ->json(Invoice::with('subscription')->where('user_id', auth()->user()->id)->orderBy('id','DESC')->get());
    }
    public function plans(): JsonResponse
    {
        return response()
            ->json(Plan::all());
    }
}
