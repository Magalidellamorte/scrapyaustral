@extends('emails.base_email')
@section('title', 'Han enviado una consulta')
@section('content')
    <p>
        Nombre: {{ $user->first_name }}<br/>
        Apellido: {{ $user->last_name }}<br/>
        Correo electrónico: {{ $user->email  }}<br/>
        Miembro desde: {{ $user->created_at }}
    </p>

    <p>
        Envió una consulta a soporte:<br/><br/>
        "{{ $support->question }}"
    </p>
@endsection
