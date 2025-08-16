<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

/**
 * @property Zone $zone
 * @property Polygon $polygon
 */
class SubZone extends Model
{
    use HasFactory;

    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class);
    }

    public function polygon(): MorphOne
    {
        return $this->morphOne(Polygon::class, 'polygonable');
    }

    public function schedules(): MorphMany
    {
        return $this->morphMany(ZoneSchedule::class, 'schedulable');
    }
}
