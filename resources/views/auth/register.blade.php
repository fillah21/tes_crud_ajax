@extends('layouts.app')

@section('content')
<div class="d-flex align-items-center justify-content-center">
  <div class="card auth-card shadow-lg">
    <div class="card-body p-4">
      <h4 class="text-center mb-4 fw-bold">Register</h4>

      @if (session('success'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
          <i class="bi bi-check-circle-fill"></i> {{ session('success') }}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      @endif

      @if (session('error'))
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="bi bi-exclamation-triangle-fill"></i> {{ session('error') }}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        @endif
        
        
      <form method="POST" action="{{ route('register.post') }}">
        @csrf
        <input type="hidden" name="_debug" value="true">

        <!-- Name -->
        <div class="mb-3">
          <div class="input-group">
            <span class="input-group-text bg-transparent border-end-0">
              <i class="bi bi-person"></i>
            </span>
            <input type="text" name="name" value="{{ old('name') }}" class="form-control border-start-0 @error('name') is-invalid @enderror" placeholder="Name" required>
          </div>
        </div>

        <!-- Email -->
        <div class="mb-3 input-group">
          <span class="input-group-text bg-transparent border-end-0">
            <i class="bi bi-envelope"></i>
          </span>
          <input type="email" name="email" class="form-control border-start-0" placeholder="Email" required>
        </div>

        <!-- Password -->
        <div class="mb-3">
          <div class="input-group">
            <span class="input-group-text bg-transparent border-end-0">
              <i class="bi bi-lock"></i>
            </span>
            <input type="password" name="password" id="password" class="form-control border-start-0 @error('password') is-invalid @enderror" placeholder="Password" required>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="mb-3">
          <div class="input-group">
            <span class="input-group-text bg-transparent border-end-0">
              <i class="bi bi-lock-fill"></i>
            </span>
            <input type="password" name="password_confirmation" id="password_confirmation" class="form-control border-start-0" placeholder="Konfirmasi Password" required>
          </div>
        </div>

        <!-- Button -->
        <div class="d-grid">
          <button type="submit" class="btn btn-gradient">Register</button>
        </div>

        <p class="text-center mt-3 text-white-50">
          Already have an account? <a href="{{ route('login') }}" class="text-white fw-bold">Login</a>
        </p>
      </form>
    </div>
  </div>
</div>
@endsection
