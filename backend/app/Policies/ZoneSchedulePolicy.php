<?php

namespace App\Policies;

use App\Models\SubZone;
use App\Models\User;
use App\Models\Zone;
use App\Models\ZoneSchedule;
use Illuminate\Auth\Access\HandlesAuthorization;

class ZoneSchedulePolicy
{
    use HandlesAuthorization;

    protected function checkUserLocalidad(User $user, ZoneSchedule $zoneSchedule): bool
    {
        $schedulable = $zoneSchedule->schedulable;
        if ($schedulable instanceof Zone || $schedulable instanceof SubZone) {
            return $schedulable->localidad_id === $user->localidad_id;
        }
        return false;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param User $user
     * @param ZoneSchedule $zoneSchedule
     * @return bool
     */
    public function view(User $user, ZoneSchedule $zoneSchedule): bool
    {
        return $this->checkUserLocalidad($user, $zoneSchedule);
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param User $user
     * @param ZoneSchedule $zoneSchedule
     * @return bool
     */
    public function update(User $user, ZoneSchedule $zoneSchedule): bool
    {
        return $this->checkUserLocalidad($user, $zoneSchedule);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param User $user
     * @param ZoneSchedule $zoneSchedule
     * @return bool
     */
    public function delete(User $user, ZoneSchedule $zoneSchedule): bool
    {
        return $this->checkUserLocalidad($user, $zoneSchedule);
    }
}
