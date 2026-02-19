async function loadNavbar() {
  const response = await fetch("/components/shared/navbar/navbar.html");
  const html = await response.text();
  document.getElementById("navbar").innerHTML = html;
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadNavbar();
});
