document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-menu'); // Match your menu class
    if (toggle && nav) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            nav.classList.toggle('active');
            toggle.classList.toggle('active');
        });
    }
});
