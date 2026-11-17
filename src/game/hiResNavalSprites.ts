import type { CompiledSprite } from './pixelSprites';

const SUPERSAMPLE = 4;

/**
 * Compiles a high-resolution cenital (top-down aerial) sprite with supersampling
 * and generates a matching solid-white hit-flash silhouette canvas.
 */
function compileCenital(
  logicalW: number,
  logicalH: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  scale = SUPERSAMPLE
): CompiledSprite {
  const pw = Math.round(logicalW * scale);
  const ph = Math.round(logicalH * scale);

  const canvas = document.createElement('canvas');
  canvas.width = pw;
  canvas.height = ph;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.save();
  ctx.scale(scale, scale);
  draw(ctx, logicalW, logicalH);
  ctx.restore();

  const flashCanvas = document.createElement('canvas');
  flashCanvas.width = pw;
  flashCanvas.height = ph;
  const fctx = flashCanvas.getContext('2d')!;
  fctx.drawImage(canvas, 0, 0);
  fctx.globalCompositeOperation = 'source-in';
  fctx.fillStyle = '#FFFFFF';
  fctx.fillRect(0, 0, pw, ph);

  return { canvas, flashCanvas, w: logicalW, h: logicalH };
}

/**
 * Traces and fills a sleek hydrodynamically curved warship hull pointing south (downwards in vertical scroll),
 * with 3D cylindrical steel shading, non-slip main deck, gunwale highlights, plated seams, and shadow bevels.
 */
function drawCurvedWarshipHull(
  ctx: CanvasRenderingContext2D,
  cx: number,
  sternY: number,
  bowY: number,
  maxHalfW: number,
  sternRatio: number,
  hullBase: string,
  deckBase: string
): void {
  const len = bowY - sternY;
  const sternHW = maxHalfW * sternRatio;
  const midStartY = sternY + len * 0.18;
  const midEndY = sternY + len * 0.56;

  const hullPath = () => {
    ctx.beginPath();
    ctx.moveTo(cx - sternHW, sternY);
    ctx.lineTo(cx + sternHW, sternY);
    ctx.quadraticCurveTo(cx + maxHalfW * 0.96, sternY + len * 0.08, cx + maxHalfW, midStartY);
    ctx.lineTo(cx + maxHalfW, midEndY);
    ctx.bezierCurveTo(
      cx + maxHalfW * 0.95,
      bowY - len * 0.2,
      cx + maxHalfW * 0.36,
      bowY - len * 0.04,
      cx,
      bowY
    );
    ctx.bezierCurveTo(
      cx - maxHalfW * 0.36,
      bowY - len * 0.04,
      cx - maxHalfW * 0.95,
      bowY - len * 0.2,
      cx - maxHalfW,
      midEndY
    );
    ctx.lineTo(cx - maxHalfW, midStartY);
    ctx.quadraticCurveTo(cx - maxHalfW * 0.96, sternY + len * 0.08, cx - sternHW, sternY);
    ctx.closePath();
  };

  // Subtle ambient water contact shadow around hull
  ctx.save();
  ctx.shadowColor = 'rgba(2, 8, 18, 0.72)';
  ctx.shadowBlur = 2.6;
  ctx.shadowOffsetX = 1.6;
  ctx.shadowOffsetY = 1.8;
  hullPath();
  ctx.fillStyle = '#0F172A';
  ctx.fill();
  ctx.restore();

  // Outer Royal Navy steel freeboard gradient (sunlit port NW -> shaded starboard SE)
  const freeboardGrad = ctx.createLinearGradient(cx - maxHalfW, sternY, cx + maxHalfW, bowY);
  freeboardGrad.addColorStop(0, '#CBD5E1');
  freeboardGrad.addColorStop(0.18, hullBase);
  freeboardGrad.addColorStop(0.75, '#475569');
  freeboardGrad.addColorStop(1, '#1E293B');

  hullPath();
  ctx.fillStyle = freeboardGrad;
  ctx.fill();
  ctx.lineWidth = 0.75;
  ctx.strokeStyle = '#090E17';
  ctx.stroke();

  // Inner recessed weather deck clipped neatly inside hull
  ctx.save();
  hullPath();
  ctx.clip();

  const inset = Math.max(1.1, maxHalfW * 0.14);
  const deckGrad = ctx.createLinearGradient(cx - maxHalfW, sternY, cx + maxHalfW, sternY);
  deckGrad.addColorStop(0, '#475569');
  deckGrad.addColorStop(0.32, deckBase);
  deckGrad.addColorStop(0.85, '#273549');
  deckGrad.addColorStop(1, '#172130');

  ctx.beginPath();
  ctx.moveTo(cx - (sternHW - inset), sternY + inset);
  ctx.lineTo(cx + (sternHW - inset), sternY + inset);
  ctx.quadraticCurveTo(cx + (maxHalfW - inset), sternY + len * 0.1, cx + (maxHalfW - inset), midStartY);
  ctx.lineTo(cx + (maxHalfW - inset), midEndY);
  ctx.bezierCurveTo(
    cx + (maxHalfW - inset) * 0.9,
    bowY - len * 0.2,
    cx + (maxHalfW - inset) * 0.34,
    bowY - len * 0.06,
    cx,
    bowY - inset * 1.6
  );
  ctx.bezierCurveTo(
    cx - (maxHalfW - inset) * 0.34,
    bowY - len * 0.06,
    cx - (maxHalfW - inset) * 0.9,
    bowY - len * 0.2,
    cx - (maxHalfW - inset),
    midEndY
  );
  ctx.lineTo(cx - (maxHalfW - inset), midStartY);
  ctx.quadraticCurveTo(cx - (maxHalfW - inset), sternY + len * 0.1, cx - (sternHW - inset), sternY + inset);
  ctx.closePath();
  ctx.fillStyle = deckGrad;
  ctx.fill();

  // Subtle steel deck plating seams & walkway ribs
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.32)';
  ctx.lineWidth = 0.35;
  for (let y = sternY + 6; y < bowY - 4; y += 6.5) {
    ctx.beginPath();
    ctx.moveTo(cx - maxHalfW, y);
    ctx.lineTo(cx + maxHalfW, y);
    ctx.stroke();
  }

  // Port sunlit gunwale highlight line
  ctx.strokeStyle = 'rgba(248, 250, 252, 0.52)';
  ctx.lineWidth = 0.65;
  ctx.beginPath();
  ctx.moveTo(cx - sternHW + 0.5, sternY + 0.8);
  ctx.lineTo(cx - maxHalfW + 0.7, midStartY);
  ctx.lineTo(cx - maxHalfW + 0.7, midEndY);
  ctx.quadraticCurveTo(cx - maxHalfW * 0.65, bowY - len * 0.14, cx, bowY - 1.2);
  ctx.stroke();

  // Outer deck perimeter lifeline stanchions & walking non-slip strips
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.34)';
  ctx.lineWidth = 0.4;
  ctx.setLineDash([1.6, 1.4]);
  ctx.beginPath();
  ctx.moveTo(cx - maxHalfW + 1.4, midStartY);
  ctx.lineTo(cx - maxHalfW + 1.4, midEndY);
  ctx.moveTo(cx + maxHalfW - 1.4, midStartY);
  ctx.lineTo(cx + maxHalfW - 1.4, midEndY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.restore();
}

