<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Scope;

class EnabledScope implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        $builder->where('enabled', 1);
    }
}

class Category extends Model
{
    use HasFactory;

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function toNotifyNewOffer(): BelongsToMany
    {
        return $this->users();
    }

    protected static function booted()
    {
        static::addGlobalScope(new EnabledScope());
    }

    public function offers()
    {
        return $this->belongsToMany(Offer::class, 'offer_offer_category');
    }
}
