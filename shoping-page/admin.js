let data = {
  products: [],
  users: [
    { name: "Rahul", email: "rahul@gmail.com", phoneNo: "1234567890" },
    { name: "Amit", email: "amit@gmail.com", phoneNo: "1234567890" },
  ],
  orders: [
    {
      id: "ORD001",
      product: "Buddha Statue",
      user: "Rahul",
      status: "Processing",
      price: 4500,
    },
  ],
};

/* NAVIGATION */
function showSection(id) {
  document
    .querySelectorAll(".main > div")
    .forEach((d) => (d.style.display = "none"));

  document.getElementById(id).style.display = "block";
}

/* DASHBOARD */

function loadDashboard() {
  document.getElementById("productCount").innerText = data.products.length;
  document.getElementById("userCount").innerText = data.users.length;
  document.getElementById("orderCount").innerText = data.orders.length;

  let sales = 0;

  data.orders.forEach((o) => (sales += o.price));

  document.getElementById("salesCount").innerText = "₹" + sales;
}

/* PRODUCTS */

function renderProducts(list = data.products) {
  let table = document.getElementById("productTable");

  table.innerHTML = "";

  list.forEach((p, i) => {
    table.innerHTML += `
<tr>
<td><img src="${p.image}" width="40"></td>
<td>${p.name}</td>
<td>₹${p.price}</td>
<td><button class="btn delete" onclick="deleteProduct(${i})">Delete</button></td>
</tr>
`;
  });
}

function addProduct() {
  let name = document.getElementById("pname").value;
  let price = document.getElementById("pprice").value;

  let file = document.getElementById("pimage").files[0];
  if (!file) {
    alert("Please select an image");
    return;
  }

  let img = URL.createObjectURL(file);

  data.products.push({ name, price, image: img });

  renderProducts();
  loadDashboard();
}

/* DELETE */

function deleteProduct(i) {
  data.products.splice(i, 1);

  renderProducts();
  loadDashboard();
}

/* USERS */

function renderUsers() {
  let table = document.getElementById("userTable");

  table.innerHTML = "";

  data.users.forEach((u) => {
    table.innerHTML += `
<tr>
<td>${u.name}</td>
<td>${u.email}</td>
<td>${u.phoneNo}</td>
</tr>
`;
  });
}

/* ORDERS */

function renderOrders() {
  let table = document.getElementById("orderTable");

  table.innerHTML = "";

  data.orders.forEach((o) => {
    table.innerHTML += `
<tr>
<td>${o.id}</td>
<td>${o.product}</td>
<td>${o.user}</td>
<td>${o.status}</td>
</tr>
`;
  });
}

/* SEARCH */

function searchProduct() {
  let key = document.getElementById("search").value.toLowerCase();

  let filtered = data.products.filter((p) =>
    p.name.toLowerCase().includes(key),
  );

  renderProducts(filtered);
}

/* CHART */

new Chart(document.getElementById("salesChart"), {
  type: "bar",
  data: {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [
      {
        label: "Sales",
        data: [12000, 18000, 25000],
        backgroundColor: "#6366f1",
      },
    ],
  },
});

/* DARK MODE */

function toggleDark() {
  document.body.classList.toggle("dark");
}

/* INIT */

renderProducts();
renderUsers();
renderOrders();
loadDashboard();
loadDashboard();
