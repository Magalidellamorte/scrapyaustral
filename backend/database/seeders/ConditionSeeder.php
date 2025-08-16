<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConditionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $conditions = [
            ['id' => 1, 'name' => 'Entero', 'enabled' => 1],
            ['id' => 2, 'name' => 'Partido', 'enabled' => 1],
            ['id' => 3, 'name' => 'Limpio', 'enabled' => 1],
            ['id' => 4, 'name' => 'Sucio', 'enabled' => 1],
            ['id' => 5, 'name' => 'Mezclado', 'enabled' => 1],
            ['id' => 6, 'name' => 'Enfardado', 'enabled' => 1],
        ];

        DB::table('conditions')->upsert($conditions, ['id'], ['name', 'enabled']);
    }
}
