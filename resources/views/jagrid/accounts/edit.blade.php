@extends('layouts/contentLayoutMaster')

@section('title', __('locale.Edit account'))

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
            <form action="{{ route('accounts.update', $account->id) }}" method="post">
              @csrf
              @method('PUT')
              <input type="hidden" name="id" value="{{ $account->id }}">
              <div class="form-group">
                <label for="">{{ __('locale.Name') }}</label>
                <input type="text" name="name" class="form-control @error('name') is-invalid @enderror" placeholder="{{ __('locale.Name') }}" value="{{ $account->name }}"/>
                @error('name')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
              </div>
              <div class="form-group mt-1">
                <label for="">{{ __('locale.Url') }}</label>
                <input type="text" name="url" class="form-control @error('url') is-invalid @enderror" placeholder="{{ __('locale.Url') }}" value="{{ $account->url }}"/>
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
                    {{ $account->enabled ? 'checked' : '' }}
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
                    {{ $account->enabled ? '' : 'checked' }}
                  />
                  <label class="form-check-label" for="enabled2">{{ __('locale.Disabled') }}</label>
                </div>
              </div>
              <div class="form-group mt-1">
                <label for="">{{ __('locale.Team') }}</label>
                <select class="form-control" disabled>
                  @foreach($teams as $team)
                    <option value="{{ $team->id }}" {{ $team->id == $currentTeam->id ? "selected" : "" }}>{{ $team->name }}</option>
                  @endforeach
                </select>
              </div>
              <div class="form-group mt-1 d-flex justify-content-between">
                <a href="{{ route('accounts.destroy', $account->id) }}" class="btn btn-outline-danger" onclick="event.preventDefault(); document.getElementById('frm-delete-account').submit();">{{ __('locale.Delete account') }}</a>
                <button type="submit" class="btn btn-primary">{{ __('locale.Edit account') }}</button>
              </div>
            </form>
            <form action="{{ route('accounts.destroy', $account->id) }}" method="post" id="frm-delete-account" class="d-none">
              @csrf
              @method('DELETE')
              <div class="form-group mt-1 d-flex justify-content-between">
                <button type="submit" class="btn btn-outline-danger">{{ __('locale.Delete account') }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
@endsection
