@php
$configData = Helper::applClasses();
@endphp
@extends('layouts/fullLayoutMaster')

@section('title', 'Iniciar Sesión')

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
          <img class="img-fluid" src="{{asset('images/pages/login-v2-dark.svg')}}" alt="Login V2" />
          @else
          <img class="img-fluid" src="{{asset('images/pages/login-v2.svg')}}" alt="Login V2" />
          @endif
      </div>
    </div>
    <!-- /Left Text-->

    <!-- Login-->
    <div class="d-flex col-lg-4 align-items-center auth-bg px-2 p-lg-5">
      <div class="col-12 col-sm-8 col-md-6 col-lg-12 px-xl-2 mx-auto">
        <h2 class="card-title fw-bold mb-1">¡Bienvenid@ a Jagrid! 👋</h2>
        <p class="card-text mb-2">Inicia sesión en tu cuenta y comienza la aventura.</p>
          @if (session('status'))
            <div class="alert alert-success mb-1 rounded-0" role="alert">
              <div class="alert-body">
                {{ session('status') }}
              </div>
            </div>
          @endif
        <form class="auth-login-form mt-2" action="{{ route('login') }}" method="POST">
          @csrf
          <div class="mb-1">
            <label class="form-label" for="login-email">Correo electrónico</label>
            <input class="form-control @error('email') is-invalid @enderror" id="login-email" type="text" name="email" value="{{ old('email') }}" placeholder="john@example.com" aria-describedby="login-email" autofocus="" tabindex="1" />
            @error('email')
              <span class="invalid-feedback" role="alert">
                <strong>{{ $message }}</strong>
              </span>
            @enderror
          </div>
          <div class="mb-1">
            <div class="d-flex justify-content-between">
              <label class="form-label" for="login-password">Contraseña</label>
              @if (Route::has('password.request'))
                <a href="{{ route('password.request') }}">
                  <small>¿Has olvidado tu contraseña?</small>
                </a>
              @endif
            </div>
            <div class="input-group input-group-merge form-password-toggle">
              <input class="form-control form-control-merge @error('password') is-invalid @enderror" id="login-password" type="password" name="password" placeholder="············" aria-describedby="login-password" tabindex="2" />
              <span class="input-group-text cursor-pointer"><i data-feather="eye"></i></span>
              @error('password')
                <span class="invalid-feedback" role="alert">
                  <strong>{{ $message }}</strong>
                </span>
              @enderror
            </div>
          </div>
          <div class="mb-1">
            <div class="form-check">
              <input class="form-check-input" name="remember" id="remember-me" type="checkbox" tabindex="3" {{ old('remember') ? 'checked' : '' }} />
              <label class="form-check-label" for="remember-me"> Recuerdame</label>
            </div>
          </div>
          <button type="submit" class="btn btn-primary w-100" tabindex="4">Iniciar sesión</button>
        </form>
        <p class="text-center mt-2">
          <span>¿No tienes una cuenta?</span>
          @if (Route::has('register'))
            <a href="{{ route('register') }}">
              <span>Crear una cuenta nueva</span>
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
    <!-- /Login-->
  </div>
</div>
@endsection

@section('vendor-script')
<script src="{{asset('vendors/js/forms/validation/jquery.validate.min.js')}}"></script>
@endsection

@section('page-script')
<script src="{{asset('js/scripts/pages/auth-login.js')}}"></script>
@endsection
