@extends('layouts/contentLayoutMaster')

@section('title', __('locale.Create account'))

@section('content')
<div class="row">
  <div class="col-12">
    <div class="card">
      <div class="card-header justify-content-end">
        <a href="{{ route('accounts.index') }}" class="btn btn-secondary">{{ __('locale.Back') }}</a>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-12">
            <form action="{{ route('accounts.store') }}" method="post">
              @csrf
              <div class="form-group">
                <label for="account_name">{{ __('locale.Name') }}</label>
                <input type="text" id="account_name" name="name" class="form-control @error('name') is-invalid @enderror" placeholder="{{ __('locale.Name') }}" value="{{ old('name') }}"/>
                @error('name')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
              </div>
              <div class="form-group mt-1">
                <label for="account_url">{{ __('locale.Url') }}</label>
                <input type="text" id="account_url" name="url" class="form-control @error('url') is-invalid @enderror" placeholder="{{ __('locale.Url') }}" value="{{ old('url') }}"/>
                @error('url')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
              </div>
              <div class="form-group mt-1">
                <label for="">{{ __('locale.Status') }}</label>
                <br>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="enabled"
                    id="enabled1"
                    value="1"
                    checked
                  />
                  <label class="form-check-label" for="enabled1">{{ __('locale.Enabled') }}</label>
                </div>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="enabled"
                    id="enabled2"
                    value="0"
                  />
                  <label class="form-check-label" for="enabled2">{{ __('locale.Disabled') }}</label>
                </div>
              </div>
              <div class="form-group mt-1">
                <label for="">{{ __('locale.Team') }}</label>
                <select name="team_id" class="form-control">
                  @foreach($teams as $team)
                    <option value="{{ $team->id }}" {{ $team->id == $currentTeam->id ? "selected" : "" }}>{{ $team->name }}</option>
                  @endforeach
                </select>
              </div>
              <div class="form-group mt-1 d-flex justify-content-end">
                <button type="submit" class="btn btn-primary">{{ __('locale.Create account') }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
@endsection
@section('page-script')
  <!-- Page js files -->
  <script>
    $(document).ready(function(e){
      var account_url = $('#account_url');
      $('#account_name').on('input', function(e){

        $(this).val().trim().replaceAll(/\s+/g, '-');

        let val = $(this).val();
        account_url.val(val.trim().replaceAll(/\s+/g, '-').toLowerCase());
      });
    });
  </script>
@endsection