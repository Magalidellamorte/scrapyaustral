<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateOfferRequest;
use App\Http\Requests\CreateOfferHogarRequest;
use App\Models\Category;
use App\Models\ChatMessage;
use App\Models\Image;
use App\Models\Offer;
use App\Models\Rating;
use App\Models\User;
use App\Models\City;
use App\Models\Province;
use App\Models\Neighborhood;
use App\Models\OfferTorky;
use App\Services\ExpoNotification;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Intervention\Image\Facades\Image as InterventionImage;
use Storage;
use Mail;

class OfferController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $requestData = $request->all();
        $user = auth()->user();
        $offers = Offer::filter($requestData);
        $paginate = null;
        // $offers = new Offer();

        // if(!empty($requestData))
        //     $offers = $offers->filter($requestData);

        if($request->get('view') == 'last_offers'){
            $offers = $offers->where('user_id','!=',$user->id);
        }

        if($user->type === 'torky'){
            $paginate = 1000;
            $offers = $offers->whereHas('address', function($query) {
                $query->where('neighborhood_id', 368);
            });
            $offers = $offers->whereHas('user', function($query) {
                $query->where('type', 'hogar');
            });
            $offers = $offers->whereDoesntHave('torkies');
        }elseif($request->get('own') !== 'true'){
            $offers = $offers->whereHas('user', function($query) {
                $query->where('type', '!=', 'hogar');
            });
        }


        // $distance = intval($request->get('distance')) ?? 0;
        // if ($user->address->latitude && $user->address->longitude && ($distance < 100 && $distance > 0)) {
        //     $offers->inDistance(10, $user->address->latitude, $user->address->longitude);
        // }

        $offers = $offers->with('offerCategories')->orderBy('created_at','DESC')->paginate($paginate)->withQueryString();

        return response()->json([
           $offers,
        ]);
    }

    public function store(CreateOfferRequest $request): JsonResponse
    {
        $user = auth()->user();
        $offer = new Offer();
        $offer->user_id = $user->id;
        $offer->offer_type_id = $request->offer_type_id;
        $offer->category_id = $request->category_id;
        $offer->condition_id = $request->condition_id;
        $offer->offer_status_id = 1; // "Pendiente";
        $offer->title = $request->title;
        $offer->description = $request->description;
        $offer->quantity = $request->quantity;
        $offer->measure_type_id = $request->measure_type_id;

        if($request->value_with_shipping) {
            $offer->value_with_shipping = $request->value_with_shipping;
        }

        if($request->value_without_shipping) {
            $offer->value_without_shipping = $request->value_without_shipping;
        }

        $offer->pick_by_scraper = $request->pick_by_scraper === 'true';
        $offer->send_by_client = $request->pick_by_donor === 'true';
        $offer->valid_until = Carbon::now()->addMonth();
        $offer->save();


        $syncData = [];
        if ($request->category_id) {
            $syncData[$request->category_id] = [
                'measure_type_id' => $request->measure_type_id,
                'quantity' => $request->quantity,
                'condition_id' => $request->condition_id
            ];
        }
        $offer->offerCategories()->sync($syncData);

        $addressMerge=[
            'neighborhood_id' => Neighborhood::createOrGet($request),
            'city_id' => City::createOrGet($request),
            'province_id' => Province::createOrGet($request)
        ];
        $address=array_merge($request['address'],$addressMerge);


        $offer->address()->create($address);

        if ($request->has('images')) {
            foreach ($request->file('images') as $photo) {
                $image = InterventionImage::make($photo);

                $image->resize(800, 600, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
                $image->encode('jpg', 60);

                $path = $photo->hashName(Offer::STORAGE_PATH . $offer->id);
                Storage::disk('public')->put($path, (string) $image);

                // Guarda la ruta y otros datos en la base de datos
                $dbImage = new Image();
                $dbImage->path = $path;
                $dbImage->bytes = Storage::disk('public')->size($path);

                $offer->images()->save($dbImage);
            }
        }

        ExpoNotification::send(Category::find($offer->category_id)->toNotifyNewOffer()->get(), '¡Nuevo anuncio que podría interesarte!', $offer->title . ' se ha publicado', [
            'new_offer' => $offer->id
        ], [
            'goTo' => 'ViewOwnOffer',
            'goToParams' => [
                'id' => $offer->id
            ]
        ]);

        $emailData = [
            'title' => $request->title,
            'description' => $request->description,
            'user' => auth()->user()->first_name .' '.auth()->user()->last_name
        ];

        try {
            Mail::raw("🚀 Nuevo post en Scrapy 🎉: \nTítulo: " . $emailData['title'] . "\nDescripción: " . $emailData['description'] . "\nPublicado por: " . $emailData['user'], function ($message) {
                $message->to('magadm.09@gmail.com')
                ->subject('🚀 Nuevo post en Scrapy 🎉');
            });
        } catch (\Exception $e) {
            \Log::error('Error enviando email de nuevo post: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Publicaciòn creada correctamente',
        ]);
    }


    public function show(Request $request, Offer $offer): JsonResponse
    {
        $offer->load('offerCategories');
        $offer->load('torkies');
        $offer->load('torkies.user');
        return response()->json($offer);
    }

    public function close(Request $request, Offer $offer): JsonResponse
    {
        if($offer->closed_reason_id) {
            return response()->json([
                'success' => false,
                'message' => 'El anuncio ya ha sido finalizado',
            ], Response::HTTP_BAD_REQUEST);
        }

        // $openPostulation = $offer->postulations()->where('offer_status_id', 2)->first();

        // if($openPostulation) {
        //     $openPostulation->offer_status_id = $request->reasonId == 1 ? 3 : 4; // Finalizado o Rechazada
        //     $openPostulation->mark_as_reciever = true;
        //     $openPostulation->save();

        //     if($request->reasonId == 1) {
        //         ExpoNotification::send([$openPostulation->user],
        //         '¡Te han entregado el material!',
        //         'El anunciante de "' . $openPostulation->offer->title . '" indicó que te entregó el material', [
        //             'new_offer' => $openPostulation->offer->id
        //         ], [
        //             'goTo' => 'ViewOwnOffer',
        //             'goToParams' => [
        //                 'id' => $openPostulation->offer->id
        //             ]
        //         ]);
        //     } else {
        //         ExpoNotification::send([$openPostulation->user],
        //         '¡El anuncio se ha cerrado!',
        //         'El anunciante de "' . $openPostulation->offer->title . '" decidió cerrar el anuncio', [
        //             'new_offer' => $openPostulation->offer->id
        //         ], [
        //             'goTo' => 'ViewOwnOffer',
        //             'goToParams' => [
        //                 'id' => $openPostulation->offer->id
        //             ]
        //         ]);
        //     }

        //     $ratingExists = Rating::where('user_id', $openPostulation->user->id)->where('offer_id', $openPostulation->offer->id)->first();

        //     if(!$ratingExists) {
        //         Rating::create([
        //             'user_id' => $openPostulation->user->id,
        //             'client_id' => $offer->user->id,
        //             'scraper_id' => $openPostulation->user->id,
        //             'offer_id' => $offer->id,
        //         ]);

        //         Rating::create([
        //             'user_id' => $offer->user->id,
        //             'client_id' => $offer->user->id,
        //             'scraper_id' => $openPostulation->user->id,
        //             'offer_id' => $offer->id,
        //         ]);
        //     }
        // }

        $rejectedIds = [];

        foreach($offer->postulations->whereIn('offer_status_id',[1,2]) as $p) {
            $p->offer_status_id = 5; // Rechazada
            $p->save();

            $rejectedIds[] = $p->user;
        }

        if(count($rejectedIds)) {
            ExpoNotification::send($rejectedIds,
                '¡Han cancelado tu postulación!',
                'El anunciante de "' . $offer->title . '" decidió finalizar el anuncio', [
                'new_offer' => $offer->id
            ], [
                'goTo' => 'ViewOwnOffer',
                'goToParams' => [
                    'id' => $offer->id
                ]
            ]);
        }

        $offer->closed_reason_id = $request->reasonId;
        // if(in_array($request->reasonId, [1, 2])) {
        //     $offer->offer_status_id = 3;
        // } else {
            $offer->offer_status_id = 5;
        // }

        $offer->save();

        return response()->json([
            'success' => true,
            'message' => '¡Anuncio cerrado correctamente!'
        ]);
    }

    public function askQuestion(Request $request, Offer $offer): JsonResponse
    {
        $user = auth()->user();

        $alreadyAsked = ChatMessage::where('sender_id', $user->id)
            ->where('offer_id', $offer->id)
            ->exists();

        if($alreadyAsked) {
            return response()->json([
                'success' => false,
                'message' => '¡Si tienes mas preguntas puedes usar el chat!'
            ], Response::HTTP_BAD_REQUEST);
        }

        ChatMessage::create([
            'sender_id' => $user->id,
            'receiver_id' => $offer->user->id,
            'offer_id' => $offer->id,
            'text' => $request->question,
            'highlighted' => true,
        ]);
        // {
        //     toUser: user,
        //     offerId: offer_id,
        //   }

        // $toUser = $user->id == $offer->user->id ? sender : receiver;

        ExpoNotification::send(
            [$offer->user],
            '¡Te han hecho una consulta en ' . $offer->title . '!',
            $user->full_name . ' hizo una consulta en tu anuncio',
            ['new_offer' => $offer->id], [
                'goTo' => 'ChatInternal',
                'goToParams' => [
                    'toUser' => $user,
                    'offerId' => $offer->id
                ]
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Tu consulta se ha creado correctamente',
        ]);
    }


    public function pickupTorky(Request $request, Offer $offer): JsonResponse
    {
        $user = auth()->user();

        if($user->type != 'torky') {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para acceder a esta sección'
            ], Response::HTTP_BAD_REQUEST);
        }

        $torky = OfferTorky::where('offer_id', $offer->id)->first();
        if($torky) {
            if($torky->user_id != $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ya hay un torky para este anuncio'
                ], Response::HTTP_BAD_REQUEST);
            }else{
                return response()->json([
                    'success' => false,
                    'message' => 'Ya tienes una fecha de recogida para este anuncio'
                ], Response::HTTP_BAD_REQUEST);
            }
        }
        $torky = new OfferTorky();

        if($offer->torky_pickup_range){
            switch($offer->torky_pickup_range) {
                case '8 a 10':
                    $torky->expected_start_pickup_at = Carbon::parse($offer->torky_pickup_at)->setTime(8, 0, 0);
                    $torky->expected_end_pickup_at = Carbon::parse($offer->torky_pickup_at)->setTime(10, 0, 0);
                    break;
                case '10 a 12':
                    $torky->expected_start_pickup_at = Carbon::parse($offer->torky_pickup_at)->setTime(10, 0, 0);
                    $torky->expected_end_pickup_at = Carbon::parse($offer->torky_pickup_at)->setTime(12, 0, 0);
                    break;
                case '15 a 17':
                    $torky->expected_start_pickup_at = Carbon::parse($offer->torky_pickup_at)->setTime(15, 0, 0);
                    $torky->expected_end_pickup_at = Carbon::parse($offer->torky_pickup_at)->setTime(17, 0, 0);
                    break;
                case '17 a 19':
                    $torky->expected_start_pickup_at = Carbon::parse($offer->torky_pickup_at)->setTime(17, 0, 0);
                    $torky->expected_end_pickup_at = Carbon::parse($offer->torky_pickup_at)->setTime(19, 0, 0);
                    break;
                default:
                    $torky->expected_start_pickup_at = Carbon::parse($offer->torky_pickup_at)->format('Y-m-d');
                    $torky->expected_end_pickup_at = Carbon::parse($offer->torky_pickup_at)->addHours(2)->format('Y-m-d');
            }
        } else {
            $torky->expected_start_pickup_at = Carbon::parse($offer->torky_pickup_at)->format('Y-m-d');
            $torky->expected_end_pickup_at = Carbon::parse($offer->torky_pickup_at)->addHours(2)->format('Y-m-d');
        }

        $torky->user_id = $user->id;
        $torky->offer_id = $offer->id;
        $torky->save();
        $offer = $torky->offer;
        $fullName = $user->first_name . ' ' . $user->last_name;

        // Notificar al anunciante
            ExpoNotification::send([$offer->user], 'Un torky se ha ofrecido para recoger tu reciclable!', $fullName . ', va a ser quien recogerá tu reciclable', [
            'new_offer' => $offer->id
        ], [
            'goTo' => 'ViewOwnOfferTorky',
                'goToParams' => [
                    'id' => $offer->id
                ]
            ]);

        return response()->json([
            'success' => true,
            'message' => '¡Anuncio actualizado correctamente!'
        ]);
    }

    public function deleteTorky(Request $request, Offer $offer): JsonResponse
    {
        $user = auth()->user();

        if($user->id != $offer->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para eliminar este anuncio'
            ], Response::HTTP_BAD_REQUEST);
        }

        if($user->type != 'hogar') {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para eliminar este anuncio'
            ], Response::HTTP_BAD_REQUEST);
        }

        $offer->images()->delete();
        $offer->address()->delete();
        $offer->postulations()->delete();
        $offer->torkies()->delete();
        $offer->delete();

        return response()->json([
            'success' => true,
            'message' => '¡Anuncio eliminado correctamente!'
        ]);
    }


    public function storeTorky(CreateOfferHogarRequest $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $offer = new Offer();
            $offer->user_id = $user->id;
            $offer->offer_type_id = 1;
            $offer->category_id = 4;
            $offer->offer_status_id = 1; // "Pendiente";
            $offer->title = '';
            $offer->description = '';
            $offer->valid_until = Carbon::now()->addMonth();

            $offer->torky_pickup_at = Carbon::parse($request->torky_pickup_at)->format('Y-m-d');
            $offer->torky_pickup_range = $request->torky_pickup_range;

            $offer->pick_by_scraper = 0;
            $offer->send_by_client = 0;
            $offer->save();
            $syncData = [];

            // if ($request->dataCategories) {
            //     foreach ($request->dataCategories as $categoryData) {
            //         $categoryJson = json_decode($categoryData, true);

            //         if (isset($categoryJson['category_id'])) {
            //             $syncData[$categoryJson['category_id']] = [
            //                 'measure_type_id' => !empty($categoryJson['measure_type_id']) ? intval($categoryJson['measure_type_id']) : null,
            //                 'quantity' => !empty($categoryJson['quantity']) ? intval($categoryJson['quantity']) : null,
            //                 'condition_id' => !empty($categoryJson['condition_id']) ? intval($categoryJson['condition_id']) : null,
            //             ];
            //         }
            //     }
            // }

            $offer->offerCategories()->sync($syncData);

            $addressMerge = [
                'neighborhood_id' => Neighborhood::createOrGet($request),
                'city_id' => City::createOrGet($request),
                'province_id' => Province::createOrGet($request)
            ];
            $address=array_merge($request['address'],$addressMerge);

            $offer->address()->create($address);

            if ($request->images && $request->has('images')) {
                foreach ($request->file('images') as $photo) {
                    try {
                        $image = InterventionImage::make($photo);

                        $image->resize(800, 600, function ($constraint) {
                            $constraint->aspectRatio();
                            $constraint->upsize();
                        });
                        $image->encode('jpg', 60);

                        $path = $photo->hashName(Offer::STORAGE_PATH . $offer->id);
                        Storage::disk('public')->put($path, (string) $image);

                        $dbImage = new Image();
                        $dbImage->path = $path;
                        $dbImage->bytes = Storage::disk('public')->size($path);

                        $offer->images()->save($dbImage);
                    } catch (\Exception $e) {
                        \Log::error('Error procesando imagen: ' . $e->getMessage());
                        continue;
                    }
                }
            }


            //notificar a los torkys
            $usersTorkys = User::where('type', 'torky')->get();
            ExpoNotification::send($usersTorkys, 'Hay un nuevo retiro por hacer!', '', [
                'new_offer' => $offer->id
            ], [
                'goTo' => 'ViewOwnOfferTorky',
                'goToParams' => [
                    'id' => $offer->id
                ]
            ]);


            // $emailData = [
            //     'title' => $request->title,
            //     'description' => $request->description,
            //     'user' => auth()->user()->first_name .' '.auth()->user()->last_name
            // ];
            // Mail::raw("🚀 Nuevo post en Scrapy - Versión Torky 🎉: \nTítulo: " . $emailData['title'] . "\nDescripción: " . $emailData['description'] . "\nPublicado por: " . $emailData['user'], function ($message) {
            //     $message->to('magadm.09@gmail.com')
            //     ->subject('🚀 Nuevo post en Scrapy 🎉');
            // });

            return response()->json([
                'success' => true,
                'message' => 'Publicación creada correctamente',
            ]);

        } catch (\Exception $e) {
            \Log::error('Error en storeTorky: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Hubo un error al crear la publicación. Por favor, inténtelo nuevamente.',
            ]);
        }
    }

    public function rating(Request $request, Offer $offer): JsonResponse
    {
        $user = auth()->user();

        Rating::create([
            'scraper_id' => $user->id,
            'client_id' => $offer->user->id,
            'user_id' => $user->id,
            'offer_id' => $offer->id,
            'rating' => $request->rating,
            'message' => $request->message,
            'pending' => 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => ' OK',
        ]);
    }

    public function ratingTorky(Request $request, OfferTorky $torky): JsonResponse
    {
        $user = auth()->user();

        Rating::create([
            'user_id' => $user->id,
            'scraper_id' => $user->id,
            'client_id' => $torky->user->id,
            'offer_id' => $torky->offer->id,
            'rating' => $request->rating,
            'message' => $request->message,
            'pending' => 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => ' OK',
        ]);
    }

}
