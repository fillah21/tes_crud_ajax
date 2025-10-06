$(document).ready(function () {
    console.log("CRUD.js loaded, jQuery ready!");

    $("#modalForm").on("show.bs.modal", function () {
        $.get(
            "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json",
            function (data) {
                $("#provinsi").html(
                    '<option value="">-- Pilih Provinsi --</option>'
                );
                $.each(data, function (i, val) {
                    $("#provinsi").append(
                        '<option value="' +
                            val.name +
                            '" data-id="' +
                            val.id +
                            '">' +
                            val.name +
                            "</option>"
                    );
                });
            }
        );
    });

    // =========================
    // LOAD DATA TABLE
    // =========================
    function loadData() {
        $.get("/people", function (res) {
            let rows = "";
            res.forEach(function (item) {
                rows += `
                  <tr>
                    <td>${item.nama}</td>
                    <td>${item.tgl_lahir ?? "-"}</td>
                    <td>${item.agama ?? "-"}</td>
                    <td>${item.provinsi ?? "-"}</td>
                    <td>${item.kabupaten ?? "-"}</td>
                    <td>${item.desa ?? "-"}</td>
                    <td>${item.hobi ?? "-"}</td>
                    <td>${item.status ?? "-"}</td>
                    <td>${
                        item.image
                            ? `<img src="/storage/${item.image}" width="50">`
                            : "-"
                    }</td>
                    <td>${
                        item.files
                            ? JSON.parse(item.files)
                                  .map(
                                      (f) =>
                                          `<a href="/storage/${f}" target="_blank">File</a>`
                                  )
                                  .join(", ")
                            : "-"
                    }</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary btn-edit me-1" data-id="${
                            item.id
                        }" title="Edit">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${
                            item.id
                        }" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                  </tr>
                `;
            });
            $("#peopleTable tbody").html(rows);
        });
    }
    loadData();

    // Validasi form tambah/edit
    $(document).on("submit", "#formData, #formEdit", function (e) {
        let nama = $(this).find("input[name='nama']").val();
        let image = $(this).find("input[name='image']")[0].files[0];

        // Validasi nama
        if (nama.length > 50) {
            e.preventDefault();
            alert("Nama maksimal 50 karakter!");
            return false;
        }

        // Validasi image
        if (image && image.size > 1 * 1024 * 1024) {
            // 2 MB
            e.preventDefault();
            alert("Ukuran image maksimal 1MB!");
            return false;
        }
    });

    // =========================
    // CREATE DATA
    // =========================
    $("#formData").submit(function (e) {
        e.preventDefault();
        let formData = new FormData(this);

        $.ajax({
            url: "/people",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function () {
                $("#modalForm").modal("hide");
                $("#formData")[0].reset();
                loadData();
                showAlert("Data berhasil ditambahkan!", "success");
            },
            error: function (err) {
                console.log(err.responseJSON);
                showAlert("Gagal menyimpan data!", "danger");
            },
        });
    });

    // =========================
    // LOAD PROVINSI SAAT MODAL TAMBAH
    // =========================
    $("#modalForm").on("show.bs.modal", function () {
        $.get("/api/provinces", function (data) {
            $("#provinsi").html(
                '<option value="">-- Pilih Provinsi --</option>'
            );
            $.each(data, function (i, val) {
                $("#provinsi").append(
                    '<option value="' +
                        val.name +
                        '" data-id="' +
                        val.id +
                        '">' +
                        val.name +
                        "</option>"
                );
            });
        });
    });

    $("#provinsi").on("change", function () {
        let provId = $(this).find(":selected").data("id");
        $("#kabupaten").html('<option value="">-- Pilih Kabupaten --</option>');
        $("#desa").html('<option value="">-- Pilih Desa --</option>');
        if (provId) {
            $.get("/api/regencies/" + provId, function (data) {
                $.each(data, function (i, val) {
                    $("#kabupaten").append(
                        '<option value="' +
                            val.name +
                            '" data-id="' +
                            val.id +
                            '">' +
                            val.name +
                            "</option>"
                    );
                });
            });
        }
    });

    $("#kabupaten").on("change", function () {
        let kabId = $(this).find(":selected").data("id");
        $("#desa").html('<option value="">-- Pilih Desa --</option>');
        if (kabId) {
            $.get("/api/districts/" + kabId, function (data) {
                $.each(data, function (i, val) {
                    $("#desa").append(
                        '<option value="' +
                            val.name +
                            '" data-id="' +
                            val.id +
                            '">' +
                            val.name +
                            "</option>"
                    );
                });
            });
        }
    });

    // =========================
    // EDIT DATA
    // =========================
    $(document).on("click", ".btn-edit", function () {
        let id = $(this).data("id");
        $.get("/people/" + id, function (data) {
            let provName = data.provinsi;
            let kabName = data.kabupaten;
            let desaName = data.desa;

            // isi field biasa dulu
            // isi field biasa dulu
            let hobiArr = data.hobi ? data.hobi.split(",") : [];
            let formHtml = `
            <input type="hidden" name="id" value="${data.id}">
            <div class="row g-3">
                <div class="col-md-6">
                <div class="form-floating">
                    <input type="text" class="form-control" name="nama" id="editNama" value="${
                        data.nama
                    }" placeholder="Nama">
                    <label for="editNama">Nama</label>
                </div>
                </div>
                <div class="col-md-6">
                <div class="form-floating">
                    <input type="date" class="form-control" name="tgl_lahir" id="editTgl" value="${
                        data.tgl_lahir ?? ""
                    }" placeholder="Tanggal Lahir">
                    <label for="editTgl">Tanggal Lahir</label>
                </div>
                </div>
                <div class="col-md-6">
                <div class="form-floating">
                    <select class="form-select" name="agama" id="editAgama">
                    <option ${
                        data.agama == "Islam" ? "selected" : ""
                    }>Islam</option>
                    <option ${
                        data.agama == "Kristen" ? "selected" : ""
                    }>Kristen</option>
                    <option ${
                        data.agama == "Katolik" ? "selected" : ""
                    }>Katolik</option>
                    <option ${
                        data.agama == "Hindu" ? "selected" : ""
                    }>Hindu</option>
                    <option ${
                        data.agama == "Buddha" ? "selected" : ""
                    }>Buddha</option>
                    <option ${
                        data.agama == "Konghucu" ? "selected" : ""
                    }>Konghucu</option>
                    </select>
                    <label for="editAgama">Agama</label>
                </div>
                </div>

                <!-- Floating labels untuk Provinsi, Kabupaten, Desa -->
                <div class="col-md-6">
                <div class="form-floating">
                    <select class="form-select" name="provinsi" id="editProvinsi"></select>
                    <label for="editProvinsi">Provinsi</label>
                </div>
                </div>
                <div class="col-md-6">
                <div class="form-floating">
                    <select class="form-select" name="kabupaten" id="editKabupaten"></select>
                    <label for="editKabupaten">Kabupaten</label>
                </div>
                </div>
                <div class="col-md-6">
                <div class="form-floating">
                    <select class="form-select" name="desa" id="editDesa"></select>
                    <label for="editDesa">Desa</label>
                </div>
                </div>

                <div class="col-md-12">
                <label class="form-label d-block">Hobi</label>
                <div class="form-check form-check-inline">
                    <input type="checkbox" class="form-check-input" name="hobi[]" value="Membaca" ${
                        hobiArr.includes("Membaca") ? "checked" : ""
                    }>
                    <label class="form-check-label">Membaca</label>
                </div>
                <div class="form-check form-check-inline">
                    <input type="checkbox" class="form-check-input" name="hobi[]" value="Olahraga" ${
                        hobiArr.includes("Olahraga") ? "checked" : ""
                    }>
                    <label class="form-check-label">Olahraga</label>
                </div>
                <div class="form-check form-check-inline">
                    <input type="checkbox" class="form-check-input" name="hobi[]" value="Musik" ${
                        hobiArr.includes("Musik") ? "checked" : ""
                    }>
                    <label class="form-check-label">Musik</label>
                </div>
                </div>

                <div class="col-md-12">
                <label class="form-label d-block">Status Pernikahan</label>
                <div class="form-check form-check-inline">
                    <input type="radio" class="form-check-input" name="status" value="Menikah" ${
                        data.status == "Menikah" ? "checked" : ""
                    }>
                    <label class="form-check-label">Menikah</label>
                </div>
                <div class="form-check form-check-inline">
                    <input type="radio" class="form-check-input" name="status" value="Belum Menikah" ${
                        data.status == "Belum Menikah" ? "checked" : ""
                    }>
                    <label class="form-check-label">Belum Menikah</label>
                </div>
                </div>

                <div class="col-md-6">
                <div class="form-floating">
                    <input type="file" class="form-control" name="image" id="editImage" placeholder="Upload Image">
                    <label for="editImage">Upload Image (baru)</label>
                </div>
                ${
                    data.image
                        ? `<img src="/storage/${data.image}" width="80" class="mt-2 rounded shadow-sm">`
                        : ""
                }
                </div>
                <div class="col-md-6">
                <div class="form-floating">
                    <input type="file" class="form-control" name="files[]" id="editFiles" multiple placeholder="Upload Files">
                    <label for="editFiles">Upload Files</label>
                </div>
                </div>
            </div>
            `;

            $("#editBody").html(formHtml);
            $("#modalEdit").modal("show");

            // Load provinsi lalu pilih yang sesuai
            // Load Provinsi
            $.get(
                "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json",
                function (provinsi) {
                    $("#editProvinsi").empty();
                    provinsi.forEach(function (p) {
                        let selected =
                            p.name.toLowerCase() === provName.toLowerCase()
                                ? "selected"
                                : "";
                        $("#editProvinsi").append(
                            `<option value="${p.name}" data-id="${p.id}" ${selected}>${p.name}</option>`
                        );
                    });

                    // Cari ID provinsi dari nama
                    let provId = $("#editProvinsi option:selected").data("id");

                    // Load Kabupaten sesuai provinsi
                    $.get(
                        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provId}.json`,
                        function (kabupaten) {
                            $("#editKabupaten").empty();
                            kabupaten.forEach(function (k) {
                                let selected =
                                    k.name.toLowerCase() ===
                                    kabName.toLowerCase()
                                        ? "selected"
                                        : "";
                                $("#editKabupaten").append(
                                    `<option value="${k.name}" data-id="${k.id}" ${selected}>${k.name}</option>`
                                );
                            });

                            // Cari ID kabupaten dari nama
                            let kabId = $(
                                "#editKabupaten option:selected"
                            ).data("id");

                            // Load Desa sesuai kabupaten
                            $.get(
                                `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${kabId}.json`,
                                function (desa) {
                                    $("#editDesa").empty();
                                    desa.forEach(function (d) {
                                        let selected =
                                            d.name.toLowerCase() ===
                                            desaName.toLowerCase()
                                                ? "selected"
                                                : "";
                                        $("#editDesa").append(
                                            `<option value="${d.name}" data-id="${d.id}" ${selected}>${d.name}</option>`
                                        );
                                    });
                                }
                            );
                        }
                    );
                }
            );

            $("#modalEdit").modal("show");
        });
    });

    // Event kalau user ganti provinsi
    $(document).on("change", "#editProvinsi", function () {
        let provId = $("#editProvinsi option:selected").data("id");
        $("#editKabupaten").empty();
        $("#editDesa").empty();

        $.get(
            `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provId}.json`,
            function (kabupaten) {
                kabupaten.forEach(function (k) {
                    $("#editKabupaten").append(
                        `<option value="${k.name}" data-id="${k.id}">${k.name}</option>`
                    );
                });

                // otomatis load desa kabupaten pertama
                let firstKabId = $("#editKabupaten option:first").data("id");
                loadDesaByKab(firstKabId, "#editDesa");
            }
        );
    });

    // Event kalau user ganti kabupaten
    $(document).on("change", "#editKabupaten", function () {
        let kabId = $("#editKabupaten option:selected").data("id");
        $("#editDesa").empty();
        loadDesaByKab(kabId, "#editDesa");
    });

    // Fungsi bantu load desa
    function loadDesaByKab(kabId, targetSelect) {
        $.get(
            `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${kabId}.json`,
            function (desa) {
                $(targetSelect).empty();
                desa.forEach(function (d) {
                    $(targetSelect).append(
                        `<option value="${d.name}" data-id="${d.id}">${d.name}</option>`
                    );
                });
            }
        );
    }

    // =========================
    // UPDATE DATA
    // =========================
    $("#formEdit").submit(function (e) {
        e.preventDefault();
        let id = $("#formEdit input[name=id]").val();
        let formData = new FormData(this);

        $.ajax({
            url: "/people/" + id,
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function () {
                $("#modalEdit").modal("hide");
                loadData();
                showAlert("Data berhasil diperbarui!", "success");
            },
            error: function () {
                showAlert("Gagal mengupdate data!", "danger");
            },
        });
    });

    // =========================
    // DELETE DATA
    // =========================
    $(document).on("click", ".btn-delete", function () {
        if (!confirm("Yakin hapus data ini?")) return;
        let id = $(this).data("id");
        $.ajax({
            url: "/people/" + id,
            type: "DELETE",
            data: { _token: $('meta[name="csrf-token"]').attr("content") },
            success: function () {
                loadData();
                showAlert("Data berhasil dihapus!", "success");
            },
            error: function () {
                showAlert("Gagal menghapus data!", "danger");
            },
        });
    });

    // ========================
    // SHOW ALERT
    // ========================
    function showAlert(message, type = "success") {
        let alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        $("#alertPlaceholder").html(alertHtml);

        // otomatis hilang setelah 3 detik
        setTimeout(() => {
            $(".alert").alert("close");
        }, 3000);
    }
});
