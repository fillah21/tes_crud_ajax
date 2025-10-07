@extends('layouts.app')
@section('title', 'Dashboard')
@section('content')

@if (session('success'))
  <div class="alert alert-success alert-dismissible fade show mx-auto text-center shadow" role="alert" style="max-width: 400px; border-radius: 10px;">
    <i class="bi bi-check-circle-fill"></i> {{ session('success') }}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
@endif

  <h2>Selamat Datang, {{ Auth::user()->name }} 🎉</h2>
  <p>Ini adalah halaman utama setelah login.</p>
@endsection
