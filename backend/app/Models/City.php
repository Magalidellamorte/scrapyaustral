<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Province;

class City extends Model
{
    public $timestamps = false;
    use HasFactory;

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
        if(!$city) return;

        $get=City::where('name',$city)->first();
        if($get)
            return $get->id;

        $new=new City();
        $new->name=$city;
        $new->province_id=Province::createOrget($request);
        $new->save();
        
        return $new->id;
    }
}
