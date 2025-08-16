<?php

namespace App\ModelFilters;

use EloquentFilter\ModelFilter;

class ChatMessageFilter extends ModelFilter
{
    public $relations = [];

    public function scraper($scraper): ChatMessageFilter
    {
        $userId = auth()->user()->id;

        if($scraper === 'true' || $scraper === true) {
            return $this->related('offer.user', function($query) use ($userId) {
                return $query->where('id', '!=', $userId);
            });
        }

        return $this->related('offer.user', function($query) use ($userId) {
            return $query->where('id', '=', $userId);
        });
    }
}
