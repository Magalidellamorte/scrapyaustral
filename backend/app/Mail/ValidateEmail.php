<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ValidateEmail extends Mailable
{
    use Queueable;
    use SerializesModels;

    private $user;
    private $attach;

    public function __construct(User $user, $attach)
    {
        $this->user = $user;
        $this->attach = $attach;
    }

    public function build(): self
    {
        return $this
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->to('info@scrapyapp.com')
            ->subject('Pendiente de validar')
            ->view('emails.validate', [
                'user' => $this->user,
                'attach' => $this->attach,
            ]);
    }
}
