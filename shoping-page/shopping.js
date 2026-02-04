// Filter images by category
const displayImageByCategory = () => {
  // 1. Get all checked categories
  const checkedBoxes = document.querySelectorAll(".checkbox:checked");

  const selectedCategories = Array.from(checkedBoxes).map((box) => box.value);

  // 2. Get all images
  const allImages = document.querySelectorAll(".box1");

  // 3. If nothing selected → show all
  if (selectedCategories.length === 0) {
    allImages.forEach((img) => {
      img.style.display = "block";
    });
    return;
  }

  // 4. Show only selected category images
  allImages.forEach((img) => {
    const imgCategory = img.getAttribute("data-category");

    if (selectedCategories.includes(imgCategory)) {
      img.style.display = "block";
    } else {
      img.style.display = "none";
    }
  });
};

//Display Image Category
const displayAllCategory = (data) => {
  let displaycategory = document.getElementById("category-section");
  let imageContainer = document.getElementById("image-container");
  displaycategory.innerHTML = "";
  imageContainer.innerHTML = "";

  Object.keys(data).forEach((category) => {
    let count = data[category].length;
    displaycategory.innerHTML += `
      <li>
        <input type="checkbox" class="checkbox" value="${category}" value="${category}" onclick="displayImageByCategory()">
        <label>${category}  (${count})</label>
      </li>
    `;
    data[category].forEach((item) => {
      imageContainer.innerHTML += `<div class="box1" data-category="${item.category}">
                <img src="${item.img}" alt="" height="400" width="300" >
                <div class="image-detail">
                    <div class="product-textarea-title is-size-6 has-text-weight-medium ellipsis is-ellipsis-2">
                        <a href="/product/sculptures/2-small-standing-lord-vishnu-in-blessing-gesture-copper-statue-ddu718/" title="2&quot; Small Standing Lord Vishnu in Blessing Gesture | Copper Statue">${item.tital}</a>
                    </div>
                    <div class="product-textarea-subtitle is-size-7 ellipsis is-ellipsis-1 is-family-secondary is-uppercase">
                        ${item.subtitle}
                    </div>
                    <div>
                        <div class="is-flex is-flex-wrap-wrap is-align-items-center price-section">
                            <div class="product-textarea-price is-size-6-touch is-size-5-desktop has-text-weight-medium mr-1            product-textarea-finalprice price">Rs.${item.price}
                            </div>
                            <div class="product-small-tag success has-text-black has-family-secondary ">Express Shipping</div>
                        </div>
                    </div>
                </div>
            </div>`;
    });
  });
};
fetch("/data.json")
  .then((response) => response.json())
  .then((data) => displayAllCategory(data))
  .catch((error) => console.error(error));

//Homepage Silide Image logic
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

const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  reveals.forEach((el) => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - 100) {
      el.classList.add("active");
    }
  });
});
