<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRemainderSentAtToPostulationsTable extends Migration
{
    public function up()
    {
        Schema::table('postulations', function (Blueprint $table) {
            $table->date('remainder_sent_at')->nullable();
        });
    }

    public function down()
    {
        Schema::table('postulations', function (Blueprint $table) {
            $table->dropColumn('remainder_sent_at');
        });
    }
}
