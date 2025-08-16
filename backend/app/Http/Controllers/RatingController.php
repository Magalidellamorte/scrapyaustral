<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use App\Services\ExpoNotification;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class RatingController extends Controller
{
    public function update(Request $request, Rating $rating): JsonResponse
    {
        if($rating->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Hubo un error al crear la calificaciòn'
            ], Response::HTTP_BAD_REQUEST);
        }

        if(!$rating->pending) {
            return response()->json([
                'success' => false,
                'message' => 'Ya has realizado esta calificaciòn'
            ], Response::HTTP_BAD_REQUEST);
        }

        $rating->rating = $request->get('rating');
        $rating->message = $request->get('message');
        $rating->pending = false;

        $rating->save();

        $ratedUser = $rating->user_id === $rating->scraper_id ? $rating->client : $rating->scraper;

        $average = Rating::where('pending', false)
            ->where('user_id', '!=', $ratedUser->id)
            ->where(function ($query) use ($ratedUser) {
                $query->where('client_id', $ratedUser->id)
                    ->orWhere('scraper_id', $ratedUser->id);
            })
            ->avg('rating');

       $ratedUser->rating_average = $average;
       $ratedUser->save();

        ExpoNotification::send([$ratedUser],
        '¡Te han dado una calificación!',
        $rating->user->full_name . ' te ha calificado por el anuncio ' . $rating->offer->title, [
            'new_offer' => $rating->offer->id
        ], [
            'goTo' => 'ViewOwnOffer',
            'goToParams' => [
                'id' => $rating->offer->id
            ]
        ]);

        return response()->json([
            'sucess' => true,
            'message' => '¡Calificaciòn guardada correctamente!',
        ]);
    }
}
