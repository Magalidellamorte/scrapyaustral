<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\Offer;
use App\Models\Postulation;
use App\Models\Rating;
use App\Services\ExpoNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PostulationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $offers = Postulation::filter($request->all())->with('offer')->paginate()->withQueryString();

        return response()->json($offers);
    }

    public function show(Request $request, Offer $offer, Postulation $postulation): JsonResponse
    {
        return response()->json($postulation);
    }

    public function store(Request $request, Offer $offer): JsonResponse
    {
        $user = auth()->user();

        if ($user->id === $offer->user->id) {
            return response()->json([
                'success' => false,
                'message' => 'No te puedes ofertar a tu propio anuncio',
            ], Response::HTTP_BAD_REQUEST);
        }

        $isEdit = true;

        $postulation = Postulation::where('user_id', $user->id)->where('offer_id', $offer->id)->firstOr(function () use (&$isEdit) {
            $isEdit = false;

            return new Postulation();
        });

        if ($postulation->offer_status_id && 1 != $postulation->offer_status_id && 4 != $postulation->offer_status_id) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes editar una oferta en progreso/rechazada',
            ], Response::HTTP_BAD_REQUEST);
        }

        $postulation->user_id = $user->id;
        $postulation->offer_id = $offer->id;
        $postulation->offer_status_id = 1; // Pendiente
        $postulation->shipment_start_date = $request->shipment_start_date;
        $postulation->shipment_end_date = $request->shipment_end_date;

        $postulation->value_with_shipping = $request->value_with_shipping;
        $postulation->value_without_shipping = $request->value_without_shipping;

        if ($request->pick_by_scraper) {
            $postulation->pick_by_scraper = 'true' === $request->pick_by_scraper;
        }

        if ($request->send_by_client) {
            $postulation->send_by_client = 'true' === $request->send_by_client;
        }

        $postulation->save();

        if (!$isEdit) {
            $text = 'Hola, soy ' . $user->full_name . '. Estoy interesado en: ' . $offer->title . '.';

            ChatMessage::create([
                'sender_id' => $user->id,
                'receiver_id' => $offer->user->id,
                'offer_id' => $offer->id,
                'text' => $text,
                'automatic' => true,
            ]);

            ExpoNotification::send(
                [$offer->user],
                '¡Nuevo interesado para ' . $offer->title . '!',
                $user->full_name . ' hizo una oferta',
                ['new_offer' => $offer->id],
                [
                    'goTo' => 'ViewOwnOffer',
                    'goToParams' => [
                        'id' => $offer->id,
                    ],
                ]
            );
        } else {
            ExpoNotification::send(
                [$offer->user],
                '¡Editaron una oferta en ' . $offer->title . '!',
                $user->full_name . ' modificó su postulación',
                ['new_offer' => $offer->id],
                [
                    'goTo' => 'ViewOwnOffer',
                    'goToParams' => [
                        'id' => $offer->id,
                    ],
                ]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Te has postulado creada correctamente',
        ]);
    }

    public function accept(Postulation $postulation): JsonResponse
    {
        $user = auth()->user();

        if ($user->id !== $postulation->offer->user->id) {
            return response()->json([
                'success' => false,
                'message' => '¡Solo puedes aceptar postulaciones a tus anuncios!',
            ], Response::HTTP_BAD_REQUEST);
        }

        $rejectedIds = [];

        foreach ($postulation->offer->postulations->where('offer_status_id', 1)->where('id', '!=', $postulation->id) as $p) {
            $p->offer_status_id = 4; // Rechazada
            $p->save();

            $rejectedIds[] = $p->user;
        }

        if (count($rejectedIds)) {
            ExpoNotification::send($rejectedIds, '¡Han rechazado tu postulación!', 'El anunciante de "' . $postulation->offer->title . '" decidió continuar con otro Scraper', [
                'new_offer' => $postulation->offer->id,
            ], [
                'goTo' => 'ViewOwnOffer',
                'goToParams' => [
                    'id' => $postulation->offer->id,
                ],
            ]);
        }

        $postulation->offer_status_id = 2; // En curso

        $offer = $postulation->offer;
        $offer->offer_status_id = 2;

        $postulation->push();

        ExpoNotification::send([$postulation->user], '¡Han aceptado tu postulación!', 'Tu postulación para ' . $offer->title . ' fue aceptada', [
            'new_offer' => $offer->id,
        ], [
            'goTo' => 'ChatInternal',
            'goToParams' => [
                'toUser' => $user,
                'offerId' => $offer->id,
            ],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Has aceptado la oferta',
        ]);
    }

    public function reject(Postulation $postulation): JsonResponse
    {
        $user = auth()->user();

        if ($user->id !== $postulation->offer->user->id) {
            return response()->json([
                'success' => false,
                'message' => '¡Solo puedes aceptar postulaciones a tus anuncios!',
            ], Response::HTTP_BAD_REQUEST);
        }

        $postulation->offer_status_id = 4; // Rechazada
        $postulation->save();

        ExpoNotification::send([$postulation->user], '¡Han rechazado tu postulación!', 'Tu postulación para ' . $postulation->offer->title . ' fue rechazada', [
            'new_offer' => $postulation->offer->id,
        ], [
            'goTo' => 'ViewOwnOffer',
            'goToParams' => [
                'id' => $postulation->offer->id,
            ],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Has rechazado la oferta',
        ]);
    }

    public function confirm(Request $request, Postulation $postulation): JsonResponse
    {
        $user = auth()->user();
        $offer = Offer::where('id', $postulation->offer_id)->first();
        $offer->offer_status_id = 3;
        $offer->save();

        $offerPostulations = Postulation::where('offer_id', $postulation->offer_id)
        ->where('id', '!=', $postulation->id)
        ->whereIn('offer_status_id', [1, 2, 4])
        ->get();
        foreach ($offerPostulations as $offerPostulation) {
            $offerPostulation->offer_status_id = 6; // Finalizada con error
            $offerPostulation->save();
        }

        $postulation->offer_status_id = 3; // Finalizada con exito
        $postulation->save();

        Rating::create([
            'scraper_id' => $postulation->user->id,
            'client_id' => $offer->user->id,
            'user_id' => $user->id,
            'offer_id' => $postulation->offer_id,
            'rating' => $request->rating,
            'message' => $request->reason,
            'pending' => 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => $request->rating . ' - ' . $request->reason . ' - ' . $postulation->user->id . ' - OK',
        ]);
    }

    public function rating(Request $request, Postulation $postulation): JsonResponse
    {
        $user = auth()->user();
        $offer = Offer::where('id', $postulation->offer_id)->first();

        Rating::create([
            'scraper_id' => $postulation->user->id,
            'client_id' => $offer->user->id,
            'user_id' => $user->id,
            'offer_id' => $postulation->offer_id,
            'rating' => $request->rating,
            'message' => $request->message,
            'pending' => 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => ' OK',
        ]);
    }

    public function delete(Request $request, Postulation $postulation): JsonResponse
    {
        $postulation->offer_status_id = 5; // Finalizada con exito
        $postulation->save();

        return response()->json([
            'success' => true,
            'message' => 'OK',
        ]);
    }

    public function startWithdrawal(Postulation $postulation): JsonResponse
    {
        $user = auth()->user();

        if ($user->id !== $postulation->user->id) {
            return response()->json([
                'success' => false,
                'message' => '¡Solo puedes iniciar retiro de tus postulaciones!',
            ], Response::HTTP_BAD_REQUEST);
        }

        if (2 != $postulation->offer_status_id) { // En curso
            return response()->json([
                'success' => false,
                'message' => '¡La postulación tiene que estar en curso!',
            ], Response::HTTP_BAD_REQUEST);
        }

        $postulation->offer_status_id = 6; // Retirando
        $postulation->save();

        ExpoNotification::send(
            [$postulation->offer->user],
            '¡Han comenzado un retiro!',
            $postulation->user->full_name . ' inicio el retiro de ' . $postulation->offer->title,
            [
                'new_offer' => $postulation->offer->id,
            ],
            [
                'goTo' => 'ViewOwnOffer',
                'goToParams' => [
                    'id' => $postulation->offer->id,
                ],
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Has comenzado el retiro',
        ]);
    }

    public function received(Postulation $postulation): JsonResponse
    {
        $user = auth()->user();

        if ($user->id !== $postulation->user->id) {
            return response()->json([
                'success' => false,
                'message' => '¡Solo puedes marcar recibidas tus postulaciones!',
            ], Response::HTTP_BAD_REQUEST);
        }

        if (2 != $postulation->offer_status_id && 6 != $postulation->offer_status_id) { // En curso, en retiro
            return response()->json([
                'success' => false,
                'message' => '¡La postulación tiene que estar en curso!',
            ], Response::HTTP_BAD_REQUEST);
        }

        $postulation->offer_status_id = 3; // Finalizada
        $postulation->save();

        $offer = $postulation->offer;

        $ratingExists = Rating::where('user_id', $postulation->user->id)->where('offer_id', $offer->id)->first();

        if (!$ratingExists) {
            Rating::create([
                'user_id' => $postulation->user->id,
                'client_id' => $offer->user->id,
                'pending' => 0,
                'scraper_id' => $postulation->user->id,
                'offer_id' => $offer->id,
            ]);

            Rating::create([
                'user_id' => $offer->user->id,
                'client_id' => $offer->user->id,
                'scraper_id' => $postulation->user->id,
                'pending' => 0,
                'offer_id' => $offer->id,
            ]);
        }

        ExpoNotification::send(
            [$postulation->offer->user],
            '¡Han recibido el producto!',
            $postulation->user->full_name . ' recibió el producto: ' . $postulation->offer->title,
            [
                'new_offer' => $postulation->offer->id,
            ],
            [
                'goTo' => 'ViewOwnOffer',
                'goToParams' => [
                    'id' => $postulation->offer->id,
                ],
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Has recibido el producto',
        ]);
    }

    public function cancel(Request $request, Postulation $postulation)
    {
        $user = auth()->user();

        if ($user->id !== $postulation->user->id) {
            return response()->json([
                'success' => false,
                'message' => '¡Solo puedes cancelar tus postulaciones!',
            ], Response::HTTP_BAD_REQUEST);
        }

        if (2 != $postulation->offer_status_id && 1 != $postulation->offer_status_id) { // En curso, Pendiente
            return response()->json([
                'success' => false,
                'message' => '¡La postulación tiene que estar en curso/pendiente!',
            ], Response::HTTP_BAD_REQUEST);
        }

        if (2 == $postulation->offer_status_id) {// En curso (aceptada)
            $ratingExists = Rating::where('user_id', $postulation->user->id)->where('offer_id', $postulation->offer->id)->first();

            if (!$ratingExists) {
                Rating::create([
                    'user_id' => $postulation->user->id,
                    'client_id' => $postulation->offer->user->id,
                    'scraper_id' => $postulation->user->id,
                    'offer_id' => $postulation->offer->id,
                    'pending' => 0,
                ]);

                Rating::create([
                    'user_id' => $postulation->offer->user->id,
                    'client_id' => $postulation->offer->user->id,
                    'scraper_id' => $postulation->user->id,
                    'offer_id' => $postulation->offer->id,
                    'pending' => 0,
                ]);
            }
        }

        if ($request->reasonId) {
            $postulation->close_postulation_reason_id = $request->reasonId;
        }

        $postulation->offer_status_id = 5; // Cancelada
        $postulation->save();

        ExpoNotification::send(
            [$postulation->offer->user],
            '¡Han cancelado una postulación!',
            $postulation->user->full_name . ' canceló la postulación a ' . $postulation->offer->title,
            [
                'new_offer' => $postulation->offer->id,
            ],
            [
                'goTo' => 'ViewOwnOffer',
                'goToParams' => [
                    'id' => $postulation->offer->id,
                ],
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Has cancelado la postulación',
        ]);
    }
}
