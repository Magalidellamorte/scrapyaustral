<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PolygonPoint extends Model
{
    use HasFactory;

    protected $fillable = ['latitude', 'longitude', 'order'];

    public function polygon(): BelongsTo
    {
        return $this->belongsTo(Polygon::class);
    }
}
