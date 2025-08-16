<?php

namespace App\ModelFilters;

use EloquentFilter\ModelFilter;

class PostulationFilter extends ModelFilter
{
    public $relations = [];

    public function own($own): PostulationFilter
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

    public function offerTypes($types): PostulationFilter
    {
        return $this->related('offer', function($query) use ($types) {
            return $query->whereIn('offer_type_id', $types);
        });
    }

    public function offerStatuses($statuses): PostulationFilter
    {
        return $this->related('offer', function($query) use ($statuses) {
            return $query->whereIn('offer_status_id', $statuses);
        });
    }

    public function categories($categories): PostulationFilter
    {
        return $this->related('offer', function($query) use ($categories) {
            return $query->whereIn('category_id', $categories);
        });
    }

    public function conditions($conditions): PostulationFilter
    {
        return $this->related('offer', function($query) use ($conditions) {
            return $query->whereIn('condition_id', $conditions);
        });
    }
}
