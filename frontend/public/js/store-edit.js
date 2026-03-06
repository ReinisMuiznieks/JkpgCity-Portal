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
    const response = await fetch(`http://localhost:3001/stores/${id}`);
    if (!response.ok) throw new Error("Failed to fetch store");

    const store = await response.json();
    displayStore(store);
  } catch (error) {
    console.error("Error:", error);
  }
}

function displayStore(store) {
  if (store.length === 0) {
    alert("Store does not exist");
    return;
  }

  document.getElementById("venue-name").value = store.name || "";
  document.getElementById("url").value = store.url || "";
  document.getElementById("district").value = store.district || "";
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadStore();
});
