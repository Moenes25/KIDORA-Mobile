const API = "http://localhost:5000/api";

async function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  const msg = document.getElementById("msg");

  if (!name || !email || !password) {
    msg.textContent = "Please fill all fields.";
    msg.className = "text-red-600";
    return;
  }

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role })
  });

  const data = await res.json();

  if (data._id) {
    msg.textContent = "Account created successfully!";
    msg.className = "text-green-600";
    setTimeout(() => (window.location = "login.html"), 1500);
  } else {
    msg.textContent = data.msg || "Registration failed.";
    msg.className = "text-red-600";
  }
}
