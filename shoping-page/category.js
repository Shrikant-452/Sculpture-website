let visibleCategories = 6;
let allCategories = [];

window.addEventListener("resize", () => {
  setInitialCategories();
  displayCategoryContainer();
});

// check screen size
function setInitialCategories() {
  if (window.innerWidth >= 1024) {
    visibleCategories = 12; // laptop / desktop
  } else {
    visibleCategories = 6; // mobile / tablet
  }
}

const displayCategoryContainer = () => {
  let imageSection = document.getElementById("category-box");
  imageSection.innerHTML = "";

  let visibleItems = allCategories.slice(0, visibleCategories);

  visibleItems.forEach((element) => {
    imageSection.innerHTML += `
      <div class="column has-text-centered is-4-touch is-2-desktop">

        <div class="px-2 box category-box-img">
          <a href="../shoping-page/statues.html" title="${element.title}">
            <img src="${element.img}" alt="${element.title}" width="155" height="155">
          </a>
        </div>

        <div class="title is-size-7 is-size-6-desktop is-family-secondary is-uppercase pt-3">
          <a href="/statues.html">${element.title}</a>
        </div>

      </div>
    `;
  });
};

document.getElementById("view-more-option").addEventListener("click", () => {
  visibleCategories += 6;

  displayCategoryContainer();
});

function displayCategory() {
  fetch("../category.json")
    .then((res) => res.json())
    .then((data) => {
      allCategories = Object.values(data);
      setInitialCategories(); // detect device
      displayCategoryContainer();
    });
}

displayCategory();
