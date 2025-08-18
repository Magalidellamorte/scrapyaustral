<?php

namespace App\Services;

use App\Models\Notification;
use Illuminate\Support\Facades\Http;

class ExpoNotification
{
    public static function send($to, $title, $body, $data = [], $goTo = ['goTo' => null, 'goToParams' => null])
    {
        $notifications = [];

        foreach ($to as $user) {
            if (!empty($user->player_id)) {
                $notifications[] = [
                    'sound' => 'default',
                    'to' => $user->player_id,
                    'title' => $title,
                    'body' => $body,
                    'data' => $data,
                ];
            }

            $notification = new Notification();
            $notification->user_id = $user->id;
            $notification->player_id = empty($user->player_id) ? null : $user->player_id;
            $notification->title = $title;
            $notification->message = $body;
            $notification->goTo = $goTo['goTo'];
            $notification->goToParams = $goTo['goToParams'] ? json_encode($goTo['goToParams']) : null;
            $notification->save();
        }

        if (count($notifications) > 0) {
            try {
                Http::withHeaders([
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                    'Accept-Encoding' => 'gzip, deflate, br',
                ])->post('https://exp.host/--/api/v2/push/send', $notifications);
            } catch (\Exception $e) {
                return false;
            }

            return $notifications;
        }

        return false;
    }
}
