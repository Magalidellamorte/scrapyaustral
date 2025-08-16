<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateOfferRequest;
use App\Http\Requests\CreateOfferHogarRequest;
use App\Models\Category;
use App\Models\ChatMessage;
use App\Models\Image;
use App\Models\Offer;
use App\Models\Rating;
use App\Models\City;
use App\Models\OfferTorky;
use App\Models\Province;
use App\Models\Neighborhood;
use App\Services\ExpoNotification;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Intervention\Image\Facades\Image as InterventionImage;
use Storage;
use Mail;

class OfferTorkyController extends Controller
{

    public function index(Request $request): JsonResponse
    {
        $requestData = $request->all();
        $user = auth()->user();

        if($user->type != 'torky'){
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para acceder a esta sección',
            ], Response::HTTP_BAD_REQUEST);
        }

        $today = Carbon::today();

        $dates = OfferTorky::where('user_id', $user->id)
            ->when($request->history === 'true', function($query) {
                return $query->whereNotNull('pickup_at');
            }, function($query) use ($today) {
                return $query->whereNull('pickup_at')
                ->where('expected_start_pickup_at', '>=', $today);
            })
            ->selectRaw('DATE(expected_start_pickup_at) as date')
            ->distinct()
            ->orderBy('date', 'DESC')
            ->pluck('date');

        $formattedOffers = [];
        foreach($dates as $date) {
            $offers = OfferTorky::where('user_id', $user->id)
                ->whereDate('expected_start_pickup_at', $date)
                ->when($request->history === 'true', function($query) {
                    return $query->whereNotNull('pickup_at');
                }, function($query) {
                    return $query->whereNull('pickup_at');
                })
                ->orderBy('expected_start_pickup_at', 'DESC')
                ->with('offer')
                ->get();

            $formattedOffers[] = [
                'date' => $date,
                'offers' => $offers
            ];
        }
        return response()->json([
            'current_date' => $today,
            'offers' => $formattedOffers
        ]);
    }

    public function show(Request $request, OfferTorky $torky): JsonResponse
    {
        $torky->load('user');
        $torky->load('offer');
        $torky->load('offer.user');
        return response()->json($torky);
    }


    public function start(Request $request, OfferTorky $torky): JsonResponse
    {
        $user = auth()->user();
        if($user->id != $torky->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para iniciar este torky'
            ], Response::HTTP_BAD_REQUEST);
        }
        if($torky->started_at) {
            return response()->json([
                'success' => false,
                'message' => 'Este torky ya ha sido iniciado'
            ], Response::HTTP_BAD_REQUEST);
        }
        $torky->started_at = Carbon::now();
        $torky->save();

        $offer = $torky->offer;
        $fullName = $user->first_name . ' ' . $user->last_name;
        // Notificar al anunciante
        ExpoNotification::send([$offer->user], 'El torky ha sido iniciado el viaje!', $fullName . ', tu torky ya está en camino, pronto va a estar en tu dirección para recoger tu reciclable', [
            'new_offer' => $offer->id
        ], [
            'goTo' => 'ViewOwnOfferTorky',
                'goToParams' => [
                    'id' => $offer->id
                ]
            ]);
        return response()->json($torky);
    }

    public function end(Request $request, OfferTorky $torky): JsonResponse
    {
        $user = auth()->user();
        if($user->id != $torky->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para iniciar este torky'
            ], Response::HTTP_BAD_REQUEST);
        }
        if($torky->pickup_at) {
            return response()->json([
                'success' => false,
                'message' => 'Este torky ya ha sido finalizado'
            ], Response::HTTP_BAD_REQUEST);
        }

        $torky->pickup_at = Carbon::now();
        $torky->kg = $request->kg;
        $torky->save();

        $offer = $torky->offer;
        $fullName = $user->first_name . ' ' . $user->last_name;

        // Notificar al anunciante
        ExpoNotification::send([$offer->user], 'El torky ha sido finalizado!', $fullName . ', tu torky ha sido finalizado, gracias por tu colaboración', [
            'new_offer' => $offer->id
        ], [
            'goTo' => 'ViewOwnOfferTorky',
                'goToParams' => [
                    'id' => $offer->id
                ]
            ]);

        return response()->json($torky);
    }

}
