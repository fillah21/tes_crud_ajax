@extends('layouts.app')

@section('content')
<div class="container py-4">
  <div class="card crud-card w-100 shadow-lg">
      <div class="card-body">
        <div class="d-flex justify-content-between mb-3">
          <h2 class="fw-bold text-primary">Data Orang</h2>
          <button class="btn btn-primary" id="btnTambah">
            + Tambah Data
          </button>
        </div>
      
        <table class="table table-bordered align-middle" id="peopleTable">
            <thead class="table-primary">
                <tr>
                    <th>Nama</th>
                    <th>Tanggal Lahir</th>
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

<!-- Modal Form Tambah/Edit -->
<div class="modal fade" id="modalForm" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content rounded-3">
          <form id="formPerson" enctype="multipart/form-data">
            @csrf
            <input type="hidden" id="person_id" name="id">

            <div class="modal-header">
              <h5 class="modal-title" id="modalTitle">Tambah Data</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="form-floating">
                    <input type="text" name="nama" id="nama" class="form-control" placeholder="Nama">
                    <label for="nama">Nama</label>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-floating">
                    <input type="date" name="tgl_lahir" id="tgl_lahir" class="form-control">
                    <label for="tgl_lahir">Tanggal Lahir</label>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-floating">
                    <select name="agama" id="agama" class="form-select">
                      <option value="">-- Pilih Agama --</option>
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
                    <select name="provinsi" id="provinsi" class="form-select"></select>
                    <label for="provinsi">Provinsi</label>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-floating">
                    <select name="kabupaten" id="kabupaten" class="form-select"></select>
                    <label for="kabupaten">Kabupaten</label>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-floating">
                    <select name="desa" id="desa" class="form-select"></select>
                    <label for="desa">Desa</label>
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label d-block">Hobi</label>
                  <div class="form-check form-check-inline">
                    <input type="checkbox" class="form-check-input" id="hobi1" name="hobi[]" value="Membaca">
                    <label class="form-check-label" for="hobi1">Membaca</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input type="checkbox" class="form-check-input" id="hobi2" name="hobi[]" value="Olahraga">
                    <label class="form-check-label" for="hobi2">Olahraga</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input type="checkbox" class="form-check-input" id="hobi3" name="hobi[]" value="Musik">
                    <label class="form-check-label" for="hobi3">Musik</label>
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label d-block">Status Pernikahan</label>
                  <div class="form-check form-check-inline">
                    <input type="radio" class="form-check-input" id="status1" name="status" value="Menikah">
                    <label class="form-check-label" for="status1">Menikah</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input type="radio" class="form-check-input" id="status2" name="status" value="Belum Menikah">
                    <label class="form-check-label" for="status2">Belum Menikah</label>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-floating">
                    <input type="file" name="image" id="image" accept="image/*" class="form-control">
                    <label for="image">Upload Image</label>
                  </div>
                  <div id="previewImage" class="mt-2"></div>
                </div>

                <div class="col-md-6">
                  <div class="form-floating">
                    <input type="file" name="files[]" id="files" multiple class="form-control">
                    <label for="files">Upload Files</label>
                  </div>
                  <div id="previewFiles" class="mt-2"></div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
              <button type="submit" class="btn btn-primary" id="btnSubmit">Simpan</button>
            </div>
          </form>
        </div>
    </div>
</div>

<!-- Konfirmasi Hapus Data -->
<div id="confirmToast" class="confirm-overlay">
  <div class="confirm-box">
    <div class="message fw-semibold mb-3">Yakin ingin menghapus data ini?</div>
    <div class="text-end">
      <button class="btn btn-secondary me-2" id="confirmNo">Batal</button>
      <button class="btn btn-danger" id="confirmYes">Hapus</button>
    </div>
  </div>
</div>

@endsection
