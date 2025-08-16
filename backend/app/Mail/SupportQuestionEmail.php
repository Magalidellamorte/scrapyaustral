<?php

namespace App\Mail;

use App\Models\Support;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Auth\Authenticatable;

class SupportQuestionEmail extends Mailable
{
    use Queueable;
    use SerializesModels;

    private $user;

    private $support;

    public function __construct(Authenticatable $user,  Support $support)
    {
        $this->user = $user;
        $this->support = $support;
    }

    public function build(): self
    {
        return $this
            ->from(config('mail.support.address'), config('mail.from.name'))
            ->to(config('mail.support.address'))
            ->subject($this->user->full_name . ' envió una consulta')
            ->view('emails.support_question', [
                'user' => $this->user,
                'support' => $this->support,
            ]);
    }
}
