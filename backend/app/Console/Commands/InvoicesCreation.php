<?php

namespace App\Console\Commands;

use App\Jobs\SendEmail;
use App\Mail\EndsTrialEmail;
use App\Mail\NewInvoiceEmail;
use App\Models\Invoice;
use App\Models\Subscription;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use MP;

class InvoicesCreation extends Command
{
    protected $signature = 'invoices:generate';

    protected $description = 'Generate new invoices';

    public function handle(): int
    {
        $subscriptions = Subscription::needsRenewal()->get();

        foreach ($subscriptions as $subscription) {
            if($subscription->hasPendingInvoices()) {
                return 0;
            }

            $isEndTrial = !$subscription->invoices->count();

            $user = $subscription->user;

            $invoice = Invoice::create([
                'user_id' => $subscription->user_id,
                'subscription_id' => $subscription->id,
                'amount' => $subscription->plan->price,
                'token' => Str::random(32)
            ]);

            $preference = MP::create_preference([
                'items' => [
                    [
                        'id' => $invoice->id,
                        'category_id' => $subscription->plan->slug,
                        'title' => config('app.name').' - Plan: '.$subscription->plan->name,
                        'description' => strip_tags($subscription->plan->text),
                        'quantity' => 1,
                        'currency_id' => $subscription->plan->currency,
                        'unit_price' => (float) $invoice->amount,
                    ]
                ],
                'auto_return' => 'approved',
                'back_urls' => [
                    'success' => url('/payment/success/' . $invoice->token),
                ],
            ]);

            $preference_id = $preference['response']['id'];
            $invoice->payment_link = 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=' . $preference_id;
            $invoice->preference_id = $preference_id;
            $invoice->save();

            // if ($isEndTrial) {
            //     SendEmail::dispatch(new EndsTrialEmail($user, $invoice));
            // } else {
                SendEmail::dispatch(new NewInvoiceEmail($user, $invoice));
            // }

            $subscription->generate_invoice = 0;
            $subscription->save();
        }

        return 0;
    }
}
