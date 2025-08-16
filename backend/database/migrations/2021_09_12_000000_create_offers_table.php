<?php

use App\Models\ClientType;
use App\Models\Condition;
use App\Models\MeasureType;
use App\Models\Category;
use App\Models\OfferStatus;
use App\Models\OfferType;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOffersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('offers', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->nullable();
            $table->foreignIdFor(OfferType::class)->nullable();
            $table->foreignIdFor(ClientType::class)->nullable();
            $table->foreignIdFor(Category::class)->nullable();
            $table->foreignIdFor(Condition::class)->nullable();
            $table->foreignIdFor(OfferStatus::class)->nullable();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('quantity')->nullable();
            $table->foreignIdFor(MeasureType::class)->nullable();
            $table->string('value_with_shipping')->nullable();
            $table->string('value_without_shipping')->nullable();
            $table->boolean('pick_by_scraper');
            $table->boolean('send_by_client');
            $table->dateTime('valid_until')->nullable();
            $table->date('torky_pickup_at')->nullable();
            $table->string('torky_pickup_range', 100)->nullable();
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
        Schema::dropIfExists('offers');
    }
}
