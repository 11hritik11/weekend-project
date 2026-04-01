import "./styles.css";
import { gridItems } from "./data.js";
import { renderGrid } from "./grid.js";
import { initLeaderboard } from "./leaderboard.js";
import { initPosterCanvas } from "./poster-canvas.js";
import { initReveal } from "./reveal.js";
import { posterImageUrl } from "./assets/index.js";

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="poster-shell">
    <section class="poster-frame" aria-label="Collage poster recreation">
      ${renderGrid(gridItems)}
      <button class="grid-back-button" type="button" aria-label="Return to collage view">
        Back To Collage
      </button>
      <button class="poster-toggle" type="button" aria-label="Reveal hidden grid behind the collage">
        <canvas class="poster-canvas" aria-hidden="true"></canvas>
      </button>
    </section>
  </main>
`;

const frame = document.querySelector(".poster-frame");
const canvas = document.querySelector(".poster-canvas");
const toggle = document.querySelector(".poster-toggle");
const backButton = document.querySelector(".grid-back-button");

initLeaderboard({
  frame,
  items: gridItems
});

initPosterCanvas({
  frame,
  canvas,
  imageUrl: posterImageUrl
});

initReveal({
  frame,
  toggle,
  backButton
});
