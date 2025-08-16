<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Polygon extends Model
{
    use HasFactory;

    public function polygonable(): MorphTo
    {
        return $this->morphTo();
    }

    public function polygonPoints(): HasMany
    {
        return $this->hasMany(PolygonPoint::class)->orderBy('order');
    }
}
