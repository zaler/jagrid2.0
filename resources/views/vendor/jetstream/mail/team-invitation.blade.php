@component('mail::message')
{{ __('Has sido invitado a unirte al equipo :team', ['team' => $invitation->team->name]) }}

@if (Laravel\Fortify\Features::enabled(Laravel\Fortify\Features::registration()))
{{ __('Si no tiene una cuenta, puede crear una haciendo clic en el botón a continuación. Después de crear una cuenta, puede hacer clic en el botón de aceptación de invitación en este correo electrónico para aceptar la invitación del equipo:') }}

@component('mail::button', ['url' => route('register')])
{{ __('Crear nueva cuenta') }}
@endcomponent

{{ __('Si ya tiene una cuenta, puede aceptar esta invitación haciendo clic en el siguiente botón:') }}

@else
{{ __('Puede aceptar esta invitación haciendo clic en el siguiente botón:') }}
@endif


@component('mail::button', ['url' => $acceptUrl])
{{ __('Aceptar invitación') }}
@endcomponent

{{ __('Si no esperaba recibir una invitación para este equipo, puede descartar este correo electrónico.') }}
@endcomponent
