<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOfferTorkiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('offer_torkies', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('offer_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->dateTime('expected_start_pickup_at');
            $table->dateTime('expected_end_pickup_at');
            $table->dateTime('started_at')->nullable();
            $table->dateTime('pickup_at')->nullable();
            $table->timestamps();
            $table->string('kg', 150)->nullable();

            $table->index('offer_id', 'offer');
            $table->index('user_id', 'user_id');

            $table->foreign('offer_id', 'offer')->references('id')->on('offers');
            $table->foreign('user_id', 'offer_torkies_ibfk_1')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('offer_torkies');
    }
}
