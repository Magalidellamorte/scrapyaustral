<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    public function index(): JsonResponse
    {
        $notifications = auth()->user()->notifications()->orderBy('created_at','DESC')->get();

        return response()->json($notifications);
    }

    public function count(): JsonResponse
    {
        return response()->json(['count'=> auth()->user()->notifications()->whereNull('read_at')->count()]);
    }

    public function readAll(): JsonResponse
    {
        $notifications = auth()->user()->notifications()->whereNull('read_at')->get();
        foreach($notifications as $notification){
            $notification->read_at = Carbon::now();
            $notification->save();
        }

        return response()->json([]);
    }
}
