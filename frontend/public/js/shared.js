// Loads favicons and adds the navbar to all pages.
// These scripts are included in the <head> of all HTML files.
// Purpose - avoid duplicating the same code in every HTML file and to ensure consistency
function loadFavicons() {
  document.head.insertAdjacentHTML(
    "beforeend",
    `
    <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicons/android-chrome-192x192.png" />
    <link rel="icon" type="image/png" sizes="512x512" href="/favicons/android-chrome-512x512.png" />
    <link rel="manifest" href="/favicons/site.webmanifest" />
  `
  );
}

// Fetches the shared navbar HTML and injects it into the navbar placeholder
// Async allows the function to pause and wait for promises without blocking the rest of the page
async function loadNavbar() {
  // Send a GET request to the navbar HTML file and wait for the response
  const response = await fetch("/components/shared/navbar/navbar.html");

  // Read the response body as a plain HTML string
  const html = await response.text();

  // Inject the HTML into the navbar placeholder element
  document.getElementById("navbar").innerHTML = html;
}

// Wait for the DOM to be fully parsed before running any scripts
document.addEventListener("DOMContentLoaded", async () => {
  // Inject favicon links into <head> (synchronous, no await needed)
  loadFavicons();

  // handle registration
  const registerForm = document.getElementById("register-form");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // stop the form from reloading the page

      const email = document.getElementById("email").value;
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      // password match validation
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        // send data to backend
        const response = await fetch("http://localhost:3001/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Registration successful!");
          window.location.href = "/login";
        } else {
          // Handles errors like "user already exists" (Postgres error 23505)
          alert(data.error || "Registration failed");
        }
      } catch (err) {
        console.error("Connection Error:", err);
        alert("Could not connect to the backend server. Make sure it is running!");
      }
    });
  }

  // Fetch and inject the navbar HTML, wait for it to finish before continuing
  await loadNavbar();
});
