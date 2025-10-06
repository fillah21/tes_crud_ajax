// Navbar background change on scroll
window.addEventListener("scroll", function () {
    let navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("bg-colored", "shadow");
        navbar.classList.remove("bg-transparent");
    } else {
        navbar.classList.remove("bg-colored", "shadow");
        navbar.classList.add("bg-transparent");
    }
});
