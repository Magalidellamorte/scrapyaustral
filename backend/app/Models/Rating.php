<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rating extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'client_id',
        'pending',
        'scraper_id',
        'rating',
        'message',
        'offer_id',
    ];

    // protected $with = [
    //     'client',
    //     'scraper',
    // ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->without(['ratings', 'ratingAsScraper']);
    }

    public function scraper(): BelongsTo
    {
        return $this->belongsTo(User::class, 'scraper_id')->without(['ratings', 'ratingAsScraper']);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id')->without(['ratings', 'ratingAsClient']);
    }

    public function offer(): BelongsTo
    {
        return $this->belongsTo(Offer::class)->without(['user', 'pendingRating', 'rating']);
    }
}
