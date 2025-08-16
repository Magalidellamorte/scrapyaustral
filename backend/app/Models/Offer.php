<?php

namespace App\Models;

use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Builder;

class Offer extends Model
{
    use HasFactory;
    use Filterable;

    protected $with = [
        'category',
        'user',
        'offerType',
        'address',
        'offerStatus',
        'images',
        'measureType',
        'condition',
        'postulations',
        'ownPostulations',
        'rating',
        'pendingRating',
    ];

    public const STORAGE_PATH = 'images/offer/';

    public function address(): MorphOne
    {
        return $this->morphOne(Address::class, 'addressable')->withDefault();
    }

    public function images(): MorphMany
    {
        return $this->morphMany(Image::class, 'imagable'); // ->orderBy('order');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function offerType(): BelongsTo
    {
        return $this->belongsTo(OfferType::class);
    }

    public function offerStatus(): BelongsTo
    {
        return $this->belongsTo(OfferStatus::class);
    }

    public function measureType(): BelongsTo
    {
        return $this->belongsTo(MeasureType::class);
    }

    public function condition(): BelongsTo
    {
        return $this->belongsTo(Condition::class);
    }

    public function postulations(): HasMany
    {
        return $this->hasMany(Postulation::class);
    }

    public function torkies(): hasMany
    {
        return $this->hasMany(OfferTorky::class);
    }

    public function ownPostulations(): HasMany
    {
        return $this
            ->hasMany(Postulation::class)
            ->where('user_id', auth()->user()->id ?? null);
    }

    public function rating(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    public function pendingRating(): HasMany
    {
        return $this
            ->rating()
            ->where('pending', true)
            ->where('user_id', auth()->user()->id ?? null);
    }

    public function scopeInDistance(Builder $query, $distance, $latitude, $longitude) {
        return $query->whereHas('address', function ($query) use ($distance, $latitude, $longitude) {
            $query->whereRaw("
                (3959 * ACOS(COS(RADIANS($latitude))
               * COS(RADIANS(latitude))
               * COS(RADIANS($longitude) - RADIANS(longitude))
               + SIN(RADIANS($latitude))
               * SIN(RADIANS(latitude)))) <= $distance
            ");
        });
    }

    public function offerCategories()
    {
        return $this->belongsToMany(Category::class, 'offer_offer_category');
    }
}
