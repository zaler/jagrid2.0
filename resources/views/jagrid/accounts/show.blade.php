@extends('layouts/contentLayoutMaster')

@section('title', __('locale.Show account'))

@section('vendor-style')
  <!-- vendor css files -->
  <link rel="stylesheet" href="{{ asset('vendors/css/forms/select/select2.min.css') }}">
  <link rel="stylesheet" href="{{ asset('vendors/css/animate/animate.min.css') }}">
  <link rel="stylesheet" href="{{ asset('vendors/css/extensions/sweetalert2.min.css') }}">
@endsection

@section('content')
<div class="row">
  <div class="col-lg-3">
    <div class="card card-profile">
      <img
        src="https://via.placeholder.com/1980x660"
        class="img-fluid card-img-top"
        alt="Profile Cover Photo"
      />
      <div class="card-body">
        <div class="profile-image-wrapper">
          <div class="profile-image">
            <div class="avatar">
              <img src="https://ui-avatars.com/api/?name={{ $account->name }}&color=7F9CF5&background=EBF4FF" alt="Profile Picture" />
            </div>
          </div>
        </div>
        <h3>{{ $account->name }}</h3>
        <h6 class="text-muted">{{ $account->url }}</h6>
        <span class="badge badge-light-primary profile-badge">{{ $account->team->name }}</span><br>
        <span class="badge rounded-pill badge-light-{{ $account->enabled ? 'success' : 'danger' }}">{{ $account->enabled ? __('locale.Enabled') : __('locale.Disabled') }}</span>
        <hr class="mb-2" />
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h6 class="text-muted fw-bolder">Followers</h6>
            <h3 class="mb-0">10.3k</h3>
          </div>
          <div>
            <h6 class="text-muted fw-bolder">Projects</h6>
            <h3 class="mb-0">156</h3>
          </div>
          <div>
            <h6 class="text-muted fw-bolder">Rank</h6>
            <h3 class="mb-0">23</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="col-lg-9">
    <div class="card">
      <div class="card-header justify-content-between align-items-center">
        {{ __('locale.Show users') }}
        <a href="{{ route('accounts.index') }}" class="btn btn-secondary">{{ __('locale.Back') }}</a>
      </div>
      <div class="card-body">
        <div class="row">
          @if (session('statusSuccess'))
            <div class="col-lg-12">
              <div class="alert alert-success">
                  <div class="alert-body">
                    {{ __('locale.'.session('statusSuccess')) }}
                  </div>
              </div>
            </div>
          @endif
          @if($isAdminOnCurrentTeam)
          <div class="col-lg-12">
            <form action="{{ route('accounts.add-user') }}" method="post">
              @csrf
              <input type="hidden" name="account_id" value="{{ $account->id }}">
              <div class="row mt-1 mb-1">
                <div class="col-lg-6">
                  <select name="user_id" class="select2 form-select @error('user_id') is-invalid @enderror">
                    <option value="">{{ __('locale.Type to search a user') }}</option>
                    @foreach($usersToAdd as $user)
                      <option value="{{ $user->id }}">{{ $user->name }}</option>
                    @endforeach
                  </select>
                  @error('user_id')
                      <div class="invalid-feedback">{{ $message }}</div>
                  @enderror
                </div>
                <div class="col-lg-6">
                  <button class="btn btn-primary float-end" type="submit">{{ __('locale.Add user to account') }}</button>
                </div>
              </div>
            </form>
          </div>
          @endif
          <div class="col-lg-12">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>{{ __('locale.Name') }}</th>
                    <th>{{ __('locale.Email') }}</th>
                    <th>{{ __('locale.Role') }}</th>
                    @if($isAdminOnCurrentTeam)
                      <th>{{ __('locale.Actions') }}</th>
                    @endif
                  </tr>
                </thead>
                <tbody>
                  @if(count($usersInAccount) == 0)
                    <tr>
                      <td colspan="5" class="text-center">{{ __('locale.Not records found') }}</td>
                    </tr>
                  @endif
                  @foreach($usersInAccount as $user)
                    <tr>
                      <td>
                        <img
                          src="{{ $user->profile_photo_url }}"
                          class="me-75"
                          height="20"
                          width="20"
                          alt=""
                        />
                        <span class="fw-bold">{{ $user->name }}</span>
                      </td>
                      <td>{{ $user->email }}</td>
                      <td>{{ $user->teamRole($user->currentteam)->name }}</td>
                      @if($isAdminOnCurrentTeam)
                        <td>
                          <ul class="nav">
                            <li class="nav-item">
                              <a href="#" class="nav-link btn btn-flat-danger btn-remove-from-account">
                                <i data-feather="trash" class="me-50"></i>
                                {{ __('locale.Remove') }}
                                <form action="{{ route('accounts.remove-user') }}" method="post" class="d-none">
                                  @csrf
                                  <input type="hidden" name="user_id" value="{{ $user->id }}">
                                  <input type="hidden" name="account_id" value="{{ $account->id }}">
                                </form>
                              </a>
                            </li>
                          </ul>
                        </td>
                      @endif
                    </tr>
                  @endforeach
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
@endsection

@section('vendor-script')
  <!-- vendor files -->
  <script src="{{ asset('vendors/js/forms/select/select2.full.min.js') }}"></script>
  <script src="{{ asset('vendors/js/extensions/sweetalert2.all.min.js') }}"></script>
  <script src="{{ asset('vendors/js/extensions/polyfill.min.js') }}"></script>
@endsection
@section('page-script')
  <!-- Page js files -->
  <script>
    $('.select2').select2();

    $('.btn-remove-from-account').click(function(e){
      let element = $(this);
      let user_id = element.data('user-id');
      Swal.fire({
        title: '{{ __("locale.Are you sure?") }}',
        text: '{{ __("locale.You wont be able to revert this!") }}',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '{{ __("locale.Yes, remove user from account!") }}',
        cancelButtonText: '{{ __("locale.Cancel") }}',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ms-1'
        },
        buttonsStyling: false
      }).then(function (result) {
        if(result.isConfirmed){
          element.find('form').submit();
        }
      });
    });
  </script>
@endsection