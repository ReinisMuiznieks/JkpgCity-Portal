const ul = document.getElementById("stores");

async function loadStores() {
  try {
    const response = await fetch("http://localhost:3001/stores");
    if (!response.ok) throw new Error("Failed to fetch stores");

    const stores = await response.json();
    displayStores(stores);
  } catch (error) {
    console.error("Error:", error);
    ul.innerHTML = "<li>could not load stores</li>";
  }
}

function displayStores(stores) {
  ul.innerHTML = "";
  if (stores.length === 0) {
    ul.innerHTML = "no stores found";
    return;
  }

  stores.forEach((store) => {
    const li = document.createElement("li");
    li.id = `store-${store.id}`;
    li.innerHTML = `
    <strong>${store.name}</strong> <br>
    <a href="${store.url}" target="_blank">${store.url}</a><br> District: ${store.district}`;
    ul.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadStores();
});
