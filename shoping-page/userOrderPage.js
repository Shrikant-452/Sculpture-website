window.onload = function () {
  showUserOrders();
};

function showUserOrders() {
  let userOrders = JSON.parse(localStorage.getItem("orders")) || [];
  let ordreContainer = document.getElementById("user-order-container");

  ordreContainer.innerHTML = "";
  if (userOrders.length === 0) {
    ordreContainer.innerHTML = `
      <div class="empty-cart">
        <h2>You have no orders yet</h2>
        <p>Start shopping to place your first order.</p>
        <a href="./shopping_page.html" class="shop-now-btn">Shop Now</a>
      </div>`;
    return;
  }

  userOrders.forEach((order) => {
    let itemHtml = "";
    const currentStatus = updateOrderStatus(order);

    // ✅ Loop products inside order
    order.items.forEach((item) => {
      itemHtml += `<div class="order-main">
          <div class="order-left">
            <img src="${item.img}" alt="Sculpture" />
            <div class="order-info">
              <h3>${item.tital}</h3>
              <div class="detail-row">Size: ${item.subtitle}</div>
              <p>Quantity: ${item.quantity ? item.quantity : 1}</p>
              <span class="status ${currentStatus.toLowerCase()}">
                ${currentStatus}
              </span>
              <span class="cancel" onclick="cancelOrder('${order.orderId}')">
                Cancel
              </span>
            </div>
          </div>

          <div class="order-right">
            <div class="total">₹${order.totalAmount}</div>
            <button class="toggle-btn" onclick="toggleDetails(this)">
              View Details
            </button>
          </div>
        </div>
      `;
    });

    ordreContainer.innerHTML += `
      <div class="order-card">

        <div class="order-header">
          <span>Order ID: #${order.orderId}</span>
          <span>${order.date}</span>
        </div>
        ${itemHtml}
        <div class="order-details">
          <div class="detail-row">Shipping : ${capitalizeWords(order.customer.address)} </div>
          <div class="detail-row">Payment : ${order.paymentMethod}</div>
        </div>
      </div>
    `;
  });
}

function toggleDetails(button) {
  const card = button.closest(".order-card");
  const details = card.querySelector(".order-details");

  details.classList.toggle("active");

  // Ternary operator
  button.innerText = details.classList.contains("active")
    ? "Hide Details"
    : "View Details";
}

function capitalizeWords(text) {
  return text.toLowerCase().replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });
}

function updateOrderStatus(order) {
  const now = new Date().getTime();
  const diffMinutes = (now - order.createdAt) / (1000 * 60);

  if (diffMinutes < 60) {
    return "Pending";
  } else if (diffMinutes < 60) {
    return "Processing";
  } else {
    return "Delivered";
  }
}

function cancelOrder(orderId) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  orders = orders.map((order) => {
    if (order.orderId === orderId && order.status !== "Delivered") {
      order.status = "Cancelled";
    }
    return order;
  });

  localStorage.setItem("orders", JSON.stringify(orders));

  showUserOrders(); // refresh UI
}
