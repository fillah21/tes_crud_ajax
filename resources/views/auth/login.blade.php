@extends('layouts.app')

@section('content')
<div class="d-flex align-items-center justify-content-center">
  <div class="card auth-card shadow-lg">
    <div class="card-body p-4">
      <h4 class="text-center mb-4 fw-bold">Login</h4>

      @if (session('success'))
        <script>
          document.addEventListener("DOMContentLoaded", function() {
            showToast("✅ {{ session('success') }}", "success");
          });
        </script>
      @endif

      @if (session('error'))
        <div class="alert alert-danger alert-dismissible fade show mx-auto text-center shadow" role="alert" style="max-width: 400px; border-radius: 10px;">
          <i class="bi bi-exclamation-triangle-fill"></i> {{ session('error') }}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      @endif

      <form method="POST" action="{{ route('login') }}">
        @csrf
        <!-- Email -->
        <div class="mb-3 input-group">
          <span class="input-group-text bg-transparent border-end-0">
            <i class="bi bi-envelope"></i>
          </span>
          <input type="email" name="email"
                class="form-control border-start-0 @error('email') is-invalid @enderror"
                value="{{ old('email') }}" placeholder="Email" required>
        </div>

        <!-- Password -->
        <div class="mb-3 input-group">
          <span class="input-group-text bg-transparent border-end-0">
            <i class="bi bi-lock"></i>
          </span>
          <input type="password" name="password"
                class="form-control border-start-0 @error('password') is-invalid @enderror"
                placeholder="Password" required>
        </div>
        @error('password')
          <div class="text-danger small mb-2">{{ $message }}</div>
        @enderror

        <!-- Button -->
        <div class="d-grid">
          <button type="submit" class="btn btn-gradient">Login</button>
        </div>

        <p class="text-center mt-3 text-white-50">
          Don't have an account? <a href="{{ route('register') }}" class="text-white fw-bold">Register</a>
        </p>
      </form>
    </div>
  </div>
</div>
@endsection
