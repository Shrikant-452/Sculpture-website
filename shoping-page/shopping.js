let filteredImages = [];
let currentPage = 1;
let allImagesData = [];
let currentIndex = 0;
let itemsPerPage = 9;

/* ---------- RESPONSIVE ITEMS ---------- */

function setItemsPerPage() {
  if (window.innerWidth <= 1024 && window.innerWidth > 768) {
    itemsPerPage = 8; // tablet
  } else {
    itemsPerPage = 9; // desktop
  }
}

setItemsPerPage();

window.addEventListener("resize", () => {
  setItemsPerPage();
  currentPage = 1;

  showImages();
  createPagination();
});

/* ---------- CATEGORY FILTER ---------- */

function displayImageByCategory() {
  const checkedBoxes = document.querySelectorAll(".checkbox:checked");
  const selectedCategories = Array.from(checkedBoxes).map((box) => box.value);

  if (selectedCategories.length === 0) {
    filteredImages = [...allImagesData];
  } else {
    filteredImages = allImagesData.filter((item) =>
      selectedCategories.includes(item.category),
    );
  }

  currentPage = 1;

  showImages();
  createPagination();
}

/* ---------- DISPLAY CATEGORY ---------- */

function displayAllCategory(data) {
  localStorage.setItem("ImageData", JSON.stringify(data));

  let displaycategory = document.getElementById("category-section");
  displaycategory.innerHTML = "";

  allImagesData = [];

  Object.keys(data).forEach((category) => {
    let count = data[category].length;

    displaycategory.innerHTML += `
      <li>
        <input type="checkbox" class="checkbox"
        value="${category}" onclick="displayImageByCategory()">

        <label>${category} (${count})</label>
      </li>
    `;

    data[category].forEach((item) => {
      allImagesData.push(item);
    });
  });

  filteredImages = [...allImagesData];

  showImages();
  createPagination();
}

/* ---------- SHOW IMAGES ---------- */

function showImages() {
  let imageContainer = document.getElementById("image-container");
  imageContainer.innerHTML = "";

  const nextItems = allImagesData.slice(
    currentIndex,
    currentIndex + itemsPerPage,
  );

  const fragment = document.createDocumentFragment();

  nextItems.forEach((item) => {
    imageContainer.innerHTML += `

      <div class="product-card">
        <div class="card-image-wrapper">
            <img src="${item.img}" alt="Abstract Bronze Sculpture" class="card-image">
            <span class="badge">New Arrival</span>
        </div>

        <div class="card-content">
            <h2 class="sculpture-title">Abstract Bronze Sentinel</h2>
            <p class="sculpture-artist">Handcrafted Original</p>
            
            <p class="sculpture-desc">
                A unique, hand-poured bronze piece exploring modern geometric forms and ancient textures.
            </p>

            <div class="card-footer">
                <span class="price">₹12,500</span>
                <button class="add-btn">
                    <span class="btn-icon">🛒</span> Add to Cart
                </button>
            </div>
        </div>
    </div>

    `;
  });
}

/* ---------- PAGINATION ---------- */

function createPagination() {
  let pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  let totalPages = Math.ceil(filteredImages.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <button class="${i === currentPage ? "active-page" : ""}"
      onclick="changePage(${i})">
        ${i}
      </button>
    `;
  }
}

function changePage(page) {
  currentPage = page;

  showImages();
  createPagination();
}

/* ---------- FETCH DATA ---------- */

fetch("../data.json")
  .then((res) => res.json())
  .then((data) => displayAllCategory(data))
  .catch((err) => console.error(err));

/* ---------- PRODUCT DETAIL ---------- */

function displayImagedetail(id, category) {
  const data = JSON.parse(localStorage.getItem("ImageData"));
  const selectedItem = data[category].find((el) => el.id === Number(id));

  localStorage.setItem("selectedItem", JSON.stringify(selectedItem));

  window.location.href = "./order_Page.html";
}

/* ---------- WISHLIST ---------- */

function addToWishlist(id, category) {
  let data = JSON.parse(localStorage.getItem("ImageData"));
  let selectedItem = data[category].find((el) => el.id === Number(id));

  let wishlistItems = JSON.parse(localStorage.getItem("wishlistItems")) || [];

  if (wishlistItems.some((item) => item.id === selectedItem.id)) {
    alert("Item already in wishlist");
    return;
  }

  wishlistItems.push(selectedItem);

  localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
}
