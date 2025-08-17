<?php

namespace App\Models;

use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

/**
 * @property string $type
 * @property int    $localidad_id
 */
class User extends Authenticatable implements CanResetPasswordContract
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;
    use CanResetPassword;

    public const STORAGE_PATH = 'images/users/';

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $appends = [
        'full_name',
    ];

    protected $with = [
        'availabilities',
        'categories',
        'address',
        'subscriptions',
        'ratingAsScraper',
        'ratingAsClient',
    ];

    public function getFullNameAttribute()
    {
        if ($this->is_company && $this->company_title) {
            return $this->company_title;
        } else {
            return $this->first_name . ' ' . $this->last_name;
        }
    }

    public function address(): MorphOne
    {
        return $this->morphOne(Address::class, 'addressable')->withDefault();
    }

    public function images(): MorphMany
    {
        return $this->morphMany(Image::class, 'imagable'); // ->orderBy('order');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function availabilities(): HasMany
    {
        return $this->hasMany(Availability::class, 'user_id', 'id');
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class, 'user_id', 'id');
    }

    public function ratingAsScraper(): HasMany
    {
        return $this
            ->hasMany(Rating::class, 'scraper_id', 'id')
            ->where('pending', 0)
            ->whereColumn('scraper_id', '!=', 'user_id')
            ->orderBy('created_at', 'desc');
    }

    public function ratingAsClient(): HasMany
    {
        return $this
            ->hasMany(Rating::class, 'client_id', 'id')
            ->where('pending', 0)
            ->whereColumn('client_id', '!=', 'user_id')
            ->orderBy('created_at', 'desc');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'user_id', 'id');
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class, 'user_id', 'id');
    }

    public function isAdminLocalidad(): bool
    {
        return 'admin_localidad' === $this->type;
    }

    public function localidad(): BelongsTo
    {
        return $this->belongsTo(Localidad::class);
    }
}
