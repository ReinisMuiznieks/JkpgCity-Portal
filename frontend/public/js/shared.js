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

// Wait for the DOM to be fully parsed before running any scripts
document.addEventListener("DOMContentLoaded", async () => {
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
        alert(
          "Could not connect to the backend server. Make sure it is running!"
        );
      }
    });
  }

  // Fetch and inject the navbar HTML, wait for it to finish before continuing
  await loadNavbar();
});
