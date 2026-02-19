window.onload = function () {
  if (!localStorage.getItem("cartItems")) {
    localStorage.setItem("cartItems", JSON.stringify([]));
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-menu"); // Match your menu class
  if (toggle && nav) {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      nav.classList.toggle("active");
      toggle.classList.toggle("active");
    });
  }
});

function displayNoOfCart(data) {
  const cartCount = document.querySelector(".cart-count");
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartCount.textContent = cartItems.length;
}
