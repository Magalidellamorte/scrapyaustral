<?php

namespace App\Http\Controllers;

use App\Jobs\SendEmail;
use App\Mail\SupportQuestionEmail;
use App\Models\Support;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupportController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $user = auth()->user();

        $support = new Support();
        $support->user_id = $user->id;
        $support->question = $request->question;

        $support->save();

        SendEmail::dispatch(new SupportQuestionEmail($user, $support));

        return response()->json([
            'success' => true,
            'message' => '¡Consulta enviada correctamente!'
        ]);
    }
}
