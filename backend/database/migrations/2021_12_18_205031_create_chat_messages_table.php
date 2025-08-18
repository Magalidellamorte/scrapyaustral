<?php

use App\Models\Offer;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChatMessagesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class, 'sender_id');
            $table->foreignIdFor(User::class, 'receiver_id');
            $table->foreignIdFor(Offer::class);
            $table->string('text');
            $table->boolean('automatic')->default(false);
            $table->boolean('readed')->default(false);
            $table->boolean('highlighted')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('chat_messages');
    }
}
