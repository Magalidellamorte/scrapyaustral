<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateOfferStatusTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('offer_status', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('nameMyOffer', 255);
            $table->string('color_background');
            $table->string('color_text');
            $table->string('enabled')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('offer_status', function (Blueprint $table) {
            Schema::dropIfExists('offer_status');
        });
    }
}
