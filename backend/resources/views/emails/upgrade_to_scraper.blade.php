@extends('emails.base_email')
@section('title', '¡Has actualizado tu cuenta a Scraper!')
@section('content')
    <p>{{ $user->first_name }} tu cuenta se actualizò a Scraper</p>
    <p>Ya puedes comenzar a ofertar por anuncios publicados. Tienes un periodo de pruebas gratuito de {{ $plan->trial_period }} dìas.</p>
@endsection