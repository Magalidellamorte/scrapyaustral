<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateClosedReasonsTable extends Migration
{
    public function up()
    {
        Schema::create('closed_reasons', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('enabled')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('closed_reasons');
    }
}
