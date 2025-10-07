// Navbar background change on scroll
document.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
    } else {
    navbar.classList.remove("scrolled");
    }
});

setTimeout(() => {
const alert = document.querySelector('.alert');
if (alert) {
    const bsAlert = new bootstrap.Alert(alert);
    bsAlert.close();
}
}, 3000);

// TOAST HELPER
if (!$('#toastContainer').length) {
    $('body').append(`
        <div id="toastContainer" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1100;"></div>
    `);
}

function showToast(message, type = "info") {
    const toastId = "toast" + Date.now();
    const bgClass = {
        info: "text-bg-info",
        success: "text-bg-success",
        warning: "text-bg-warning",
        danger: "text-bg-danger"
    }[type];

    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center ${bgClass} border-0 mb-2 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body fw-semibold">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    $("#toastContainer").append(toastHTML);
    const toastEl = new bootstrap.Toast(document.getElementById(toastId), { delay: 4000 });
    toastEl.show();
}

// VALIDASI REGISTER NAME & PASSWORD
$(document).ready(function () {
    const registerForm = $("form[action*='register']");
    const emailInput = $("input[name='email']");

    if (registerForm.length) {

        // CEK EMAIL SAAT USER BERHENTI NGETIK
        let emailTimer;
        emailInput.on("keyup", function () {
            clearTimeout(emailTimer);
            const email = $(this).val().trim();

            // Hanya cek kalau email tidak kosong dan format valid
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.length > 5 && emailPattern.test(email)) {
                emailTimer = setTimeout(() => {
                    $.ajax({
                        url: "/check-email",
                        method: "POST",
                        data: {
                            email: email,
                            _token: $('meta[name="csrf-token"]').attr("content")
                        },
                        success: function (response) {
                            if (response.exists) {
                                showToast("❌ Email sudah terdaftar, gunakan email lain!", "danger");
                                emailInput.addClass("is-invalid");
                            } else {
                                emailInput.removeClass("is-invalid");
                            }
                        },
                        error: function () {
                            showToast("⚠️ Gagal memeriksa email, coba lagi!", "warning");
                        }
                    });
                }, 500); // tunggu 0.5 detik setelah berhenti ngetik
            }
        });

        // === VALIDASI SEBELUM SUBMIT ===
        registerForm.on("submit", function (e) {
            const name = $("input[name='name']").val().trim();
            const email = emailInput.val().trim();
            const password = $("input[name='password']").val();
            const confirmPassword = $("input[name='password_confirmation']").val();

            // Validasi Nama
            if (name.length < 3) {
                e.preventDefault();
                showToast("⚠️ Nama minimal 3 karakter!", "warning");
                return;
            }

            if (name.length > 50) {
                e.preventDefault();
                showToast("⚠️ Nama maksimal 50 karakter!", "warning");
                return;
            }

            // Validasi Email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                e.preventDefault();
                showToast("⚠️ Format email tidak valid!", "warning");
                return;
            }

            if (emailInput.hasClass("is-invalid")) {
                e.preventDefault();
                showToast("❌ Email sudah digunakan!", "danger");
                return;
            }

            // Validasi Password
            if (password.length < 6) {
                e.preventDefault();
                showToast("⚠️ Password minimal 6 karakter!", "warning");
                return;
            }

            if (password !== confirmPassword) {
                e.preventDefault();
                showToast("❌ Konfirmasi password tidak sama!", "danger");
                return;
            }
            e.target.submit();
        });
    }

    $(document).ready(function () {
        $("#profileForm").on("submit", function (e) {
            e.preventDefault();

            const form = $(this);
            const formData = form.serialize();

            $.ajax({
                url: form.attr("action"),
                method: "POST",
                data: formData,
                success: function (res) {
                    showToast("✅ Profil berhasil diperbarui!", "success");
                },
                error: function (xhr) {
                    if (xhr.status === 422) {
                        const errors = xhr.responseJSON.errors;
                        Object.values(errors).forEach(errArray => {
                            showToast("⚠️ " + errArray[0], "warning");
                        });
                    } else {
                        showToast("❌ Terjadi kesalahan pada server!", "danger");
                    }
                }
            });
        });
    });

});

