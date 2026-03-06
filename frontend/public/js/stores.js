const grid = document.querySelector(".grid");

async function loadStores() {
  try {
    const response = await fetch("http://localhost:3001/stores");
    if (!response.ok) throw new Error("Failed to fetch stores");

    const stores = await response.json();
    displayStores(stores);
  } catch (error) {
    console.error("Error:", error);
    grid.innerHTML = "<p>Could not load stores</p>";
  }
}

function displayStores(stores) {
  grid.innerHTML = "";
  if (stores.length === 0) {
    grid.innerHTML = "<p>no stores found</p>";
    return;
  }

  stores.forEach((store) => {
    const article = document.createElement("article");
    article.className = "card";
    article.id = `store-${store.id}`;
    article.innerHTML = `
      <div class="card-content">
        <h3>${store.name}</h3>
        <p>Read more</p>
      </div>
      <span class="arrow">→</span>`;
    article.addEventListener("click", () => {
      const url = store.url.startsWith("http")
        ? store.url
        : `https://${store.url}`;
      window.open(url, "_blank");
    });
    grid.appendChild(article);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadStores();
});
