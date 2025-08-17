<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Zone;
use Illuminate\Auth\Access\HandlesAuthorization;

class ZonePolicy
{
    use HandlesAuthorization;

    private function checkUserLocalidad(User $user, Zone $zone): bool
    {
        return $user->isAdminLocalidad() && ($user->localidad_id === $zone->localidad_id);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Zone $zone): bool
    {
        return $this->checkUserLocalidad($user, $zone);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Zone $zone): bool
    {
        return $this->checkUserLocalidad($user, $zone);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Zone $zone): bool
    {
        return $this->checkUserLocalidad($user, $zone);
    }

    public function createSchedule(User $user, Zone $zone): bool
    {
        return $this->checkUserLocalidad($user, $zone);
    }
}
