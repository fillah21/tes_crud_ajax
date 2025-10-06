@extends('layouts.app')
@section('title', 'Dashboard')
@section('content')
  <h2>Selamat Datang, {{ Auth::user()->name }} 🎉</h2>
  <p>Ini adalah halaman utama setelah login.</p>
@endsection
