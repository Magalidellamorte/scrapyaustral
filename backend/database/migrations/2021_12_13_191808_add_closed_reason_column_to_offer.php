<?php

use App\Models\ClosedReason;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddClosedReasonColumnToOffer extends Migration
{
    public function up()
    {
        Schema::table('offers', function (Blueprint $table) {
            $table->foreignIdFor(ClosedReason::class)->nullable();
        });
    }

    public function down()
    {
        Schema::table('offers', function (Blueprint $table) {
            $table->dropColumn('closed_reason_id');
        });
    }
}
