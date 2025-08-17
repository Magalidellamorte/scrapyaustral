<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOfferOfferCategoryTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('offer_offer_category', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('offer_id');
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('condition_id')->nullable();
            $table->unsignedBigInteger('measure_type_id')->nullable();
            $table->integer('quantity')->nullable();
            $table->timestamps();

            $table->index('offer_id', 'of');
            $table->index('category_id', 'offers');

            $table->foreign('category_id', 'offers')->references('id')->on('categories');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('offer_offer_category');
    }
}
