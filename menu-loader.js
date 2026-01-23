// Load menu on all pages
const placeholder = document.getElementById("menu-placeholder");
if (placeholder) {
  placeholder.innerHTML = `
    <div class="hamburger-menu" id="hamburgerMenu">
      <div class="hamburger-button" id="hamburgerButton">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="hamburger-panel" id="hamburgerPanel">
        <a href="prjct1.html">Wiggle Keyboard</a>
        <a href="prjct2.html">RE fanwebsite</a>
        <a href="prjct3.html">Funky brand flyer</a>
        <a href="prjct4.html">Custom game controller</a>
        <hr>
        <a href="contact.html">Contact</a>
      </div>
    </div>
  `;

  // Menu toggle logic
  const hamburgerMenu = document.getElementById("hamburgerMenu");
  const hamburgerButton = document.getElementById("hamburgerButton");
  const hamburgerPanel = document.getElementById("hamburgerPanel");

  hamburgerButton.addEventListener("click", e => {
    e.stopPropagation();
    hamburgerMenu.classList.toggle("open");
  });

  hamburgerPanel.addEventListener("click", e => e.stopPropagation());

  document.addEventListener("click", () => {
    hamburgerMenu.classList.remove("open");
  });
}
