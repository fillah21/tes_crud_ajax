$(document).ready(function () {
    const modal = new bootstrap.Modal(document.getElementById('modalForm'));
    const form = $("#formPerson");
    const API_BASE = "https://www.emsifa.com/api-wilayah-indonesia/api";

   // Load Provinsi 
    function loadProvinsi(selected = "", callback = null) {
        $.get(`${API_BASE}/provinces.json`, function (res) {
            let options = `<option value="">-- Pilih Provinsi --</option>`;
            res.forEach(p => {
                options += `<option value="${p.name}" data-id="${p.id}" ${p.name === selected ? "selected" : ""}>${p.name}</option>`;
            });
            $("#provinsi").html(options);
            if (callback) callback();
        });
    }

    // Load Kabupaten
    function loadKabupaten(provinsiName = "", selectedKab = "", callback = null) {
        let provId = $("#provinsi option:selected").data("id");
        if (!provId && provinsiName) {
            const opt = $(`#provinsi option[value="${provinsiName}"]`);
            provId = opt.data("id");
        }
        if (!provId) {
            $("#kabupaten").html('<option value="">-- Pilih Kabupaten --</option>');
            $("#desa").html('<option value="">-- Pilih Desa --</option>');
            return;
        }

        $.get(`${API_BASE}/regencies/${provId}.json`, function (res) {
            let options = `<option value="">-- Pilih Kabupaten --</option>`;
            res.forEach(k => {
                options += `<option value="${k.name}" data-id="${k.id}" ${k.name === selectedKab ? "selected" : ""}>${k.name}</option>`;
            });
            $("#kabupaten").html(options);
            if (callback) callback();
        });
    }

    // Load Desa Berdasarkan Kabupaten
    function loadDesa(kabupatenName = "", selectedDesa = "") {
        let kabId = $("#kabupaten option:selected").data("id");
        if (!kabId && kabupatenName) {
            const opt = $(`#kabupaten option[value="${kabupatenName}"]`);
            kabId = opt.data("id");
        }

        if (!kabId) {
            $("#desa").html('<option value="">-- Pilih Desa --</option>');
            return;
        }

        $.get(`${API_BASE}/districts/${kabId}.json`, function (kecamatanList) {
            let desaOptions = `<option value="">-- Pilih Desa --</option>`;
            let totalRequests = kecamatanList.length;
            let completed = 0;

            kecamatanList.forEach(kec => {
                $.get(`${API_BASE}/villages/${kec.id}.json`, function (desaList) {
                    desaList.forEach(d => {
                        desaOptions += `<option value="${d.name}" ${d.name === selectedDesa ? "selected" : ""}>${d.name}</option>`;
                    });
                }).always(() => {
                    completed++;
                    if (completed === totalRequests) {
                        $("#desa").html(desaOptions);
                    }
                });
            });
        });
    }

    // Event Dropdown 
    $("#provinsi").on("change", function () {
        loadKabupaten();
    });
    $("#kabupaten").on("change", function () {
        loadDesa();
    });

    // Load Data Tabel 
    function loadData() {
        $.get("/person", function (res) {
            let html = "";
            res.data.forEach(p => {
                html += `
                <tr>
                    <td>${p.nama}</td>
                    <td>${p.tgl_lahir || "-"}</td>
                    <td>${p.agama || "-"}</td>
                    <td>${p.provinsi || "-"}</td>
                    <td>${p.kabupaten || "-"}</td>
                    <td>${p.desa || "-"}</td>
                    <td>${p.hobi || "-"}</td>
                    <td>${p.status || "-"}</td>
                    <td>${p.image ? `<img src="/storage/${p.image}" width="50">` : "-"}</td>
                    <td>${p.files ? JSON.parse(p.files).map(f => `<a href="/storage/${f}" target="_blank">File</a>`).join(", ") : "-"}</td>
                    <td>
                        <button class="btn btn-warning btn-sm editBtn" data-id="${p.id}">Edit</button>
                        <button class="btn btn-danger btn-sm deleteBtn" data-id="${p.id}">Hapus</button>
                    </td>
                </tr>`;
            });
            $("#peopleTable tbody").html(html);
        });
    }
    loadData();

    // Tambah Data
    $("#btnTambah").on("click", function () {
        form[0].reset();
        $("#person_id").val("");
        $("#modalTitle").text("Tambah Data");
        loadProvinsi();
        $("#kabupaten").html('<option value="">-- Pilih Kabupaten --</option>');
        $("#desa").html('<option value="">-- Pilih Desa --</option>');
        modal.show();
    });

    // Validasi & Submit
    form.on("submit", function (e) {
        e.preventDefault();

        const id = $("#person_id").val();
        const nama = form.find("input[name='nama']").val().trim();
        const image = form.find("input[name='image']")[0]?.files[0];
        const files = form.find("input[name='files[]']")[0]?.files; // multiple file input

        // Validasi nama
        if (!nama) {
            showToast("⚠️ Nama wajib diisi!", "warning");
            return false;
        }
        if (nama.length > 50) {
            showToast("⚠️ Nama maksimal 50 karakter!", "warning");
            return false;
        }

        // Validasi file gambar
        if (image) {
            const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
            if (!validImageTypes.includes(image.type)) {
                showToast("⚠️ Hanya boleh mengunggah gambar (JPG, PNG, GIF)!", "warning");
                return false;
            }
            if (image.size > 1024 * 1024) {
                showToast("⚠️ Ukuran gambar maksimal 1 MB!", "warning");
                return false;
            }
        }

        // Validasi file dokumen
        if (files && files.length > 0) {
            const validDocTypes = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/zip",
                "text/plain",
            ];

            for (const file of files) {
                if (!validDocTypes.includes(file.type)) {
                    showToast(`⚠️ File "${file.name}" tidak diperbolehkan!`, "warning");
                    return false;
                }
                if (file.size > 1024 * 1024) {
                    showToast(`⚠️ Ukuran file "${file.name}" maksimal 1 MB!`, "warning");
                    return false;
                }
            }
        }

        // Kirim ke server
        const formData = new FormData(this);
        const url = id ? `/person/${id}` : "/person";
        if (id) formData.append("_method", "PUT");

        $.ajax({
            url,
            method: "POST", // Laravel otomatis handle PUT dari _method
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                modal.hide();
                loadData();
                showToast("✅ Data berhasil disimpan!", "success");
            },
            error: function (xhr) {
                console.error(xhr.responseText);
                showToast("❌ Terjadi kesalahan pada server!", "danger");
            },
        });
    });

    // Edit Data
    $(document).on("click", ".editBtn", function () {
        const id = $(this).data("id");
        $.get(`/person/${id}/edit`, function (res) {
            const p = res.data;
            $("#modalTitle").text("Edit Data");
            $("#person_id").val(p.id);
            form.find("input[name='nama']").val(p.nama);
            form.find("input[name='tgl_lahir']").val(p.tgl_lahir);
            form.find("select[name='agama']").val(p.agama);

            loadProvinsi(p.provinsi, () => {
                loadKabupaten(p.provinsi, p.kabupaten, () => {
                    loadDesa(p.kabupaten, p.desa);
                });
            });

            form.find("input[name='hobi[]']").prop("checked", false);
            if (p.hobi) {
                p.hobi.split(",").forEach((h) => {
                    form.find(`input[name='hobi[]'][value='${h.trim()}']`).prop("checked", true);
                });
            }

            form.find("input[name='status'][value='" + p.status + "']").prop("checked", true);

            modal.show();
        });
    });

    // Hapus Data
    let deleteId = null;

    $(document).on("click", ".deleteBtn", function () {
        deleteId = $(this).data("id");
        $("#confirmToast").addClass("show");
    });

    $("#confirmYes").on("click", function () {
        if (!deleteId) return;

        $.ajax({
            url: `/person/${deleteId}`,
            method: "POST",
            data: {
                _method: "DELETE",
                _token: $('meta[name="csrf-token"]').attr("content"),
            },
            success: function () {
                loadData();
                showToast("🗑️ Data berhasil dihapus!", "warning");
            },
            error: function () {
                showToast("❌ Gagal menghapus data!", "danger");
            },
            complete: function () {
                $("#confirmToast").removeClass("show");
                deleteId = null;
            },
        });
    });

    $("#confirmNo").on("click", function () {
        $("#confirmToast").removeClass("show");
        deleteId = null;
    });

});
