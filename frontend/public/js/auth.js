const registerForm = document.getElementById("register-form");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop the form from reloading the page

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // password match validation
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // send data to backend (No username included)
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        window.location.href = "/login";
      } else {
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
