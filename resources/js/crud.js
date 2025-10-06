console.log("CSRF:", $('meta[name="csrf-token"]').attr("content"));
$(document).ready(function () {
    // ======================
    // SETUP CSRF
    // ======================
    // CSRF setup
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    // ======================
    // LOAD DATA
    // ======================
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
                    <button class="btn btn-sm btn-warning btn-edit" data-id="${
                        item.id
                    }">Edit</button>
                    <button class="btn btn-sm btn-danger btn-delete" data-id="${
                        item.id
                    }">Delete</button>
                  </td>
                </tr>
              `;
            });
            $("#peopleTable tbody").html(rows);
        });
    }

    loadData();

    // ======================
    // CREATE (FORM)
    // ======================
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
            },
            error: function (err) {
                console.log(err.responseJSON);
                alert("Gagal simpan data!");
            },
        });
    });

    // ======================
    // LOAD PROVINSI
    // ======================
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

    $("#provinsi").on("change", function () {
        let provId = $(this).find(":selected").data("id");
        $("#kabupaten").html('<option value="">-- Pilih Kabupaten --</option>');
        $("#desa").html('<option value="">-- Pilih Desa --</option>');
        if (provId) {
            $.get(
                "https://www.emsifa.com/api-wilayah-indonesia/api/regencies/" +
                    provId +
                    ".json",
                function (data) {
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
                }
            );
        }
    });

    $("#kabupaten").on("change", function () {
        let kabId = $(this).find(":selected").data("id");
        $("#desa").html('<option value="">-- Pilih Desa --</option>');
        if (kabId) {
            $.get(
                "https://www.emsifa.com/api-wilayah-indonesia/api/districts/" +
                    kabId +
                    ".json",
                function (data) {
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
                }
            );
        }
    });

    // ======================
    // EDIT
    // ======================
    $(document).on("click", ".btn-edit", function () {
        let id = $(this).data("id");
        $.get("/people/" + id, function (data) {
            let provName = data.provinsi;
            let kabName = data.kabupaten;
            let desaName = data.desa;

            let hobiArr = data.hobi ? data.hobi.split(",") : [];
            let formHtml = `
            <input type="hidden" name="id" value="${data.id}">
            <div class="mb-3">
              <label>Nama</label>
              <input type="text" class="form-control" name="nama" value="${
                  data.nama
              }">
            </div>
            <div class="mb-3">
              <label>Tanggal Lahir</label>
              <input type="date" class="form-control" name="tgl_lahir" value="${
                  data.tgl_lahir ?? ""
              }">
            </div>
            <div class="mb-3">
              <label>Agama</label>
              <select class="form-control" name="agama">
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
            </div>

            <div class="mb-3">
              <label>Provinsi</label>
              <select class="form-control" name="provinsi" id="editProvinsi"></select>
            </div>
            <div class="mb-3">
              <label>Kabupaten</label>
              <select class="form-control" name="kabupaten" id="editKabupaten"></select>
            </div>
            <div class="mb-3">
              <label>Desa</label>
              <select class="form-control" name="desa" id="editDesa"></select>
            </div>

            <div class="mb-3">
              <label>Hobi</label><br>
              <input type="checkbox" name="hobi[]" value="Membaca" ${
                  hobiArr.includes("Membaca") ? "checked" : ""
              }> Membaca
              <input type="checkbox" name="hobi[]" value="Olahraga" ${
                  hobiArr.includes("Olahraga") ? "checked" : ""
              }> Olahraga
              <input type="checkbox" name="hobi[]" value="Musik" ${
                  hobiArr.includes("Musik") ? "checked" : ""
              }> Musik
            </div>
            <div class="mb-3">
              <label>Status Pernikahan</label><br>
              <input type="radio" name="status" value="Menikah" ${
                  data.status == "Menikah" ? "checked" : ""
              }> Menikah
              <input type="radio" name="status" value="Belum Menikah" ${
                  data.status == "Belum Menikah" ? "checked" : ""
              }> Belum Menikah
            </div>
            <div class="mb-3">
              <label>Upload Image (baru)</label>
              <input type="file" class="form-control" name="image">
              ${
                  data.image
                      ? `<img src="/storage/${data.image}" width="80">`
                      : ""
              }
            </div>
            <div class="mb-3">
              <label>Upload Files (tambahan)</label>
              <input type="file" class="form-control" name="files[]" multiple>
            </div>
          `;
            $("#editBody").html(formHtml);

            // Load Provinsi, Kab, Desa
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

                    let provId = $("#editProvinsi option:selected").data("id");

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

                            let kabId = $(
                                "#editKabupaten option:selected"
                            ).data("id");

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

    // Update
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
            },
        });
    });

    // DELETE
    $(document).on("click", ".btn-delete", function () {
        if (!confirm("Yakin hapus data ini?")) return;
        let id = $(this).data("id");
        $.ajax({
            url: "/people/" + id,
            type: "DELETE",
            success: function () {
                loadData();
            },
        });
    });

    // helper desa
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

    // event change prov & kab di modal edit
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

                let firstKabId = $("#editKabupaten option:first").data("id");
                loadDesaByKab(firstKabId, "#editDesa");
            }
        );
    });

    $(document).on("change", "#editKabupaten", function () {
        let kabId = $("#editKabupaten option:selected").data("id");
        $("#editDesa").empty();
        loadDesaByKab(kabId, "#editDesa");
    });
});
