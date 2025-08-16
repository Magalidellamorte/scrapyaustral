@extends('emails.base_email')
@section('content')
    <p>El usuario <strong>#{{ $user->id }}</strong>  {{ $user->first_name }} {{ $user->last_name }} ( {{ $user->email }} ) solicito validación en Scarpy</p>
    <p>Tipo: {{ $user->is_company ? 'Compañia' : 'Persona' }}</p>
    <p>{{ $user->is_company ? 'CUIT' : 'DNI' }}: {{ $user->fiscal_id }}</p>
    <br /><br />


    <p><u>Documentación adjunta:</u></p>
    @foreach($attach as $att)
        <div><a href="{{url('storage/'.$att)}}" target="_blank">{{$att}}</a></div>
    @endforeach
@endsection