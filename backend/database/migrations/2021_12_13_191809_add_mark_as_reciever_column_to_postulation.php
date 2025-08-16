<?php

use App\Models\ClosedReason;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMarkAsRecieverColumnToPostulation extends Migration
{
    public function up()
    {
        Schema::table('postulations', function (Blueprint $table) {
            $table->boolean('mark_as_reciever')->default(false);
        });
    }

    public function down()
    {
        Schema::table('postulations', function (Blueprint $table) {
            $table->dropColumn('mark_as_reciever');
        });
    }
}
