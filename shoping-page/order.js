window.onload = function () {
  vieworedredItem();
};

function vieworedredItem() {
  const item = JSON.parse(localStorage.getItem("selectedItem"));
  let oredrPageContainer = document.getElementById("order-page-container");
  oredrPageContainer.innerHTML = `<div class="product-wrapper">
      <div class="gallery">
        <div class="thumb-list">
          <img src="${item.img}" alt="">
          <img src="${item.img}" alt="">
          <img src="${item.img}" alt="">
        </div>

        <div class="preview zoom-hover">
          <img src="${item.img}" alt="Main Product Image">
        </div>
      </div>

      <div class="product-info">
        <h1>${item.tital}</h1>

        <div class="price-box">
          <span class="price">Rs.₹ ${item.price}</span>
          <small>Inclusive of all taxes</small>
        </div>

        <div class="trust-row">
          <span>🔒 Secure</span>
          <span>✔ Verified</span>
          <span>⚡ Fast Support</span>
        </div>

        <div class="shipping-card">
          <input type="checkbox" checked  placeholder="."/>
          <div>
            <strong>Express Shipping</strong>
            <p>24 – 48 hrs · ₹100</p>
          </div>
        </div>

        <div class="action-row">
          <select title="." onchange="updateQuantity('${item.id}','${item.category}', this.value)">
            <option>1</option>
            <option>2</option>
            <option>3</option>
          </select>

          <button class="cta" type="button" onclick="addToCart('${item.id}','${item.category}')">Add to Cart</button>
        </div>

        <details class="specs">
          <summary>Specifications</summary>
          <ul>
            <li>${item.subtitle}</li>
            <li>${item.tital}</li>
          </ul>
        </details>
      </div>
    </div>`;
}

function addToCart(id, category) {
  const data = JSON.parse(localStorage.getItem("ImageData"));
  const selectedItem = data[category].find((el) => el.id === Number(id));
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  if (cartItems.length >= 5) {
    alert("Cart is full! Maximum 5 items allowed.");
    return;
  }
  // 🔥 THIS IS WHAT YOU WERE MISSING
  cartItems.push(selectedItem);

  // Save updated array
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  alert("Item added to cart!");
  window.location.href = "./addToCart.html";
}

function updateQuantity(id, category, quantity) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartItems = cartItems.map((item) => {
    if (item.id === Number(id) && item.category === category) {
      return { ...item, quantity: Number(quantity) };
    }
    return item;
  });
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  cartSummary();
}
