@extends('layouts/contentLayoutMaster')

@section('title', __('locale.Accounts'))

@section('content')
<div class="row">
  <div class="col-12">
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-12">
            @if (session('statusSuccess'))
                <div class="alert alert-success">
                    <div class="alert-body">
                      {{ __('locale.'.session('statusSuccess')) }}
                    </div>
                </div>
            @endif
            @if (session('statusDanger'))
                <div class="alert alert-danger">
                    <div class="alert-body">
                      {{ __('locale.'.session('statusDanger')) }}
                    </div>
                </div>
            @endif
          </div>
          <div class="col-lg-4">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                placeholder="{{ __('locale.Search') }}"
              />
              <button class="btn btn-outline-primary" type="button"><i data-feather="search"></i></button>
            </div>
          </div>
          <div class="col-lg-8">
            @if($isAdminOnCurrentTeam)
              <a href="{{ route('accounts.create') }}" class="btn btn-primary float-end">{{ __('locale.Create account') }}</a>
            @endif
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12 py-2">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{{ __('locale.Name') }}</th>
                    <th>{{ __('locale.Url') }}</th>
                    <th>{{ __('locale.Team') }}</th>
                    <th>{{ __('locale.Status') }}</th>
                    <th>{{ __('locale.Actions') }}</th>
                  </tr>
                </thead>
                <tbody>
                  @if(count($accounts) == 0)
                    <tr>
                      <td colspan="6" class="text-center">{{ __('locale.Not records found') }}</td>
                    </tr>
                  @endif
                  @foreach($accounts as $account)
                  <tr>
                    <td>{{ $account->id }}</td>
                    <td>
                      <img
                        src="https://ui-avatars.com/api/?name={{ $account->name }}&color=7F9CF5&background=EBF4FF"
                        class="me-75 round"
                        height="35"
                        width="35"
                        alt=""
                      />
                      <span class="fw-bold">{{ $account->name }}</span>
                    </td>
                    <td>{{ $account->url }}</td>
                    <td>{{ $account->team->name }}</td>
                    <td><span class="badge rounded-pill badge-light-{{ $account->enabled ? 'success' : 'danger' }} me-1">{{ $account->enabled ? __('locale.Enabled') : __('locale.Disabled') }}</span></td>
                    <td>
                      <ul class="nav flex-column">
                        <li class="nav-item">
                          <a class="nav-link" href="{{ url('calendar', $account->url) }}">
                            <i data-feather="eye" class="me-auto"></i>
                            <span>{{ __('locale.View calendar') }}</span>
                          </a>
                        </li>
                        @if($isAdminOnCurrentTeam)
                          <li class="nav-item">
                            <a class="nav-link" href="{{ route('accounts.show', $account->id) }}">
                              <i data-feather="user" class="me-auto"></i>
                              <span>{{ __('locale.Manage users') }}</span>
                            </a>
                          </li>
                          <li class="nav-item">
                            <a class="nav-link" href="{{ route('accounts.edit', $account->id) }}">
                              <i data-feather="edit-2" class="me-auto"></i>
                              <span>{{ __('locale.Edit account') }}</span>
                            </a>
                          </li>
                        @endif
                      </ul>
                    </td>
                  </tr>
                  @endforeach
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-lg-12 d-flex justify-content-center">
          {{ $accounts->links() }}
        </div>
      </div>
    </div>
  </div>
</div>
@endsection
