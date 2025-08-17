<?php

use App\Models\Offer;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToRatingsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('ratings', function (Blueprint $table) {
            $table->boolean('pending')->default(true);
            $table->string('response')->nullable();
            $table->foreignIdFor(Offer::class)->nullable();
            $table->foreignIdFor(User::class)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('ratings', function (Blueprint $table) {
            $table->dropColumn(['pending', 'response', 'offer_id', 'user_id']);
        });
    }
}
