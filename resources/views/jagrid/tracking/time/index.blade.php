@extends('layouts/contentLayoutMaster')

@section('title', 'Tracking Time')

@section('content')
<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Path</th>
                                <th>HH:mm:ss</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        @foreach($trackingTime as $time)
                        <tr>
                            <td>{{ $time->id }}</td>
                            <td>{{ $time->path }}</td>
                            <td>
                                <?php echo gmdate("H:i:s", $time->seconds); ?>
                            </td>
                            <td>
                                {{ date('Y-m-d', strtotime($time->created_at)) }}
                            </td>
                        </tr>
                        @endforeach
                    </table>
                </div>
                <div class="d-flex justify-content-center mt-5">
                    {{ $trackingTime->links() }}
                </div>
            </div>
        </div>
    </div>
</div>
@endsection