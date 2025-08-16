<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatMessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();

        $chats = ChatMessage::where(function (Builder $inner) use ($user) {
            return $inner
                ->where('sender_id', $user->id)
                ->orWhere('receiver_id', $user->id);
        })
            ->filter($request->all())->with(['offer', 'sender', 'receiver'])
            ->orderBy('id', 'desc')
            ->get()
            ->unique(function ($item) {
                $sender = $item['sender_id'];
                $receiver = $item['receiver_id'];
                $offer_id = $item['offer_id'];

                $key = $sender . $receiver . $offer_id;

                if($receiver > $sender) {
                    $key = $receiver . $sender . $offer_id;
                }

                return $key;
            })
            ->map(function ($item) use ($user) {
                $unreadCount= ChatMessage::where('receiver_id', $user->id)
                    ->where('sender_id', $user->id == $item['sender_id'] ? $item['receiver_id'] : $item['sender_id'])
                    ->where('readed', false)
                    ->count();

                $item['unread_count'] = $unreadCount;

                return $item;
            })
            ->values()
            ->all();

        return response()->json($chats);
    }
}
