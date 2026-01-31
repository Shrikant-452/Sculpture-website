let slides = document.querySelectorAll(".slide");
let dots = document.querySelectorAll(".dot");
let current = 0;
let viewMoreButton = document.getElementById("view-more-option");

function showSlide(index) {
  slides.forEach((slide) => slide.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));
  slides[index].classList.add("active");
  dots[index].classList.add("active");
}

document.getElementById("next").onclick = () => {
  current = (current + 1) % slides.length;
  showSlide(current);
};

document.getElementById("prev").onclick = () => {
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
};

dots.forEach((dot, index) => {
  dot.onclick = () => {
    current = index;
    showSlide(current);
  };
});

// Auto slide
setInterval(() => {
  current = (current + 1) % slides.length;
  showSlide(current);
}, 2000);

viewMoreButton.addEventListener("click", function () {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => console.log(data));
});
