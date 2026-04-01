export function initLeaderboard({ frame, items }) {
  const state = items.map((item, index) => ({
    ...item,
    score: 980 - index * 17,
    streak: 12 - (index % 6),
    note: index % 2 === 0 ? "Sunline active" : "Awaiting ascent"
  }));

  const panel = document.createElement("aside");
  panel.className = "leaderboard-panel";
  panel.setAttribute("aria-hidden", "true");
  panel.innerHTML = `
    <div class="leaderboard-panel__backdrop" data-close="true"></div>
    <section class="leaderboard-panel__dialog" aria-label="Leaderboard panel">
      <button class="leaderboard-panel__close" type="button" data-close="true" aria-label="Close leaderboard">Close</button>
      <div class="leaderboard-panel__eyebrow">Board Snapshot</div>
      <h2 class="leaderboard-panel__title">Select a box</h2>
      <p class="leaderboard-panel__subtitle">Click any revealed card to inspect or rename it.</p>
      <div class="leaderboard-panel__hero">
        <div>
          <div class="leaderboard-panel__hero-rank">--</div>
          <div class="leaderboard-panel__hero-name">No card selected</div>
        </div>
        <div class="leaderboard-panel__hero-score">0 pts</div>
      </div>
      <div class="leaderboard-panel__stats">
        <div class="leaderboard-stat">
          <span class="leaderboard-stat__label">Streak</span>
          <span class="leaderboard-stat__value" data-field="streak">0</span>
        </div>
        <div class="leaderboard-stat">
          <span class="leaderboard-stat__label">Status</span>
          <span class="leaderboard-stat__value" data-field="note">Idle</span>
        </div>
      </div>
      <div class="leaderboard-list"></div>
    </section>
  `;

  frame.append(panel);

  const panelTitle = panel.querySelector(".leaderboard-panel__title");
  const panelSubtitle = panel.querySelector(".leaderboard-panel__subtitle");
  const heroRank = panel.querySelector(".leaderboard-panel__hero-rank");
  const heroName = panel.querySelector(".leaderboard-panel__hero-name");
  const heroScore = panel.querySelector(".leaderboard-panel__hero-score");
  const streakValue = panel.querySelector('[data-field="streak"]');
  const noteValue = panel.querySelector('[data-field="note"]');
  const list = panel.querySelector(".leaderboard-list");

  renderList();

  frame.querySelectorAll(".grid-card__open").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.cardId);
      const selected = state.find((item) => item.id === id);

      if (!selected) {
        return;
      }

      updatePanel(selected);
      panel.classList.add("is-open");
      panel.setAttribute("aria-hidden", "false");
    });
  });

  frame.querySelectorAll(".grid-card__title-input").forEach((input) => {
    input.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    input.addEventListener("input", () => {
      const id = Number(input.dataset.cardId);
      const target = state.find((item) => item.id === id);

      if (!target) {
        return;
      }

      target.title = input.value.trim() || `BOX_${id}`;
      const openButton = frame.querySelector(`.grid-card__open[data-card-id="${id}"]`);

      if (openButton) {
        openButton.setAttribute("aria-label", `Open ${target.title}`);
      }

      renderList();

      if (panel.classList.contains("is-open") && heroRank.textContent === target.labelNumber) {
        updatePanel(target);
      }
    });
  });

  panel.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.close === "true") {
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
    }
  });

  function updatePanel(item) {
    panelTitle.textContent = `${item.labelNumber} Leaderboard`;
    panelSubtitle.textContent = "Inline edits update both the card and this panel.";
    heroRank.textContent = item.labelNumber;
    heroName.textContent = item.title;
    heroScore.textContent = `${item.score} pts`;
    streakValue.textContent = `${item.streak} days`;
    noteValue.textContent = item.note;
    highlightActiveRow(item.id);
  }

  function renderList() {
    const sorted = [...state].sort((a, b) => b.score - a.score);
    list.innerHTML = sorted
      .map(
        (item, index) => `
          <button class="leaderboard-row" type="button" data-row-id="${item.id}">
            <span class="leaderboard-row__place">${index + 1}</span>
            <span class="leaderboard-row__name">${item.title}</span>
            <span class="leaderboard-row__score">${item.score}</span>
          </button>
        `
      )
      .join("");

    list.querySelectorAll(".leaderboard-row").forEach((row) => {
      row.addEventListener("click", () => {
        const selected = state.find((item) => item.id === Number(row.dataset.rowId));

        if (selected) {
          updatePanel(selected);
        }
      });
    });
  }

  function highlightActiveRow(id) {
    list.querySelectorAll(".leaderboard-row").forEach((row) => {
      row.classList.toggle("is-active", Number(row.dataset.rowId) === id);
    });
  }
}
