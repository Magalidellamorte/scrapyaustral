<?php

namespace App\ModelFilters;

use EloquentFilter\ModelFilter;

class PostulationFilter extends ModelFilter
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
        return $this->related('offer', function ($query) use ($types) {
            return $query->whereIn('offer_type_id', $types);
        });
    }

    public function offerStatuses($statuses): self
    {
        return $this->related('offer', function ($query) use ($statuses) {
            return $query->whereIn('offer_status_id', $statuses);
        });
    }

    public function categories($categories): self
    {
        return $this->related('offer', function ($query) use ($categories) {
            return $query->whereIn('category_id', $categories);
        });
    }

    public function conditions($conditions): self
    {
        return $this->related('offer', function ($query) use ($conditions) {
            return $query->whereIn('condition_id', $conditions);
        });
    }
}
