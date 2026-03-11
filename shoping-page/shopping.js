let filteredImages = [];
let currentPage = 1;
let allImagesData = [];
let itemsPerPage = 9;

/* ---------- RESPONSIVE ITEMS ---------- */

function setItemsPerPage() {
  if (window.innerWidth <= 1024 && window.innerWidth > 768) {
    itemsPerPage = 8;
  } else {
    itemsPerPage = 12;
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
        <input type="checkbox"
        class="checkbox"
        value="${category}"
        onclick="displayImageByCategory()">

        <label>${category} (${count})</label>
      </li>
    `;

    data[category].forEach((item) => {
      item.category = category; // ADD THIS LINE
      allImagesData.push(item);
    });
  });

  filteredImages = [...allImagesData];
  showImages();
  createPagination();
}

/* ---------- SHOW IMAGES ---------- */

function showImages() {
  if (!filteredImages || filteredImages.length === 0) return;
  const container = document.getElementById("image-container");
  container.innerHTML = "";

  let start = (currentPage - 1) * itemsPerPage;
  let end = start + itemsPerPage;

  let pageItems = filteredImages.slice(start, end);

  const fragment = document.createDocumentFragment();

  pageItems.forEach((item) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("data-category", item.category);

    card.innerHTML = `

      <div class="card-image-wrapper ">

        <img
        src="${item.img}"
        loading="lazy"
        class="card-image"
        onclick="displayImagedetail('${item.id}','${item.category}')">
      </div>

      <div class="image-overlay">

        <i class="bi bi-heart"
        onclick="addToWishlist('${item.id}','${item.category}')" title="Add To Wishlist"></i>

        <i class="bi bi-eye"
        onclick="displayImagedetail('${item.id}','${item.category}')" title="View Details"></i>

        <i class="bi bi-cart" onclick="displayImagedetail('${item.id}','${item.category}')" title="Add To Cart"></i>

      </div>

      <div class="card-content">

        <h2 class="sculpture-title">${item.title}</h2>

        <p class="sculpture-artist">${item.subtitle}</p>

        <div class="card-footer">

          <span class="price">₹${item.price}</span>

          <button class="add-btn" onclick="displayImagedetail('${item.id}','${item.category}')">
            🛒 Add to Cart
          </button>

        </div>

      </div>

    `;

    fragment.appendChild(card);
  });

  container.appendChild(fragment);
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

fetch("./data.json")
  .then((res) => res.json())
  .then((data) => {
    // check data
    displayAllCategory(data);
  })
  .catch((err) => console.error(err));

// Cheak a User Loginned or Not

/* ---------- PRODUCT DETAIL ---------- */

function displayImagedetail(id, category) {
  const data = JSON.parse(localStorage.getItem("ImageData"));
  const loggined = JSON.parse(localStorage.getItem("userLogin"));
  if (!loggined) {
    showNotify();
    return;
  }

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

// Homepage Slide Image Logic

let slides = document.querySelectorAll(".slide");
let dots = document.querySelectorAll(".dot");
let current = 0;
let autoSlide;

/* Show Slide */
function showSlide(index) {
  slides.forEach((slide) => slide.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));

  slides[index].classList.add("active");
  dots[index].classList.add("active");
}

/* Next Slide */
function nextSlide() {
  current = (current + 1) % slides.length;
  showSlide(current);
}

/* Previous Slide */
function prevSlide() {
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
}

/* Buttons */
document.getElementById("next").onclick = () => {
  nextSlide();
  resetAutoSlide();
};

document.getElementById("prev").onclick = () => {
  prevSlide();
  resetAutoSlide();
};

/* Dot Navigation */
dots.forEach((dot, index) => {
  dot.onclick = () => {
    current = index;
    showSlide(current);
    resetAutoSlide();
  };
});

/* Auto Slide Start */
function startAutoSlide() {
  autoSlide = setInterval(() => {
    nextSlide();
  }, 3000); // 3 seconds
}

/* Reset Auto Slide when user interacts */
function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

/* Start Auto Slide */
startAutoSlide();
document.getElementById("logo-sign").addEventListener("click", () => {
  console.log("Loggin page");
  window.location.href = "./loginPage.html";
});
