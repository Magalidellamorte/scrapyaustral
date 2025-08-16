@extends('emails.base_email')
@section('title', '¡Bienvenido a Scrapy!')
@section('content')
    <p>{{ $user->first_name }} te damos la bienvenida a Scrapy</p>
    <p>Ya puedes comenzar a publicar anuncios para tus materiales</p>
@endsection