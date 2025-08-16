<?php

namespace App\Mail;

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewInvoiceEmail extends Mailable
{
    use Queueable;
    use SerializesModels;

    private $user;

    private $invoice;

    public function __construct(User $user, Invoice $invoice)
    {
        $this->user = $user;
        $this->invoice = $invoice;
    }

    public function build(): self
    {
        $subject = 'Nueva boleta de pago';

        return $this
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->to($this->user->email)
            ->subject($subject)
            ->view('emails.new_invoice', [
                'user' => $this->user,
                'invoice' => $this->invoice,
                'subject' => $subject,
            ]);
    }
}
