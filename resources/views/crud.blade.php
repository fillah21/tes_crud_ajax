@extends('layouts.app')
@section('title', 'CRUD AJAX')
@section('content')

<div class="container py-4">

  <!-- Card Wrapper -->
  <div class="crud-wrapper">
    <div class="card crud-card w-100 shadow-lg">
      <div class="card-body">
        <div class="d-flex justify-content-between mb-3">
          <h2 class="fw-bold text-primary">Data Orang</h2>
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalForm">
            + Tambah Data
          </button>
        </div>
  
        <table class="table table-hover table-bordered" id="peopleTable">
          <thead class="table-primary">
            <tr>
              <th>Nama</th>
              <th>Tgl Lahir</th>
              <th>Agama</th>
              <th>Provinsi</th>
              <th>Kabupaten</th>
              <th>Desa</th>
              <th>Hobi</th>
              <th>Status</th>
              <th>Image</th>
              <th>Files</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- End Card -->

</div>

<!-- Modal Tambah Data -->
<div class="modal fade" id="modalForm" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content bg-light shadow-lg rounded-3">
      <form id="formData" enctype="multipart/form-data">
        @csrf
        <div class="modal-header">
          <h5 class="modal-title fw-bold"><i class="bi bi-person-plus me-2"></i>Tambah Data</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="form-floating">
                <input type="text" class="form-control" name="nama" id="nama" placeholder="Nama" maxlength="50" required>
                <label for="nama">Nama</label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-floating">
                <input type="date" class="form-control" name="tgl_lahir" id="tgl_lahir" placeholder="Tanggal Lahir">
                <label for="tgl_lahir">Tanggal Lahir</label>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-floating">
                <select class="form-select" name="agama" id="agama">
                  <option value="">Pilih Agama</option>
                  <option>Islam</option>
                  <option>Kristen</option>
                  <option>Katolik</option>
                  <option>Hindu</option>
                  <option>Buddha</option>
                  <option>Konghucu</option>
                </select>
                <label for="agama">Agama</label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-floating">
                <select class="form-select" name="provinsi" id="provinsi"></select>
                <label for="provinsi">Provinsi</label>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-floating">
                <select class="form-select" name="kabupaten" id="kabupaten"></select>
                <label for="kabupaten">Kabupaten</label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-floating">
                <select class="form-select" name="desa" id="desa"></select>
                <label for="desa">Desa</label>
              </div>
            </div>

            <!-- Checkbox -->
            <div class="col-md-6">
              <label class="form-label">Hobi</label><br>
              <div class="form-check form-check-inline">
                <input type="checkbox" name="hobi[]" value="Membaca" class="form-check-input" id="hobi1">
                <label class="form-check-label" for="hobi1">Membaca</label>
              </div>
              <div class="form-check form-check-inline">
                <input type="checkbox" name="hobi[]" value="Olahraga" class="form-check-input" id="hobi2">
                <label class="form-check-label" for="hobi2">Olahraga</label>
              </div>
              <div class="form-check form-check-inline">
                <input type="checkbox" name="hobi[]" value="Musik" class="form-check-input" id="hobi3">
                <label class="form-check-label" for="hobi3">Musik</label>
              </div>
            </div>

            <!-- Radio -->
            <div class="col-md-6">
              <label class="form-label">Status Pernikahan</label><br>
              <div class="form-check form-check-inline">
                <input type="radio" name="status" value="Menikah" class="form-check-input" id="status1">
                <label class="form-check-label" for="status1">Menikah</label>
              </div>
              <div class="form-check form-check-inline">
                <input type="radio" name="status" value="Belum Menikah" class="form-check-input" id="status2">
                <label class="form-check-label" for="status2">Belum Menikah</label>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-floating">
                <input type="file" class="form-control" name="image" id="image" placeholder="Upload Image" accept="image/*">
                <label for="image">Upload Image</label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-floating">
                <input type="file" class="form-control" name="files[]" id="files" placeholder="Upload Files" multiple>
                <label for="files">Upload Files</label>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="submit" class="btn btn-primary"><i class="bi bi-save me-1"></i> Simpan</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
        </div>
      </form>
    </div>
  </div>
</div>

<!-- Modal Edit Data -->
<div class="modal fade" id="modalEdit" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content bg-light shadow-lg rounded-3">
      <form id="formEdit" enctype="multipart/form-data">
        @csrf
        <div class="modal-header">
          <h5 class="modal-title fw-bold"><i class="bi bi-pencil-square me-2"></i>Edit Data</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
          <div class="row g-3" id="editBody">
            <!-- form edit diisi lewat JS, contoh struktur field: -->
          </div>
        </div>

        <div class="modal-footer">
          <button type="submit" class="btn btn-primary"><i class="bi bi-arrow-repeat me-1"></i> Update</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
        </div>
      </form>
    </div>
  </div>
</div>


<script src="{{ asset('js/crud.js') }}"></script>
@endsection
