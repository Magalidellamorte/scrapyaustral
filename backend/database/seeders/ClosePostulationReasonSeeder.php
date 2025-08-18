<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClosePostulationReasonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $reasons = [
            ['id' => 1, 'name' => 'regret', 'enabled' => 1],
            ['id' => 2, 'name' => 'with_other_scraper', 'enabled' => 1],
            ['id' => 3, 'name' => 'unable_to_agree', 'enabled' => 1],
            ['id' => 5, 'name' => 'other', 'enabled' => 1],
        ];

        DB::table('close_postulation_reasons')->upsert($reasons, ['id'], ['name', 'enabled']);
    }
}
