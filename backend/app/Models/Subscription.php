<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'plan_id',
        'trial_ends_at',
        'starts_at',
        'ends_at',
        'ends_at',
        'generate_invoice',
        'free_time',
    ];

    protected $casts = [
        'ends_at' => 'datetime',
        'trial_ends_at' => 'datetime'
    ];

    protected $with = [
        'plan',
        'invoices'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class, 'subscription_id', 'id');
    }

    public function scopeIsNotEnded($query) {
        return $query->where('ends_at', '>=', Carbon::today());
    }

    public function scopeIsNotCancelled($query) {
        return $query->where('canceled_at', null);
    }

    public function scopeNeedsRenewal($query)
    {
        return $query
            ->isNotEnded()
            ->isNotCancelled()
            ->where(function (Builder $inner) {
                return $inner
                    ->where('ends_at', '<=', Carbon::today()->addDays(3))
                    ->orWhere('trial_ends_at', '<=', Carbon::today()->addDays(1))
                    ->orWhere('generate_invoice', 1);
            })
            ->whereDoesntHave('invoices', function (Builder $query) {
                $query->where('created_at', 'like', Carbon::today()->format('Y-m-d') . '%');
            });
    }

    public function hasPendingInvoices(): bool
    {
        return (bool) $this->invoices->where('paid_at', null)->count();
    }
}
