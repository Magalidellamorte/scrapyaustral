<?php

use App\Models\ClosePostulationReason;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCloseReasionColumnToPostulation extends Migration
{
    public function up()
    {
        Schema::table('postulations', function (Blueprint $table) {
            $table->foreignIdFor(ClosePostulationReason::class)->nullable();
        });
    }

    public function down()
    {
        Schema::table('postulations', function (Blueprint $table) {
            $table->dropColumn('close_postulation_reason_id');
        });
    }
}
