<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClosedReasonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $reasons = [
            ['id' => 1, 'name' => 'with_selected_scraper', 'enabled' => 1],
            ['id' => 2, 'name' => 'with_other_scraper', 'enabled' => 1],
            ['id' => 3, 'name' => 'outside_scrapy', 'enabled' => 1],
            ['id' => 4, 'name' => 'regret', 'enabled' => 1],
            ['id' => 5, 'name' => 'other', 'enabled' => 1],
        ];

        DB::table('closed_reasons')->upsert($reasons, ['id'], ['name', 'enabled']);
    }
}
