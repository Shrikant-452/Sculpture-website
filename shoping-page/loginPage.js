/* SWITCH FORMS */
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const container = document.getElementById("form-wrapper");

loginBtn.addEventListener("click", () => {
  loginBtn.classList.add("active");
  signupBtn.classList.remove("active");
  container.style.height = "300px";
  loginForm.classList.add("active");
  signupForm.classList.remove("active");
});

signupBtn.addEventListener("click", () => {
  signupBtn.classList.add("active");
  loginBtn.classList.remove("active");
  container.style.height = "400px";
  signupForm.classList.add("active");
  loginForm.classList.remove("active");
});

/* SIGNUP */
function signup() {
  let name = document.getElementById("signupName").value;
  let email = document.getElementById("signupEmail").value;
  let password = document.getElementById("signupPassword").value;
  let role = document.getElementById("signupRole").value;
  let phoneNo = document.getElementById("phoneNumber").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let exists = users.find((u) => u.email === email && u.phoneNo === phoneNo);

  if (exists) {
    document.getElementById("signupMsg").innerHTML = "User already exists";
    document.getElementById("signupMsg").className = "message error";
    return;
  }

  users.push({ name, email, password, role, phoneNo });

  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById("signupMsg").innerHTML =
    "Account created successfully";
  document.getElementById("signupMsg").className = "message success";
}

/* LOGIN */
function login() {
  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;
  let role = document.getElementById("loginRole").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let user = users.find(
    (u) => u.email === email && u.password === password && u.role === role,
  );

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));

    document.getElementById("loginMsg").innerHTML = "Login successful";
    document.getElementById("loginMsg").className = "message success";

    setTimeout(() => {
      if (role === "admin") {
        window.location.href = "admin-dashboard.html";
      } else {
        window.location.href = "index.html";
      }
    }, 1000);
  } else {
    document.getElementById("loginMsg").innerHTML = "Invalid credentials";
    document.getElementById("loginMsg").className = "message error";
  }
}
