<?php

use App\Models\Offer;
use App\Models\OfferStatus;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostulationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('postulations', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class);
            $table->foreignIdFor(Offer::class);
            $table->foreignIdFor(OfferStatus::class);

            $table->string('value_with_shipping')->nullable();
            $table->string('value_without_shipping')->nullable();
            $table->boolean('pick_by_scraper')->nullable();
            $table->boolean('send_by_client')->nullable();

            $table->string('shipment_start_date')->nullable();
            $table->string('shipment_end_date')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('postulations');
    }
}
