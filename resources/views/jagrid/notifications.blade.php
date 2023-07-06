@extends('layouts/contentLayoutMaster')

@section('title', __('locale.Notifications'))

@section('content')
<div class="row">
  <div class="col-12">
    <div class="card">
        <div class="card-body mt-1">
          <div class="row">
            <div class="col-sm-12 col-md-8 col-lg-6">
              @foreach($notifications as $notification)
                <a href="/calendar/{{ $notification->account_url }}/{{ $notification->event_url }}/?notify={{ $notification->id }}&comment={{ $notification->comment_id }}" style="color: inherit">
                  <div class="d-flex justify-content-between align-items-center border shadow p-1 mb-2">
                    <div class="d-flex flex-row">
                        <div class="me-75">
                          @if(!is_null($notification->profile_photo_path))
                            <img src="{{ $notification->profile_photo_path }}" class="round" width="42" height="42" alt="">
                          @else
                            <img src="https://ui-avatars.com/api/?name={{ $notification->from_user_name }}&color=7F9CF5&background=EBF4FF" class="round" width="42" height="42" alt="">
                          @endif
                        </div>
                        <div class="my-auto">
                          @if(app()->getLocale() == 'es')
                            <p class="mb-0"><b>{{ $notification->from_user_name }}</b> te ha mencionado en un comentario en el evento de <b>{{ $notification->account_name }}</b></p>
                          @endif
                          @if(app()->getLocale() == 'en')
                            <p class="mb-0"><b>{{ $notification->from_user_name }}</b> has mentioned you in a comment on the <b>{{ $notification->account_name }}</b> event</p>
                          @endif
                          <small>{{ date_format(date_create($notification->created_at), 'g:ia l jS F Y') }}</small>
                        </div>
                    </div>
                  </div>
                </a>
              @endforeach
              {{ $notifications->links() }}
            </div>
          </div>
        </div>
    </div>
  </div>
</div>
@endsection
