<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class EnsureUserIsAdminLocalidad
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(Request): (Response|RedirectResponse) $next
     */
    public function handle(Request $request, \Closure $next): ResponseAlias
    {
        $user = auth()->user();
        if (!$user || !$user->isAdminLocalidad() || !$user->localidad_id) {
            return response()->json([
                'success' => false,
                'message' => 'Acceso restringido a usuarios administradores.',
            ], ResponseAlias::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
