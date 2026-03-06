// connect addeventlisteneer input to data in backend

const button = document.getElementById("btn-submit-store");

button.addEventListener("click", async (e) => {
  e.preventDefault();
  const name = document.getElementById("venue-name").value;
  const url = document.getElementById("url").value;
  const description = document.getElementById("description").value;
  const district = document.getElementById("district").value;

  try {
    // send data to backend
    const response = await fetch("http://localhost:3001/stores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, url, district, description }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Store created successfully!");
      //   window.location.href = "/";
    } else {
      alert(data.error || "Failed to create store");
    }
  } catch (err) {
    console.error("Connection Error:", err);
    alert("Could not connect to the backend server. Make sure it is running!");
  }
});
