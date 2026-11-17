// High-Detail Realistic Scale-Model 1982 South Atlantic Aircraft & Ground Sprite Generator
// Uses smooth Bezier airfoils, anatomical military proportions, subtle panel lines & 4x supersampling.

import { CompiledSprite } from './pixelSprites';

const S = 4;

function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function compileRealisticSprite(
  logicalW: number,
  logicalH: number,
  drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
): CompiledSprite {
  const pw = logicalW * S;
  const ph = logicalH * S;
  const canvas = makeCanvas(pw, ph);
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.scale(S, S);
  drawFn(ctx, logicalW, logicalH);

  const flashCanvas = makeCanvas(pw, ph);
  const fctx = flashCanvas.getContext('2d')!;
  fctx.drawImage(canvas, 0, 0);
  fctx.globalCompositeOperation = 'source-in';
  fctx.fillStyle = '#FFFFFF';
  fctx.fillRect(0, 0, pw, ph);

  return { canvas, flashCanvas, w: logicalW, h: logicalH };
}

function drawRealisticCanopy(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number
): void {
  ctx.save();
  // Flush armored windscreen frame
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx + 0.45, ry + 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tinted Plexiglas aerodynamic bubble dome
  const grad = ctx.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry);
  grad.addColorStop(0, '#E0F2FE');
  grad.addColorStop(0.28, '#38BDF8');
  grad.addColorStop(0.68, '#0369A1');
  grad.addColorStop(1, '#08182E');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(cx, cy - ry);
  ctx.bezierCurveTo(cx + rx * 1.05, cy - ry * 0.45, cx + rx * 0.95, cy + ry * 0.65, cx, cy + ry);
  ctx.bezierCurveTo(cx - rx * 0.95, cy + ry * 0.65, cx - rx * 1.05, cy - ry * 0.45, cx, cy - ry);
  ctx.closePath();
  ctx.fill();

  // Subtle glare curve & internal canopy bow frame
  ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
  ctx.beginPath();
  ctx.ellipse(cx - rx * 0.3, cy - ry * 0.34, rx * 0.24, ry * 0.38, -0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(15, 23, 42, 0.7)';
  ctx.lineWidth = 0.45;
  ctx.beginPath();
  ctx.moveTo(cx - rx * 0.85, cy - ry * 0.15);
  ctx.quadraticCurveTo(cx, cy - ry * 0.28, cx + rx * 0.85, cy - ry * 0.15);
  ctx.stroke();
  ctx.restore();
}

