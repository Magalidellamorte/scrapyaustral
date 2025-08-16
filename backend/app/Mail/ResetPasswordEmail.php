<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordEmail extends Mailable
{
    use Queueable;
    use SerializesModels;

    private $token;

    private $email;

    public function __construct(string $email, string $token)
    {
        $this->token = $token;
        $this->email = $email;
    }

    public function build(): self
    {
        return $this
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->to($this->email)
            ->subject('Código para recuperar contraseña')
            ->view('emails.forgot_password', [
                'token' => $this->token
            ]);
    }
}
