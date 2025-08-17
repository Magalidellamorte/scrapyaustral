<?php

namespace App\Auth\Passwords;

use Exception;
use Illuminate\Auth\Passwords\DatabaseTokenRepository;

class CustomDatabaseTokenRepository extends DatabaseTokenRepository
{
    /**
     * @throws \Exception
     */
    public function createNewToken()
    {
        return random_int(100000, 999999);
    }
}
