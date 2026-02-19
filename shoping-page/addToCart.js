window.onload = function () {
  showCartItems();
  cartSummary();
};

function showCartItems() {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  let cartContainer = document.getElementById("cart-container");
  let mainContainer = document.getElementById("add-to-cart-serction");
  cartContainer.innerHTML = ""; // Clear previous content
  if (cartItems.length === 0) {
    mainContainer.innerHTML = `<div class="empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <a href="./shopping_page.html" class="shop-now-btn">Shop Now</a>
    </div>`;
    return;
  }
  cartItems.forEach((item) => {
    cartContainer.innerHTML += `<div class="cart-card">
                <!-- IMAGE -->
                <div class="cart-img">
                    <img src="${item.img}" alt="Product">
                </div>
                <!-- DETAILS -->
                <div class="cart-details">

                <div class="top-row">
                    <div>
                        <h2>${item.tital}</h2>
                        <p class="category">${item.category}</p>
                    </div>
                    <div class="price">Rs.${item.price}</div>
                </div>

                <p class="tax-price">Rs.${item.price}<br><span>INCLUSIVE OF ALL TAXES</span></p>

                <div class="qty-row">
                    <span>Quantity</span>
                    <select class="qty-box" title="quantity" onchange="updateQuantity('${item.id}','${item.category}', this.value)">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                    </select>
                </div>

                <!-- SHIPPING -->
                <div class="shipping-box">
                    <div class="ship-left">
                        <input type="checkbox" placeholder="." onclick="addShipping(this)">
                        <div>
                            <p class="ship-title">Express Shipping</p>
                            <p class="ship-price">Rs.100</p>
                        </div>
                    </div>

                    <div class="divider"></div>

                    <div class="ship-right">
                        <div class="badge"><i class="bi bi-check-lg"></i></div>
                        <p>Express Blue Dart Shipping (24 – 48 hours)</p>
                    </div>
                </div>

                <!-- ACTIONS -->
                <div class="action-buttons">
                    <button type="button" class="save-later-btn">Save for later</button>
                    <button type="button" class="remove-btn" onclick="removeItem('${item.id}','${item.category}')">Remove</button>
                </div>
                </div>
            </div>`;
  });
}

function removeItem(id, category) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartItems = cartItems.filter(
    (item) => item.id !== Number(id) || item.category !== category,
  );
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  alert("Item removed from cart");
  showCartItems();
  cartSummary();
}

function cartSummary() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  let totalPrice = 0;
  cartItems.forEach((item) => {
    // Remove commas before converting
    let cleanPrice = item.price.toString().replace(/,/g, "");
    totalPrice += Number(cleanPrice) * (item.quantity || 1);
  });
  document.getElementById("subtotal").innerText =
    `Rs.${totalPrice.toLocaleString()}`;
  document.getElementById("total").innerText =
    `Rs.${totalPrice.toLocaleString()}`;
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

function addShipping(checkbox) {
  const shippingCost = 100;
  let totalElement = document.getElementById("total");
  let shippingElement = document.getElementById("shipping");
  if (checkbox.checked) {
    shippingElement.innerText = `Rs.${shippingCost}`;
  } else {
    shippingElement.innerText = "Rs.0";
  }
  let currentTotal = Number(totalElement.innerText.replace(/Rs\.|,/g, ""));
  if (checkbox.checked) {
    currentTotal += shippingCost;
  } else {
    currentTotal -= shippingCost;
  }
  totalElement.innerText = `Rs.${currentTotal.toLocaleString()}`;
}
