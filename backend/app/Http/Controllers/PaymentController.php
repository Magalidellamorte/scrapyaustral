<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function success(Request $request, Invoice $invoice) {
        if($invoice->paid_at) {
            return;
        }

        $invoice->paid_at = Carbon::now();
        $invoice->payment_callback_options = collect($request->all())->toJson();
        $subscription = $invoice->subscription;
        $plan = $subscription->plan;

        if($subscription->ends_at < Carbon::now()) {
            $subscription->ends_at = Carbon::now()->add($plan->invoice_period, $plan->invoice_interval);
        } else {
            $subscription->ends_at = $subscription->ends_at->add($plan->invoice_period, $plan->invoice_interval);
        }

        $invoice->save();
        $subscription->save();

        return view('payment.success')->with('invoice', $invoice);
    }
}
