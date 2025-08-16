<?php

namespace App\ModelFilters;

use EloquentFilter\ModelFilter;
use Illuminate\Database\Eloquent\Builder;

class OfferFilter extends ModelFilter
{
    public $relations = [];

    public function own($own): OfferFilter
    {
        $userId = auth()->user()->id;

        if($own === 'true' || $own === true) {
            return $this->where('user_id', $userId);
        }

        if($own == 'false' || $own === false) {
            return $this->where('user_id', '!=', $userId);
        }

        return $this;
    }

    public function offerTypes($types): OfferFilter
    {
        return $this->whereIn('offer_type_id', $types);
    }

    public function offerStatuses($statuses): OfferFilter
    {
        return $this->whereIn('offer_status_id', $statuses);
    }

    public function categories($categories): OfferFilter
    {
        return $this->whereIn('category_id', $categories);
    }

    public function conditions($conditions): OfferFilter
    {
        return $this->whereIn('condition_id', $conditions);
    }

    public function userId($userId): OfferFilter
    {
        return $this->where('user_id', $userId);
    }

    public function search($search): OfferFilter
    {
        return $this->where(function (Builder $inner) use ($search) {
            return $inner
                ->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        });
    }
}
