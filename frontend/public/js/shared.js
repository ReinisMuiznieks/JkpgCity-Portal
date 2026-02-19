// Loads favicons and adds the navbar to all pages.
// These scripts are included in the <head> of all HTML files.
// Purpose - avoid duplicating the same code in every HTML file and to ensure consistency
function loadFavicons() {
  document.head.insertAdjacentHTML(
    "beforeend",
    `
    <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicons/android-chrome-192x192.png" />
    <link rel="icon" type="image/png" sizes="512x512" href="/favicons/android-chrome-512x512.png" />
    <link rel="manifest" href="/favicons/site.webmanifest" />
  `
  );
}

// Fetches the shared navbar HTML and injects it into the navbar placeholder
// Async allows the function to pause and wait for promises without blocking the rest of the page
async function loadNavbar() {
  // Send a GET request to the navbar HTML file and wait for the response
  const response = await fetch("/components/shared/navbar/navbar.html");

  // Read the response body as a plain HTML string
  const html = await response.text();

  // Inject the HTML into the navbar placeholder element
  document.getElementById("navbar").innerHTML = html;
}

// Wait for the DOM to be fully parsed before running any scripts
document.addEventListener("DOMContentLoaded", async () => {
  // Inject favicon links into <head> (synchronous, no await needed)
  loadFavicons();

  // Fetch and inject the navbar HTML, wait for it to finish before continuing
  await loadNavbar();
});
