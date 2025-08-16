<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MeasureTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $measureTypes = [
            ['id' => 1, 'name' => 'Kg', 'enabled' => 1],
            ['id' => 2, 'name' => 'Unidad', 'enabled' => 1],
            ['id' => 3, 'name' => 'Tn', 'enabled' => 1],
        ];

        DB::table('measure_types')->upsert($measureTypes, ['id'], ['name', 'enabled']);
    }
}
