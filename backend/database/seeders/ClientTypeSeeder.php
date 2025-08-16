<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClientTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $clientTypes = [
            ['id' => 1, 'name' => 'Empresa', 'enabled' => 1],
            ['id' => 2, 'name' => 'Particular', 'enabled' => 1],
        ];

        DB::table('client_types')->upsert($clientTypes, ['id'], ['name', 'enabled']);
    }
}
