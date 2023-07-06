@extends('layouts/contentLayoutMaster')

@section('title', 'Tracking Projects')

@section('content')
@inject('carbon', 'Carbon\Carbon')
<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Time</th>
                                <th>Account URL</th>
                            </tr>
                        </thead>
                        @foreach($events as $event)
                        <tr>
                            <td>{{ $event->id }}</td>
                            <td>{{ $event->title }}</td>
                            <td>{{ $event->start }}</td>
                            <td>{{ $event->end }}</td>
                            <td>
                                @if( $event->end != '' )
                                {{ $carbon::createFromFormat('Y-m-d H:i:s', $event->start)->diff($carbon::createFromFormat('Y-m-d H:i:s', $event->end))->format('%H:%I:%S') }}
                                @endif
                            </td>
                            <td>{{ $event->account_url }}</td>
                        </tr>
                        @endforeach
                    </table>
                </div>
                <div class="d-flex justify-content-center mt-5">
                    {{ $events->links() }}
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('page-script')
<!-- Page js files -->
@endsection