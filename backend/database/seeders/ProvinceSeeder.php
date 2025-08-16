<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProvinceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $provinces = [
            ['id' => 1, 'name' => 'Provincia de Buenos Aires'],
            ['id' => 2, 'name' => 'Córdoba'],
            ['id' => 3, 'name' => 'Mendoza'],
            ['id' => 4, 'name' => 'Chaco'],
            ['id' => 5, 'name' => 'Chubut'],
            ['id' => 6, 'name' => 'Formosa'],
            ['id' => 7, 'name' => 'Jujuy'],
            ['id' => 8, 'name' => 'Neuquén'],
            ['id' => 9, 'name' => 'Salta'],
            ['id' => 10, 'name' => 'Santa Fe'],
            ['id' => 11, 'name' => 'Catamarca'],
            ['id' => 12, 'name' => 'Entre Ríos'],
            ['id' => 13, 'name' => 'La Rioja'],
            ['id' => 14, 'name' => 'Misiones'],
            ['id' => 15, 'name' => 'Río Negro'],
            ['id' => 16, 'name' => 'Tucumán'],
            ['id' => 17, 'name' => 'San Luis'],
            ['id' => 18, 'name' => 'San Juan'],
            ['id' => 19, 'name' => 'Tierra del Fuego'],
            ['id' => 20, 'name' => 'Santiago del Estero'],
            ['id' => 21, 'name' => 'Corrientes'],
            ['id' => 22, 'name' => 'La Pampa'],
            ['id' => 23, 'name' => 'Santa Cruz'],
            ['id' => 24, 'name' => 'Capital Federal'],
            ['id' => 25, 'name' => 'Buenos Aires'],
            ['id' => 26, 'name' => 'La Capital'],
            ['id' => 27, 'name' => 'Comuna 13'],
            ['id' => 28, 'name' => 'Rosario'],
            ['id' => 29, 'name' => 'Pilar'],
            ['id' => 30, 'name' => 'Ciudad Autónoma de Buenos Aires'],
            ['id' => 31, 'name' => 'Comuna 2'],
        ];

        DB::table('provinces')->upsert($provinces, ['id'], ['name']);
    }
}
