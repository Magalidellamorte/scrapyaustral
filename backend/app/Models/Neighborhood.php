<?php

namespace App\Models;

use App\Models\City;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Neighborhood extends Model
{
    use HasFactory;
    public $timestamps = false;

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function address(): HasMany
    {
        return $this->hasMany(Address::class);
    }

    public function scopeUsed(Builder $query): Builder
    {
        return $query->has('address');
    }

    public static function createOrGet($request)
    {
        $neighborhood = empty($request['address']['neighborhood']) ? '' : $request['address']['neighborhood'];
        if (!$neighborhood) {
            return;
        }

        $get = self::where('name', $neighborhood)->first();
        if ($get) {
            return $get->id;
        }

        $new = new self();
        $new->name = $neighborhood;
        $new->city_id = City::createOrget($request);
        $new->save();

        return $new->id;
    }
}