function drawArgentineCockade(ctx: CanvasRenderingContext2D, cx: number, cy: number, r = 1.6): void {
  ctx.save();
  ctx.fillStyle = '#74ACDF';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.62, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#74ACDF';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawRoyalNavyRoundel(ctx: CanvasRenderingContext2D, cx: number, cy: number, r = 1.65): void {
  ctx.save();
  ctx.fillStyle = '#1E3A8A';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.64, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.36, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawStreamlinedStore(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  len: number,
  radius: number,
  bodyColor: string,
  bandColor: string,
  hasFins = true
): void {
  ctx.save();
  const halfL = len * 0.5;
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(x, y - halfL);
  ctx.quadraticCurveTo(x + radius, y - halfL * 0.55, x + radius, y + halfL * 0.65);
  ctx.lineTo(x + radius * 0.6, y + halfL);
  ctx.lineTo(x - radius * 0.6, y + halfL);
  ctx.lineTo(x - radius, y + halfL * 0.65);
  ctx.quadraticCurveTo(x - radius, y - halfL * 0.55, x, y - halfL);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(15, 23, 42, 0.55)';
  ctx.lineWidth = 0.35;
  ctx.stroke();

  // Tactical nose band
  ctx.fillStyle = bandColor;
  ctx.fillRect(x - radius * 0.78, y - halfL * 0.32, radius * 1.56, 0.85);

  if (hasFins) {
    ctx.fillStyle = '#64748B';
    ctx.beginPath();
    ctx.moveTo(x - radius, y + halfL * 0.45);
    ctx.lineTo(x - radius * 1.9, y + halfL * 0.92);
    ctx.lineTo(x - radius * 0.6, y + halfL * 0.92);
    ctx.moveTo(x + radius, y + halfL * 0.45);
    ctx.lineTo(x + radius * 1.9, y + halfL * 0.92);
    ctx.lineTo(x + radius * 0.6, y + halfL * 0.92);
    ctx.fill();
  }
  ctx.restore();
}

function drawWingtipNavLights(ctx: CanvasRenderingContext2D, lx: number, rx: number, y: number): void {
  ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
  ctx.beginPath();
  ctx.arc(lx, y, 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
  ctx.beginPath();
  ctx.arc(rx, y, 0.55, 0, Math.PI * 2);
  ctx.fill();
}

function drawPanelSeamLines(ctx: CanvasRenderingContext2D, lines: [number, number, number, number][]): void {
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.32)';
  ctx.lineWidth = 0.3;
  ctx.beginPath();
  for (const [x1, y1, x2, y2] of lines) {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.stroke();
}

function drawBankTransform(ctx: CanvasRenderingContext2D, w: number, h: number, bank: -1 | 0 | 1): void {
  if (bank === 0) return;
  const cx = w / 2;
  const cy = h / 2;
  ctx.translate(cx + bank * 1.1, cy);
  ctx.scale(0.84, 1);
  ctx.transform(1, bank * 0.05, 0, 1, 0, 0);
  ctx.translate(-cx, -cy);
}

// ============================================================================
// 1. DOUGLAS A-4B/Q SKYHAWK — Sleek Realistic Cropped-Delta Silhouette (38x42)
// ============================================================================
export function buildMSSkyhawk(bank: -1 | 0 | 1): CompiledSprite {
  return compileRealisticSprite(38, 42, (ctx, w, h) => {
    ctx.save();
    drawBankTransform(ctx, w, h, bank);
    const cx = w / 2;

    // Wing-mounted Snakeye Mk-82 bombs & streamlined underwing fuel tanks
    drawStreamlinedStore(ctx, cx - 6.8, 25.5, 9.2, 1.05, '#D4D9DF', '#475569', false);
    drawStreamlinedStore(ctx, cx + 6.8, 25.5, 9.2, 1.05, '#D4D9DF', '#475569', false);
    drawStreamlinedStore(ctx, cx - 10.6, 26.8, 6.2, 0.65, '#475569', '#FACC15', true);
    drawStreamlinedStore(ctx, cx + 10.6, 26.8, 6.2, 0.65, '#475569', '#FACC15', true);

    // Authentic A-4 Skyhawk curved cropped-delta wing planform
    const wingPath = () => {
      ctx.beginPath();
      ctx.moveTo(cx, 12.2);
      ctx.lineTo(cx + 3.2, 15.8);
      ctx.quadraticCurveTo(cx + 12.5, 22.8, cx + 15.6, 27.0);
      ctx.quadraticCurveTo(cx + 16.4, 29.2, cx + 14.6, 29.6);
      ctx.lineTo(cx + 3.8, 29.0);
      ctx.lineTo(cx - 3.8, 29.0);
      ctx.lineTo(cx - 14.6, 29.6);
      ctx.quadraticCurveTo(cx - 16.4, 29.2, cx - 15.6, 27.0);
      ctx.quadraticCurveTo(cx - 12.5, 22.8, cx - 3.2, 15.8);
      ctx.closePath();
    };

    wingPath();
    const wingGrad = ctx.createLinearGradient(cx - 16, 15, cx + 16, 30);
    wingGrad.addColorStop(0, '#728450');
    wingGrad.addColorStop(0.5, '#59693E');
    wingGrad.addColorStop(1, '#3D4829');
    ctx.fillStyle = wingGrad;
    ctx.fill();

    // Organic curved FAA olive & sand tactical camo blotches clipped inside wings
    ctx.save();
    wingPath();
    ctx.clip();
    ctx.fillStyle = '#B8A06E';
    ctx.beginPath();
    ctx.ellipse(cx - 8.5, 26.2, 6.2, 3.2, -0.35, 0, Math.PI * 2);
    ctx.ellipse(cx + 9.2, 23.8, 5.4, 2.8, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Subtle 1982 Malvinas yellow theater identification bands (swept along wing chord!)
    ctx.fillStyle = 'rgba(250, 204, 21, 0.9)';
    ctx.beginPath();
    ctx.moveTo(cx - 12.8, 24.4);
    ctx.lineTo(cx - 10.6, 23.0);
    ctx.lineTo(cx - 10.6, 29.6);
    ctx.lineTo(cx - 12.8, 29.6);
    ctx.closePath();
    ctx.moveTo(cx + 10.6, 23.0);
    ctx.lineTo(cx + 12.8, 24.4);
    ctx.lineTo(cx + 12.8, 29.6);
    ctx.lineTo(cx + 10.6, 29.6);
    ctx.closePath();
    ctx.fill();

    // Wing leading-edge slat highlight & trailing flap hinge lines
    ctx.strokeStyle = 'rgba(248, 250, 252, 0.25)';
    ctx.lineWidth = 0.55;
    ctx.beginPath();
    ctx.moveTo(cx - 15.2, 26.8);
    ctx.quadraticCurveTo(cx - 9, 21.0, cx - 3.2, 16.0);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(15, 23, 42, 0.42)';
    ctx.lineWidth = 0.45;
    ctx.beginPath();
    ctx.moveTo(cx - 14.0, 28.0);
    ctx.lineTo(cx - 4.0, 27.6);
    ctx.moveTo(cx + 4.0, 27.6);
    ctx.lineTo(cx + 14.0, 28.0);
    ctx.stroke();
    ctx.restore();

    wingPath();
    ctx.strokeStyle = '#182012';
    ctx.lineWidth = 0.55;
    ctx.stroke();

    // Swept low-set horizontal tailplanes
    ctx.fillStyle = '#4B5934';
    ctx.beginPath();
    ctx.moveTo(cx, 32.0);
    ctx.quadraticCurveTo(cx + 5.8, 33.6, cx + 7.6, 36.2);
    ctx.lineTo(cx + 7.2, 37.3);
    ctx.lineTo(cx - 7.2, 37.3);
    ctx.lineTo(cx - 7.6, 36.2);
    ctx.quadraticCurveTo(cx - 5.8, 33.6, cx, 32.0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#182012';
    ctx.lineWidth = 0.45;
    ctx.stroke();

    // Tapered circular-cross-section Skyhawk fuselage + dorsal avionics hump
    const fuseGrad = ctx.createLinearGradient(cx - 3.5, 0, cx + 3.5, 0);
    fuseGrad.addColorStop(0, '#7F915B');
    fuseGrad.addColorStop(0.42, '#5F6E42');
    fuseGrad.addColorStop(1, '#313B22');
    ctx.fillStyle = fuseGrad;
    ctx.beginPath();
    ctx.moveTo(cx, 2.2);
    ctx.bezierCurveTo(cx + 1.6, 6.8, cx + 2.4, 11.5, cx + 2.5, 16.0);
    ctx.bezierCurveTo(cx + 3.3, 21.0, cx + 2.8, 30.0, cx + 1.45, 37.8);
    ctx.lineTo(cx - 1.45, 37.8);
    ctx.bezierCurveTo(cx - 2.8, 30.0, cx - 3.3, 21.0, cx - 2.5, 16.0);
    ctx.bezierCurveTo(cx - 2.4, 11.5, cx - 1.6, 6.8, cx, 2.2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#182012';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Characteristic rounded cheek engine intakes (curved air ducts)
    for (const side of [-1, 1]) {
      const ix = cx + side * 2.55;
      ctx.fillStyle = side < 0 ? '#68794A' : '#3E4A29';
      ctx.beginPath();
      ctx.ellipse(ix, 17.5, 1.05, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0B111A';
      ctx.beginPath();
      ctx.ellipse(ix + side * 0.15, 14.8, 0.72, 0.9, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Offset refueling probe along starboard nose & black dielectric radome
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 0.55;
    ctx.beginPath();
    ctx.moveTo(cx + 1.15, 10.6);
    ctx.lineTo(cx + 1.75, 4.4);
    ctx.stroke();

    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.moveTo(cx, 2.1);
    ctx.quadraticCurveTo(cx + 0.95, 4.5, cx + 1.1, 6.2);
    ctx.lineTo(cx - 1.1, 6.2);
    ctx.quadraticCurveTo(cx - 0.95, 4.5, cx, 2.1);
    ctx.closePath();
    ctx.fill();

    // Twin 20mm Mk 12 wing root gun barrels
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(cx - 4.4, 16.2);
    ctx.lineTo(cx - 4.4, 20.0);
    ctx.moveTo(cx + 4.4, 16.2);
    ctx.lineTo(cx + 4.4, 20.0);
    ctx.stroke();

    drawRealisticCanopy(ctx, cx, 11.4, 1.45, 3.6);
    drawArgentineCockade(ctx, cx - 7.5, 25.0, 1.45);
    drawArgentineCockade(ctx, cx + 7.5, 25.0, 1.45);

    // Tall swept vertical tail spine with celeste-white-celeste rudder flash
    ctx.fillStyle = '#42502E';
    ctx.beginPath();
    ctx.moveTo(cx, 27.6);
    ctx.lineTo(cx + 0.75, 37.6);
    ctx.lineTo(cx - 0.75, 37.6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#74ACDF';
    ctx.fillRect(cx - 0.4, 30.2, 0.8, 6.4);
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(cx - 0.4, 32.4, 0.8, 2.1);

    // Exhaust shroud
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.ellipse(cx, 38.0, 1.35, 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    drawPanelSeamLines(ctx, [
      [cx - 1.8, 19, cx + 1.8, 19],
      [cx - 2.0, 24, cx + 2.0, 24],
      [cx - 1.4, 30, cx + 1.4, 30],
    ]);
    drawWingtipNavLights(ctx, cx - 15.2, cx + 15.2, 27.8);
    ctx.restore();
  });
}

// ============================================================================
// 2. DASSAULT SUPER ÉTENDARD — Sleek Naval Strike Swept Jet (38x44)
// ============================================================================
export function buildMSSuperEtendard(bank: -1 | 0 | 1): CompiledSprite {
  return compileRealisticSprite(38, 44, (ctx, w, h) => {
    ctx.save();
    drawBankTransform(ctx, w, h, bank);
    const cx = w / 2;

    // Asymmetric realistic load: AM-39 Exocet starboard pylon + drop tank port pylon!
    drawStreamlinedStore(ctx, cx + 6.6, 24.0, 11.4, 0.92, '#F1F5F9', '#74ACDF', true);
    drawStreamlinedStore(ctx, cx - 6.6, 24.0, 10.6, 1.1, '#64748B', '#E2E8F0', false);

    // Gracefully sweptback naval fighter wings (curved trailing notch)
    const wingPath = () => {
      ctx.beginPath();
      ctx.moveTo(cx, 13.8);
      ctx.lineTo(cx + 3.0, 16.5);
      ctx.quadraticCurveTo(cx + 12.2, 23.0, cx + 16.2, 27.8);
      ctx.quadraticCurveTo(cx + 16.4, 29.6, cx + 14.5, 29.8);
      ctx.lineTo(cx + 3.8, 27.6);
      ctx.lineTo(cx - 3.8, 27.6);
      ctx.lineTo(cx - 14.5, 29.8);
      ctx.quadraticCurveTo(cx - 16.4, 29.6, cx - 16.2, 27.8);
      ctx.quadraticCurveTo(cx - 12.2, 23.0, cx - 3.0, 16.5);
      ctx.closePath();
    };

    wingPath();
    const wingGrad = ctx.createLinearGradient(cx - 16, 14, cx + 16, 30);
    wingGrad.addColorStop(0, '#64748B');
    wingGrad.addColorStop(0.45, '#475569');
    wingGrad.addColorStop(1, '#273549');
    ctx.fillStyle = wingGrad;
    ctx.fill();

    // Subtle Dark Slate / Extra Dark Sea Grey upper camo mottling
    ctx.save();
    wingPath();
    ctx.clip();
    ctx.fillStyle = 'rgba(148, 163, 184, 0.28)';
    ctx.beginPath();
    ctx.ellipse(cx - 8, 25, 6, 3, -0.4, 0, Math.PI * 2);
    ctx.ellipse(cx + 9, 25, 6, 3, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    wingPath();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 0.55;
    ctx.stroke();

    // Swept all-moving tailplane
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(cx, 33.4);
    ctx.quadraticCurveTo(cx + 5.8, 35.4, cx + 7.8, 38.6);
    ctx.lineTo(cx + 7.2, 39.6);
    ctx.lineTo(cx - 7.2, 39.6);
    ctx.lineTo(cx - 7.8, 38.6);
    ctx.quadraticCurveTo(cx - 5.8, 35.4, cx, 33.4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 0.45;
    ctx.stroke();

    // Needle nose & area-ruled coke-bottle steel fuselage
    const fuseGrad = ctx.createLinearGradient(cx - 3.2, 0, cx + 3.2, 0);
    fuseGrad.addColorStop(0, '#CBD5E1');
    fuseGrad.addColorStop(0.4, '#64748B');
    fuseGrad.addColorStop(1, '#1E293B');
    ctx.fillStyle = fuseGrad;
    ctx.beginPath();
    ctx.moveTo(cx, 2.0);
    ctx.bezierCurveTo(cx + 1.4, 7.0, cx + 2.2, 12.2, cx + 2.5, 16.5);
    ctx.bezierCurveTo(cx + 3.1, 22.0, cx + 2.4, 32.0, cx + 1.35, 39.8);
    ctx.lineTo(cx - 1.35, 39.8);
    ctx.bezierCurveTo(cx - 2.4, 32.0, cx - 3.1, 22.0, cx - 2.5, 16.5);
    ctx.bezierCurveTo(cx - 2.2, 12.2, cx - 1.4, 7.0, cx, 2.0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Fine nose pitot boom
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 0.45;
    ctx.beginPath();
    ctx.moveTo(cx, 2.2);
    ctx.lineTo(cx, 0.4);
    ctx.stroke();

    // Semicircular French side intakes smoothly faired into fuselage
    for (const side of [-1, 1]) {
      ctx.fillStyle = side < 0 ? '#94A3B8' : '#334155';
      ctx.beginPath();
      ctx.ellipse(cx + side * 2.35, 16.2, 0.85, 2.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#090D16';
      ctx.beginPath();
      ctx.ellipse(cx + side * 2.4, 13.8, 0.65, 0.85, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Black Agave radar cone
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.moveTo(cx, 2.0);
    ctx.quadraticCurveTo(cx + 0.9, 4.8, cx + 1.0, 6.6);
    ctx.lineTo(cx - 1.0, 6.6);
    ctx.quadraticCurveTo(cx - 0.9, 4.8, cx, 2.0);
    ctx.closePath();
    ctx.fill();

    drawRealisticCanopy(ctx, cx, 10.8, 1.35, 3.6);
    drawArgentineCockade(ctx, cx - 10.0, 25.6, 1.5);
    drawArgentineCockade(ctx, cx + 10.0, 25.6, 1.5);

    // Fin spine & COAN rudder flash
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(cx, 29.0);
    ctx.lineTo(cx + 0.7, 39.5);
    ctx.lineTo(cx - 0.7, 39.5);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#74ACDF';
    ctx.fillRect(cx - 0.4, 31.8, 0.8, 6.8);
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(cx - 0.4, 34.2, 0.8, 2.2);

    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.ellipse(cx, 40.0, 1.25, 0.8, 0, 0, Math.PI * 2);
    ctx.fill();

    drawPanelSeamLines(ctx, [
      [cx - 1.6, 19.5, cx + 1.6, 19.5],
      [cx - 1.8, 25.5, cx + 1.8, 25.5],
      [cx - 1.3, 31.5, cx + 1.3, 31.5],
    ]);
    drawWingtipNavLights(ctx, cx - 15.8, cx + 15.8, 28.6);
    ctx.restore();
  });
}

// ============================================================================
// 3. IAI DAGGER M-5 — Needle-Nosed Pure Tailless Delta Mirage (38x44)
// ============================================================================
export function buildMSDagger(bank: -1 | 0 | 1): CompiledSprite {
  return compileRealisticSprite(38, 44, (ctx, w, h) => {
    ctx.save();
    drawBankTransform(ctx, w, h, bank);
    const cx = w / 2;

    // Outboard Shafrir II heat-seeking missiles
    drawStreamlinedStore(ctx, cx - 11.4, 28.2, 7.6, 0.62, '#F1F5F9', '#38BDF8', true);
    drawStreamlinedStore(ctx, cx + 11.4, 28.2, 7.6, 0.62, '#F1F5F9', '#38BDF8', true);

    // Classic pure Mirage/Dagger 60° swept compound delta planform
    const deltaPath = () => {
      ctx.beginPath();
      ctx.moveTo(cx, 13.0);
      ctx.lineTo(cx + 3.0, 17.5);
      ctx.quadraticCurveTo(cx + 12.0, 26.8, cx + 15.8, 32.0);
      ctx.quadraticCurveTo(cx + 16.4, 34.2, cx + 14.5, 34.6);
      ctx.lineTo(cx + 2.4, 33.8);
      ctx.lineTo(cx - 2.4, 33.8);
      ctx.lineTo(cx - 14.5, 34.6);
      ctx.quadraticCurveTo(cx - 16.4, 34.2, cx - 15.8, 32.0);
      ctx.quadraticCurveTo(cx - 12.0, 26.8, cx - 3.0, 17.5);
      ctx.closePath();
    };

    deltaPath();
    const wingGrad = ctx.createLinearGradient(cx - 15, 16, cx + 15, 35);
    wingGrad.addColorStop(0, '#6B7C4B');
    wingGrad.addColorStop(0.5, '#526038');
    wingGrad.addColorStop(1, '#343F22');
    ctx.fillStyle = wingGrad;
    ctx.fill();

    // Curved South-East Asia brown/tan tactical camouflage lobes
    ctx.save();
    deltaPath();
    ctx.clip();
    ctx.fillStyle = '#9C7F54';
    ctx.beginPath();
    ctx.ellipse(cx - 7.8, 30.0, 6.8, 3.6, 0.35, 0, Math.PI * 2);
    ctx.ellipse(cx + 8.4, 27.5, 5.8, 3.4, -0.45, 0, Math.PI * 2);
    ctx.fill();

    // Thin tapered yellow Malvinas wing bands
    ctx.fillStyle = 'rgba(250, 204, 21, 0.88)';
    ctx.fillRect(cx - 13.6, 30.8, 2.2, 4.0);
    ctx.fillRect(cx + 11.4, 30.8, 2.2, 4.0);

    // Elevon hinges
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.lineWidth = 0.45;
    ctx.beginPath();
    ctx.moveTo(cx - 14.0, 32.6);
    ctx.lineTo(cx - 2.8, 32.0);
    ctx.moveTo(cx + 2.8, 32.0);
    ctx.lineTo(cx + 14.0, 32.6);
    ctx.stroke();
    ctx.restore();

    deltaPath();
    ctx.strokeStyle = '#182012';
    ctx.lineWidth = 0.55;
    ctx.stroke();

    // Long slender Mirage cylindrical fuselage
    const fuseGrad = ctx.createLinearGradient(cx - 2.8, 0, cx + 2.8, 0);
    fuseGrad.addColorStop(0, '#859660');
    fuseGrad.addColorStop(0.45, '#5B6A3F');
    fuseGrad.addColorStop(1, '#2D371D');
    ctx.fillStyle = fuseGrad;
    ctx.beginPath();
    ctx.moveTo(cx, 1.8);
    ctx.bezierCurveTo(cx + 1.25, 6.8, cx + 1.9, 12.0, cx + 2.1, 17.0);
    ctx.bezierCurveTo(cx + 2.6, 23.0, cx + 2.3, 33.5, cx + 1.45, 40.4);
    ctx.lineTo(cx - 1.45, 40.4);
    ctx.bezierCurveTo(cx - 2.3, 33.5, cx - 2.6, 23.0, cx - 2.1, 17.0);
    ctx.bezierCurveTo(cx - 1.9, 12.0, cx - 1.25, 6.8, cx, 1.8);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#182012';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Nose pitot boom
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 0.42;
    ctx.beginPath();
    ctx.moveTo(cx, 2.0);
    ctx.lineTo(cx, 0.3);
    ctx.stroke();

    // Authentic Mirage V half-cone souris splitter intakes
    for (const side of [-1, 1]) {
      ctx.fillStyle = side < 0 ? '#748453' : '#3B4728';
      ctx.beginPath();
      ctx.ellipse(cx + side * 2.2, 17.2, 0.9, 2.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#090D16';
      ctx.beginPath();
      ctx.arc(cx + side * 2.2, 15.2, 0.72, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#CBD5E1';
      ctx.beginPath();
      ctx.arc(cx + side * 1.95, 15.2, 0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    drawRealisticCanopy(ctx, cx, 10.6, 1.25, 3.6);
    drawArgentineCockade(ctx, cx - 7.8, 28.4, 1.45);
    drawArgentineCockade(ctx, cx + 7.8, 28.4, 1.45);

    // Tall vertical tail fin spine
    ctx.fillStyle = '#4A5833';
    ctx.beginPath();
    ctx.moveTo(cx, 28.8);
    ctx.lineTo(cx + 0.7, 40.0);
    ctx.lineTo(cx - 0.7, 40.0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#74ACDF';
    ctx.fillRect(cx - 0.38, 32.0, 0.76, 6.8);
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(cx - 0.38, 34.4, 0.76, 2.2);

    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.ellipse(cx, 40.6, 1.25, 0.75, 0, 0, Math.PI * 2);
    ctx.fill();

    drawPanelSeamLines(ctx, [
      [cx - 1.6, 20, cx + 1.6, 20],
      [cx - 1.8, 26.5, cx + 1.8, 26.5],
      [cx - 1.4, 33, cx + 1.4, 33],
    ]);
    drawWingtipNavLights(ctx, cx - 15.6, cx + 15.6, 33.0);
    ctx.restore();
  });
}

// ============================================================================
// 4. FMA IA-58 PUCARÁ — Slim Twin-Turboprop High-Aspect Gunship (44x38)
// ============================================================================
export function buildMSPucara(bank: -1 | 0 | 1): CompiledSprite {
  return compileRealisticSprite(44, 38, (ctx, w, h) => {
    ctx.save();
    drawBankTransform(ctx, w, h, bank);
    const cx = w / 2;

    // Underwing LAU-61 rocket pods
    drawStreamlinedStore(ctx, cx - 12.6, 18.0, 7.6, 0.72, '#CBD5E1', '#F97316', false);
    drawStreamlinedStore(ctx, cx + 12.6, 18.0, 7.6, 0.72, '#CBD5E1', '#F97316', false);

    // Authentic long tapered high-aspect Pucará wing (NOT a boxy rectangle!)
    const wingPath = () => {
      ctx.beginPath();
      ctx.moveTo(cx, 12.6);
      ctx.lineTo(cx + 19.6, 14.0);
      ctx.quadraticCurveTo(cx + 21.0, 15.8, cx + 19.5, 18.2);
      ctx.lineTo(cx + 2.6, 19.8);
      ctx.lineTo(cx - 2.6, 19.8);
      ctx.lineTo(cx - 19.5, 18.2);
      ctx.quadraticCurveTo(cx - 21.0, 15.8, cx - 19.6, 14.0);
      ctx.closePath();
    };

    wingPath();
    const wingGrad = ctx.createLinearGradient(cx - 20, 13, cx + 20, 19);
    wingGrad.addColorStop(0, '#728450');
    wingGrad.addColorStop(0.5, '#59693E');
    wingGrad.addColorStop(1, '#3D4829');
    ctx.fillStyle = wingGrad;
    ctx.fill();

    ctx.save();
    wingPath();
    ctx.clip();
    ctx.fillStyle = '#B8A06E';
    ctx.beginPath();
    ctx.ellipse(cx - 12.0, 16.5, 6.2, 2.5, 0.15, 0, Math.PI * 2);
    ctx.ellipse(cx + 11.5, 16.2, 6.4, 2.5, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(250, 204, 21, 0.88)';
    ctx.fillRect(cx - 18.2, 13.8, 2.0, 5.2);
    ctx.fillRect(cx + 16.2, 13.8, 2.0, 5.2);
    ctx.restore();

    wingPath();
    ctx.strokeStyle = '#182012';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Sleek high T-tail stabilizer with tapered swept leading edges
    ctx.fillStyle = '#53623A';
    ctx.beginPath();
    ctx.moveTo(cx, 31.0);
    ctx.lineTo(cx + 7.2, 32.4);
    ctx.quadraticCurveTo(cx + 7.8, 33.4, cx + 6.8, 34.4);
    ctx.lineTo(cx - 6.8, 34.4);
    ctx.quadraticCurveTo(cx - 7.8, 33.4, cx - 7.2, 32.4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#182012';
    ctx.lineWidth = 0.45;
    ctx.stroke();

    // Streamlined twin Turbomeca Astazou engine nacelles extending well ahead of wings!
    for (const side of [-1, 1]) {
      const nx = cx + side * 7.6;
      const nacGrad = ctx.createLinearGradient(nx - 2, 0, nx + 2, 0);
      nacGrad.addColorStop(0, '#94A3B8');
      nacGrad.addColorStop(0.5, '#64748B');
      nacGrad.addColorStop(1, '#334155');
      ctx.fillStyle = nacGrad;
      ctx.beginPath();
      ctx.moveTo(nx, 8.2);
      ctx.bezierCurveTo(nx + 1.5, 9.6, nx + 1.85, 13.5, nx + 1.45, 21.8);
      ctx.lineTo(nx + 0.65, 22.8);
      ctx.lineTo(nx - 0.65, 22.8);
      ctx.lineTo(nx - 1.45, 21.8);
      ctx.bezierCurveTo(nx - 1.85, 13.5, nx - 1.5, 9.6, nx, 8.2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 0.45;
      ctx.stroke();

      // Chrome pointed turboprop spinner
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.moveTo(nx, 6.8);
      ctx.quadraticCurveTo(nx + 1.15, 8.2, nx + 1.25, 9.4);
      ctx.lineTo(nx - 1.25, 9.4);
      ctx.quadraticCurveTo(nx - 1.15, 8.2, nx, 6.8);
      ctx.closePath();
      ctx.fill();

      // Under-cowling chin air scoop
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.ellipse(nx, 10.6, 0.75, 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Slender tapered pencil fuselage (Pucará's signature slim profile)
    const fuseGrad = ctx.createLinearGradient(cx - 2.4, 0, cx + 2.4, 0);
    fuseGrad.addColorStop(0, '#859660');
    fuseGrad.addColorStop(0.5, '#59693E');
    fuseGrad.addColorStop(1, '#2E381E');
    ctx.fillStyle = fuseGrad;
    ctx.beginPath();
    ctx.moveTo(cx, 2.4);
    ctx.bezierCurveTo(cx + 1.5, 6.2, cx + 2.1, 10.0, cx + 1.9, 17.5);
    ctx.bezierCurveTo(cx + 1.7, 24.5, cx + 1.2, 31.0, cx + 0.55, 36.2);
    ctx.lineTo(cx - 0.55, 36.2);
    ctx.bezierCurveTo(cx - 1.2, 31.0, cx - 1.7, 24.5, cx - 1.9, 17.5);
    ctx.bezierCurveTo(cx - 2.1, 10.0, cx - 1.5, 6.2, cx, 2.4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#182012';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Nose celeste tactical band
    ctx.fillStyle = '#74ACDF';
    ctx.fillRect(cx - 1.35, 22.8, 2.7, 2.2);
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(cx - 1.35, 23.5, 2.7, 0.8);

    // Long tandem bubble canopy (pilot + co-pilot)
    drawRealisticCanopy(ctx, cx, 9.6, 1.32, 4.4);
    drawArgentineCockade(ctx, cx - 14.8, 16.0, 1.45);
    drawArgentineCockade(ctx, cx + 14.8, 16.0, 1.45);

    drawPanelSeamLines(ctx, [
      [cx - 18, 17.0, cx + 18, 17.0],
      [cx - 1.5, 19.5, cx + 1.5, 19.5],
      [cx - 1.2, 26.5, cx + 1.2, 26.5],
    ]);
    drawWingtipNavLights(ctx, cx - 20.0, cx + 20.0, 15.8);
    ctx.restore();
  });
}

// ============================================================================
// 5. ENEMY AIRCRAFT & HELICOPTERS (Realistic 1982 Royal Navy / RAF Silhouettes)
// ============================================================================
export function buildMSSeaHarrier(): CompiledSprite {
  return compileRealisticSprite(38, 40, (ctx, w, h) => {
    const cx = w / 2;
    ctx.save();
    ctx.translate(cx, h / 2);
    ctx.rotate(Math.PI);
    ctx.translate(-cx, -h / 2);

    // AIM-9L Sidewinders on outboard rails
    drawStreamlinedStore(ctx, cx - 12.6, 23.8, 7.2, 0.56, '#F1F5F9', '#DC2626', true);
    drawStreamlinedStore(ctx, cx + 12.6, 23.8, 7.2, 0.56, '#F1F5F9', '#DC2626', true);

    // Authentic Sea Harrier swept shoulder wing with curved wingtip outrigger pods
    const wingPath = () => {
      ctx.beginPath();
      ctx.moveTo(cx, 12.6);
      ctx.lineTo(cx + 3.4, 15.6);
      ctx.quadraticCurveTo(cx + 12.6, 21.8, cx + 15.8, 25.4);
      ctx.quadraticCurveTo(cx + 16.4, 27.0, cx + 14.2, 27.4);
      ctx.lineTo(cx + 3.6, 24.4);
      ctx.lineTo(cx - 3.6, 24.4);
      ctx.lineTo(cx - 14.2, 27.4);
      ctx.quadraticCurveTo(cx - 16.4, 27.0, cx - 15.8, 25.4);
      ctx.quadraticCurveTo(cx - 12.6, 21.8, cx - 3.4, 15.6);
      ctx.closePath();
    };

    wingPath();
    const wingGrad = ctx.createLinearGradient(cx - 15, 14, cx + 15, 28);
    wingGrad.addColorStop(0, '#64748B');
    wingGrad.addColorStop(0.5, '#475569');
    wingGrad.addColorStop(1, '#1E293B');
    ctx.fillStyle = wingGrad;
    ctx.fill();
    ctx.strokeStyle = '#090D16';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Swept low-set Harrier tailplanes
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(cx, 31.2);
    ctx.quadraticCurveTo(cx + 5.6, 33.4, cx + 7.4, 36.2);
    ctx.lineTo(cx + 6.8, 37.2);
    ctx.lineTo(cx - 6.8, 37.2);
    ctx.lineTo(cx - 7.4, 36.2);
    ctx.quadraticCurveTo(cx - 5.6, 33.4, cx, 31.2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#090D16';
    ctx.lineWidth = 0.45;
    ctx.stroke();

    // Rounded Pegasus fuselage + curved "elephant ear" front intakes!
    const fuseGrad = ctx.createLinearGradient(cx - 3.6, 0, cx + 3.6, 0);
    fuseGrad.addColorStop(0, '#94A3B8');
    fuseGrad.addColorStop(0.45, '#475569');
    fuseGrad.addColorStop(1, '#1E293B');
    ctx.fillStyle = fuseGrad;
    ctx.beginPath();
    ctx.moveTo(cx, 2.2);
    ctx.bezierCurveTo(cx + 1.8, 6.8, cx + 2.8, 10.6, cx + 3.5, 14.0);
    ctx.bezierCurveTo(cx + 3.8, 18.8, cx + 2.6, 30.0, cx + 1.25, 37.6);
    ctx.lineTo(cx - 1.25, 37.6);
    ctx.bezierCurveTo(cx - 2.6, 30.0, cx - 3.8, 18.8, cx - 3.5, 14.0);
    ctx.bezierCurveTo(cx - 2.8, 10.6, cx - 1.8, 6.8, cx, 2.2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#090D16';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Characteristic rounded Pegasus intake bells & 4 vector nozzle fairings
    for (const side of [-1, 1]) {
      ctx.fillStyle = '#090D16';
      ctx.beginPath();
      ctx.ellipse(cx + side * 2.85, 12.8, 0.72, 1.35, side * 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Forward cold & rear hot swiveling vector exhaust fairings
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.ellipse(cx + side * 3.3, 18.2, 0.72, 1.15, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + side * 3.1, 22.8, 0.72, 1.15, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Blue Fox slender radar nosecone
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.moveTo(cx, 2.1);
    ctx.quadraticCurveTo(cx + 1.1, 4.8, cx + 1.25, 6.8);
    ctx.lineTo(cx - 1.25, 6.8);
    ctx.quadraticCurveTo(cx - 1.1, 4.8, cx, 2.1);
    ctx.closePath();
    ctx.fill();

    drawRealisticCanopy(ctx, cx, 10.2, 1.45, 3.3);
    drawRoyalNavyRoundel(ctx, cx - 8.6, 22.8, 1.55);
    drawRoyalNavyRoundel(ctx, cx + 8.6, 22.8, 1.55);

    drawPanelSeamLines(ctx, [
      [cx - 2.0, 17, cx + 2.0, 17],
      [cx - 1.8, 25, cx + 1.8, 25],
    ]);
    drawWingtipNavLights(ctx, cx - 15.4, cx + 15.4, 26.2);
    ctx.restore();
  });
}

export function buildMSSeaKing(): CompiledSprite {
  return compileRealisticSprite(34, 48, (ctx, w) => {
    const cx = w / 2;

    // Swept horizontal tailplane & tail rotor fairing on top
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(cx, 2.8);
    ctx.lineTo(cx + 5.8, 4.0);
    ctx.lineTo(cx + 5.4, 6.2);
    ctx.lineTo(cx - 2.0, 6.2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 0.45;
    ctx.stroke();

    // Long tapered cylindrical tail boom
    const boomGrad = ctx.createLinearGradient(cx - 2, 4, cx + 2, 4);
    boomGrad.addColorStop(0, '#94A3B8');
    boomGrad.addColorStop(0.5, '#475569');
    boomGrad.addColorStop(1, '#1E293B');
    ctx.fillStyle = boomGrad;
    ctx.beginPath();
    ctx.moveTo(cx - 1.2, 3.2);
    ctx.lineTo(cx + 1.2, 3.2);
    ctx.lineTo(cx + 2.5, 20.5);
    ctx.lineTo(cx - 2.5, 20.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tapered boat-hull Sea King fuselage facing South
    const hullGrad = ctx.createLinearGradient(cx - 6, 18, cx + 6, 44);
    hullGrad.addColorStop(0, '#94A3B8');
    hullGrad.addColorStop(0.5, '#475569');
    hullGrad.addColorStop(1, '#1E293B');
    ctx.fillStyle = hullGrad;
    ctx.beginPath();
    ctx.moveTo(cx, 18.0);
    ctx.bezierCurveTo(cx + 4.8, 19.0, cx + 5.8, 25.0, cx + 5.4, 34.0);
    ctx.bezierCurveTo(cx + 5.0, 41.0, cx + 3.2, 44.5, cx, 45.2);
    ctx.bezierCurveTo(cx - 3.2, 44.5, cx - 5.0, 41.0, cx - 5.4, 34.0);
    ctx.bezierCurveTo(cx - 5.8, 25.0, cx - 4.8, 19.0, cx, 18.0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Streamlined twin main-wheel sponsons curving cleanly out of boat hull
    for (const side of [-1, 1]) {
      ctx.fillStyle = side < 0 ? '#64748B' : '#334155';
      ctx.beginPath();
      ctx.moveTo(cx + side * 4.6, 26.2);
      ctx.quadraticCurveTo(cx + side * 8.2, 28.0, cx + side * 7.8, 32.5);
      ctx.quadraticCurveTo(cx + side * 7.4, 35.8, cx + side * 4.6, 34.8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Twin Rolls-Royce Gnome dorsal turbine doghouse fairing
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(cx - 2.6, 21.0, 5.2, 10.5, 2.2);
    ctx.fill();
    ctx.fillStyle = '#090D16';
    ctx.beginPath();
    ctx.ellipse(cx - 1.3, 21.6, 0.75, 1.0, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 1.3, 21.6, 0.75, 1.0, 0, 0, Math.PI * 2);
    ctx.fill();

    // Curved Royal Navy panoramic cockpit glass
    drawRealisticCanopy(ctx, cx, 39.8, 3.6, 2.6);

    // Search/Rescue yellow band & dorsal spine antenna
    ctx.fillStyle = '#FACC15';
    ctx.fillRect(cx - 1.6, 13.5, 3.2, 2.0);
    drawRoyalNavyRoundel(ctx, cx - 3.2, 28.5, 1.3);
  });
}

export function buildMSLynx(): CompiledSprite {
  return compileRealisticSprite(30, 38, (ctx, w) => {
    const cx = w / 2;

    // Swept horizontal tailplane & vertical fin
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(cx - 4.8, 3.2);
    ctx.lineTo(cx + 4.8, 3.2);
    ctx.lineTo(cx + 4.2, 5.2);
    ctx.lineTo(cx - 4.2, 5.2);
    ctx.closePath();
    ctx.fill();

    // Sleek tapered tail boom
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(cx - 1.0, 2.6);
    ctx.lineTo(cx + 1.0, 2.6);
    ctx.lineTo(cx + 1.8, 16.0);
    ctx.lineTo(cx - 1.8, 16.0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 0.45;
    ctx.stroke();

    // Sea Skua missiles slung on curved outrigger struts
    drawStreamlinedStore(ctx, cx - 6.8, 25.0, 7.0, 0.58, '#F1F5F9', '#DC2626', true);
    drawStreamlinedStore(ctx, cx + 6.8, 25.0, 7.0, 0.58, '#F1F5F9', '#DC2626', true);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(cx - 6.8, 25.5);
    ctx.lineTo(cx + 6.8, 25.5);
    ctx.stroke();

    // Streamlined teardrop Lynx cabin fuselage
    const hullGrad = ctx.createLinearGradient(cx - 4.5, 15, cx + 4.5, 35);
    hullGrad.addColorStop(0, '#94A3B8');
    hullGrad.addColorStop(0.5, '#475569');
    hullGrad.addColorStop(1, '#1E293B');
    ctx.fillStyle = hullGrad;
    ctx.beginPath();
    ctx.moveTo(cx, 15.0);
    ctx.bezierCurveTo(cx + 3.8, 16.0, cx + 4.4, 21.5, cx + 4.0, 28.0);
    ctx.bezierCurveTo(cx + 3.4, 33.5, cx + 1.8, 35.4, cx, 35.8);
    ctx.bezierCurveTo(cx - 1.8, 35.4, cx - 3.4, 33.5, cx - 4.0, 28.0);
    ctx.bezierCurveTo(cx - 4.4, 21.5, cx - 3.8, 16.0, cx, 15.0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Twin dorsal Gem turbine cowling & nose radar blister
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(cx - 2.0, 17.5, 4.0, 8.2, 1.8);
    ctx.fill();

    drawRealisticCanopy(ctx, cx, 31.2, 2.8, 2.2);
  });
}

// ============================================================================
// 5B. AVRO VULCAN B.2 — Signature Compound Cranked-Crescent Delta Wing (64x44)
// ============================================================================
export function buildMSVulcan(): CompiledSprite {
  return compileRealisticSprite(64, 44, (ctx, w, h) => {
    const cx = w / 2;
    ctx.save();
    ctx.translate(cx, h / 2);
    ctx.rotate(Math.PI);
    ctx.translate(-cx, -h / 2);

    // Authentic compound kinked-edge Avro Vulcan B.2 delta silhouette!
    const vulcanPath = () => {
      ctx.beginPath();
      ctx.moveTo(cx, 2.2); // Bomber nosecone
      ctx.bezierCurveTo(cx + 2.4, 5.5, cx + 3.4, 10.2, cx + 4.4, 13.0);
      // Inner steep sweep -> subtle mid-wing kink -> shallower outer crescent wingtip
      ctx.lineTo(cx + 15.2, 22.8);
      ctx.quadraticCurveTo(cx + 24.5, 28.5, cx + 29.8, 32.8);
      ctx.quadraticCurveTo(cx + 30.8, 34.4, cx + 28.8, 35.2);
      // Swept trailing edge back to four-jet tailcone
      ctx.lineTo(cx + 7.5, 32.8);
      ctx.quadraticCurveTo(cx + 4.5, 35.8, cx + 2.8, 39.2);
      ctx.lineTo(cx - 2.8, 39.2);
      ctx.quadraticCurveTo(cx - 4.5, 35.8, cx - 7.5, 32.8);
      ctx.lineTo(cx - 28.8, 35.2);
      ctx.quadraticCurveTo(cx - 30.8, 34.4, cx - 29.8, 32.8);
      ctx.quadraticCurveTo(cx - 24.5, 28.5, cx - 15.2, 22.8);
      ctx.lineTo(cx - 4.4, 13.0);
      ctx.bezierCurveTo(cx - 3.4, 10.2, cx - 2.4, 5.5, cx, 2.2);
      ctx.closePath();
    };

    vulcanPath();
    const wingGrad = ctx.createLinearGradient(cx - 30, 8, cx + 30, 38);
    wingGrad.addColorStop(0, '#5B6B40');
    wingGrad.addColorStop(0.5, '#435032');
    wingGrad.addColorStop(1, '#263222');
    ctx.fillStyle = wingGrad;
    ctx.fill();

    // RAF Operation Black Buck Dark Sea Grey & Olive wrap-around camo pattern
    ctx.save();
    vulcanPath();
    ctx.clip();
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.ellipse(cx - 14.5, 28.0, 9.5, 5.5, 0.3, 0, Math.PI * 2);
    ctx.ellipse(cx + 15.5, 29.0, 8.8, 5.0, -0.35, 0, Math.PI * 2);
    ctx.ellipse(cx, 20.5, 6.5, 7.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Elevon control surface lines along swept trailing edge
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(cx - 27.5, 33.4);
    ctx.lineTo(cx - 8.2, 31.2);
    ctx.moveTo(cx + 8.2, 31.2);
    ctx.lineTo(cx + 27.5, 33.4);
    ctx.stroke();
    ctx.restore();

    vulcanPath();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 0.55;
    ctx.stroke();

    // Flush paired Olympus wing-root intakes & quad tailpipe exhausts
    for (const side of [-1, 1]) {
      ctx.fillStyle = '#0B111A';
      ctx.beginPath();
      ctx.ellipse(cx + side * 6.8, 17.5, 2.2, 0.85, side * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const ox of [-4.6, -2.5, 2.5, 4.6]) {
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.ellipse(cx + ox, 33.6, 0.85, 1.4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    drawRealisticCanopy(ctx, cx, 8.6, 1.9, 2.2);
    drawRoyalNavyRoundel(ctx, cx - 16.5, 28.5, 2.0);
    drawRoyalNavyRoundel(ctx, cx + 16.5, 28.5, 2.0);
    drawPanelSeamLines(ctx, [
      [cx, 12, cx, 35],
      [cx - 12, 22, cx - 12, 32],
      [cx + 12, 22, cx + 12, 32],
    ]);
    drawWingtipNavLights(ctx, cx - 29.4, cx + 29.4, 33.6);
    ctx.restore();
  });
}

// ============================================================================
// 6. REALISTIC COASTAL GROUND EMPLACEMENTS (Curved Revetments, Field Guns & Radars)
// ============================================================================
export function buildMSBoforsAA(): CompiledSprite {
  return compileRealisticSprite(28, 28, (ctx, w, h) => {
    const cx = w / 2;
    const cy = h / 2;

    // Turf-draped circular blast berm
    const bermGrad = ctx.createRadialGradient(cx - 2, cy - 2, 2, cx, cy, 12.6);
    bermGrad.addColorStop(0, '#647244');
    bermGrad.addColorStop(0.75, '#4A5532');
    bermGrad.addColorStop(1, '#2D341F');
    ctx.fillStyle = bermGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 12.2, 0, Math.PI * 2);
    ctx.fill();

    // Authentic sandbag parapet rings (organic staggered ovals)
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const sx = cx + Math.cos(a) * 9.5;
      const sy = cy + Math.sin(a) * 9.5;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(a + Math.PI / 2);
      ctx.fillStyle = i < 7 ? '#C4AE7C' : '#8A764E';
      ctx.beginPath();
      ctx.ellipse(0, 0, 2.2, 1.25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.5)';
      ctx.lineWidth = 0.35;
      ctx.stroke();
      ctx.restore();
    }

    // Sunken steel gun pit floor
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(cx, cy, 7.2, 0, Math.PI * 2);
    ctx.fill();

    // Central Bofors 40mm L/70 wheeled/outrigger mount carriage
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.1;
    for (let leg = 0; leg < 4; leg++) {
      const a = (leg * Math.PI) / 2 + Math.PI / 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * 5.8, cy + Math.sin(a) * 5.8);
      ctx.stroke();
    }
    ctx.fillStyle = '#4A5832';
    ctx.beginPath();
    ctx.arc(cx, cy, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 0.45;
    ctx.stroke();
  });
}

export function buildMSRapierSam(): CompiledSprite {
  return compileRealisticSprite(32, 32, (ctx, w, h) => {
    const cx = w / 2;
    const cy = h / 2;

    // Realistic British Army camouflaged circular firing pit & earth berm (NOT a Lego tank!)
    const pitGrad = ctx.createRadialGradient(cx, cy, 3, cx, cy, 14);
    pitGrad.addColorStop(0, '#364125');
    pitGrad.addColorStop(0.75, '#4A5532');
    pitGrad.addColorStop(1, 'rgba(30, 38, 22, 0)');
    ctx.fillStyle = pitGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();

    // Towed Rapier 4-missile optical launcher turntable base & stabilizer outriggers
    ctx.strokeStyle = '#53623A';
    ctx.lineWidth = 1.4;
    for (let leg = 0; leg < 3; leg++) {
      const a = (leg * Math.PI * 2) / 3 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * 9.5, cy + Math.sin(a) * 9.5);
      ctx.stroke();
    }

    // Circular camouflage turret dome & paired side missile pods
    ctx.fillStyle = '#475532';
    ctx.beginPath();
    ctx.arc(cx, cy, 4.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 0.45;
    ctx.stroke();

    // 4 Tapered white-and-red Rapier SAMs mounted in twin pods flanking the tracker dome
    for (const mx of [-6.4, -4.8, 4.8, 6.4]) {
      drawStreamlinedStore(ctx, cx + mx, cy + 0.5, 7.8, 0.55, '#F1F5F9', '#DC2626', true);
    }

    // Blindfire optical/radar tracker dome on top
    const domeGrad = ctx.createRadialGradient(cx - 0.8, cy - 0.8, 0.3, cx, cy, 2.8);
    domeGrad.addColorStop(0, '#F8FAFC');
    domeGrad.addColorStop(0.7, '#94A3B8');
    domeGrad.addColorStop(1, '#334155');
    ctx.fillStyle = domeGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 2.7, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function buildMSRadarBunker(): CompiledSprite {
  return compileRealisticSprite(34, 34, (ctx, w, h) => {
    const cx = w / 2;
    const cy = h / 2;

    // Turf earth mound revetment (smooth gradient blending onto Malvinas island!)
    const berm = ctx.createRadialGradient(cx, cy, 4, cx, cy, 15.5);
    berm.addColorStop(0, '#4E5C34');
    berm.addColorStop(0.75, '#3A4628');
    berm.addColorStop(1, 'rgba(30, 38, 22, 0)');
    ctx.fillStyle = berm;
    ctx.beginPath();
    ctx.arc(cx, cy, 15.5, 0, Math.PI * 2);
    ctx.fill();

    // Circular reinforced concrete bunker cupola
    const concGrad = ctx.createRadialGradient(cx - 2.5, cy - 2.5, 1, cx, cy, 10.8);
    concGrad.addColorStop(0, '#CBD5E1');
    concGrad.addColorStop(0.55, '#7E8D9C');
    concGrad.addColorStop(1, '#334155');
    ctx.fillStyle = concGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 10.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 0.6;
    ctx.stroke();

    // Moss/camo net overlay draped naturally across north flank
    ctx.fillStyle = 'rgba(72, 88, 46, 0.72)';
    ctx.beginPath();
    ctx.ellipse(cx - 2.2, cy - 3.6, 6.2, 3.6, -0.35, 0, Math.PI * 2);
    ctx.fill();

    // Observation cupola ring & dark armored vision slits
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy + 1.5, 6.4, 0.35, Math.PI - 0.35);
    ctx.stroke();

    // Central Marconi S-band radar pedestal mounting ring
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(cx, cy, 3.2, 0, Math.PI * 2);
    ctx.fill();
  });
}

// ============================================================================
// 7. SOFT ATLANTIC CLOUDS
// ============================================================================
export function buildMSCloud(variant: 0 | 1 | 2): CompiledSprite {
  const sizes = [
    { w: 62, h: 36 },
    { w: 80, h: 46 },
    { w: 102, h: 54 },
  ];
  const { w, h } = sizes[variant];
  return compileRealisticSprite(w, h, (ctx) => {
    const puffs =
      variant === 0
        ? [
            [19, 19, 12],
            [33, 15, 14],
            [45, 19, 11],
            [29, 22, 11],
          ]
        : variant === 1
          ? [
              [19, 25, 13],
              [34, 19, 16],
              [50, 20, 15],
              [62, 26, 12],
              [42, 27, 13],
            ]
          : [
              [22, 31, 15],
              [40, 23, 19],
              [60, 22, 18],
              [78, 29, 15],
              [48, 32, 16],
              [66, 33, 14],
            ];

    ctx.fillStyle = 'rgba(100, 145, 195, 0.45)';
    for (const [cx, cy, r] of puffs) {
      ctx.beginPath();
      ctx.arc(cx, cy + 3.2, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(226, 238, 250, 0.78)';
    for (const [cx, cy, r] of puffs) {
      ctx.beginPath();
      ctx.arc(cx, cy, r - 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (const [cx, cy, r] of puffs) {
      ctx.beginPath();
      ctx.arc(cx - 1.2, cy - 2.0, Math.max(3, r - 3.6), 0, Math.PI * 2);
      ctx.fill();
    }
  });
}
