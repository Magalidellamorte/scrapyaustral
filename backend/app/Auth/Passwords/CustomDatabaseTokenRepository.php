<?php

namespace App\Auth\Passwords;

use Illuminate\Auth\Passwords\DatabaseTokenRepository;
use Exception;

class CustomDatabaseTokenRepository extends DatabaseTokenRepository
{
    /**
     * @throws Exception
     */
    public function createNewToken()
    {
        return random_int(100000, 999999);
    }
}
