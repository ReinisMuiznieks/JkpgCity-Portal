// Check if current URL is an edit page
const isEdit = window.location.pathname.includes("/store/edit/");

// Extract store ID from URL path if editing
// 1. window.location.pathname → "/store/edit/123"
// 2. .split("/") → ["", "store", "edit", "123"] (splits on slashes)
// 3. .pop() → "123" (grabs last item from array)
// 4. Ternary ? : → if (isEdit) use "123" else use null
const id = isEdit ? window.location.pathname.split("/").pop() : null;

async function loadStore() {
  try {
    const response = await fetch(`http://localhost:3000/stores/${id}`);
    if (!response.ok) throw new Error("Failed to fetch store");
    const store = await response.json();
    if (store.length === 0) {
      alert("Store does not exist");
      return;
    }
    document.getElementById("venue-name").value = store.name || "";
    document.getElementById("url").value = store.url || "";
    document.getElementById("district").value = store.district || "";
    document.getElementById("description").value = store.description || "";
    document.getElementById("type").value = store.type || "";
  } catch (error) {
    console.error("Error:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  document.querySelector(".hero h1").textContent = isEdit
    ? "Edit Venue"
    : "Add Venue";
  document.getElementById("btn-submit-store").textContent = isEdit
    ? "Save Changes"
    : "Add Venue";

  if (isEdit) await loadStore();
});

document
  .getElementById("btn-submit-store")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const name = document.getElementById("venue-name").value;
    const url = document.getElementById("url").value;
    const district = document.getElementById("district").value;
    const description = document.getElementById("description").value;
    const type = document.getElementById("type").value;

    try {
      const response = await fetch(
        isEdit
          ? `http://localhost:3000/stores/${id}`
          : "http://localhost:3000/stores",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, url, district, description, type }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert(
          isEdit ? "Store updated successfully!" : "Store created successfully!"
        );
      } else {
        alert(
          data.error ||
            (isEdit ? "Failed to update store" : "Failed to create store")
        );
      }
    } catch (err) {
      console.error("Connection Error:", err);
      alert(
        "Could not connect to the backend server. Make sure it is running!"
      );
    }
  });
