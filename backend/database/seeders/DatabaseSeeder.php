<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        $this->call([
            CategorySeeder::class,
            ClientTypeSeeder::class,
            ClosePostulationReasonSeeder::class,
            ClosedReasonSeeder::class,
            ConditionSeeder::class,
            MeasureTypeSeeder::class,
            OfferStatusSeeder::class,
            OfferTypeSeeder::class,
            PlanSeeder::class,
            ProvinceSeeder::class,
            CitySeeder::class,
            NeighborhoodSeeder::class,
        ]);
    }
}
