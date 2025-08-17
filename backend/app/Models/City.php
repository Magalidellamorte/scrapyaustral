<?php

namespace App\Models;

use App\Models\Province;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class City extends Model
{
    use HasFactory;
    public $timestamps = false;

    public function neighborhoods(): HasMany
    {
        return $this->hasMany(Neighborhood::class);
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    public function address(): HasMany
    {
        return $this->hasMany(Address::class);
    }

    public function scopeUsed(Builder $query): Builder
    {
        return $query->has('address');
    }

    public function createOrGet($request)
    {
        $city = empty($request['address']['city']) ? '' : $request['address']['city'];
        if (!$city) {
            return;
        }

        $get = self::where('name', $city)->first();
        if ($get) {
            return $get->id;
        }

        $new = new self();
        $new->name = $city;
        $new->province_id = Province::createOrget($request);
        $new->save();

        return $new->id;
    }
}
