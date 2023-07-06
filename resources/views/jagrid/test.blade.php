@extends('layouts/contentLayoutMaster')

@section('title', 'Test')

@section('content')
<div class="row">
  <div class="col-12 pb-5">
    <div id="mockups"></div>
  </div>
</div>
@endsection

@section('page-script')
  <!-- Page js files -->
  <script src="{{ asset('js/mockups.js') }}"></script>
@endsection