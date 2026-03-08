const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop the form from reloading the page

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      // send data to backend
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        window.location.href = "/";
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Connection Error:", err);
      alert(
        "Could not connect to the backend server. Make sure it is running!"
      );
    }
  });
}
