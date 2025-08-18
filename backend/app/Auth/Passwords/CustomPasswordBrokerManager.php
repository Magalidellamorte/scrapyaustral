<?php

namespace App\Auth\Passwords;

use Closure;
use Illuminate\Auth\Passwords\PasswordBrokerManager;
use Illuminate\Support\Str;

class CustomPasswordBrokerManager extends PasswordBrokerManager
{
    protected function createTokenRepository(array $config): CustomDatabaseTokenRepository
    {
        $key = $this->app['config']['app.key'];

        if (Str::startsWith($key, 'base64:')) {
            $key = base64_decode(substr($key, 7));
        }

        $connection = $config['connection'] ?? null;

        return new CustomDatabaseTokenRepository(
            $this->app['db']->connection($connection),
            $this->app['hash'],
            $config['table'],
            $key,
            $config['expire'],
            $config['throttle'] ?? 0
        );
    }

    public function sendResetLink(array $credentials, ?\Closure $callback = null)
    {
        return parent::sendResetLink($credentials, $callback);
    }

    public function reset(array $credentials, \Closure $callback)
    {
        return parent::reset($credentials, $callback);
    }
}
