@extends('emails.base_email')
@section('title', $subject)
@section('content')
    <p>{{ $user->first_name }} en el día {{ $invoice->subscription->trial_ends_at->format('d/m/Y') }} se vence tu periodo de prueba como Scraper</p>
    <p>Si deseas continuar siendo Scraper puedes abonar tu subscripción en el siguiente enlace:</p>
    <p><a href="{{ $invoice->payment_link }}">{{ $invoice->payment_link }}</a></p>
@endsection
