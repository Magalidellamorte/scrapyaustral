@extends('emails.base_email')
@section('title', 'Código para cambio de contraseña')
@section('content')
    <p>El código para cambiar tu contraseña es:</p>
    <h3>{{ $token }}</h3>
@endsection
