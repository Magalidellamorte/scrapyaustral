<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OfferTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $offerTypes = [
            ['id' => 1, 'name' => 'Vender', 'enabled' => 1],
            ['id' => 2, 'name' => 'Donar', 'enabled' => 1],
        ];

        DB::table('offer_types')->upsert($offerTypes, ['id'], ['name', 'enabled']);
    }
}
