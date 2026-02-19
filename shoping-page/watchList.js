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
    container.innerHTML += `<div class="box1 " data-category="${item.category}" >
                <a href="#"><img src="${item.img}" alt="" height="400" width="300" onclick="displayImagedetail('${item.id}', '${item.category}')"></a>
                <div class="image-overlay">
                    <i class="bi bi-heart" title="Add to Wishlist" onclick="addToWishlist('${item.id}', '${item.category}')"></i>
                    <i class="bi bi-eye" title="View Details" onclick="displayImagedetail('${item.id}', '${item.category}')"></i>
                    <i class="bi bi-cart" title="Add to Cart" onclick="displayImagedetail('${item.id}', '${item.category}')"></i>
                </div>
                <div class="image-detail">
                    <div class="product-textarea-title is-size-6 has-text-weight-medium ellipsis is-ellipsis-2">
                        <a href="/shoping-page/order_Page.html" title="2&quot; Small Standing Lord Vishnu in Blessing Gesture | Copper Statue">${item.tital}</a>
                    </div>
                    <div class="product-textarea-subtitle is-size-7 ellipsis is-ellipsis-1 is-family-secondary is-uppercase">
                        ${item.subtitle}
                    </div>
                    <div>
                        <div class="is-flex is-flex-wrap-wrap is-align-items-center price-section">
                            <div class="product-textarea-price is-size-6-touch is-size-5-desktop has-text-weight-medium mr-1 product-textarea-finalprice price">Rs.${item.price}
                            </div>
                            <div class="product-small-tag success has-text-black has-family-secondary ">Express Shipping</div>
                        </div>
                    </div>
                </div>
            </div>`;
  });
}
