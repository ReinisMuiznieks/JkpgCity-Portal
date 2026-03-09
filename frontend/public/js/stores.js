const grid = document.querySelector(".grid");
const districtFilter = document.getElementById("district-filter");
const sortingSelect = document.getElementById("sorting");

let allStores = [];

// default state
let isLoggedIn = false;

async function checkAuth() {
  const res = await fetch("http://localhost:3000/users/me", {
    credentials: "include",
  });
  return res.ok;
}

async function loadStores() {
  // set actual state
  isLoggedIn = await checkAuth();
  addStore();

  try {
    const response = await fetch("http://localhost:3000/stores");
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
    filtered = filtered.filter((store) => store.district === selectedDistrict);
  }

  //sort logic
  const sortBy = sortingSelect.value;
  filtered.sort((a, b) => {
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

function addStore() {
  addStoreButton = document.getElementById("add-store-button");
  if (isLoggedIn) {
    addStoreButton.style.display = "block";
    addStoreButton.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "/store/new";
    });
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
    const url = store.url
      ? store.url.startsWith("http")
        ? store.url
        : `https://${store.url}`
      : "#";

    article.className = "card";
    article.id = `store-${store.id}`;
    article.innerHTML = `
      <div class="card-content">
        <h3>${store.name}</h3>
        <a target="_blank" href="${url}">Read more</a>
      </div>
      <div>
      <a href="/store/edit/${store.id}" style="display: ${isLoggedIn ? "block" : "none"}">Edit</a> 
      <button id="deleteButton">Delete</button>
      </div>`;

    const deleteBtn = article.querySelector("#deleteButton");
    deleteBtn.addEventListener("click", async (e) => {
      await deleteStore(store.id);

      loadStores();
    });

    grid.appendChild(article);
  });
}
async function deleteStore(id) {
  try {
    const response = await fetch(`http://localhost:3000/stores/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete store");
  } catch (err) {
    console.log("Error: ", err);
  }
}

districtFilter.addEventListener("change", applyFiltersAndSort);
sortingSelect.addEventListener("change", applyFiltersAndSort);

document.addEventListener("DOMContentLoaded", loadStores);
