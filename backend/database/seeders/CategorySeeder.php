<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            ['id' => 1, 'name' => 'Metal', 'enabled' => 1],
            ['id' => 2, 'name' => 'Cartón', 'enabled' => 1],
            ['id' => 3, 'name' => 'Madera', 'enabled' => 1],
            ['id' => 4, 'name' => 'Plástico', 'enabled' => 1],
            ['id' => 5, 'name' => 'Textil', 'enabled' => 0],
            ['id' => 6, 'name' => 'Mueble', 'enabled' => 1],
            ['id' => 7, 'name' => 'Maquinarias', 'enabled' => 0],
            ['id' => 8, 'name' => 'RAEE', 'enabled' => 1],
            ['id' => 9, 'name' => 'Papel', 'enabled' => 1],
            ['id' => 10, 'name' => 'Cables', 'enabled' => 1],
        ];

        DB::table('categories')->upsert($categories, ['id'], ['name', 'enabled']);
    }
}
