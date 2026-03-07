window.onload = function () {
  ShowOrderDetail();
};

const payment = document.getElementById("paymentMethod");
const extraFields = document.getElementById("extraFields");
const form = document.getElementById("checkoutForm");
let now = new Date();

// ---------------- PAYMENT FIELD LOGIC ----------------

payment.addEventListener("change", function () {
  extraFields.innerHTML = "";
  extraFields.style.display = "none";

  if (this.value === "UPI") {
    extraFields.innerHTML = `
      <div class="form-group">
        <input type="text" placeholder="Enter UPI ID" required>
      </div>
    `;
    extraFields.style.display = "block";
  }

  if (this.value === "Credit") {
    extraFields.innerHTML = `
      <div class="form-group">
        <input type="text" placeholder="Card Number" maxlength="16" required>
      </div>
      <div class="form-group">
        <input type="text" placeholder="Card Holder Name" required>
      </div>
      <div class="form-group">
        <input type="month" required>
      </div>
      <div class="form-group">
        <input type="password" placeholder="CVV" maxlength="3" required>
      </div>
    `;
    extraFields.style.display = "block";
  }
});

// ---------------- STORE BOOKING DATA ----------------

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const selectedItems = JSON.parse(localStorage.getItem("selectedItems")) || [];

  if (selectedItems.length === 0) {
    alert("No items selected");
    return;
  }

  const orderId = "SC" + Math.floor(Math.random() * 1000000);

  // Get form values safely
  const name = document.querySelector('input[placeholder="Full Name"]').value;
  const email = document.querySelector('input[type="email"]').value;
  const phone = document.querySelector('input[type="tel"]').value;
  const address = document.querySelector(
    'input[placeholder="Shipping Address"]',
  ).value;
  const paymentMethod = payment.value;

  // Calculate total
  let totalAmount = 0;

  selectedItems.forEach((item) => {
    let cleanPrice = item.price.toString().replace(/,/g, "");
    totalAmount += Number(cleanPrice) * (item.quantity || 1);
  });

  const formattedDateTime = now.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Create order object
  const orderData = {
    orderId: orderId,
    date: formattedDateTime,
    createdAt: new Date().getTime(),
    status: "Pending",
    customer: {
      name,
      email,
      phone,
      address,
    },
    items: selectedItems,
    totalAmount,
    paymentMethod,
  };

  // Get existing orders
  let allOrders = JSON.parse(localStorage.getItem("orders")) || [];

  // Add new order
  allOrders.push(orderData);

  // Save back to localStorage
  localStorage.setItem("orders", JSON.stringify(allOrders));

  // Clear checkout items
  localStorage.removeItem("selectedItems");

  // Show confirmation popup
  document.getElementById("orderNumber").innerText = orderId;
  document.getElementById("confirmationPopup").classList.add("active");
});

// ---------------- CONTINUE SHOPPING ----------------

function continueShopping() {
  window.location.href = "./statues.html";
}

// ---------------- SHOW ORDER TOTAL ----------------

function ShowOrderDetail() {
  let selectedItems = JSON.parse(localStorage.getItem("selectedItems")) || [];
  let totalPrice = 0;

  selectedItems.forEach((item) => {
    let cleanPrice = item.price.toString().replace(/,/g, "");
    totalPrice += Number(cleanPrice) * (item.quantity || 1);
  });

  document.getElementById("grandTotal").innerText =
    `Rs.${totalPrice.toLocaleString()}`;
}
