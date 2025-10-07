@extends('layouts.app')

@section('content')
<div class="container py-4">
  <div class="card crud-card w-100 shadow-lg">
    <div class="card-body">
      <h3 class="fw-bold text-primary mb-4">Profil Saya</h3>

      <form id="profileForm" method="POST" action="{{ route('profile.update') }}">
        @csrf
        @method('PUT')

        <div class="row g-3">
            <div class="col-md-6">
                <div class="form-floating">
                <input type="text" name="name" id="name" class="form-control" placeholder="Nama" value="{{ $user->name }}">
                <label for="name">Nama</label>
                </div>
            </div>

            <div class="col-md-6">
                <div class="form-floating">
                <input type="email" name="email" id="email" class="form-control" placeholder="Email" value="{{ $user->email }}">
                <label for="email">Email</label>
                </div>
            </div>

            <div class="col-md-6">
                <div class="form-floating">
                    <input type="password" name="password" id="password" class="form-control" placeholder="Isi jika ingin mengganti password">
                    <label for="password">Password Baru</label>
                </div>
            </div>

            <div class="col-md-6">
                <div class="form-floating">
                    <input type="password" name="password_confirmation" id="password_confirmation" class="form-control" placeholder="Ulangi password baru">
                    <label for="password_confirmation">Konfirmasi Password</label>
                </div>
            </div>

            <div class="modal-footer">
                <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
            </div>
        </div>
      </form>
    </div>
  </div>
</div>
@endsection
