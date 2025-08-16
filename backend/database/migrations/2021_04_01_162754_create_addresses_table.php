<?php

use App\Models\City;
use App\Models\Neighborhood;
use App\Models\Province;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAddressesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->morphs('addressable');
            $table->string('street')->nullable();
            $table->string('street_number')->nullable();
            $table->string('floor')->nullable();
            $table->string('apartment')->nullable();
            $table->string('postal_code')->nullable();
            $table->foreignIdFor(Province::class)->nullable();
            $table->foreignIdFor(City::class)->nullable();
            $table->foreignIdFor(Neighborhood::class)->nullable();
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('addresses');
    }
}
