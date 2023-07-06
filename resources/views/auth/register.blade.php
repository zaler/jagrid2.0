@php
$configData = Helper::applClasses();
@endphp
@extends('layouts/fullLayoutMaster')

@section('title', 'Crear una cuenta nueva')

@section('page-style')
  {{-- Page Css files --}}
  <link rel="stylesheet" href="{{ asset('css/base/plugins/forms/form-validation.css') }}">
  <link rel="stylesheet" href="{{ asset('css/base/pages/authentication.css') }}">
@endsection

@section('content')
<div class="auth-wrapper auth-cover">
  <div class="auth-inner row m-0">
    <!-- Brand logo-->
    <a class="brand-logo" href="#">
      <img src="{{asset('images/logo/jagrid-black.png')}}" class="img-fluid" alt="Jagrid.io">
    </a>
    <!-- /Brand logo-->

    <!-- Left Text-->
    <div class="d-none d-lg-flex col-lg-8 align-items-center p-5">
      <div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
        @if($configData['theme'] === 'dark')
        <img class="img-fluid" src="{{asset('images/pages/register-v2-dark.svg')}}" alt="Register V2" />
        @else
        <img class="img-fluid" src="{{asset('images/pages/register-v2.svg')}}" alt="Register V2" />
        @endif
      </div>
    </div>
    <!-- /Left Text-->

    <!-- Register-->
    <div class="d-flex col-lg-4 align-items-center auth-bg px-2 p-lg-5">
      <div class="col-12 col-sm-8 col-md-6 col-lg-12 px-xl-2 mx-auto">
        <h2 class="card-title fw-bold mb-1">La aventura comienza aquí 🚀</h2>
        <p class="card-text mb-2">¡Haga que la administración de su negocio sea más fácil y divertida!</p>
        <form class="auth-register-form mt-2" action="{{ route('register') }}" method="POST">
          @csrf
          <div class="mb-1">
            <label class="form-label" for="register-username">Nombre completo</label>
            <input class="form-control @error('name') is-invalid @enderror" id="register-username" type="text" name="name" placeholder="johndoe" aria-describedby="register-username" autofocus="" tabindex="1" value="{{ old('name') }}" />
            @error('name')
              <span class="invalid-feedback" role="alert">
                <strong>{{ $message }}</strong>
              </span>
            @enderror
          </div>
          <div class="mb-1">
            <label class="form-label" for="register-email">Correo electrónico</label>
            <input class="form-control @error('email') is-invalid @enderror" id="register-email" type="text" name="email" placeholder="john@example.com" aria-describedby="register-email" tabindex="2" value="{{ old('email') }}" />
            @error('email')
              <span class="invalid-feedback" role="alert">
                <strong>{{ $message }}</strong>
              </span>
            @enderror
          </div>
          <div class="mb-1">
            <label class="form-label" for="register-password">Contraseña</label>
            <div class="input-group input-group-merge form-password-toggle">
              <input class="form-control form-control-merge @error('password') is-invalid @enderror" id="register-password" type="password" name="password" placeholder="············" aria-describedby="register-password" tabindex="3" />
              <span class="input-group-text cursor-pointer"><i data-feather="eye"></i></span>
              @error('password')
                <span class="invalid-feedback" role="alert">
                  <strong>{{ $message }}</strong>
                </span>
              @enderror
            </div>
          </div>
          <div class="mb-1">
            <label class="form-label" for="register-password-confirmation">Confirmar contraseña</label>
            <div class="input-group input-group-merge form-password-toggle">
              <input class="form-control form-control-merge" id="register-password-confirmation" type="password" name="password_confirmation" placeholder="············" aria-describedby="register-password" tabindex="3" />
              <span class="input-group-text cursor-pointer"><i data-feather="eye"></i></span>
            </div>
          </div>
          @if (Laravel\Jetstream\Jetstream::hasTermsAndPrivacyPolicyFeature())
            <div class="mb-1">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="terms" name="terms" tabindex="4" />
                <label class="form-check-label" for="terms">
                  Acepto los <a href="{{ route('terms.show') }}" target="_blank">términos de servicio</a> y la
                  <a href="{{ route('policy.show') }}" target="_blank">política de privacidad</a>.
                </label>
              </div>
            </div>
          @endif
          <button type="submit" class="btn btn-primary w-100" tabindex="5">Registrarse</button>
        </form>
        <p class="text-center mt-2">
          <span>¿Ya tienes una cuenta?</span>
          @if (Route::has('login'))
            <a href="{{ route('login') }}">
              <span>Inicia sesión</span>
            </a>
          @endif
        </p>
        <div class="divider my-2">
          <div class="divider-text">o</div>
        </div>
        <div class="auth-footer-btn d-flex justify-content-center">
          <a class="btn btn-facebook" href="#"><i data-feather="facebook"></i></a>
          <a class="btn btn-twitter white" href="#"><i data-feather="twitter"></i></a>
          <a class="btn btn-google" href="#"><i data-feather="mail"></i></a>
          <a class="btn btn-github" href="#"><i data-feather="github"></i></a>
        </div>
      </div>
    </div>
    <!-- /Register-->
  </div>
</div>
@endsection

@section('vendor-script')
<script src="{{asset('vendors/js/forms/validation/jquery.validate.min.js')}}"></script>
@endsection

@section('page-script')
<script src="{{asset('js/scripts/pages/auth-register.js')}}"></script>
@endsection
