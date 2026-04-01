import "./styles.css";
import { initLeaderboard } from "./leaderboard.js";

const goalUrl = new URL("../goal.png", import.meta.url).href;
const gridItems = Array.from({ length: 30 }, (_, index) => {
  const labelNumber = `#${index + 1}`;
  const title = index % 3 === 0 ? "HELIOS_UNIT_0" : index % 3 === 1 ? "PROMETHEUS-." : "SOL_ARCHIVE";
  return { id: index + 1, digit: (index % 9) + 1, labelNumber, title };
});

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="poster-shell">
    <section class="poster-frame" aria-label="Collage poster recreation">
      <div class="box-grid" aria-hidden="true">
        ${gridItems
          .map(
            ({ id, digit, labelNumber, title }, index) => `
              <article class="grid-card" style="--card-delay:${index * 28}ms">
                <div class="grid-card__inner">
                  <button class="grid-card__open" type="button" data-card-id="${id}" aria-label="Open ${title}">
                    <div class="grid-card__meta">
                      <span class="grid-card__digit">${digit}</span>
                      <span class="grid-card__number">${labelNumber}</span>
                    </div>
                  </button>
                  <input class="grid-card__title-input" type="text" value="${title}" maxlength="22" data-card-id="${id}" aria-label="Edit title for ${labelNumber}" />
                </div>
              </article>
            `
          )
          .join("")}
      </div>
      <aside class="side-panel" aria-label="Solar registry preview">
        <div class="side-panel__eyebrow">Registry</div>
        <h2 class="side-panel__title">Solar Table</h2>
        <div class="side-panel__rows">
          ${gridItems
            .slice(0, 7)
            .map(
              ({ labelNumber, title, digit }) => `
                <div class="side-row">
                  <span class="side-row__digit">${digit}</span>
                  <span class="side-row__name">${title}</span>
                  <span class="side-row__rank">${labelNumber}</span>
                </div>
              `
            )
            .join("")}
        </div>
      </aside>
      <button class="poster-toggle" type="button" aria-label="Reveal hidden grid behind the collage">
        <canvas class="poster-canvas" aria-hidden="true"></canvas>
      </button>
    </section>
  </main>
`;

const canvas = document.querySelector(".poster-canvas");
const toggle = document.querySelector(".poster-toggle");
const frame = document.querySelector(".poster-frame");
const context = canvas.getContext("2d");
const image = new Image();
let isRevealed = false;

initLeaderboard({
  frame,
  items: gridItems
});

image.addEventListener("load", () => {
  drawPoster();
  window.addEventListener("resize", drawPoster);
  toggle.addEventListener("click", handleReveal);
  toggle.addEventListener("pointermove", handlePointerMove);
  toggle.addEventListener("pointerleave", () => {
    if (!isRevealed) {
      toggle.classList.remove("is-face-hover");
    }
  });
});

image.src = goalUrl;

function drawPoster() {
  const width = Math.floor(frame.clientWidth * window.devicePixelRatio);
  const height = Math.floor(frame.clientHeight * window.devicePixelRatio);

  if (!width || !height) {
    return;
  }

  canvas.width = width;
  canvas.height = height;

  const cssWidth = frame.clientWidth;
  const cssHeight = frame.clientHeight;
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.scale(window.devicePixelRatio, window.devicePixelRatio);

  context.clearRect(0, 0, cssWidth, cssHeight);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  drawBackdrop(cssWidth, cssHeight);
  drawImageCover(cssWidth, cssHeight);
  drawVignette(cssWidth, cssHeight);
  drawDust(cssWidth, cssHeight);
}

function handleReveal(event) {
  if (isRevealed || !isFaceHit(event)) {
    return;
  }

  isRevealed = true;
  frame.classList.add("is-revealed");
  toggle.disabled = true;
  toggle.classList.remove("is-face-hover");
}

function handlePointerMove(event) {
  if (isRevealed) {
    return;
  }

  toggle.classList.toggle("is-face-hover", isFaceHit(event));
}

function isFaceHit(event) {
  const bounds = toggle.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;

  const dx = (x - 0.425) / 0.17;
  const dy = (y - 0.58) / 0.33;

  return dx * dx + dy * dy <= 1;
}

function drawBackdrop(width, height) {
  const gradient = context.createRadialGradient(
    width * 0.5,
    height * 0.12,
    width * 0.04,
    width * 0.5,
    height * 0.5,
    width * 0.72
  );

  gradient.addColorStop(0, "#d8d0c5");
  gradient.addColorStop(0.45, "#c1b9b0");
  gradient.addColorStop(1, "#8b837b");

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
}

function drawImageCover(width, height) {
  const sourceRatio = image.width / image.height;
  const targetRatio = width / height;

  let drawWidth = width;
  let drawHeight = height;
  let offsetX = 0;
  let offsetY = 0;

  if (sourceRatio > targetRatio) {
    drawHeight = height;
    drawWidth = height * sourceRatio;
    offsetX = (width - drawWidth) / 2;
  } else {
    drawWidth = width;
    drawHeight = width / sourceRatio;
    offsetY = (height - drawHeight) / 2;
  }

  context.save();
  context.shadowColor = "rgba(28, 18, 8, 0.18)";
  context.shadowBlur = 24;
  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  context.restore();
}

function drawVignette(width, height) {
  const vignette = context.createRadialGradient(
    width * 0.5,
    height * 0.48,
    width * 0.2,
    width * 0.5,
    height * 0.5,
    width * 0.7
  );

  vignette.addColorStop(0, "rgba(255, 248, 235, 0)");
  vignette.addColorStop(0.72, "rgba(72, 54, 28, 0.08)");
  vignette.addColorStop(1, "rgba(34, 24, 11, 0.28)");

  context.fillStyle = vignette;
  context.fillRect(0, 0, width, height);
}

function drawDust(width, height) {
  context.save();
  context.globalAlpha = 0.08;

  for (let i = 0; i < 1400; i += 1) {
    const x = seededValue(i * 13.7) * width;
    const y = seededValue(i * 27.1) * height;
    const size = seededValue(i * 9.3) > 0.92 ? 1.6 : 0.8;

    context.fillStyle = i % 3 === 0 ? "#20180f" : "#fff8eb";
    context.fillRect(x, y, size, size);
  }

  context.restore();
}

function seededValue(seed) {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}
