@component('mail::message')
# Publicaciones pendientes de revisión

Estas son las últimas publicaciones pendientes de revisión para el calendario de {{ $data->account_name }}.

@component('mail::button', ['url' => $data->url])
Ir al calendario
@endcomponent

Att,<br>
El equipo de {{ config('app.name') }}
@endcomponent