function drawForecastleAnchorGear(ctx: CanvasRenderingContext2D, cx: number, y: number, halfW: number): void {
  // Anchor chains leading from hawsepipes to twin dark iron capstan winches
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 0.6;
  ctx.setLineDash([0.7, 0.45]);
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cx + side * (halfW * 0.25), y + 4.5);
    ctx.lineTo(cx + side * (halfW * 0.52), y);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Anchor capstan drums & bollards
  for (const side of [-1, 1]) {
    const wx = cx + side * (halfW * 0.46);
    ctx.fillStyle = '#090D16';
    ctx.beginPath();
    ctx.arc(wx, y, 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#CBD5E1';
    ctx.beginPath();
    ctx.arc(wx - 0.15, y - 0.15, 0.45, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawAAMount(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(cx, cy, 1.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#94A3B8';
  ctx.beginPath();
  ctx.arc(cx, cy, 0.95, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy + 1.8);
  ctx.stroke();
}

function drawLifeRaftPods(ctx: CanvasRenderingContext2D, x: number, y: number, count = 2): void {
  for (let i = 0; i < count; i++) {
    const ry = y + i * 2.1;
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(x - 0.9, ry - 0.7, 1.8, 1.4);
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(x - 0.75, ry - 0.55, 1.5, 1.1);
  }
}

function drawRoyalNavyRoundel(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
  ctx.save();
  ctx.fillStyle = '#0F2B6B';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.64, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.34, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawDeckUnionJack(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number): void {
  const x = cx - w / 2;
  const y = cy - h / 2;
  ctx.save();
  ctx.fillStyle = '#0B245B';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#F8FAFC';
  ctx.lineWidth = Math.max(0.6, h * 0.16);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y + h);
  ctx.moveTo(x + w, y);
  ctx.lineTo(x, y + h);
  ctx.stroke();
  ctx.strokeStyle = '#DC2626';
  ctx.lineWidth = Math.max(0.35, h * 0.08);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y + h);
  ctx.moveTo(x + w, y);
  ctx.lineTo(x, y + h);
  ctx.stroke();
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(x, y + h * 0.34, w, h * 0.32);
  ctx.fillRect(x + w * 0.37, y, w * 0.26, h);
  ctx.fillStyle = '#DC2626';
  ctx.fillRect(x, y + h * 0.41, w, h * 0.18);
  ctx.fillRect(x + w * 0.43, y, w * 0.14, h);
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.lineWidth = 0.35;
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}

function drawHullPennantNumber(ctx: CanvasRenderingContext2D, cx: number, y: number, code: string): void {
  ctx.save();
  ctx.font = 'bold 2.9px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fillText(code, cx + 0.28, y + 0.28);
  ctx.fillStyle = '#F8FAFC';
  ctx.fillText(code, cx, y);
  ctx.restore();
}

function drawSuperstructureBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  _radius: number,
  topColor = '#B6C2CF',
  shadowOffset = 1.6
): void {
  // Tapered faceted naval deckhouse (chamfered bow & aft corners — zero rectangular Lego blocks)
  const chamBow = Math.min(w * 0.24, 3.2);
  const chamStern = Math.min(w * 0.16, 2.0);
  const deckPath = (ox = 0, oy = 0) => {
    ctx.beginPath();
    ctx.moveTo(x + chamStern + ox, y + oy);
    ctx.lineTo(x + w - chamStern + ox, y + oy);
    ctx.lineTo(x + w + ox, y + h * 0.14 + oy);
    ctx.lineTo(x + w + ox, y + h * 0.78 + oy);
    ctx.quadraticCurveTo(x + w - chamBow * 0.2 + ox, y + h + oy, x + w - chamBow + ox, y + h + oy);
    ctx.lineTo(x + chamBow + ox, y + h + oy);
    ctx.quadraticCurveTo(x + chamBow * 0.2 + ox, y + h + oy, x + ox, y + h * 0.78 + oy);
    ctx.lineTo(x + ox, y + h * 0.14 + oy);
    ctx.closePath();
  };

  ctx.fillStyle = 'rgba(6, 12, 22, 0.5)';
  deckPath(shadowOffset, shadowOffset);
  ctx.fill();

  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, '#E2E8F0');
  grad.addColorStop(0.32, topColor);
  grad.addColorStop(0.84, '#64748B');
  grad.addColorStop(1, '#334155');

  deckPath();
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = 0.45;
  ctx.strokeStyle = '#0F172A';
  ctx.stroke();

  // Subtle recessed inner roof deck tier & ventilation louvers
  ctx.strokeStyle = 'rgba(248, 250, 252, 0.28)';
  ctx.lineWidth = 0.35;
  ctx.beginPath();
  ctx.moveTo(x + chamStern + 1, y + 1.2);
  ctx.lineTo(x + w - chamStern - 1, y + 1.2);
  ctx.stroke();
}

function drawBridgeWingTier(
  ctx: CanvasRenderingContext2D,
  cx: number,
  y: number,
  halfSpan: number,
  depth: number,
  glassWidth: number
): void {
  // Swept flared bridge wings with curved wraparound navigation glass
  const wingPath = (ox = 0, oy = 0) => {
    ctx.beginPath();
    ctx.moveTo(cx - halfSpan * 0.72 + ox, y + oy);
    ctx.lineTo(cx + halfSpan * 0.72 + ox, y + oy);
    ctx.lineTo(cx + halfSpan + ox, y + depth * 0.45 + oy);
    ctx.quadraticCurveTo(cx + halfSpan * 0.85 + ox, y + depth + oy, cx + halfSpan * 0.55 + ox, y + depth + oy);
    ctx.lineTo(cx - halfSpan * 0.55 + ox, y + depth + oy);
    ctx.quadraticCurveTo(cx - halfSpan * 0.85 + ox, y + depth + oy, cx - halfSpan + ox, y + depth * 0.45 + oy);
    ctx.closePath();
  };

  ctx.fillStyle = 'rgba(5, 10, 20, 0.48)';
  wingPath(1.2, 1.2);
  ctx.fill();

  const grad = ctx.createLinearGradient(cx - halfSpan, y, cx + halfSpan, y + depth);
  grad.addColorStop(0, '#F1F5F9');
  grad.addColorStop(0.5, '#CBD5E1');
  grad.addColorStop(1, '#475569');
  wingPath();
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 0.45;
  ctx.stroke();

  // Curved tinted bridge windows
  ctx.strokeStyle = '#0B1320';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(cx - glassWidth * 0.5, y + depth * 0.68);
  ctx.quadraticCurveTo(cx, y + depth * 0.82, cx + glassWidth * 0.5, y + depth * 0.68);
  ctx.stroke();
}

function drawAngledExocetPods(ctx: CanvasRenderingContext2D, cx: number, y: number, spread = 3.2): void {
  // Authentic angled twin MM38 Exocet launch canisters (port & starboard angled out)
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(cx + side * spread, y);
    ctx.rotate(side * 0.34);
    ctx.fillStyle = 'rgba(5, 10, 20, 0.45)';
    ctx.fillRect(-1.0, -2.0, 2.4, 4.4);
    for (const tubeX of [-0.65, 0.55]) {
      ctx.fillStyle = '#CBD5E1';
      ctx.beginPath();
      ctx.roundRect(tubeX - 0.45, -2.1, 0.9, 4.2, 0.4);
      ctx.fill();
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(tubeX, 2.0, 0.42, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function drawSphereRadome(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
  // Cast shadow
  ctx.fillStyle = 'rgba(6, 12, 22, 0.48)';
  ctx.beginPath();
  ctx.arc(cx + r * 0.35, cy + r * 0.35, r, 0, Math.PI * 2);
  ctx.fill();

  const g = ctx.createRadialGradient(cx - r * 0.32, cy - r * 0.32, r * 0.1, cx, cy, r);
  g.addColorStop(0, '#FFFFFF');
  g.addColorStop(0.55, '#E2E8F0');
  g.addColorStop(0.88, '#94A3B8');
  g.addColorStop(1, '#475569');

  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 0.45;
  ctx.strokeStyle = '#0F172A';
  ctx.stroke();
}

function drawFunnelCasing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number
): void {
  // Shadow
  ctx.fillStyle = 'rgba(5, 10, 20, 0.5)';
  ctx.beginPath();
  ctx.ellipse(cx + 1.2, cy + 1.2, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  const grad = ctx.createLinearGradient(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2);
  grad.addColorStop(0, '#CBD5E1');
  grad.addColorStop(0.5, '#64748B');
  grad.addColorStop(1, '#1E293B');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = '#090D16';
  ctx.stroke();

  // Signature Royal Navy Admiralty red-and-black funnel casing ring & soot cowl
  ctx.strokeStyle = '#B91C1C';
  ctx.lineWidth = Math.max(0.55, w * 0.1);
  ctx.beginPath();
  ctx.ellipse(cx, cy, w * 0.41, h * 0.41, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Iconic Admiralty black top cowl & twin turbine uptakes
  ctx.fillStyle = '#090D16';
  ctx.beginPath();
  ctx.ellipse(cx, cy - h * 0.06, w * 0.36, h * 0.34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.arc(cx - w * 0.1, cy - h * 0.08, Math.max(0.5, w * 0.12), 0, Math.PI * 2);
  ctx.arc(cx + w * 0.1, cy - h * 0.08, Math.max(0.5, w * 0.12), 0, Math.PI * 2);
  ctx.fill();
}

function drawHelipad(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  ringColor = '#F8FAFC'
): void {
  // Non-slip dark flight deck mat
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 1.4);
  ctx.fill();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 0.45;
  ctx.stroke();

  // Perimeter yellow/white warning line
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.7)';
  ctx.lineWidth = 0.4;
  ctx.strokeRect(cx - w / 2 + 1, cy - h / 2 + 1, w - 2, h - 2);

  // Landing circle
  const rad = Math.min(w, h) * 0.33;
  ctx.strokeStyle = ringColor;
  ctx.lineWidth = 0.75;
  ctx.beginPath();
  ctx.arc(cx, cy, rad, 0, Math.PI * 2);
  ctx.stroke();

  // Crisp 'H' inside circle
  const hs = rad * 0.45;
  ctx.beginPath();
  ctx.moveTo(cx - hs, cy - hs);
  ctx.lineTo(cx - hs, cy + hs);
  ctx.moveTo(cx + hs, cy - hs);
  ctx.lineTo(cx + hs, cy + hs);
  ctx.moveTo(cx - hs, cy);
  ctx.lineTo(cx + hs, cy);
  ctx.stroke();
}

function drawDeckLynx(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale = 1): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(0.8, 0.8, 1.4, 3.6, 0, 0, Math.PI * 2);
  ctx.fill();
  // Fuselage
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.ellipse(0, 0.5, 1.3, 3.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#64748B';
  ctx.fillRect(-0.5, -4.5, 1, 3); // tail boom
  // Folded / crossed rotor blades
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 0.45;
  ctx.beginPath();
  ctx.moveTo(-2.8, -1.8);
  ctx.lineTo(2.8, 2.2);
  ctx.moveTo(2.8, -1.8);
  ctx.lineTo(-2.8, 2.2);
  ctx.stroke();
  ctx.restore();
}

function drawLifeBoat(ctx: CanvasRenderingContext2D, x: number, y: number, len = 4.2, color = '#F1F5F9'): void {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(x + 0.5, y + 0.5, 1.1, len / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, 1.0, len / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 0.35;
  ctx.stroke();
  ctx.restore();
}

function drawType965Lattice(ctx: CanvasRenderingContext2D, cx: number, cy: number, width: number): void {
  // Cast shadow
  ctx.fillStyle = 'rgba(4, 10, 20, 0.45)';
  ctx.fillRect(cx - width / 2 + 1, cy - 1 + 1.2, width, 2.2);
  // White/grey rectangular bedstead radar truss
  ctx.fillStyle = '#94A3B8';
  ctx.fillRect(cx - width / 2, cy - 1, width, 2);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 0.4;
  ctx.strokeRect(cx - width / 2, cy - 1, width, 2);
  for (let x = cx - width / 2 + 1.5; x < cx + width / 2; x += 2) {
    ctx.beginPath();
    ctx.moveTo(x, cy - 1);
    ctx.lineTo(x, cy + 1);
    ctx.stroke();
  }
}

function drawDeckTurretGun(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, barrelLen: number): void {
  // Circular barbette ring
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.arc(cx, cy, r + 0.75, 0, Math.PI * 2);
  ctx.fill();

  // Realistic angular faceted Vickers 4.5-inch Mk.8 Stealth Cupola
  const g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  g.addColorStop(0, '#F1F5F9');
  g.addColorStop(0.55, '#94A3B8');
  g.addColorStop(1, '#475569');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.65, cy - r);
  ctx.lineTo(cx + r * 0.65, cy - r);
  ctx.lineTo(cx + r, cy);
  ctx.lineTo(cx + r * 0.52, cy + r * 1.12);
  ctx.lineTo(cx - r * 0.52, cy + r * 1.12);
  ctx.lineTo(cx - r, cy);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 0.45;
  ctx.stroke();

  // Tapered naval gun barrel & muzzle brake pointing forward
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 0.85;
  ctx.beginPath();
  ctx.moveTo(cx, cy + r * 0.75);
  ctx.lineTo(cx, cy + r + barrelLen);
  ctx.stroke();
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(cx, cy + r + barrelLen, 0.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawBowBreakwater(ctx: CanvasRenderingContext2D, cx: number, y: number, halfW: number): void {
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 0.75;
  ctx.beginPath();
  ctx.moveTo(cx - halfW, y - 2.5);
  ctx.lineTo(cx, y);
  ctx.lineTo(cx + halfW, y - 2.5);
  ctx.stroke();
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 0.4;
  ctx.beginPath();
  ctx.moveTo(cx - halfW, y - 1.8);
  ctx.lineTo(cx, y + 0.7);
  ctx.lineTo(cx + halfW, y - 1.8);
  ctx.stroke();
}

function drawCranesOnDeck(ctx: CanvasRenderingContext2D, x: number, y: number, tipX: number, tipY: number): void {
  // Cast shadow
  ctx.strokeStyle = 'rgba(0,0,0,0.45)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x + 1.2, y + 1.2);
  ctx.lineTo(tipX + 1.2, tipY + 1.2);
  ctx.stroke();
  // Turntable pedestal
  drawSphereRadome(ctx, x, y, 1.8);
  // Lattice boom
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();
  ctx.strokeStyle = '#FEF3C7';
  ctx.lineWidth = 0.45;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();
}

// =========================================================================
// 1. REALISTIC ROYAL NAVY & RFA WARSHIPS (11 DISTINCT CLASSES)
// =========================================================================

// Class 1: Castle / Island Class Offshore Patrol Vessel (HMS Leeds Castle)
export function buildHiResPatrolBoat(): CompiledSprite {
  const w = 22;
  const h = 50;
  const cx = w / 2;
  return compileCenital(w, h, (ctx) => {
    drawCurvedWarshipHull(ctx, cx, 3, 47, 6.8, 0.72, '#94A3B8', '#475569');
    drawHelipad(ctx, cx, 10, 9.2, 10);
    drawSuperstructureBlock(ctx, cx - 4.4, 16, 8.8, 16, 1.6, '#CBD5E1');
    drawFunnelCasing(ctx, cx, 21.5, 4.2, 4.6);
    // Bridge glass arc
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(cx - 3.6, 29.5, 7.2, 1.6, 0.6);
    ctx.fill();
    drawLifeBoat(ctx, cx - 4.8, 22, 4.4, '#F97316');
    drawLifeBoat(ctx, cx + 4.8, 22, 4.4, '#F97316');
    drawBowBreakwater(ctx, cx, 38.5, 3.8);
    drawForecastleAnchorGear(ctx, cx, 41.2, 4.5);
    drawDeckTurretGun(ctx, cx, 35.5, 1.5, 2.8);
    drawLifeRaftPods(ctx, cx - 5.2, 26, 2);
    drawLifeRaftPods(ctx, cx + 5.2, 26, 2);
    drawDeckUnionJack(ctx, cx, 18.2, 4.2, 2.5);
    drawHullPennantNumber(ctx, cx, 44.2, 'HMS P265');
  });
}

// Class 2: HMS Endurance / Hecla Class Polar & Survey Ship
export function buildHiResMinesweeper(): CompiledSprite {
  const w = 24;
  const h = 58;
  const cx = w / 2;
  return compileCenital(w, h, (ctx) => {
    // Iconic red-orange icebreaker hull band (HMS Endurance)
    drawCurvedWarshipHull(ctx, cx, 3, 55, 7.6, 0.74, '#DC2626', '#7F1D1D');
    drawHelipad(ctx, cx, 11.5, 10.6, 11, '#FDE047');
    drawSuperstructureBlock(ctx, cx - 5.2, 19, 10.4, 19, 1.8, '#F8FAFC');
    drawFunnelCasing(ctx, cx, 26, 4.8, 5.2);
    // Twin orange motor launches
    drawLifeBoat(ctx, cx - 5.4, 25, 5.2, '#FB923C');
    drawLifeBoat(ctx, cx + 5.4, 25, 5.2, '#FB923C');
    // Bridge & radar
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(cx - 4, 35, 8, 1.8);
    drawSphereRadome(ctx, cx, 31.5, 1.8);
    drawAAMount(ctx, cx - 4.4, 39.5);
    drawAAMount(ctx, cx + 4.4, 39.5);
    // Forward deck crane & anchor capstans
    drawCranesOnDeck(ctx, cx - 2.5, 43, cx + 2.5, 47.5);
    drawBowBreakwater(ctx, cx, 49.5, 4);
    drawForecastleAnchorGear(ctx, cx, 51.5, 4.8);
    drawHullPennantNumber(ctx, cx, 53.5, 'A171');
  });
}

// Class 3: Type 12M Rothesay Frigate (HMS Plymouth / HMS Yarmouth)
export function buildHiResCorvette(): CompiledSprite {
  const w = 26;
  const h = 72;
  const cx = w / 2;
  return compileCenital(w, h, (ctx) => {
    drawCurvedWarshipHull(ctx, cx, 3.5, 68.5, 8.6, 0.64, '#94A3B8', '#3E4C5E');
    // Aft Limbo ASW mortar well & small helipad
    drawHelipad(ctx, cx, 12, 10.5, 12.5);
    drawSuperstructureBlock(ctx, cx - 5.2, 20, 10.4, 28, 1.8, '#CBD5E1');
    drawFunnelCasing(ctx, cx, 29, 5.2, 6);
    drawSphereRadome(ctx, cx, 23, 2);
    drawType965Lattice(ctx, cx, 36.5, 8.5);
    drawBridgeWingTier(ctx, cx, 42.5, 6.8, 4.4, 9.2);
    drawLifeBoat(ctx, cx - 6, 33, 4.8);
    drawLifeBoat(ctx, cx + 6, 33, 4.8);
    drawLifeRaftPods(ctx, cx - 5.6, 25, 2);
    drawLifeRaftPods(ctx, cx + 5.6, 25, 2);
    drawDeckTurretGun(ctx, cx, 53.5, 2.3, 4.2);
    drawBowBreakwater(ctx, cx, 59, 4.8);
    drawForecastleAnchorGear(ctx, cx, 61.5, 5.2);
    drawDeckUnionJack(ctx, cx, 21.5, 4.4, 2.6);
    drawRoyalNavyRoundel(ctx, cx, 48.8, 1.5);
    drawHullPennantNumber(ctx, cx, 64.5, 'HMS F126');
  });
}

// Class 4: Type 21 Amazon-Class Frigate (HMS Ardent / HMS Antelope)
export function buildHiResType21Frigate(): CompiledSprite {
  const w = 28;
  const h = 82;
  const cx = w / 2;
  return compileCenital(w, h, (ctx) => {
    drawCurvedWarshipHull(ctx, cx, 4, 78, 9.5, 0.65, '#94A3B8', '#364354');
    drawHelipad(ctx, cx, 13.5, 12.2, 14.5);
    drawDeckLynx(ctx, cx, 13.5, 0.9);

    drawSuperstructureBlock(ctx, cx - 5.8, 22.5, 11.6, 31, 2.0, '#CBD5E1');
    drawFunnelCasing(ctx, cx, 34, 6.4, 6.8);
    drawType965Lattice(ctx, cx, 41.5, 9.6);
    drawSphereRadome(ctx, cx, 26.5, 2.1);

    drawBridgeWingTier(ctx, cx, 48, 7.6, 4.8, 10.4);

    drawLifeBoat(ctx, cx - 6.8, 36, 5.2, '#F97316');
    drawLifeBoat(ctx, cx + 6.8, 36, 5.2, '#F97316');
    drawAAMount(ctx, cx - 6.8, 43.5);
    drawAAMount(ctx, cx + 6.8, 43.5);
    drawLifeRaftPods(ctx, cx - 6.2, 26.5, 2);
    drawLifeRaftPods(ctx, cx + 6.2, 26.5, 2);

    // Angled Exocet MM38 cylindrical pods ahead of bridge
    drawAngledExocetPods(ctx, cx, 56.8, 2.7);

    drawDeckTurretGun(ctx, cx, 62.8, 2.2, 4.2);
    drawBowBreakwater(ctx, cx, 68.5, 5);
    drawForecastleAnchorGear(ctx, cx, 71, 5.5);
    drawDeckUnionJack(ctx, cx, 24.0, 4.8, 2.8);
    drawRoyalNavyRoundel(ctx, cx, 53.6, 1.6);
    drawHullPennantNumber(ctx, cx, 74, 'HMS F184');
  });
}

// Class 5: Type 42 Guided Missile Destroyer (HMS Sheffield D80 / HMS Coventry D118)
export function buildHiResType42Destroyer(): CompiledSprite {
  const w = 32;
  const h = 92;
  const cx = w / 2;
  return compileCenital(w, h, (ctx) => {
    drawCurvedWarshipHull(ctx, cx, 4, 88, 10.8, 0.62, '#94A3B8', '#334155');
    drawHelipad(ctx, cx, 14.5, 13.6, 16, '#FACC15');
    drawDeckLynx(ctx, cx, 14.5, 1.0);

    drawSuperstructureBlock(ctx, cx - 6.6, 24.5, 13.2, 35, 2.2, '#CBD5E1');
    drawType965Lattice(ctx, cx, 28, 12.2);
    drawSphereRadome(ctx, cx, 35.5, 2.9);
    drawSphereRadome(ctx, cx, 50.5, 2.9);
    drawFunnelCasing(ctx, cx, 43, 7.6, 6.8);

    drawBridgeWingTier(ctx, cx, 54.5, 8.4, 5.0, 11.8);
    drawDeckUnionJack(ctx, cx, 26.2, 5.4, 3.0);
    drawRoyalNavyRoundel(ctx, cx - 3.6, 60.5, 1.6);
    drawRoyalNavyRoundel(ctx, cx + 3.6, 60.5, 1.6);

    drawLifeBoat(ctx, cx - 7.5, 41, 5.8);
    drawLifeBoat(ctx, cx + 7.5, 41, 5.8);
    drawAAMount(ctx, cx - 7.4, 48.5);
    drawAAMount(ctx, cx + 7.4, 48.5);
    drawLifeRaftPods(ctx, cx - 7, 31, 3);
    drawLifeRaftPods(ctx, cx + 7, 31, 3);

    // Sleek rotating Sea Dart twin-arm launcher base + cylindrical missiles
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(cx, 64.5, 2.8, 0, Math.PI * 2);
    ctx.fill();
    for (const mx of [-1.45, 1.45]) {
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.roundRect(cx + mx - 0.6, 62.4, 1.2, 4.8, 0.5);
      ctx.fill();
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.arc(cx + mx, 66.8, 0.58, 0, Math.PI * 2);
      ctx.fill();
    }

    drawDeckTurretGun(ctx, cx, 71.5, 2.2, 4.4);
    drawBowBreakwater(ctx, cx, 78, 5.6);
    drawForecastleAnchorGear(ctx, cx, 80.5, 6);
    drawHullPennantNumber(ctx, cx, 83.5, 'HMS D80');
  });
}

// Class 6: RFA Sir Galahad / Sir Tristram Logistic Landing Ship (LSL)
export function buildHiResAssaultShip(): CompiledSprite {
  const w = 36;
  const h = 84;
  const cx = w / 2;
  return compileCenital(w, h, (ctx) => {
    drawCurvedWarshipHull(ctx, cx, 4, 80, 12.8, 0.78, '#64748B', '#2C3A47');

    drawSuperstructureBlock(ctx, cx - 9.4, 7.5, 18.8, 15.5, 1.8, '#F1F5F9');
    drawFunnelCasing(ctx, cx, 12, 5.6, 4.5);
    drawBridgeWingTier(ctx, cx, 19.8, 8.6, 3.2, 13.0);

    drawLifeBoat(ctx, cx - 10.2, 13, 5.4, '#F8FAFC');
    drawLifeBoat(ctx, cx + 10.2, 13, 5.4, '#F8FAFC');

    // Broad open cargo well deck with curved side coamings
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(cx - 9.4, 25.5, 18.8, 37, 2.6);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Realistic military Bedford trucks (cab nose + curved tarpaulin bed hoops)
    const trucks = [
      { x: cx - 7.3, y: 28.5, w: 5.2, h: 8.2, col: '#4D5E36' },
      { x: cx + 2.1, y: 29.5, w: 5.2, h: 8.2, col: '#8D7D59' },
      { x: cx - 7.3, y: 40.0, w: 5.2, h: 8.2, col: '#8D7D59' },
      { x: cx + 2.1, y: 41.0, w: 5.2, h: 8.2, col: '#4D5E36' },
    ];
    for (const t of trucks) {
      ctx.fillStyle = 'rgba(0,0,0,0.42)';
      ctx.beginPath();
      ctx.roundRect(t.x + 0.9, t.y + 0.9, t.w, t.h, 1.1);
      ctx.fill();

      // Canvas bed + structural tilt ribs
      ctx.fillStyle = t.col;
      ctx.beginPath();
      ctx.roundRect(t.x, t.y, t.w, t.h - 2.2, 1.0);
      ctx.fill();
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.35)';
      ctx.lineWidth = 0.35;
      for (const ry of [t.y + 1.8, t.y + 3.6]) {
        ctx.beginPath();
        ctx.moveTo(t.x + 0.4, ry);
        ctx.lineTo(t.x + t.w - 0.4, ry);
        ctx.stroke();
      }
      // Forward truck cab & windshield
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(t.x + 0.3, t.y + t.h - 2.6, t.w - 0.6, 2.5, 0.8);
      ctx.fill();
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(t.x + 0.8, t.y + t.h - 1.2, t.w - 1.6, 0.8);
    }

    drawCranesOnDeck(ctx, cx - 9, 34, cx - 1, 43);
    drawCranesOnDeck(ctx, cx + 9, 46, cx + 1.5, 55);

    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(cx - 5.5, 67);
    ctx.quadraticCurveTo(cx, 72.5, cx + 5.5, 67);
    ctx.stroke();
    drawDeckUnionJack(ctx, cx, 69.5, 6.2, 3.6);
    drawHullPennantNumber(ctx, cx, 75.5, 'RFA L3005');
  });
}

// Class 7: RFA Fleet Replenishment Tanker (RFA Tidespring / RFA Olmeda)
export function buildHiResSupplyTanker(): CompiledSprite {
  const w = 32;
  const h = 90;
  const cx = w / 2;
  return compileCenital(w, h, (ctx) => {
    drawCurvedWarshipHull(ctx, cx, 4, 86, 11.4, 0.7, '#475569', '#3B2F2F');
    // Aft RFA bridge tower & helipad
    drawHelipad(ctx, cx, 11.5, 13.5, 11.5);
    drawSuperstructureBlock(ctx, cx - 8.5, 19, 17, 13, 1.6, '#F1F5F9');
    drawFunnelCasing(ctx, cx, 23, 5.4, 4.6);

    // Long tanker cargo deck with manifold pipes & central raised catwalk
    ctx.strokeStyle = '#991B1B';
    ctx.lineWidth = 0.75;
    for (const ox of [-5.2, -3.4, 3.4, 5.2]) {
      ctx.beginPath();
      ctx.moveTo(cx + ox, 33);
      ctx.lineTo(cx + ox, 70);
      ctx.stroke();
    }
    // Central raised steel catwalk
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(cx - 1.2, 33, 2.4, 39);

    // Twin Replenishment-At-Sea (RAS) derrick goalposts amidships
    drawSuperstructureBlock(ctx, cx - 8.2, 42, 16.4, 3.2, 0.6, '#CBD5E1', 1);
    drawSuperstructureBlock(ctx, cx - 8.2, 57, 16.4, 3.2, 0.6, '#CBD5E1', 1);
    drawCranesOnDeck(ctx, cx - 6, 49, cx + 3, 53);

    // Forward forecastle mast & breakwater + RFA Union Jack recognition panel
    drawDeckUnionJack(ctx, cx, 77, 5.6, 3.2);
    drawHullPennantNumber(ctx, cx, 82, 'RFA A76');
    drawBowBreakwater(ctx, cx, 74, 5.5);
  });
}

// Class 8: Type 22 Batch 1 Frigate Boss (HMS Brilliant / HMS Broadsword)
export function buildHiResBossFrigate(): CompiledSprite {
  const w = 36;
  const h = 104;
  const cx = w / 2;
  return compileCenital(w, h, (ctx) => {
    drawCurvedWarshipHull(ctx, cx, 4, 100, 12.5, 0.66, '#94A3B8', '#334155');
    drawHelipad(ctx, cx, 16, 15.8, 19, '#FDE047');
    drawDeckLynx(ctx, cx - 2.6, 15.5, 1.0);
    drawDeckLynx(ctx, cx + 2.6, 17.5, 0.95);

    // Wide twin-hangar stealthy Type 22 superstructure
    drawSuperstructureBlock(ctx, cx - 7.8, 28, 15.6, 40, 2.2, '#CBD5E1');
    // Twin Type 910 Sea Wolf tracker radomes
    drawSphereRadome(ctx, cx - 2.8, 35, 2.4);
    drawSphereRadome(ctx, cx + 2.8, 56, 2.4);
    // Double funnel arrangement
    drawFunnelCasing(ctx, cx - 2.5, 45, 4.4, 6.5);
    drawFunnelCasing(ctx, cx + 2.5, 45, 4.4, 6.5);
    drawType965Lattice(ctx, cx, 50.5, 13);

    // Wide bridge wings
    drawBridgeWingTier(ctx, cx, 61.5, 9.6, 5.4, 13.8);

    // Angled Exocet MM38 canisters & 6-cell Sea Wolf mount
    drawAngledExocetPods(ctx, cx, 73.2, 3.6);
    drawAAMount(ctx, cx - 8.2, 55);
    drawAAMount(ctx, cx + 8.2, 55);
    drawLifeRaftPods(ctx, cx - 8.2, 34, 3);
    drawLifeRaftPods(ctx, cx + 8.2, 34, 3);
    drawDeckTurretGun(ctx, cx, 79, 2.6, 3.6);
    drawBowBreakwater(ctx, cx, 87, 6.4);
    drawForecastleAnchorGear(ctx, cx, 90.5, 7);
    drawDeckUnionJack(ctx, cx, 31, 6.4, 3.6);
    drawRoyalNavyRoundel(ctx, cx, 70.5, 1.8);
    drawHullPennantNumber(ctx, cx, 94.5, 'HMS F90');
  });
}

// Class 9: Amphibious Assault Dock Ship LPD Boss (HMS Fearless L10 / HMS Intrepid)
export function buildHiResBossAssault(): CompiledSprite {
  const w = 44;
  const h = 110;
  const cx = w / 2;
  return compileCenital(w, h, (ctx) => {
    drawCurvedWarshipHull(ctx, cx, 4, 106, 16.5, 0.84, '#64748B', '#283546');

    ctx.fillStyle = '#0B2B4B';
    ctx.fillRect(cx - 8.5, 6, 17, 15);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(cx - 8.5, 6, 17, 15);
    for (const lx of [cx - 6.8, cx + 1.0]) {
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.roundRect(lx, 8.5, 5.8, 10.2, 1.4);
      ctx.fill();
    }

    drawHelipad(ctx, cx - 5.5, 30, 10.5, 15, '#F8FAFC');
    drawHelipad(ctx, cx + 5.5, 30, 10.5, 15, '#F8FAFC');
    drawDeckLynx(ctx, cx + 5.5, 30, 1.15);

    drawSuperstructureBlock(ctx, cx - 11.2, 41, 22.4, 34, 2.4, '#CBD5E1');
    drawFunnelCasing(ctx, cx - 4.5, 51, 5.8, 6.2);
    drawFunnelCasing(ctx, cx + 4.5, 51, 5.8, 6.2);
    drawType965Lattice(ctx, cx, 58.5, 15);
    drawSphereRadome(ctx, cx, 66, 2.8);
    drawDeckUnionJack(ctx, cx, 44.5, 7.6, 4.2);

    drawLifeBoat(ctx, cx - 13, 47, 6.8, '#475569');
    drawLifeBoat(ctx, cx - 13, 57, 6.8, '#475569');
    drawLifeBoat(ctx, cx + 13, 47, 6.8, '#475569');
    drawLifeBoat(ctx, cx + 13, 57, 6.8, '#475569');
    drawAAMount(ctx, cx - 12, 76);
    drawAAMount(ctx, cx + 12, 76);

    drawBridgeWingTier(ctx, cx, 69, 13.6, 5.6, 18.8);
    drawCranesOnDeck(ctx, cx - 6, 80, cx + 2, 85);
    drawDeckTurretGun(ctx, cx + 5, 86, 2.2, 3.4);
    drawBowBreakwater(ctx, cx, 93, 8.2);
    drawForecastleAnchorGear(ctx, cx, 97, 8.5);
    drawHullPennantNumber(ctx, cx, 101.5, 'HMS L10');
  });
}

// Class 10: Heavy Guided-Missile Destroyer Boss (Type 82 HMS Bristol / HMS Glamorgan)
export function buildHiResBossDestroyer(): CompiledSprite {
  const w = 40;
  const h = 118;
  const cx = w / 2;
  return compileCenital(w, h, (ctx) => {
    drawCurvedWarshipHull(ctx, cx, 4, 114, 14.2, 0.62, '#94A3B8', '#2E3C4F');

    drawHelipad(ctx, cx, 17, 17, 18.5, '#FACC15');
    drawDeckLynx(ctx, cx, 17, 1.1);

    drawSuperstructureBlock(ctx, cx - 8.5, 29.5, 17, 49, 2.4, '#CBD5E1');
    drawType965Lattice(ctx, cx, 34, 15);
    drawSphereRadome(ctx, cx, 43, 3.4);
    drawFunnelCasing(ctx, cx, 52, 8.5, 7.5);
    drawFunnelCasing(ctx, cx, 63, 7.8, 6.8);
    drawSphereRadome(ctx, cx, 71, 3.2);
    drawDeckUnionJack(ctx, cx, 38, 7.0, 3.8);

    drawBridgeWingTier(ctx, cx, 74, 10.8, 5.6, 15.8);

    drawLifeBoat(ctx, cx - 9.6, 48, 6.5);
    drawLifeBoat(ctx, cx + 9.6, 48, 6.5);
    drawLifeBoat(ctx, cx - 9.6, 61, 6.5);
    drawLifeBoat(ctx, cx + 9.6, 61, 6.5);
    drawAAMount(ctx, cx - 9.6, 69);
    drawAAMount(ctx, cx + 9.6, 69);
    drawLifeRaftPods(ctx, cx - 9.5, 36, 3);
    drawLifeRaftPods(ctx, cx + 9.5, 36, 3);

    drawDeckTurretGun(ctx, cx, 85, 2.8, 4.8);
    drawDeckTurretGun(ctx, cx, 94.5, 2.4, 4.4);
    drawBowBreakwater(ctx, cx, 102, 6.6);
    drawForecastleAnchorGear(ctx, cx, 105.5, 6.8);
    drawHullPennantNumber(ctx, cx, 109.5, 'HMS D118');
  });
}

// Class 11: Light Fleet Aircraft Carrier Boss (HMS Invincible R05 / HMS Hermes R12)
export function buildHiResCarrierBoss(): CompiledSprite {
  const w = 58;
  const h = 136;
  const cx = w / 2;
  return compileCenital(w, h, (ctx) => {
    drawCurvedWarshipHull(ctx, cx, 4, 132, 22, 0.72, '#64748B', '#1E293B');

    // Smooth curved Invincible-class flight deck silhouette
    const deckPath = () => {
      ctx.beginPath();
      ctx.moveTo(cx - 18, 7.5);
      ctx.lineTo(cx + 19, 7.5);
      ctx.quadraticCurveTo(cx + 23.5, 13, cx + 23.5, 23);
      ctx.lineTo(cx + 23.5, 84);
      ctx.bezierCurveTo(cx + 21.5, 104, cx + 15.0, 118, cx + 7.5, 127);
      ctx.quadraticCurveTo(cx - 3.5, 128.5, cx - 14.5, 127);
      ctx.bezierCurveTo(cx - 21.0, 112, cx - 24.5, 96, cx - 24.5, 82);
      ctx.lineTo(cx - 24.5, 21);
      ctx.quadraticCurveTo(cx - 23.5, 11, cx - 18, 7.5);
      ctx.closePath();
    };

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    deckPath();
    const deckGrad = ctx.createLinearGradient(cx - 24, 7, cx + 24, 127);
    deckGrad.addColorStop(0, '#475569');
    deckGrad.addColorStop(0.35, '#293545');
    deckGrad.addColorStop(0.8, '#1E293B');
    deckGrad.addColorStop(1, '#111827');
    ctx.fillStyle = deckGrad;
    ctx.fill();
    ctx.restore();

    deckPath();
    ctx.lineWidth = 0.9;
    ctx.strokeStyle = '#94A3B8';
    ctx.stroke();

    ctx.save();
    deckPath();
    ctx.clip();

    // Bow 7-degree Ski-Jump ramp with curved transition
    ctx.fillStyle = '#334155';
    ctx.fillRect(cx - 13.5, 115, 20, 11);
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(cx - 13.5, 121.5, 20, 2.0);
    ctx.fillStyle = '#FACC15';
    ctx.fillRect(cx - 13.5, 123.8, 20, 2.0);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
    ctx.lineWidth = 0.45;
    for (let y = 14; y < 120; y += 8) {
      ctx.beginPath();
      ctx.moveTo(cx - 24, y);
      ctx.lineTo(cx + 24, y);
      ctx.stroke();
    }

    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(cx - 20, 14);
    ctx.lineTo(cx - 20, 88);
    ctx.moveTo(cx + 9.5, 12);
    ctx.lineTo(cx + 9.5, 110);
    ctx.stroke();

    ctx.strokeStyle = '#F8FAFC';
    ctx.lineWidth = 1.4;
    ctx.setLineDash([4.5, 4.5]);
    ctx.beginPath();
    ctx.moveTo(cx - 4, 14);
    ctx.lineTo(cx - 6, 118);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 0.75;
    ctx.strokeRect(cx - 12, 22, 11.5, 12.5);
    ctx.strokeRect(cx - 14, 82, 11.5, 11.5);

    drawDeckUnionJack(ctx, cx - 6.5, 105, 10.5, 5.8);
    drawRoyalNavyRoundel(ctx, cx - 6, 48, 2.8);
    drawHullPennantNumber(ctx, cx - 14.5, 15, 'HMS R05');

    drawSuperstructureBlock(ctx, cx + 11.5, 36, 11, 50, 2.0, '#E2E8F0', 2.2);
    drawFunnelCasing(ctx, cx + 17, 48, 5.2, 6.2);
    drawFunnelCasing(ctx, cx + 17, 62, 5.2, 6.2);
    drawSphereRadome(ctx, cx + 17, 40, 2.3);
    drawSphereRadome(ctx, cx + 17, 73, 2.3);
    drawType965Lattice(ctx, cx + 17, 55, 8);
    ctx.fillStyle = '#090D16';
    ctx.fillRect(cx + 13, 81, 8, 2);

    // Realistic Curved Sea Harrier FRS.1 jets parked in echelon along port flight deck
    for (const [hx, hy] of [
      [cx - 17, 44],
      [cx - 17, 59],
      [cx - 16, 74],
    ]) {
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.beginPath();
      ctx.moveTo(hx + 1, hy + 6);
      ctx.quadraticCurveTo(hx + 5.5, hy + 1, hx + 5.0, hy - 1.5);
      ctx.lineTo(hx - 4.2, hy - 1.5);
      ctx.quadraticCurveTo(hx - 4.5, hy + 1, hx + 1, hy + 6);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#64748B';
      ctx.beginPath();
      ctx.moveTo(hx, hy + 5.5);
      ctx.bezierCurveTo(hx + 1.5, hy + 2.5, hx + 5.0, hy, hx + 4.8, hy - 1.5);
      ctx.lineTo(hx + 1.1, hy - 1.2);
      ctx.lineTo(hx + 2.4, hy - 4.2);
      ctx.lineTo(hx - 2.4, hy - 4.2);
      ctx.lineTo(hx - 1.1, hy - 1.2);
      ctx.lineTo(hx - 4.8, hy - 1.5);
      ctx.bezierCurveTo(hx - 5.0, hy, hx - 1.5, hy + 2.5, hx, hy + 5.5);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.ellipse(hx, hy + 2.0, 0.55, 1.35, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.roundRect(cx + 4, 24, 3.2, 2.2, 0.7);
    ctx.fill();
    drawCranesOnDeck(ctx, cx + 11, 90, cx + 4, 96);
    drawAAMount(ctx, cx - 21, 30);
    drawAAMount(ctx, cx + 19, 102);

    ctx.restore();
  });
}

// =========================================================================
// 2. DIVERSE TOP-DOWN MALVINAS LANDFORMS (10 UNIQUE ARCHETYPES, ZERO REPETITION!)
// =========================================================================

interface IslandZone {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  phase: number;
  freqA: number;
  freqB: number;
  coveAngle?: number;
  coveDepth?: number;
}

function hash2(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  return n - Math.floor(n);
}

// Smooth bilinear value noise + multi-octave FBM for realistic aerial Malvinas geography
function smoothValueNoise(x: number, y: number, seed: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  const a = hash2(ix, iy, seed);
  const b = hash2(ix + 1, iy, seed);
  const c = hash2(ix, iy + 1, seed);
  const d = hash2(ix + 1, iy + 1, seed);

  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm2(x: number, y: number, seed: number): number {
  let val = 0;
  let amp = 0.52;
  let freq = 1.0;
  for (let o = 0; o < 4; o++) {
    val += amp * smoothValueNoise(x * freq, y * freq, seed + o * 13.7);
    freq *= 2.08;
    amp *= 0.48;
  }
  return val;
}

function buildCenitalMalvinasLand(
  w: number,
  h: number,
  seed: number,
  zones: IslandZone[],
  drawExtras: (ctx: CanvasRenderingContext2D) => void
): CompiledSprite {
  // Render organic landmass at 2x resolution so Malvinas fjords, peat & quartzite stone runs look photographic
  const texW = w * 2;
  const texH = h * 2;

  return compileCenital(
    w,
    h,
    (ctx) => {
      const off = document.createElement('canvas');
      off.width = texW;
      off.height = texH;
      const octx = off.getContext('2d')!;
      const img = octx.createImageData(texW, texH);
      const data = img.data;

      // Precompute FBM field for fast NW-slope calculation and smooth fjord shaping
      const elevGrid = new Float32Array(texW * texH);
      const detailGrid = new Float32Array(texW * texH);

      for (let py = 0; py < texH; py++) {
        for (let px = 0; px < texW; px++) {
          const x = px * 0.5;
          const y = py * 0.5;

          // Multi-scale FBM warping produces jagged Malvinas inlets, creeks & drowned valleys
          const warpX = (fbm2(x * 0.055, y * 0.055, seed + 1.3) - 0.5) * 14;
          const warpY = (fbm2(x * 0.055, y * 0.055, seed + 7.9) - 0.5) * 14;
          const wx = x + warpX;
          const wy = y + warpY;

          let best = -1.2;
          for (const z of zones) {
            const dx = (wx - z.cx) / z.rx;
            const dy = (wy - z.cy) / z.ry;
            const dist = Math.hypot(dx, dy);
            const ang = Math.atan2(dy, dx);

            let mod =
              1 +
              0.16 * Math.sin(ang * z.freqA + z.phase) +
              0.09 * Math.cos(ang * z.freqB - z.phase * 1.6);

            if (z.coveAngle !== undefined && z.coveDepth) {
              let ad = ang - z.coveAngle;
              while (ad > Math.PI) ad -= Math.PI * 2;
              while (ad < -Math.PI) ad += Math.PI * 2;
              mod -= z.coveDepth * Math.exp(-(ad * ad) / 0.34);
            }
            const e = 1 - dist / mod;
            if (e > best) best = e;
          }

          const ridgeFbm = fbm2(x * 0.085, y * 0.085, seed + 19.4);
          const microFbm = fbm2(x * 0.24, y * 0.24, seed + 41.2);
          // Combine coastline shape + ridge relief interior
          const coastPerturb = (ridgeFbm - 0.5) * 0.24 + (microFbm - 0.5) * 0.09;
          const mountainBoost = best > 0.14 ? Math.max(0, ridgeFbm - 0.32) * 0.42 : 0;
          elevGrid[py * texW + px] = best + coastPerturb + mountainBoost;
          detailGrid[py * texW + px] = microFbm;
        }
      }

      for (let py = 0; py < texH; py++) {
        for (let px = 0; px < texW; px++) {
          const i = py * texW + px;
          const e = elevGrid[i];
          if (e < -0.26) continue;

          const pxNW = Math.max(0, px - 2);
          const pyNW = Math.max(0, py - 2);
          const slope = Math.max(-0.28, Math.min(0.28, e - elevGrid[pyNW * texW + pxNW]));
          const detail = detailGrid[i];
          const grit = hash2(px * 0.45, py * 0.45, seed);
          const idx = i * 4;

          let r = 0;
          let g = 0;
          let b = 0;
          let a = 255;

          if (e < -0.10) {
            // Shallow Atlantic shelf + dark olive submarine kelp beds ("cachiyuyo" characteristic of Malvinas)
            const hasKelp = detail > 0.62 && e > -0.21;
            if (hasKelp) {
              r = 26;
              g = 72;
              b = 64;
              a = Math.round(Math.max(0, (e + 0.26) / 0.16) * 185);
            } else {
              r = 18;
              g = 92;
              b = 128;
              a = Math.round(Math.max(0, (e + 0.26) / 0.16) * 165);
            }
          } else if (e < 0.0) {
            // Breaking white surf foam along rocky shore + kelp pockets
            const foamWave = Math.sin(e * 95 + detail * 6.5);
            if (foamWave > 0.22) {
              r = 218;
              g = 240;
              b = 252;
              a = 212;
            } else {
              r = 42;
              g = 114;
              b = 148;
              a = 195;
            }
          } else if (e < 0.065) {
            // Pale Malvinas quartz sand beaches alternating with dark wet coastal basalt cliffs
            const cliffBand = detail < 0.42;
            if (cliffBand) {
              r = 76;
              g = 80;
              b = 84;
            } else {
              r = 198;
              g = 188;
              b = 152;
            }
          } else if (e < 0.26) {
            // Coastal tussac grass & dark Malvinas "turba" peat soil bands
            const peatSpot = detail < 0.36;
            if (peatSpot) {
              r = 68;
              g = 56;
              b = 42;
            } else {
              r = 86 + Math.round(grit * 16);
              g = 104 + Math.round(grit * 18);
              b = 58 + Math.round(grit * 10);
            }
          } else if (e < 0.56) {
            // Authentic golden-ochre & olive Malvinas whitegrass ("cortadera" steppe) + dark peat gullies
            const gully = detail < 0.28;
            if (gully) {
              r = 72;
              g = 62;
              b = 46;
            } else {
              r = Math.round(112 + detail * 38);
              g = Math.round(116 + detail * 28);
              b = Math.round(64 + detail * 14);
            }
          } else if (e < 0.78) {
            // Pale grey weathered Malvinas quartzite stone runs ("ríos de piedra") & rocky scree
            const stoneRun = detail > 0.52;
            r = stoneRun ? 156 : 114;
            g = stoneRun ? 162 : 120;
            b = stoneRun ? 158 : 114;
          } else {
            // High windy Malvinas rocky peak crests & faint Antarctic frost streaks
            const frost = detail > 0.68;
            r = frost ? 212 : 168;
            g = frost ? 218 : 172;
            b = frost ? 222 : 166;
          }

          const shade = 1 + slope * 1.95;
          data[idx] = Math.max(0, Math.min(255, Math.round(r * shade)));
          data[idx + 1] = Math.max(0, Math.min(255, Math.round(g * shade)));
          data[idx + 2] = Math.max(0, Math.min(255, Math.round(b * shade)));
          data[idx + 3] = a;
        }
      }

      octx.putImageData(img, 0, 0);
      ctx.drawImage(off, 0, 0, w, h);
      drawExtras(ctx);
    },
    2
  );
}

export function buildAllMalvinasIslands(): CompiledSprite[] {
  return [
    // 0: Twin-peak rugged promontory with winding dirt track & estancia cottage
    buildCenitalMalvinasLand(
      126,
      98,
      1.7,
      [
        { cx: 46, cy: 48, rx: 34, ry: 29, phase: 0.4, freqA: 3, freqB: 5 },
        { cx: 80, cy: 44, rx: 30, ry: 26, phase: 2.1, freqA: 4, freqB: 3 },
        { cx: 64, cy: 66, rx: 24, ry: 18, phase: 1.1, freqA: 2, freqB: 4 },
      ],
      (ctx) => {
        ctx.strokeStyle = '#B8A27A';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(32, 54);
        ctx.bezierCurveTo(48, 44, 66, 56, 86, 42);
        ctx.stroke();
        // Estancia red-roof cottage
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(55, 45, 7, 5);
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(54, 44, 6.5, 4.5);
        ctx.fillStyle = '#B91C1C';
        ctx.fillRect(54, 44, 6.5, 2.2);
      }
    ),

    // 1: Goose Green / Darwin Airfield Peninsula
    buildCenitalMalvinasLand(
      138,
      110,
      3.3,
      [
        { cx: 68, cy: 55, rx: 52, ry: 38, phase: 1.5, freqA: 3, freqB: 4 },
        { cx: 42, cy: 38, rx: 28, ry: 24, phase: 0.8, freqA: 4, freqB: 5 },
        { cx: 96, cy: 70, rx: 28, ry: 23, phase: 2.6, freqA: 3, freqB: 5 },
      ],
      (ctx) => {
        // Gravel airstrip with threshold bars
        ctx.save();
        ctx.translate(68, 52);
        ctx.rotate(-0.14);
        ctx.fillStyle = '#2B333D';
        ctx.fillRect(-26, -5, 52, 10);
        ctx.fillStyle = '#FACC15';
        ctx.fillRect(-25, -4, 1.8, 8);
        ctx.fillRect(23.2, -4, 1.8, 8);
        ctx.fillStyle = '#F8FAFC';
        for (let x = -20; x < 20; x += 6) ctx.fillRect(x, -0.5, 3, 1);
        ctx.restore();
      }
    ),

    // 2: Jagged Archipelago of 4 Basalt Islets (Islas Sebaldes)
    buildCenitalMalvinasLand(
      128,
      96,
      5.1,
      [
        { cx: 30, cy: 34, rx: 20, ry: 18, phase: 0.9, freqA: 4, freqB: 6 },
        { cx: 68, cy: 28, rx: 21, ry: 16, phase: 2.3, freqA: 3, freqB: 5 },
        { cx: 95, cy: 54, rx: 22, ry: 20, phase: 1.2, freqA: 5, freqB: 3 },
        { cx: 52, cy: 68, rx: 19, ry: 16, phase: 3.1, freqA: 4, freqB: 4 },
      ],
      (ctx) => {
        ctx.fillStyle = '#185C54';
        ctx.beginPath();
        ctx.ellipse(48, 48, 9, 4, 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    ),

    // 3: Deep Fjord Coastal Cliff Wall & Road
    buildCenitalMalvinasLand(
      122,
      138,
      7.4,
      [
        { cx: 52, cy: 68, rx: 42, ry: 52, phase: 0.5, freqA: 3, freqB: 5, coveAngle: 0.2, coveDepth: 0.25 },
        { cx: 80, cy: 36, rx: 26, ry: 24, phase: 2.2, freqA: 4, freqB: 3 },
        { cx: 74, cy: 102, rx: 24, ry: 22, phase: 1.7, freqA: 3, freqB: 4 },
      ],
      (ctx) => {
        ctx.strokeStyle = '#C2B086';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(48, 28);
        ctx.bezierCurveTo(60, 52, 42, 76, 56, 108);
        ctx.stroke();
      }
    ),

    // 4: Sheltered Crescent Bay with Timber Jetty & Fishing Boat
    buildCenitalMalvinasLand(
      132,
      102,
      9.2,
      [
        { cx: 64, cy: 50, rx: 48, ry: 36, phase: 0.2, freqA: 2, freqB: 4, coveAngle: 0.15, coveDepth: 0.36 },
        { cx: 50, cy: 28, rx: 26, ry: 18, phase: 1.8, freqA: 3, freqB: 5 },
        { cx: 54, cy: 74, rx: 26, ry: 18, phase: 2.9, freqA: 4, freqB: 3 },
      ],
      (ctx) => {
        ctx.fillStyle = '#785A3A';
        ctx.fillRect(76, 48, 22, 3.2);
        ctx.fillStyle = '#F8FAFC';
        ctx.beginPath();
        ctx.ellipse(90, 55, 4.5, 1.5, 0.1, 0, Math.PI * 2);
        ctx.fill();
      }
    ),

    // 5: Cabo Pembroke Lighthouse Headland
    buildCenitalMalvinasLand(
      124,
      106,
      11.6,
      [
        { cx: 54, cy: 54, rx: 40, ry: 36, phase: 2.0, freqA: 4, freqB: 5 },
        { cx: 88, cy: 52, rx: 24, ry: 16, phase: 0.6, freqA: 3, freqB: 4 },
      ],
      (ctx) => {
        ctx.strokeStyle = '#B8A27A';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(36, 52);
        ctx.lineTo(86, 52);
        ctx.stroke();
        // Red & white lighthouse tower
        drawSphereRadome(ctx, 86, 50, 3.2);
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.arc(86, 50, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    ),

    // 6: Peat Moorland with Freshwater Pond & Winding Stream
    buildCenitalMalvinasLand(
      134,
      112,
      14.1,
      [
        { cx: 66, cy: 56, rx: 48, ry: 40, phase: 1.1, freqA: 3, freqB: 6 },
        { cx: 42, cy: 76, rx: 24, ry: 20, phase: 2.8, freqA: 4, freqB: 3 },
      ],
      (ctx) => {
        // Dark teal interior peat lagoon + winding stream to coast
        ctx.fillStyle = '#144E6B';
        ctx.beginPath();
        ctx.ellipse(62, 52, 13, 8, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#387CA8';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(73, 55);
        ctx.quadraticCurveTo(88, 62, 102, 72);
        ctx.stroke();
      }
    ),

    // 7: Narrow Twin-Headland Tombolo Connected by White Sand Spit
    buildCenitalMalvinasLand(
      142,
      86,
      17.4,
      [
        { cx: 34, cy: 42, rx: 25, ry: 28, phase: 0.7, freqA: 4, freqB: 3 },
        { cx: 108, cy: 44, rx: 26, ry: 28, phase: 2.2, freqA: 3, freqB: 5 },
        { cx: 70, cy: 43, rx: 22, ry: 8, phase: 0.1, freqA: 2, freqB: 3 },
      ],
      (ctx) => {
        ctx.fillStyle = '#D6C8A5';
        ctx.fillRect(54, 41, 32, 3);
      }
    ),

    // 8: Prominent Quartzite "Stone Run" Ridge Island
    buildCenitalMalvinasLand(
      128,
      118,
      20.9,
      [
        { cx: 64, cy: 58, rx: 44, ry: 44, phase: 2.4, freqA: 5, freqB: 4, coveAngle: -0.9, coveDepth: 0.28 },
      ],
      (ctx) => {
        // Signature white/grey Malvinas quartzite stone run river
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 4.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(54, 34);
        ctx.bezierCurveTo(64, 52, 58, 68, 72, 86);
        ctx.stroke();
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
    ),

    // 9: Long Eastern Mainland Coastline Edge with Twin Bays & Road
    buildCenitalMalvinasLand(
      130,
      152,
      24.5,
      [
        { cx: 38, cy: 42, rx: 32, ry: 34, phase: 0.5, freqA: 3, freqB: 4 },
        { cx: 44, cy: 82, rx: 36, ry: 36, phase: 1.9, freqA: 4, freqB: 5, coveAngle: 0.0, coveDepth: 0.24 },
        { cx: 36, cy: 118, rx: 30, ry: 28, phase: 2.7, freqA: 3, freqB: 3 },
      ],
      (ctx) => {
        ctx.strokeStyle = '#B8A27A';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(26, 22);
        ctx.bezierCurveTo(38, 62, 24, 96, 36, 130);
        ctx.stroke();
      }
    ),

    // 10: Monte Longdon & Dos Hermanas Snow-Streaked Basalt Heights
    buildCenitalMalvinasLand(
      146,
      118,
      28.8,
      [
        { cx: 56, cy: 58, rx: 40, ry: 42, phase: 1.3, freqA: 5, freqB: 4 },
        { cx: 96, cy: 52, rx: 36, ry: 34, phase: 2.8, freqA: 4, freqB: 5 },
        { cx: 78, cy: 82, rx: 28, ry: 22, phase: 0.6, freqA: 3, freqB: 6 },
      ],
      (ctx) => {
        // Wind-blown Antarctic frost snow patches along high rocky ridge
        ctx.fillStyle = 'rgba(241, 245, 249, 0.85)';
        ctx.beginPath();
        ctx.ellipse(54, 52, 8, 3.2, -0.4, 0, Math.PI * 2);
        ctx.ellipse(62, 61, 6, 2.5, 0.2, 0, Math.PI * 2);
        ctx.ellipse(94, 50, 7, 2.8, -0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    ),

    // 11: BAM Cóndor Airfield Dispersal with Twin Parked IA-58 Pucará Aircraft
    buildCenitalMalvinasLand(
      150,
      114,
      33.1,
      [
        { cx: 74, cy: 56, rx: 56, ry: 40, phase: 0.4, freqA: 3, freqB: 4, coveAngle: 2.1, coveDepth: 0.2 },
        { cx: 44, cy: 66, rx: 26, ry: 24, phase: 1.9, freqA: 4, freqB: 5 },
      ],
      (ctx) => {
        ctx.save();
        ctx.translate(74, 56);
        ctx.rotate(0.18);
        ctx.fillStyle = '#334155';
        ctx.fillRect(-32, -5.5, 64, 11);
        ctx.fillStyle = '#CBD5E1';
        for (let x = -26; x < 26; x += 7) ctx.fillRect(x, -0.5, 4, 1);
        // Dispersal parking tarmac + two green camo Pucarás on ground!
        ctx.fillStyle = '#475569';
        ctx.fillRect(-20, 6, 24, 9);
        for (const px of [-14, -3]) {
          ctx.fillStyle = '#4D5E36';
          ctx.fillRect(px - 4.5, 9.5, 9, 2);
          ctx.fillRect(px - 1, 7, 2, 6);
          ctx.fillStyle = '#FACC15';
          ctx.fillRect(px - 4, 9.8, 1.5, 1.5);
        }
        ctx.restore();
      }
    ),

    // 12: Malvinas Estancia with Dry-Stone Sheep Corral & Grazing Flock
    buildCenitalMalvinasLand(
      138,
      108,
      39.4,
      [
        { cx: 68, cy: 54, rx: 50, ry: 38, phase: 2.2, freqA: 3, freqB: 5 },
        { cx: 40, cy: 40, rx: 22, ry: 18, phase: 1.0, freqA: 4, freqB: 3 },
      ],
      (ctx) => {
        // Stone sheep corral fence
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 1.4;
        ctx.strokeRect(52, 42, 22, 16);
        // Scattered cream-white Patagonian/Malvinas sheep dots
        ctx.fillStyle = '#F8FAFC';
        for (const [sx, sy] of [
          [56, 46],
          [60, 49],
          [65, 45],
          [69, 51],
          [58, 54],
          [82, 48],
          [86, 52],
        ]) {
          ctx.fillRect(sx, sy, 1.8, 1.4);
        }
        // Shearing shed
        ctx.fillStyle = '#991B1B';
        ctx.fillRect(42, 44, 7, 4.5);
      }
    ),

    // 13: Puerto Argentino / Stanley Waterfront Harbour, Piers & Coastal Settlement
    buildCenitalMalvinasLand(
      152,
      116,
      44.7,
      [
        { cx: 74, cy: 64, rx: 56, ry: 36, phase: 0.9, freqA: 3, freqB: 4, coveAngle: -1.5, coveDepth: 0.3 },
        { cx: 40, cy: 46, rx: 24, ry: 20, phase: 2.4, freqA: 4, freqB: 5 },
        { cx: 112, cy: 48, rx: 24, ry: 20, phase: 1.3, freqA: 3, freqB: 4 },
      ],
      (ctx) => {
        // Coastal seawall road & wooden harbour jetties jutting into bay
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(34, 52);
        ctx.quadraticCurveTo(74, 62, 114, 50);
        ctx.stroke();

        ctx.fillStyle = '#785A3A';
        ctx.fillRect(58, 36, 3.2, 20);
        ctx.fillRect(82, 38, 3.2, 19);

        // Bright Stanley coastal settlement houses (red/blue/green tin roofs)
        const houses: [number, number, string][] = [
          [44, 58, '#DC2626'],
          [54, 62, '#2563EB'],
          [66, 65, '#DC2626'],
          [78, 66, '#16A34A'],
          [90, 62, '#B91C1C'],
          [100, 58, '#2563EB'],
        ];
        for (const [hx, hy, roof] of houses) {
          ctx.fillStyle = 'rgba(0,0,0,0.45)';
          ctx.fillRect(hx + 0.8, hy + 0.8, 5.4, 3.8);
          ctx.fillStyle = roof;
          ctx.fillRect(hx, hy, 5.4, 3.8);
        }
      }
    ),
  ];
}

// =========================================================================
// 3. ARGENTINE NAVY AIRCRAFT CARRIER (ARA VEINTICINCO DE MAYO V-2) — FACING NORTH
// =========================================================================
export function buildHiResArgentineCarrier(): CompiledSprite {
  const w = 74;
  const h = 168;
  const cx = w / 2;
  return compileCenital(w, h, (ctx) => {
    // 1. Lower hull pointing North (flip drawCurvedWarshipHull vertically cleanly around center)
    ctx.save();
    ctx.translate(cx, h / 2);
    ctx.rotate(Math.PI);
    ctx.translate(-cx, -h / 2);
    drawCurvedWarshipHull(ctx, cx, 6, 162, 25, 0.74, '#64748B', '#1E293B');
    ctx.restore();

    // Smoothly curved Colossus-class carrier flight deck (ARA Veinticinco de Mayo V-2)
    const deckPath = () => {
      ctx.beginPath();
      ctx.moveTo(cx - 10, 7.5);
      ctx.quadraticCurveTo(cx + 1, 6.2, cx + 12, 7.5);
      ctx.bezierCurveTo(cx + 19, 20, cx + 25, 34, cx + 25.5, 44);
      ctx.lineTo(cx + 27, 134);
      ctx.quadraticCurveTo(cx + 26, 152, cx + 22, 160);
      ctx.lineTo(cx - 25, 160);
      ctx.bezierCurveTo(cx - 29.5, 138, cx - 31, 120, cx - 31, 108);
      ctx.lineTo(cx - 31, 52);
      ctx.bezierCurveTo(cx - 26, 36, cx - 19, 20, cx - 10, 7.5);
      ctx.closePath();
    };

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.78)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2.5;
    ctx.shadowOffsetY = 2.5;
    deckPath();
    const deckGrad = ctx.createLinearGradient(cx - 30, 8, cx + 28, 160);
    deckGrad.addColorStop(0, '#334155');
    deckGrad.addColorStop(0.4, '#1E293B');
    deckGrad.addColorStop(0.85, '#172030');
    deckGrad.addColorStop(1, '#0F172A');
    ctx.fillStyle = deckGrad;
    ctx.fill();
    ctx.restore();

    deckPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#94A3B8';
    ctx.stroke();

    ctx.save();
    deckPath();
    ctx.clip();

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
    ctx.lineWidth = 0.5;
    for (let y = 16; y < 156; y += 9) {
      ctx.beginPath();
      ctx.moveTo(cx - 32, y);
      ctx.lineTo(cx + 30, y);
      ctx.stroke();
    }

    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 0.85;
    ctx.beginPath();
    ctx.moveTo(cx - 24, 148);
    ctx.lineTo(cx - 24, 58);
    ctx.lineTo(cx - 12, 24);
    ctx.moveTo(cx + 10, 150);
    ctx.lineTo(cx + 10, 22);
    ctx.stroke();

    ctx.strokeStyle = '#F8FAFC';
    ctx.lineWidth = 1.6;
    ctx.setLineDash([5.5, 4.5]);
    ctx.beginPath();
    ctx.moveTo(cx - 3, 152);
    ctx.lineTo(cx - 10, 52);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#475569';
    ctx.fillRect(cx - 2.2, 11, 2.4, 52);
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(cx - 1.4, 11, 0.8, 52);

    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 0.75;
    for (const wy of [122, 130, 138, 146]) {
      ctx.beginPath();
      ctx.moveTo(cx - 20, wy);
      ctx.lineTo(cx + 8, wy);
      ctx.stroke();
    }

    ctx.fillStyle = '#74ACDF';
    ctx.fillRect(cx - 18, 152, 24, 2.2);
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(cx - 18, 154.2, 24, 2.2);
    ctx.fillStyle = '#74ACDF';
    ctx.fillRect(cx - 18, 156.4, 24, 2.2);
    drawHullPennantNumber(ctx, cx - 12, 16, 'V-2');

    ctx.fillStyle = '#0F172A';
    ctx.fillRect(cx - 6, 62, 9, 2.4);
    ctx.fillStyle = '#FACC15';
    ctx.fillRect(cx - 6, 62, 9, 0.7);

    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(cx - 9, 34, 13, 14);
    ctx.strokeRect(cx - 8, 96, 13, 13);

    drawSuperstructureBlock(ctx, cx + 13, 52, 12, 56, 2.0, '#E2E8F0', 2.4);
    drawFunnelCasing(ctx, cx + 19, 86, 5.6, 7.2);
    drawSphereRadome(ctx, cx + 19, 64, 2.5);
    drawSphereRadome(ctx, cx + 19, 98, 2.2);
    drawType965Lattice(ctx, cx + 19, 75, 9);
    ctx.fillStyle = '#090D16';
    ctx.fillRect(cx + 14.5, 55, 9, 2.2);
    drawAAMount(ctx, cx + 19, 114);
    drawAAMount(ctx, cx - 26, 98);
    drawLifeRaftPods(ctx, cx + 25, 68, 3);

    // Realistic parked A-4Q Skyhawk & Super Étendard jets on port-aft parking spot
    for (const [jx, jy] of [
      [cx - 20, 118],
      [cx - 19, 88],
    ]) {
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.beginPath();
      ctx.moveTo(jx + 1, jy - 6);
      ctx.quadraticCurveTo(jx + 5.6, jy + 0.5, jx + 4.8, jy + 3);
      ctx.lineTo(jx - 4.4, jy + 3);
      ctx.quadraticCurveTo(jx - 4.8, jy + 0.5, jx + 1, jy - 6);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#64748B';
      ctx.beginPath();
      ctx.moveTo(jx, jy - 6.2);
      ctx.bezierCurveTo(jx + 1.4, jy - 2.6, jx + 5.2, jy + 0.2, jx + 4.8, jy + 2.4);
      ctx.lineTo(jx + 1.0, jy + 2.0);
      ctx.lineTo(jx + 2.2, jy + 4.5);
      ctx.lineTo(jx - 2.2, jy + 4.5);
      ctx.lineTo(jx - 1.0, jy + 2.0);
      ctx.lineTo(jx - 4.8, jy + 2.4);
      ctx.bezierCurveTo(jx - 5.2, jy + 0.2, jx - 1.4, jy - 2.6, jx, jy - 6.2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.ellipse(jx, jy - 2.4, 0.55, 1.3, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.roundRect(cx + 5, 134, 3.6, 2.2, 0.7);
    ctx.fill();
    drawCranesOnDeck(ctx, cx + 14, 118, cx + 7, 126);

    ctx.restore();
  });
}
