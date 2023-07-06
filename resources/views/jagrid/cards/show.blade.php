@extends('layouts/contentLayoutMaster')

@section('title', 'Cards')

@section('page-style')
<link rel="stylesheet" href="{{ asset('css/base/pages/app-chat-list.css') }}">
@endsection

@section('content')

  <div class="row">
    <div class="col-12">
      <input type="hidden" name="account_id" value="{{ $account->id }}">
      <input type="hidden" name="account_url" value="{{ $account->url }}">
      <input type="hidden" name="account_name" value="{{ $account->name }}">
      <input type="hidden" name="user_id" value="{{ $user_id }}">
      <input type="hidden" name="user_role" value="{{ $user_role }}">
      <input type="hidden" name="locale" value="{{ app()->getLocale() }}" />
      <input type="hidden" name="base_url" value="{{ config('app.url') }}" />
      <div id="cards"></div>
    </div>
  </div>

@endsection

@section('page-script')
  <script src="{{ mix('js/cards.js') }}"></script>
@endsection