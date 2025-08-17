<?php

namespace App\ModelFilters;

use EloquentFilter\ModelFilter;

class ChatMessageFilter extends ModelFilter
{
    public $relations = [];

    public function scraper($scraper): self
    {
        $userId = auth()->user()->id;

        if ('true' === $scraper || true === $scraper) {
            return $this->related('offer.user', function ($query) use ($userId) {
                return $query->where('id', '!=', $userId);
            });
        }

        return $this->related('offer.user', function ($query) use ($userId) {
            return $query->where('id', '=', $userId);
        });
    }
}
