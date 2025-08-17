<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsCompanyToUsersTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->integer('is_company')->default(0)->nullable();
            $table->integer('request_scraper')->default(0)->nullable();
            $table->integer('verified')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_company', 'request_scraper', 'verified']);
        });
    }
}
