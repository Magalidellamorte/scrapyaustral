<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

/**
 * @property int                 $localidad_id
 * @property Polygon             $polygon
 * @property Collection<SubZone> $subZones
 */
class Zone extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'localidad_id'];

    public function subZones(): HasMany
    {
        return $this->hasMany(SubZone::class);
    }

    public function polygon(): MorphOne
    {
        return $this->morphOne(Polygon::class, 'polygonable');
    }

    public function schedules(): MorphMany
    {
        return $this->morphMany(ZoneSchedule::class, 'schedulable');
    }

    public function localidad(): BelongsTo
    {
        return $this->belongsTo(Localidad::class);
    }
}
