const api = "http://localhost:5000/api";

// Register
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${api}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  alert(data.message || data.error);
  if (data.message) window.location = "login.html";
});

// Login
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${api}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.name);
    window.location = "dashboard.html";
  } else {
    alert(data.error);
  }
});

// Dashboard
if (window.location.pathname.endsWith("dashboard.html")) {
  document.getElementById("welcome").innerText = "Welcome " + localStorage.getItem("name");
  fetch(`${api}/courses`).then(res => res.json()).then(courses => {
    const list = document.getElementById("courseList");
    courses.forEach(c => {
      const li = document.createElement("li");
      li.innerText = `${c.title} - ${c.description}`;
      list.appendChild(li);
    });
  });
}
