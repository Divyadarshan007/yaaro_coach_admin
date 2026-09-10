// Draws the downloadable attendance card from scratch onto a canvas, instead of
// screenshotting the live DOM. Screenshot libraries (html-to-image/html2canvas) guess
// at element sizing from computed styles and were consistently a pixel or two off
// around the card's rounded corners/ring border — this draws every pixel deliberately,
// so the output is exact every time. The card always renders in the light "poster"
// style regardless of the app's theme, same as a printed sign would.

const CARD_WIDTH = 384;
const PAD_Y = 32;
const GAP = 20;
const CARD_RADIUS = 16;
const QR_BOX_PADDING = 16;
const QR_BOX_RADIUS = 12;
const BORDER_COLOR = "rgba(15, 15, 15, 0.1)";
const TITLE_COLOR = "#0f0f0f";
const MUTED_COLOR = "#71717a";
const OUTPUT_SCALE = 3; // sharp on high-DPI phone screens and when printed

function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Matches whatever font next/font actually resolved to on the page (its generated
// local family name + fallbacks), so canvas text lines up with the on-screen card
// without hardcoding a font name that could drift from the real stylesheet.
function resolvePageFontFamily(): string {
  if (typeof document === "undefined") return "sans-serif";
  return getComputedStyle(document.body).fontFamily || "sans-serif";
}

export async function renderAttendanceCardBlob({
  studioName,
  qrCanvas,
  qrSize,
}: {
  studioName: string;
  qrCanvas: HTMLCanvasElement;
  /** The logical size (CSS px) the QR was rendered at — i.e. its `size` prop, NOT
   * qrCanvas.width, which qrcode.react multiplies by devicePixelRatio internally for
   * sharpness (220 on desktop, but 440-660 on a phone) and would blow the layout up. */
  qrSize: number;
}): Promise<Blob> {
  await document.fonts.ready;
  const fontFamily = resolvePageFontFamily();

  const qrBoxSize = qrSize + QR_BOX_PADDING * 2;
  const titleHeight = 24;
  const subtitleHeight = 18;
  const footerHeight = 16;

  const width = CARD_WIDTH;
  const height =
    PAD_Y + titleHeight + GAP + subtitleHeight + GAP + qrBoxSize + GAP + footerHeight + PAD_Y;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * OUTPUT_SCALE);
  canvas.height = Math.round(height * OUTPUT_SCALE);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");
  ctx.scale(OUTPUT_SCALE, OUTPUT_SCALE);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "center";

  // Card background + border
  ctx.fillStyle = "#ffffff";
  roundedRectPath(ctx, 0, 0, width, height, CARD_RADIUS);
  ctx.fill();
  ctx.strokeStyle = BORDER_COLOR;
  ctx.lineWidth = 1;
  roundedRectPath(ctx, 0.5, 0.5, width - 1, height - 1, CARD_RADIUS - 0.5);
  ctx.stroke();

  let y = PAD_Y;

  // Title
  ctx.fillStyle = TITLE_COLOR;
  ctx.font = `500 20px ${fontFamily}`;
  y += titleHeight * 0.72;
  ctx.fillText(studioName, width / 2, y);
  y += titleHeight * 0.28 + GAP;

  // Subtitle
  ctx.fillStyle = MUTED_COLOR;
  ctx.font = `400 14px ${fontFamily}`;
  y += subtitleHeight * 0.72;
  ctx.fillText("Scan for attendance", width / 2, y);
  y += subtitleHeight * 0.28 + GAP;

  // QR box
  const qrBoxX = (width - qrBoxSize) / 2;
  const qrBoxY = y;
  ctx.fillStyle = "#ffffff";
  roundedRectPath(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, QR_BOX_RADIUS);
  ctx.fill();
  ctx.strokeStyle = BORDER_COLOR;
  roundedRectPath(ctx, qrBoxX + 0.5, qrBoxY + 0.5, qrBoxSize - 1, qrBoxSize - 1, QR_BOX_RADIUS - 0.5);
  ctx.stroke();
  try {
    ctx.drawImage(qrCanvas, qrBoxX + QR_BOX_PADDING, qrBoxY + QR_BOX_PADDING, qrSize, qrSize);
  } catch (err) {
    throw new Error(
      `Failed to draw QR canvas (${qrCanvas.width}x${qrCanvas.height}): ${(err as Error).message}`,
    );
  }
  y = qrBoxY + qrBoxSize + GAP;

  // Footer — "Powered by " (muted) + "yaaro.fit" (bold, dark)
  const prefix = "Powered by ";
  const brand = "yaaro.fit";
  ctx.font = `400 12px ${fontFamily}`;
  const prefixWidth = ctx.measureText(prefix).width;
  ctx.font = `600 12px ${fontFamily}`;
  const brandWidth = ctx.measureText(brand).width;
  const startX = width / 2 - (prefixWidth + brandWidth) / 2;
  y += footerHeight * 0.75;

  ctx.textAlign = "left";
  ctx.font = `400 12px ${fontFamily}`;
  ctx.fillStyle = MUTED_COLOR;
  ctx.fillText(prefix, startX, y);
  ctx.font = `600 12px ${fontFamily}`;
  ctx.fillStyle = TITLE_COLOR;
  ctx.fillText(brand, startX + prefixWidth, y);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob =>
        blob
          ? resolve(blob)
          : reject(
              new Error(
                `canvas.toBlob returned null (${canvas.width}x${canvas.height}) — canvas may be tainted or too large`,
              ),
            ),
      "image/png",
    );
  });
}
