@extends('layouts/contentLayoutMaster')

<?php
$title = $account->name . ' ' . __('locale.Calendar');
if(app()->getLocale() == 'es'){
  $title= __('locale.Calendar') . ' ' . $account->name;
}
?>

@section('title', $title )

@section('page-style')
<link rel="stylesheet" href="{{asset('css/base/pages/app-chat-list.css')}}">
@endsection

@section('content')

  <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-body">
          <input type="hidden" name="account_id" value="{{ $account->id }}">
          <input type="hidden" name="account_url" value="{{ $account->url }}">
          <input type="hidden" name="account_name" value="{{ $account->name }}">
          <input type="hidden" name="event_id" value="{{ $event_id }}">
          <input type="hidden" name="isSingleEvent" value="{{ $isSingleEvent }}">
          <input type="hidden" name="locale" value="{{ app()->getLocale() }}" />
          <input type="hidden" name="user_id" value="{{ $user_id }}" />
          <input type="hidden" name="user_role" value="{{ $user_role }}" />
          <input type="hidden" name="base_url" value="{{ config('app.url') }}" />
          <div id="calendar"></div>
        </div>
      </div>
    </div>
  </div>

@endsection

@section('page-script')
  <!-- Page js files -->
  <script src="{{ mix('js/calendar.js') }}"></script>
@endsection