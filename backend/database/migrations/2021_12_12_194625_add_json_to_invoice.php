<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddJsonToInvoice extends Migration
{
    public function up()
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->json('payment_callback_options')->nullable();
        });
    }

    public function down()
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn('payment_callback_options');
        });
    }
}
