<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateOfferTypesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('offer_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('enabled')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('offer_types');
    }
}
