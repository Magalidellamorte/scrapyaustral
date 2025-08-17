<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Province extends Model
{
    use HasFactory;
    public $timestamps = false;

    public function cities(): HasMany
    {
        return $this->hasMany(City::class);
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
        $province = empty($request['address']['province']) ? '' : $request['address']['province'];
        if (!$province) {
            return;
        }
        $get = self::where('name', $province)->first();
        if ($get) {
            return $get->id;
        }

        $new = new self();
        $new->name = $province;
        $new->save();

        return $new->id;
    }
}
