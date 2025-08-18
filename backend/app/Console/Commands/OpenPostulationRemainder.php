<?php

namespace App\Console\Commands;

use App\Models\Postulation;
use App\Services\ExpoNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Builder;

class OpenPostulationRemainder extends Command
{
    protected $signature = 'open-postulation:remainder';

    protected $description = 'Send remainder to close open postulation';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $today = Carbon::today()->format('Y-m-d');

        $needResolution = Postulation::where('offer_status_id', 2)
            ->where(function (Builder $inner) use ($today) {
                return $inner
                    ->where('remainder_sent_at', '!=', $today)
                    ->orWhere('remainder_sent_at', null);
            })
            ->where('shipment_end_date', '<', $today)
            ->get();

        foreach ($needResolution as $postulation) {
            $postulation->remainder_sent_at = $today;
            $postulation->save();

            ExpoNotification::send(
                [$postulation->user],
                '¡Debes dar una resolución a tu postulación!',
                'El plazo acordado para ' . $postulation->offer->title . ' ya vencio, necesitamos una resolución.',
                ['new_offer' => $postulation->offer->id],
                [
                    'goTo' => 'ViewOwnOffer',
                    'goToParams' => [
                        'id' => $postulation->offer->user,
                    ],
                ]
            );

            ExpoNotification::send(
                [$postulation->offer->user],
                '¡Debes dar una resolución a tu anuncio!',
                'El plazo acordado para ' . $postulation->offer->title . ' ya venció, necesitamos una resolución.',
                ['new_offer' => $postulation->offer->id],
                [
                    'goTo' => 'ViewOwnOffer',
                    'goToParams' => [
                        'id' => $postulation->offer->user,
                    ],
                ]
            );
        }

        return 0;
    }
}
