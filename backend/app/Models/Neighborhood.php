<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\City;

class Neighborhood extends Model
{
    public $timestamps = false;
    use HasFactory;

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

    public function createOrGet($request)
    {
        $neighborhood = empty($request['address']['neighborhood']) ? '' : $request['address']['neighborhood'];
        if(!$neighborhood) return;
        
        $get = Neighborhood::where('name',$neighborhood)->first();
        if($get)
            return $get->id;

        $new=new Neighborhood();
        $new->name=$neighborhood;
        $new->city_id=City::createOrget($request);
        $new->save();
        
        return $new->id;
    }
}
