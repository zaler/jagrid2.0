@extends('layouts/contentLayoutMaster')

@section('title', 'Feedbacks')

@section('content')
<div class="row">
  <div class="col-12">
    <div class="card">
        <div class="card-body">
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
                    {{ session('statusDanger') }}
                    </div>
                </div>
            @endif
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead class="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Solucionado</th>
                            <th>Descripción</th>
                            <th>Imagenes</th>
                            <th>Fecha</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    @foreach($feedbacks as $feedback)
                        <tr>
                            <td>{{ $feedback->id }}</td>
                            <td>
                                @if($feedback->solved)
                                    <span class="badge bg-success">True</span>
                                @else
                                    <span class="badge bg-danger">False</span>
                                @endif
                            </td>
                            <td>{{ $feedback->description }}</td>                        
                            <td>
                                @foreach($feedback->files as $file)
                                    <img src="/storage/{{ $file->path }}" class="img-fluid" />
                                @endforeach
                            </td>
                            <td>{{ $feedback->created_at }}</td>
                            <td>
                                <a href="{{ route('feedbacks.edit', $feedback->id) }}">{{ __('locale.Edit') }}</a>
                            </td>
                        </tr>
                    @endforeach
                </table>
            </div>
            <div class="d-flex justify-content-center mt-5">
                {{ $feedbacks->links() }}
            </div>
        </div>
    </div>
  </div>
</div>
@endsection
