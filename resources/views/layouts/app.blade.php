<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">

  <title>{{ config('app.name', 'Laravel App') }}</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">

  {{-- Custom CSS --}}
  <link href="{{ asset('css/app.css') }}" rel="stylesheet">
  @stack('styles')
</head>
<body>

  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-transparent fixed-top">
    <div class="container">
      <a class="navbar-brand fw-bold" href="#">LOGO</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
              data-bs-target="#navbarNav" aria-controls="navbarNav" 
              aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-lg-center">

          @auth
          <li class="nav-item"><span class="btn-outline-dark me-4 fw-bold">Halo, {{ Auth::user()->name }}</span></li>
          <li class="nav-item"><a class="btn btn-outline-dark me-2" href="{{ url('/dashboard') }}">Dashboard</a></li>
          <li class="nav-item"><a class="btn btn-outline-dark me-2" href="{{ url('/crud') }}">CRUD</a></li>
          <li class="nav-item"><a class="btn btn-outline-danger" href="{{ route('logout') }}">Logout</a></li>
        @else
          <li class="nav-item"><a class="btn btn-outline-dark me-2" href="{{ url('/login') }}">Login</a></li>
          <li class="nav-item"><a class="btn btn-light" href="{{ url('/register') }}">Register</a></li>
        @endauth
        </ul>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <header class="hero d-flex align-items-center text-white">
    <div class="container text-center">
      <!-- Content -->
      <main class="container py-5">
        @yield('content')
      </main>      
    </div>
  </header>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

  {{-- Custom JS --}}
  <script src="{{ asset('js/app.js') }}"></script>
  <script src="{{ asset('js/crud.js') }}"></script>
  @stack('scripts')
</body>
</html>
