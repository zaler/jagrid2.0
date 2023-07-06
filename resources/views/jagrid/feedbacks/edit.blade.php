@extends('layouts/contentLayoutMaster')

@section('title', 'Feedback')

@section('content')
<div class="row">
  <div class="col-12">
    <div class="card">
        <div class="card-body">
            <div class="d-flex justify-content-end">
              <a href="{{ route('feedbacks.index') }}" class="btn btn-secondary">Regresar</a>
            </div>
            <form action="{{ route('feedbacks.update', $feedback->id) }}" method="post">
              @csrf
              @method('PUT')
                <div class="row">
                    <div class="col">
                        <div class="form-group mb-2">
                            <label for="">ID</label>
                            <input type="text" value="{{ $feedback->id }}" class="form-control" disabled>
                        </div>
                        <div class="form-group mb-2">
                            <label for="">{{ __('locale.Description') }}</label>
                            <textarea class="form-control" name="description">{{ $feedback->description }}</textarea>
                        </div>
                        <div class="form-group mb-2">
                            <label for="">{{ __('locale.Date') }}</label>
                            <input type="text" class="form-control" value="{{ $feedback->created_at }}" disabled>
                        </div>
                        <div class="form-group mb-2">
                            <label for="">{{ __('locale.Solved') }}</label>
                            <br>
                            <div class="form-check form-check-inline">
                              <input
                                class="form-check-input"
                                type="radio"
                                name="solved"
                                id="enabled1"
                                value="1"
                                {{ $feedback->solved ? 'checked' : '' }}
                              />
                              <label class="form-check-label" for="enabled1">Yes</label>
                            </div>
                            <div class="form-check form-check-inline">
                              <input
                                class="form-check-input"
                                type="radio"
                                name="solved"
                                id="enabled2"
                                value="0"
                                {{ $feedback->solved ? '' : 'checked' }}
                              />
                              <label class="form-check-label" for="enabled2">No</label>
                            </div>
                        </div>
                        <div class="form-group mb-2">
                          <div class="d-flex justify-content-between">
                            <a href="#" class="btn btn-danger" onclick="event.preventDefault(); document.getElementById('delete-feedback').submit();">{{ __('locale.Delete') }}</a>
                            <button type="submit" class="btn btn-primary">{{ __('locale.Save') }}</button>
                          </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group mb-2">
                            @foreach($feedback->files as $file)
                                <img src="/storage/{{ $file->path }}" class="img-fluid" />
                            @endforeach
                        </div>
                    </div>
                </div>
            </form>
            <form action="{{ route('feedbacks.destroy', $feedback->id) }}" class="d-none" id="delete-feedback" method="post">
              @csrf
              @method('DELETE')
              <button class="btn btn-primary">{{ __('locale.Delete') }}</button>
            </form>
        </div>
    </div>
  </div>
</div>
@endsection
