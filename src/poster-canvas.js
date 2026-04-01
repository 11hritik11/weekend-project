export function initPosterCanvas({ frame, canvas, imageUrl }) {
  const context = canvas.getContext("2d");
  const image = new Image();

  image.addEventListener("load", () => {
    drawPoster();
    window.addEventListener("resize", drawPoster);
  });

  image.src = imageUrl;

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
}
