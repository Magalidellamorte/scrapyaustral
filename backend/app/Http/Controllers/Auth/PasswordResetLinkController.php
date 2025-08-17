<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Jobs\SendEmail;
use App\Mail\ResetPasswordEmail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class PasswordResetLinkController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where(['email' => $request->email])->first();

        if (!$user) {
            return response()->json([
                'success' => true,
                'message' => 'El código de reseteo fue enviado a tu correo electrónico.',
            ]);
        }

        $token = Password::createToken($user);

        SendEmail::dispatch(new ResetPasswordEmail($request->email, $token));

        return response()->json([
            'success' => true,
            'message' => 'El código de reseteo fue enviado a tu correo electrónico.',
        ]);
    }
}
