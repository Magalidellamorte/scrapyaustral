<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OfferStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $offerStatus = [
            ['id' => 1, 'name' => 'Pendiente', 'nameMyOffer' => 'En curso', 'color_background' => '#ffcb6b', 'color_text' => '#8d6927', 'enabled' => 1],
            ['id' => 2, 'name' => 'En curso', 'nameMyOffer' => 'En curso', 'color_background' => '#ffcb6b', 'color_text' => '#8d6927', 'enabled' => 1],
            ['id' => 3, 'name' => 'Finalizado', 'nameMyOffer' => 'Finalizado', 'color_background' => '#00e383', 'color_text' => '#ffffff', 'enabled' => 1],
            ['id' => 4, 'name' => 'Rechazado', 'nameMyOffer' => 'Rechazado', 'color_background' => '#f99393', 'color_text' => '#784444', 'enabled' => 1],
            ['id' => 5, 'name' => 'Cancelado', 'nameMyOffer' => 'Cancelado', 'color_background' => '#bdd7ff', 'color_text' => '#45628f', 'enabled' => 1],
            ['id' => 6, 'name' => 'Rechazado Finalizado', 'nameMyOffer' => 'Rechazado Finalizado', 'color_background' => '#f99393', 'color_text' => '#784444', 'enabled' => 1],
        ];

        DB::table('offer_status')->upsert($offerStatus, ['id'], ['name', 'nameMyOffer', 'color_background',
            'color_text', 'enabled']);
    }
}
