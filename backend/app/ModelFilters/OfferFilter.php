<?php

namespace App\ModelFilters;

use EloquentFilter\ModelFilter;
use Illuminate\Database\Eloquent\Builder;

class OfferFilter extends ModelFilter
{
    public $relations = [];

    public function own($own): self
    {
        $userId = auth()->user()->id;

        if ('true' === $own || true === $own) {
            return $this->where('user_id', $userId);
        }

        if ('false' == $own || false === $own) {
            return $this->where('user_id', '!=', $userId);
        }

        return $this;
    }

    public function offerTypes($types): self
    {
        return $this->whereIn('offer_type_id', $types);
    }

    public function offerStatuses($statuses): self
    {
        return $this->whereIn('offer_status_id', $statuses);
    }

    public function categories($categories): self
    {
        return $this->whereIn('category_id', $categories);
    }

    public function conditions($conditions): self
    {
        return $this->whereIn('condition_id', $conditions);
    }

    public function userId($userId): self
    {
        return $this->where('user_id', $userId);
    }

    public function search($search): self
    {
        return $this->where(function (Builder $inner) use ($search) {
            return $inner
                ->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        });
    }
}
