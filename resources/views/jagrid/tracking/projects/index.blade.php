@extends('layouts/contentLayoutMaster')

@section('title', 'Tracking Projects')

@section('content')

<div class="row">
  @foreach($accounts as $account)
  <div class="col-xl-3 col-md-4 col-sm-6">
    <a href="/tracking/projects/{{ $account->url }}">
      <div class="card text-center">
        <div class="card-body">
          <div class="avatar bg-light-danger p-50 mb-1">
            <div class="avatar-content">
              <img src="https://ui-avatars.com/api/?name={{ $account->name }}&color=7F9CF5&background=EBF4FF" alt="" />
            </div>
          </div>
          <h2 class="fw-bolder">{{ $account->name }}</h2>
          <p class="card-text">{{ $account->url }}</p>
        </div>
      </div>
    </a>
  </div>
  @endforeach
  <div class="col-lg-12">
    {{ $accounts->links() }}
  </div>
</div>

@endsection