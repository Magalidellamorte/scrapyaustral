<?php

namespace App\Policies;

use App\Models\SubZone;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SubZonePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the model.
     *
     * @param User $user
     * @param SubZone $subZone
     * @return bool
     */
    public function view(User $user, SubZone $subZone): bool
    {
        return $user->isAdminLocalidad() && ($user->localidad_id === $subZone->zone->localidad_id);
    }
}
