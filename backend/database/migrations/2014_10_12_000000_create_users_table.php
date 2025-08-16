<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->boolean('admin')->default(false);
            $table->boolean('scraper')->default(false);
            $table->string('profile_picture_path')->nullable();
            $table->string('document_picture_front_path')->nullable();
            $table->string('document_picture_back_path')->nullable();
            $table->string('fiscal_id')->nullable();
            $table->string('description')->nullable();
            $table->string('player_id', 50)->nullable();
            $table->boolean('enabled')->default(true);
            $table->string('coverage_range')->default(50)->nullable();
            $table->string('company_title')->nullable();
            $table->string('whatsapp', 255)->nullable();
            $table->tinyInteger('is_store')->default(0);
            $table->enum('type', ['torky', 'hogar', 'industria'])->default('industria');
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
}
