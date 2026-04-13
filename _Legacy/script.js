let isZoomed = false;
let currentItem = null;
let zoomReady = false;

// ---- Data ----
const portfolioItems = [
  { id: 1, title: "Wiggle Keyboard", link: "prjct1.html", image: "img/keyboard1.png", position: { x: 33, y: 17 }, rotation: 2, connections: [2,3], zoom: { scale: 2.3, xOffset: 43, yOffset: 35 }, nav: { down: 3, right: 2 } },
  { id: 2, title: "RE fanwebsite", link: "prjct2.html", image: "img/fpzomb.png", position: { x: 70, y: 32 }, rotation: 3, connections: [1,4], zoom: { scale: 2.2, xOffset: 47, yOffset: 47 }, nav: { down: 4, left: 1 } },
  { id: 3, title: "Funky brand flyer", link: "prjct3.html", image: "img/flyerf.png", position: { x: 15, y: 57 }, rotation: 2, connections: [1,4], zoom: { scale: 2.2, xOffset: 32, yOffset: 38 }, nav: { up: 1, right: 4 } },
  { id: 4, title: "Custom game controller", link: "prjct4.html", image: "img/ctr.png", position: { x: 55, y: 60 }, rotation: 4, connections: [2,3], zoom: { scale: 2.2, xOffset: 38, yOffset: 38 }, nav: { up: 2, left: 3 } }
];

const pinBoard = document.getElementById("pinBoard");
const board = document.getElementById("board");
const navArrows = document.getElementById("navArrows");

const arrows = {
  up: document.getElementById("arrowUp"),
  down: document.getElementById("arrowDown"),
  left: document.getElementById("arrowLeft"),
  right: document.getElementById("arrowRight")
};

// ---- Render board ----
function renderBoard() {
  board.innerHTML = "";

  portfolioItems.forEach(item => {
    const polaroid = document.createElement("div");
    polaroid.className = "polaroid";
    polaroid.dataset.id = item.id;
    polaroid.style.left = `${item.position.x}%`;
    polaroid.style.top = `${item.position.y}%`;
    polaroid.style.setProperty("--rotation", `${item.rotation}deg`);

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.title;
    polaroid.appendChild(img);

    const label = document.createElement("div");
    label.textContent = item.title;
    label.style.marginTop = "8px";
    label.style.fontSize = "12px";
    label.style.textAlign = "center";
    label.style.fontWeight = "bold";
    polaroid.appendChild(label);

    polaroid.addEventListener("click", e => {
      e.stopPropagation();

      if (!isZoomed) {
        zoomToItem(item);
      } else if (currentItem && currentItem.id !== item.id) {
        moveCameraAlongWire(currentItem, item);
      }
    });

    board.appendChild(polaroid);
  });

  portfolioItems.forEach(item => {
    item.connections.forEach(connId => {
      const connected = portfolioItems.find(i => i.id === connId);
      if (connected && item.id < connected.id) {
        drawRedString(item, connected);
      }
    });
  });
}

// ---- Draw red string ----
function drawRedString(a, b) {
  const rect = board.getBoundingClientRect();
  const w = rect.width, h = rect.height;
  const polW = 140, polH = 170;
  const cx = polW / 2, cy = polH / 2;

  const x1 = (a.position.x / 100) * w + cx;
  const y1 = (a.position.y / 100) * h + cy;
  const x2 = (b.position.x / 100) * w + cx;
  const y2 = (b.position.y / 100) * h + cy;

  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ang = Math.atan2(dy, dx) * 180 / Math.PI;

  const line = document.createElement("div");
  line.className = "red-string";
  line.style.width = `${len}px`;
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;
  line.style.transform = `rotate(${ang}deg)`;
  board.appendChild(line);
}

// ---- Zoom ----
function zoomToItem(item) {
  zoomReady = false;

  const scale = item.zoom.scale;
  const x = item.zoom.xOffset - item.position.x;
  const y = item.zoom.yOffset - item.position.y;

  pinBoard.style.setProperty("--zoom-scale", scale);
  pinBoard.style.setProperty("--zoom-x", `${x}%`);
  pinBoard.style.setProperty("--zoom-y", `${y}%`);

  pinBoard.classList.add("zoomed");
  isZoomed = true;
  currentItem = item;
  updateArrows();

  setTimeout(() => {
    zoomReady = true;
  }, 1200); // must match CSS transition
}

// ---- Navigate ----
function navigateToProject(item) {
  document.body.style.transition = "opacity 0.4s ease";
  document.body.style.opacity = "0";

  setTimeout(() => {
    window.location.href = item.link;
  }, 400);
}

// ---- Reset zoom ----
function resetZoom() {
  pinBoard.classList.remove("zoomed");
  isZoomed = false;
  currentItem = null;
  zoomReady = false;
  showArrows(false);

  document.body.style.opacity = "1";
  document.body.style.transition = "";
}

// ---- Arrow UI ----
function updateArrows() {
  showArrows(true);
  for (const dir in arrows) {
    arrows[dir].style.display = currentItem.nav?.[dir] ? "block" : "none";
  }
}

function showArrows(show) {
  navArrows.classList.toggle("visible", show);
}

// ---- Camera movement ----
function moveCameraAlongWire(fromItem, toItem) {
  zoomReady = false;

  const path = computePath(fromItem, toItem, 25);
  let step = 0;

  function animate() {
    if (step >= path.length) {
      currentItem = toItem;
      updateArrows();
      setTimeout(() => zoomReady = true, 200);
      return;
    }

    const p = path[step];
    pinBoard.style.setProperty("--zoom-x", `${p.x}%`);
    pinBoard.style.setProperty("--zoom-y", `${p.y}%`);
    step++;
    requestAnimationFrame(animate);
  }

  animate();
}

// ---- Path math ----
function computePath(a, b, steps) {
  const sx = a.zoom.xOffset - a.position.x;
  const sy = a.zoom.yOffset - a.position.y;
  const ex = b.zoom.xOffset - b.position.x;
  const ey = b.zoom.yOffset - b.position.y;

  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const e = t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t;
    return {
      x: sx + (ex - sx) * e,
      y: sy + (ey - sy) * e
    };
  });
}

// ---- Global navigation click ----
pinBoard.addEventListener("click", e => {
  if (!isZoomed || !zoomReady || !currentItem) return;
  e.stopPropagation();
  navigateToProject(currentItem);
});

// ---- Exit zoom ----
document.addEventListener("click", e => {
  if (!isZoomed) return;
  if (e.target.closest(".arrow")) return;
  resetZoom();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && isZoomed) resetZoom();
});

// ---- Arrow clicks ----
for (const dir in arrows) {
  arrows[dir].addEventListener("click", e => {
    e.stopPropagation();
    const id = currentItem?.nav?.[dir];
    const target = portfolioItems.find(i => i.id === id);
    if (target) moveCameraAlongWire(currentItem, target);
  });
}

// ---- Init ----
window.addEventListener("load", () => {
  renderBoard();
  window.addEventListener("resize", renderBoard);
});
