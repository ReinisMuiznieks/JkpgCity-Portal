// Fetches the shared navbar HTML and injects it into the navbar placeholder
// Async allows the function to pause and wait for promises without blocking the rest of the page
async function loadNavbar() {
  // Send a GET request to the navbar HTML file and wait for the response
  const response = await fetch("/components/shared/navbar/navbar.html");

  // Stop early if the request failed
  if (!response.ok) return;

  // Read the response body as a plain HTML string and inject it into the navbar placeholder element
  document.getElementById("navbar").innerHTML = await response.text();
}

async function requireAuth() {
  const res = await fetch("http://localhost:3000/users/me", { credentials: "include" });
  if (!res.ok) {
    window.location.href = "/login";
    return false;
  }
  return true;
}

async function updateAuthNav() {
  const authNav = document.getElementById("auth-nav");
  if (!authNav) return;

  try {
    const res = await fetch("http://localhost:3000/users/me", { credentials: "include" });
    if (!res.ok) return;
  } catch (_) {
    return;
  }

  authNav.innerHTML = `<a id="logout-btn" href="#">Logout</a>`;
  document.getElementById("logout-btn").addEventListener("click", async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3000/users/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/login";
  });
}

// Wait for the DOM to be fully parsed before running any scripts
document.addEventListener("DOMContentLoaded", async () => {
  // Fetch and inject the navbar HTML, wait for it to finish before continuing
  await loadNavbar();
  await updateAuthNav();
});
