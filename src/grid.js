export function renderGrid(items) {
  return `
    <div class="box-grid" aria-hidden="true">
      ${items
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
  `;
}
