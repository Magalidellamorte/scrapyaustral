<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;

class NewPasswordController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', Rules\Password::defaults()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();
            }
        );

        if($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'success' => false,
                'messsage' => 'Hubo un problema al actualizar tu contraseña'
            ], Response::HTTP_BAD_REQUEST);
        }

        return response()->json([
            'success' => true,
            'messsage' => 'Tu contraseña fue actualizada correctamente'
        ]);
    }
}
