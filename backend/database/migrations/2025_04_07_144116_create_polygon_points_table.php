<?php

use App\Models\Polygon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePolygonPointsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('polygon_points', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Polygon::class)->constrained();
            $table->decimal('latitude', 20, 17);
            $table->decimal('longitude', 20, 17);
            $table->unsignedInteger('order');
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
        Schema::dropIfExists('polygon_points');
    }
}
