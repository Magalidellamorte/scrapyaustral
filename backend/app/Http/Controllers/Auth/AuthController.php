<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Jobs\SendEmail;
use App\Mail\UpgradeToScraperEmail;
use App\Mail\ValidateEmail;
use App\Mail\WelcomeEmail;
use App\Models\Availability;
use App\Models\City;
use App\Models\Image;
use App\Models\Invoice;
use App\Models\Neighborhood;
use App\Models\Plan;
use App\Models\Province;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $credentials = request(['email', 'password']);

        if (!Auth::attempt(array_merge($credentials, ['enabled' => 1]))) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }

        $user = $request->user();

        if ($request->get('player_id')) {
            $user->player_id = $request->get('player_id');
            $user->save();
        }

        $tokenResult = $user->createToken('Personal Access Token');
        $token = $tokenResult->token;

        if ($request->remember_me) {
            $token->expires_at = Carbon::now()->addWeeks(1);
        }

        $token->save();

        return response()->json([
            'access_token' => $tokenResult->accessToken,
            'token_type' => 'Bearer',
            'expires_at' => Carbon::parse(
                $tokenResult->token->expires_at
            )->toDateTimeString(),
        ]);
    }

    public function expoTokenPush(Request $request): JsonResponse
    {
        $request->validate([
            'player_id' => 'required|string',
        ]);

        $user = auth()->user();
        $user->player_id = $request->player_id;
        $user->save();

        return response()->json([
            'message' => '',
        ], 201);
    }

    public function register(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'user_type' => 'required|string',
                'first_name' => 'required|string',
                'last_name' => 'required|string',
                'email' => 'required|string|email|unique:users',
                'password' => 'required|string',
                'whatsapp' => 'required|string',
            ]);

            $user = new User();
            $user->first_name = $request->first_name;
            $user->last_name = $request->last_name;
            $user->type = 'comercio' === $request->user_type ? 'hogar' : $request->user_type;

            if ('comercio' == $request->user_type || 'industria' == $request->user_type) {
                $user->company_title = $request->company_title ?? null;
            } else {
                $user->company_title = null;
            }

            if ('comercio' == $request->user_type) {
                $user->is_store = true;
            } else {
                $user->is_store = false;
            }

            if ('industria' == $request->user_type) {
                $user->is_company = true;
            } else {
                $user->is_company = false;
            }

            $user->whatsapp = $request->whatsapp;
            $user->email = $request->email;
            $user->password = Hash::make($request->password);
            $user->admin = false;
            $user->scraper = false;

            if ($request->player_id) {
                $user->player_id = $request->player_id;
            }
            $user->save();

            try {
                SendEmail::dispatch(new WelcomeEmail($user));
            } catch (\Exception $e) {
                \Log::error('Error enviando email de bienvenida: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => '¡Usuario creado correctamente!',
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error en registro: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Hubo un error al crear el usuario. Por favor, inténtelo nuevamente.',
            ], 500);
        }
    }

    public function update_profile(Request $request): JsonResponse
    {
        $user = auth()->user();

        $request->validate([
            'user_type' => 'torky' !== $user->type ? 'required|string' : 'sometimes|string',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'whatsapp' => 'required|string',
            'email' => 'required|string|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string',
        ]);

        if ('comercio' == $request->user_type || 'industria' == $request->user_type) {
            $user->company_title = $request->company_title;
        } else {
            $user->company_title = null;
        }

        if ('comercio' == $request->user_type) {
            $user->is_store = true;
        } else {
            $user->is_store = false;
        }
        if ('industria' == $request->user_type) {
            $user->is_company = true;
        } else {
            $user->is_company = false;
        }

        $user->type = 'comercio' === $request->user_type ? 'hogar' : $request->user_type;
        $user->description = $request->description;
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->whatsapp = $request->whatsapp;
        $user->email = $request->email;

        if ($request->password && $request->confirm_password === $request->password) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        if ($request->has('address')) {
            $addressMerge = [
                'neighborhood_id' => Neighborhood::createOrGet($request),
                'city_id' => City::createOrGet($request),
                'province_id' => Province::createOrGet($request),
            ];
            $address = array_merge($request['address'], $addressMerge);

            $user->address()->updateOrCreate([
                'addressable_type' => User::class,
                'addressable_id' => $user->id,
            ], $address);
        }

        return response()->json([
            'message' => '¡Usuario actualizado correctamente!',
        ], 201);
    }

    public function upgrade(Request $request): JsonResponse
    {
        $request->validate([
            'description' => 'required|string',
            'categories.*' => 'required|exists:categories,id',
        ]);
        $user = auth()->user();
        $user->company_title = $request->company_title;
        $user->is_company = $request->is_company ? 1 : 0;
        $user->description = $request->description;
        $user->scraper = 1;

        // Si cambia el company vuelve a pedir validacion
        if ($user->is_company != $request->is_company) {
            $user->verified = 0;
            $user->request_validate = 0;
        }

        if ($request->has('address')) {
            $addressMerge = [
                'neighborhood_id' => Neighborhood::createOrGet($request),
                'city_id' => City::createOrGet($request),
                'province_id' => Province::createOrGet($request),
            ];
            $address = array_merge($request['address'], $addressMerge);

            $user->address()->updateOrCreate([
                'addressable_type' => User::class,
                'addressable_id' => $user->id,
            ], $address);
        }

        $user->categories()->sync($request->categories);

        if ($request->has('availabilities')) {
            $user->availabilities()->delete();

            $availabilities = [];

            foreach ($request->availabilities as $availability) {
                $availabilities[] = new Availability([
                    'day_index' => $availability['day_index'],
                    'from' => $availability['from'],
                    'to' => $availability['to'],
                ]);
            }

            $user->availabilities()->saveMany($availabilities);
        }

        if ($request->has('profile_picture')) {
            $photo = $request->file('profile_picture');
            $path = $photo->storePublicly(User::STORAGE_PATH . 'profile/' . $user->id, [
                'disk' => 'public',
            ]);

            $image = new Image();
            $image->path = $path;
            $image->bytes = 0;

            $user->images()->save($image);
        }

        if ($request->has('images')) {
            foreach ($request->file('images') as $photo) {
                $path = $photo->storePublicly(User::STORAGE_PATH . 'work/' . $user->id, [
                    'disk' => 'public',
                ]);

                $image = new Image();
                $image->path = $path;
                $image->bytes = 0; // Storage::disk('public')->size($path);

                $user->images()->save($image);
            }
        }
        $user->save();

        // if(!$user->subscriptions()->where('ends_at','>=',Carbon::now())->count()) {
        $plan = Plan::OrderBy('id', 'DESC')->get()->first();
        $user->subscriptions()->create([
            'plan_id' => $plan->id,
            'free_time' => 1,
            'trial_ends_at' => Carbon::now()->add($plan->trial_interval, $plan->trial_period),
            'starts_at' => Carbon::now(),
            'ends_at' => Carbon::now()->add($plan->trial_interval, $plan->trial_period),
        ]);

        // SendEmail::dispatch(new UpgradeToScraperEmail($user, $plan));
        // }

        return response()->json([
            'message' => '¡Perfíl actualizado!',
        ], 200);
    }

    public function subscription(Request $request): JsonResponse
    {
        $user = auth()->user();
        $plan = Plan::find($request->plan_id);
        if (!$plan) {
            return response()->json([
                'message' => 'No se encontro el plan',
            ], 200);
        }
        $subscriptions = $user->subscriptions()->get();
        foreach ($subscriptions as $subscription) {
            $subscription->delete();
        }

        $user->subscriptions()->create([
            'plan_id' => $plan->id,
            'trial_ends_at' => null,
            'generate_invoice' => 1,
            'starts_at' => Carbon::now(),
            'ends_at' => Carbon::now()->add($plan->invoice_interval, $plan->invoice_period),
        ]);
        $invoices = $user->invoices()->whereNull('paid_at')->get();
        foreach ($invoices as $invoice) {
            $invoice->delete();
        }

        Artisan::call('invoices:generate');
        SendEmail::dispatch(new UpgradeToScraperEmail($user, $plan));

        return response()->json([
            'message' => 'Subscrition ok',
        ], 200);
    }

    public function account_validate(Request $request): JsonResponse
    {
        $user = auth()->user();

        if ($user->is_company) {
            $request->validate([
                'fiscal_id' => 'required|string',
                'document_picture_front_path' => 'required|file',
                /* 'document_picture' => 'required|file', */
            ]);
        } else {
            $request->validate([
                'fiscal_id' => 'required|string',
                'document_picture_front_path' => 'required|file',
                'document_picture_back_path' => 'required|file',
            ]);
        }
        $user->fiscal_id = $request->fiscal_id;
        $user->request_validate = 1;

        $attachEmail = [];
        if ($request->has('document_picture_front_path')) {
            $photo = $request->file('document_picture_front_path');

            $path = $photo->storePublicly(User::STORAGE_PATH . 'document/front/' . $user->id, [
                'disk' => 'public',
            ]);

            $attachEmail[] = $path;

            $image = new Image();
            $image->path = $path;
            $image->bytes = 0; // Storage::disk('public')->size($path);

            $user->images()->save($image);
        }

        if ($request->has('document_picture_back_path')) {
            $photo = $request->file('document_picture_back_path');

            $path = $photo->storePublicly(User::STORAGE_PATH . 'document/back/' . $user->id, [
                'disk' => 'public',
            ]);
            $attachEmail[] = $path;

            $image = new Image();
            $image->path = $path;
            $image->bytes = 0; // Storage::disk('public')->size($path);

            $user->images()->save($image);
        }

        // emviar un email a magui con los archivos.
        // info@scrapyapp.com

        $user->save();

        SendEmail::dispatch(new ValidateEmail($user, $attachEmail));

        return response()->json([
            'message' => 'Validación enviada correctamente',
        ], 200);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->token()->revoke();

        return response()->json([
            'message' => '¡Se ha cerrado sesión correctamente!',
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json(
            User::where('id', $request->user()->id)
                ->with(['address'])
                ->get()
                ->first()
        );
    }

    public function profilePicture(Request $request): JsonResponse
    {
        $user = auth()->user();

        if ($request->has('image')) {
            $photo = $request->file('image');
            $path = $photo->storePublicly(User::STORAGE_PATH . 'profile/' . $user->id, [
                'disk' => 'public',
            ]);

            $user->profile_picture_path = $path;
            $user->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Imagen actualizada',
        ]);
    }

    public function testmail(Request $request): JsonResponse
    {
        // $user = User::find(2);
        // SendEmail::dispatch(new WelcomeEmail($user));

        return response()->json([
        ], 201);
    }
}
