<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'city_id', 'latitude', 'longitude', 'neighborhood_id',
        'postal_code', 'province_id', 'street', 'street_number',
        'floor', 'apartment',
    ];

    protected $with = [
        'province',
        'city',
        'neighborhood',
    ];

    protected $appends = array(
        'readable',
        'readable_public',
    );

    public function addressable(): MorphTo
    {
        return $this->morphTo();
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function neighborhood(): BelongsTo
    {
        return $this->belongsTo(Neighborhood::class);
    }

    public function getReadableAttribute(): string
    {
        $normalizeInteriorData = $this->floor || $this->apartment ? '(' . $this->floor . $this->apartment . ')' : '';

        $parts = [];
        $street = $this->street;
        if ($this->street_number) {
            $street .= ' ' . $this->street_number;
        }

        if ($street) {
            $parts[] = trim($street);
        }
        if ($normalizeInteriorData) {
            $parts[] = $normalizeInteriorData;
        }

        if ($this->neighborhood && $this->neighborhood->name) {
            $parts[] = $this->neighborhood->name;
        }

        if ($this->city && $this->city->name) {
            $parts[] = $this->city->name;
        }

        if ($this->province && $this->province->name) {
            $parts[] = $this->province->name;
        }

        return implode(', ', $parts);
    }

    public function getReadablePublicAttribute(): string
    {
        $readable = [];

        if($this->neighborhood)
            $readable[]=$this->neighborhood->name;

        if($this->city)
            $readable[]=$this->city->name;

        if($this->province)
            $readable[]=$this->province->name;

        return implode(', ',$readable);
    }
}
