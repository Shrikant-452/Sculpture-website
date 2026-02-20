window.onload = function () {
  displayWatchListItem();
};

function displayWatchListItem() {
  let watchlistItems = JSON.parse(localStorage.getItem("wishlistItems")) || [];
  let container = document.getElementById("watchlist-container");
  container.innerHTML = ""; // Clear previous content
  if (watchlistItems.length === 0) {
    container.innerHTML = `<div class="watchlist-empty-cart">
        <h2>Your Watchlist is Empty</h2>
        <p>Looks like you haven't added anything to your watchlist yet.</p>
        <a href="./shopping_page.html" class="shop-now-btn">Shop Now</a>
    </div>`;
    return;
  }

  watchlistItems.forEach((item) => {
    container.innerHTML += `<div class="cart-card">
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
                <!-- ACTIONS -->
                <div class="action-buttons">
                    <button type="button" class="remove-btn" onclick="removeItem('${item.id}','${item.category}')">Remove</button>
                </div>
                </div>
            </div>`;
  });
}

function removeItem(id, category) {
  let watchlistItems = JSON.parse(localStorage.getItem("wishlistItems")) || [];
  watchlistItems = watchlistItems.filter(
    (item) => item.id !== Number(id) || item.category !== category,
  );
  localStorage.setItem("wishlistItems", JSON.stringify(watchlistItems));
  alert("Item removed from watchlist");
  displayWatchListItem();
}
