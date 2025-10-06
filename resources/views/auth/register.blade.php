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


      <form method="POST" action="{{ route('register') }}">
        @csrf
        <!-- Name -->
        <div class="mb-3 input-group">
          <span class="input-group-text bg-transparent border-end-0">
            <i class="bi bi-person"></i>
          </span>
          <input type="text" name="name" class="form-control border-start-0" placeholder="Name" required>
        </div>

        <!-- Email -->
        <div class="mb-3 input-group">
          <span class="input-group-text bg-transparent border-end-0">
            <i class="bi bi-envelope"></i>
          </span>
          <input type="email" name="email" class="form-control border-start-0" placeholder="Email" required>
        </div>

        <!-- Password -->
        <div class="mb-3 input-group">
          <span class="input-group-text bg-transparent border-end-0">
            <i class="bi bi-lock"></i>
          </span>
          <input type="password" name="password" class="form-control border-start-0" placeholder="Password" required>
        </div>

        <!-- Confirm Password -->
        <div class="mb-3 input-group">
          <span class="input-group-text bg-transparent border-end-0">
            <i class="bi bi-lock-fill"></i>
          </span>
          <input type="password" name="password_confirmation" class="form-control border-start-0" placeholder="Confirm Password" required>
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
