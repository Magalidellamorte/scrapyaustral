<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChatMessageController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\ClosedReasonController;
use App\Http\Controllers\ClosePostulationReasonController;
use App\Http\Controllers\ConditionController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\LocalidadController;
use App\Http\Controllers\MeasureTypeController;
use App\Http\Controllers\NeighborhoodController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\OfferStatusController;
use App\Http\Controllers\OfferTorkyController;
use App\Http\Controllers\OfferTypeController;
use App\Http\Controllers\PostulationController;
use App\Http\Controllers\ProvinceController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\SubzoneController;
use App\Http\Controllers\SupportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ZoneController;
use App\Http\Controllers\ZoneScheduleController;
use Illuminate\Support\Facades\Route;

Route::get('__docs_dummy', function () {
    return response()->json(['status' => 'ok']);
});

Route::group([
    'prefix' => 'auth',
], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::get('testmail', [AuthController::class, 'testmail']);

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store']);
    Route::post('reset-password', [NewPasswordController::class, 'store']);

    Route::group([
        'middleware' => 'auth:api',
    ], function () {
        Route::get('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);

        Route::post('profile-picture', [AuthController::class, 'profilePicture']);
    });
});

Route::group([
    'middleware' => 'auth:api',
], function () {
    Route::post('upgrade', [AuthController::class, 'upgrade']);
    Route::post('expoTokenPush', [AuthController::class, 'expoTokenPush']);
    Route::post('validate', [AuthController::class, 'account_validate']);
    Route::post('update_profile', [AuthController::class, 'update_profile']);
    Route::post('subscription', [AuthController::class, 'subscription']);

    Route::post('torkies/{torky}/start', [OfferTorkyController::class, 'start']);
    Route::post('torkies/{torky}/end', [OfferTorkyController::class, 'end']);
    Route::apiResource('torkies', OfferTorkyController::class)->only(['index', 'show']);

    Route::post('offers.torky', [OfferController::class, 'storeTorky']);
    Route::post('offers.torky/{offer}/pickup', [OfferController::class, 'pickupTorky']);
    Route::put('offers.torky/{torky}/rating', [OfferController::class, 'ratingTorky']);
    Route::delete('offers.torky/{offer}', [OfferController::class, 'deleteTorky']);
    Route::put('offers/{offer}/rating', [OfferController::class, 'rating']);
    Route::apiResource('offers', OfferController::class)->only(['show', 'store', 'index']);
    Route::apiResource('offers.postulations', PostulationController::class)->only(['store', 'show']);
    Route::post('offers/{offer}/close', [OfferController::class, 'close']);
    Route::post('offers/{offer}/ask_question', [OfferController::class, 'askQuestion']);

    Route::apiResource('postulations', PostulationController::class)->only(['index', 'show']);
    Route::post('postulations/{postulation}/accept', [PostulationController::class, 'accept']);
    Route::post('postulations/{postulation}/confirm', [PostulationController::class, 'confirm']);
    Route::post('postulations/{postulation}/delete', [PostulationController::class, 'delete']);
    Route::post('postulations/{postulation}/reject', [PostulationController::class, 'reject']);
    Route::post('postulations/{postulation}/rating', [PostulationController::class, 'rating']);
    Route::post('postulations/{postulation}/start_withdrawal', [PostulationController::class, 'startWithdrawal']);
    Route::post('postulations/{postulation}/received', [PostulationController::class, 'received']);
    Route::post('postulations/{postulation}/cancel', [PostulationController::class, 'cancel']);

    Route::apiResource('support', SupportController::class)->only(['store']);
    Route::apiResource('invoices', InvoiceController::class)->only(['index']);
    Route::apiResource('user', UserController::class)->only(['show']);
    Route::post('user/{user}/rating', [UserController::class, 'rating']);

    Route::apiResource('chats', ChatMessageController::class)->only(['index']);
    Route::get('notifications/count', [NotificationController::class, 'count']);
    Route::post('notifications/read_all', [NotificationController::class, 'readAll']);
    Route::apiResource('notifications', NotificationController::class)->only(['index']);

    Route::post('validate', [AuthController::class, 'account_validate']);
    Route::apiResource('ratings', RatingController::class)->only(['update']);
});

Route::get('provinces', [ProvinceController::class, 'index']);
Route::get('provinces/{province}/cities', [CityController::class, 'index']);
Route::get('cities/{city}/neighborhoods', [NeighborhoodController::class, 'index']);
Route::get('categories', [CategoryController::class, 'index']);
Route::get('offer_types', [OfferTypeController::class, 'index']);
Route::get('offer_statuses', [OfferStatusController::class, 'index']);
Route::get('measure_types', [MeasureTypeController::class, 'index']);
Route::get('conditions', [ConditionController::class, 'index']);
Route::get('closed_reasons', [ClosedReasonController::class, 'index']);
Route::get('closed_postulation_reasons', [ClosePostulationReasonController::class, 'index']);
Route::get('plans', [InvoiceController::class, 'plans']);
Route::get('localidades', [LocalidadController::class, 'index']);

Route::middleware(['auth:api', 'admin_localidad'])
    ->prefix('admin')
    ->group(function () {
        // Zones.
        Route::get('/zones', [ZoneController::class, 'index']);
        Route::post('/zones', [ZoneController::class, 'store']);
        Route::get('/zones/{zone}', [ZoneController::class, 'show']);
        Route::put('/zones/{zone}', [ZoneController::class, 'update']);
        Route::delete('/zones/{zone}', [ZoneController::class, 'destroy']);

        // SubZones.
        Route::get('/subzones', [SubzoneController::class, 'index']);
        Route::get('/zones/{zone}/subzones', [ZoneController::class, 'subzones']);

        // Schedules.
        Route::get('/zones/{zone}/schedules', [ZoneController::class, 'schedules']);
        Route::post('/zones/{zone}/schedules', [ZoneScheduleController::class, 'storeZoneSchedule']);
        Route::get('/schedules/{zoneSchedule}', [ZoneScheduleController::class, 'show']);
        Route::put('/schedules/{zoneSchedule}', [ZoneScheduleController::class, 'update']);
        Route::delete('/schedules/{zoneSchedule}', [ZoneScheduleController::class, 'destroy']);
        Route::get('/subzones/{subZone}/schedules', [SubzoneController::class, 'schedules']);

        // Polygons.
        Route::get('/zones/{zone}/polygon', [ZoneController::class, 'polygon']);
        Route::get('/subzones/{subZone}/polygon', [SubzoneController::class, 'polygon']);
    });
