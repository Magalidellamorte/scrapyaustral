<?php

use App\Models\Zone;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubZonesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('sub_zones', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Zone::class)->constrained();
            $table->string('name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('sub_zones');
    }
}
