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
  
  // Fetch and inject the navbar HTML, wait for it to finish before continuing
  await loadNavbar();
});
