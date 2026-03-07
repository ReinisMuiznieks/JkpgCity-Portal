const grid = document.querySelector(".grid");
const districtFilter = document.getElementById("district-filter");
const sortingSelect = document.getElementById("sorting");

let allStores = [];

async function loadStores() {
  try {
    const response = await fetch("http://localhost:3001/stores");
    if (!response.ok) throw new Error("Failed to fetch stores");

    allStores = await response.json();
    applyFiltersAndSort();
  } catch (error) {
    console.error("Error:", error);
    grid.innerHTML = "<p>Could not load stores</p>";
  }
}

function applyFiltersAndSort() {
  //create copy of the original stores to modify
  let filtered = [...allStores];

  //filter by district
  const selectedDistrict = districtFilter.value;
  if (selectedDistrict) {
    filtered = filtered.filter(store => store.district === selectedDistrict);
  }

  //sort logic
  const sortBy = sortingSelect.value;
  filtered.sort((a,b) => {
    if (sortBy === "az") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "district") {
      //if store has no district, move it
      return (a.district || "").localeCompare(b.district || "");
    }
    return 0;
  });

  displayStores(filtered);
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

districtFilter.addEventListener("change", applyFiltersAndSort);
sortingSelect.addEventListener("change", applyFiltersAndSort);

document.addEventListener("DOMContentLoaded", loadStores);