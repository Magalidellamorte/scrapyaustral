<?php

namespace App\Mail;

use App\Models\Plan;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Auth\Authenticatable;

class UpgradeToScraperEmail extends Mailable
{
    use Queueable;
    use SerializesModels;

    private $user;

    private $plan;

    public function __construct(Authenticatable $user, Plan $plan)
    {
        $this->user = $user;
        $this->plan = $plan;
    }

    public function build(): self
    {
        return $this
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->to($this->user->email)
            ->subject('¡Has actualizado tu cuenta a Scraper!')
            ->view('emails.upgrade_to_scraper', [
                'user' => $this->user,
                'plan' => $this->plan,
            ]);
    }
}
