export function initReveal({ frame, toggle, backButton }) {
  let isRevealed = false;

  toggle.addEventListener("click", handleReveal);
  backButton.addEventListener("click", handleReset);
  toggle.addEventListener("pointermove", handlePointerMove);
  toggle.addEventListener("pointerleave", () => {
    if (!isRevealed) {
      toggle.classList.remove("is-face-hover");
    }
  });

  function handleReveal(event) {
    if (isRevealed || !isFaceHit(event)) {
      return;
    }

    isRevealed = true;
    frame.classList.add("is-revealed");
    toggle.disabled = true;
    toggle.classList.remove("is-face-hover");
  }

  function handleReset() {
    isRevealed = false;
    frame.classList.remove("is-revealed");
    toggle.disabled = false;
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
}
