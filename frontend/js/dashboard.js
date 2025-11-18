const API = "http://localhost:5000/api";
const token = localStorage.getItem("token");

async function loadChild() {
  const res = await fetch(`${API}/children`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  document.getElementById("child").innerHTML =
    `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

loadChild();
