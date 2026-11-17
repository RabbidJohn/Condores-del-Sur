import { Music, Pause, Play, RotateCcw, SkipForward, Trophy, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getAircraftSpec } from '../game/aircraft';
import { AircraftId, HudSnapshot } from '../game/types';

interface VictoryTributeVideoProps {
  hud: HudSnapshot;
  muted: boolean;
  musicMuted: boolean;
  onToggleMute: () => void;
  onToggleMusic: () => void;
  onShowSummary: () => void;
  onRestart: () => void;
}

interface TributeAct {
  start: number;
  end: number;
  kicker: string;
  verse: string;
}

const TOTAL_DURATION = 34;

const TRIBUTE_ACTS: TributeAct[] = [
  {
    start: 0,
    end: 7.2,
    kicker: '2 de Abril — 14 de Junio de 1982 · Atlántico Sur',
    verse:
      'Despegaron entre la niebla helada y las ráfagas del sur. Algunos regresaron con las alas heridas; otros quedaron eternamente de guardia en el cielo austral.',
  },
  {
    start: 7.2,
    end: 14.8,
    kicker: '2 de Mayo de 1982 · Latitud 55°24\' Sur · Crucero ARA General Belgrano',
    verse:
      'En memoria de los 323 marinos que descansan en las profundidades del mar argentino, centinelas eternos de nuestra soberanía.',
  },
  {
    start: 14.8,
    end: 22.4,
    kicker: 'Puerto Darwin · Pradera del Ganso · Monte Longdon',
    verse:
      'Soldados, pilotos y marinos abrazados por la turba sagrada que defendieron con valor, entrega y hermandad.',
  },
  {
    start: 22.4,
    end: 28.8,
    kicker: '649 Héroes Caídos · Veteranos de Malvinas',
    verse:
      'Mientras el viento del Atlántico Sur sople sobre las islas, su coraje y su memoria jamás serán olvidados.',
  },
];

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function easeInOut(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

function drawJetSilhouette(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  bankAngle: number,
  aircraftId: AircraftId,
  sunHighlight: string
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(bankAngle);
  ctx.scale(scale, scale);

  // Contrail wisps from wingtips
  ctx.fillStyle = 'rgba(226, 240, 255, 0.25)';
  ctx.fillRect(-28, 6, 3, 24);
  ctx.fillRect(25, 6, 3, 24);

  // Aircraft body silhouette (rear-3/4 climbing aspect)
  ctx.fillStyle = '#0B1320';
  ctx.beginPath();
  if (aircraftId === 'dagger') {
    // Delta Mirage/Dagger
    ctx.moveTo(0, -24);
    ctx.lineTo(5, -6);
    ctx.lineTo(30, 12);
    ctx.lineTo(28, 16);
    ctx.lineTo(5, 13);
    ctx.lineTo(3, 22);
    ctx.lineTo(-3, 22);
    ctx.lineTo(-5, 13);
    ctx.lineTo(-28, 16);
    ctx.lineTo(-30, 12);
    ctx.lineTo(-5, -6);
  } else if (aircraftId === 'pucara') {
    // Twin-turboprop Pucara
    ctx.moveTo(0, -22);
    ctx.lineTo(4, -7);
    ctx.lineTo(34, -1);
    ctx.lineTo(34, 5);
    ctx.lineTo(13, 5);
    ctx.lineTo(13, 10);
    ctx.lineTo(9, 10);
    ctx.lineTo(5, 5);
    ctx.lineTo(4, 20);
    ctx.lineTo(14, 22);
    ctx.lineTo(14, 25);
    ctx.lineTo(-14, 25);
    ctx.lineTo(-14, 22);
    ctx.lineTo(-4, 20);
    ctx.lineTo(-5, 5);
    ctx.lineTo(-9, 10);
    ctx.lineTo(-13, 10);
    ctx.lineTo(-13, 5);
    ctx.lineTo(-34, 5);
    ctx.lineTo(-34, -1);
    ctx.lineTo(-4, -7);
  } else {
    // A-4 Skyhawk / Super Etendard swept delta-ish silhouette
    ctx.moveTo(0, -24);
    ctx.lineTo(5, -8);
    ctx.lineTo(28, 9);
    ctx.lineTo(26, 14);
    ctx.lineTo(5, 11);
    ctx.lineTo(11, 20);
    ctx.lineTo(10, 23);
    ctx.lineTo(-10, 23);
    ctx.lineTo(-11, 20);
    ctx.lineTo(-5, 11);
    ctx.lineTo(-26, 14);
    ctx.lineTo(-28, 9);
    ctx.lineTo(-5, -8);
  }
  ctx.closePath();
  ctx.fill();

  // Golden sunset rim highlight along upper fuselage & leading wing edges
  ctx.strokeStyle = sunHighlight;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-27, 10);
  ctx.lineTo(-4, -7);
  ctx.lineTo(0, -24);
  ctx.lineTo(4, -7);
  ctx.lineTo(27, 10);
  ctx.stroke();

  // Soft warm jet exhaust glow
  const glow = ctx.createRadialGradient(0, 22, 1, 0, 22, 12);
  glow.addColorStop(0, 'rgba(253, 224, 71, 0.85)');
  glow.addColorStop(0.5, 'rgba(249, 115, 22, 0.35)');
  glow.addColorStop(1, 'rgba(249, 115, 22, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 22, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function renderScene1MissingMan(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  localT: number,
  aircraftId: AircraftId
): void {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.68);
  skyGrad.addColorStop(0, '#060F1E');
  skyGrad.addColorStop(0.45, '#193556');
  skyGrad.addColorStop(0.82, '#5F7793');
  skyGrad.addColorStop(1, '#E6A65C');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Golden sunbeams breaking through parting southern clouds
  const sunX = w * 0.56;
  const sunY = h * 0.62;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 12, sunX, sunY, 340);
  sunGlow.addColorStop(0, 'rgba(255, 237, 178, 0.72)');
  sunGlow.addColorStop(0.35, 'rgba(246, 180, 14, 0.28)');
  sunGlow.addColorStop(1, 'rgba(246, 180, 14, 0)');
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, w, h);

  // Diagonal volumetric sun shafts
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 4; i++) {
    const rayAlpha = 0.06 + 0.02 * Math.sin(localT * 0.9 + i);
    ctx.fillStyle = `rgba(253, 224, 140, ${rayAlpha})`;
    ctx.beginPath();
    ctx.moveTo(sunX - 40 + i * 22, sunY);
    ctx.lineTo(sunX - 240 + i * 130, 0);
    ctx.lineTo(sunX - 130 + i * 130, 0);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Soft drifting storm cloud banks
  for (let i = 0; i < 8; i++) {
    const cx = ((i * 180 - localT * 14) % (w + 260)) - 130;
    const cy = 62 + (i % 3) * 48;
    const cg = ctx.createRadialGradient(cx, cy, 10, cx, cy, 130);
    cg.addColorStop(0, 'rgba(18, 32, 54, 0.52)');
    cg.addColorStop(1, 'rgba(18, 32, 54, 0)');
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 150, 46, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Choppy twilight South Atlantic ocean below horizon
  const horizonY = h * 0.66;
  const seaGrad = ctx.createLinearGradient(0, horizonY, 0, h);
  seaGrad.addColorStop(0, '#27405C');
  seaGrad.addColorStop(0.25, '#122842');
  seaGrad.addColorStop(1, '#050C17');
  ctx.fillStyle = seaGrad;
  ctx.fillRect(0, horizonY, w, h - horizonY);

  // Shimmering sunlight reflection path on ocean waves
  for (let row = 0; row < 26; row++) {
    const ry = horizonY + 4 + row * 7.2;
    const depth = row / 26;
    const waveW = 40 + depth * 180 + Math.sin(localT * 2.2 + row * 0.8) * 18;
    const rx = sunX + Math.sin(localT * 1.4 + row) * 14;
    ctx.fillStyle = `rgba(251, 211, 141, ${0.28 * (1 - depth * 0.72)})`;
    ctx.fillRect(rx - waveW * 0.5, ry, waveW, 2);
  }

  // Rolling sea swell crests
  ctx.strokeStyle = 'rgba(148, 197, 239, 0.18)';
  ctx.lineWidth = 1.5;
  for (let wIdx = 0; wIdx < 11; wIdx++) {
    const wy = horizonY + 14 + wIdx * 16;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 24) {
      const dy = Math.sin(x * 0.018 + localT * 1.6 + wIdx) * (2 + wIdx * 0.25);
      if (x === 0) ctx.moveTo(x, wy + dy);
      else ctx.lineTo(x, wy + dy);
    }
    ctx.stroke();
  }

  // 4 Argentine aircraft in Missing-Man Formation climbing gently toward sunset
  const climbProgress = clamp01(localT / 7.2);
  const baseX = w * 0.44 + climbProgress * 65;
  const baseY = h * 0.52 - climbProgress * 36;

  // Leader & Left/Outer wingmen fly steady
  drawJetSilhouette(ctx, baseX, baseY, 1.08, -0.04, aircraftId, 'rgba(253, 224, 140, 0.75)');
  drawJetSilhouette(ctx, baseX - 96, baseY + 38, 0.96, -0.05, aircraftId, 'rgba(253, 224, 140, 0.6)');
  drawJetSilhouette(ctx, baseX + 168, baseY + 62, 0.88, -0.03, aircraftId, 'rgba(253, 224, 140, 0.55)');

  // #2 Wingman pulls up gracefully into the golden sky ("Formación del Hombre Ausente")
  const breakAway = easeInOut((localT - 2.4) / 4.2);
  const absentX = baseX + 86 + breakAway * 38;
  const absentY = baseY + 26 - breakAway * 210;
  const absentScale = Math.max(0.42, 0.96 - breakAway * 0.54);
  if (breakAway > 0.02) {
    ctx.save();
    const trailGrad = ctx.createLinearGradient(baseX + 86, baseY + 26, absentX, absentY);
    trailGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    trailGrad.addColorStop(1, 'rgba(254, 240, 138, 0.55)');
    ctx.strokeStyle = trailGrad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(baseX + 86, baseY + 26);
    ctx.quadraticCurveTo(baseX + 98, baseY - 55, absentX, absentY);
    ctx.stroke();
    ctx.restore();
  }
  ctx.save();
  ctx.globalAlpha = clamp01(1 - breakAway * 0.55);
  drawJetSilhouette(
    ctx,
    absentX,
    absentY,
    absentScale,
    -0.06 - breakAway * 0.35,
    aircraftId,
    'rgba(255, 247, 200, 0.9)'
  );
  ctx.restore();
}

function renderScene2BelgranoVigil(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  localT: number
): void {
  // Deep solemn midnight sky & cold South Atlantic sea
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#020611');
  bg.addColorStop(0.56, '#08182E');
  bg.addColorStop(0.64, '#0B223D');
  bg.addColorStop(1, '#020710');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Twinkling Southern Cross (Cruz del Sur) & polar stars
  const crossStars = [
    { x: 0.74, y: 0.14, r: 2.6 }, // Acrux
    { x: 0.72, y: 0.28, r: 2.2 }, // Gacrux
    { x: 0.67, y: 0.21, r: 1.9 },
    { x: 0.79, y: 0.20, r: 2.0 },
    { x: 0.75, y: 0.24, r: 1.4 },
  ];
  for (let i = 0; i < 42; i++) {
    const sx = ((i * 197 + 53) % 940) + 10;
    const sy = ((i * 89 + 19) % 280) + 14;
    const tw = 0.25 + 0.45 * Math.sin(localT * 1.8 + i * 1.3);
    ctx.fillStyle = `rgba(224, 242, 254, ${Math.max(0.12, tw)})`;
    ctx.fillRect(sx, sy, 1.8, 1.8);
  }
  for (const s of crossStars) {
    const glow = ctx.createRadialGradient(w * s.x, h * s.y, 0.5, w * s.x, h * s.y, 10);
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    glow.addColorStop(0.4, 'rgba(147, 197, 253, 0.45)');
    glow.addColorStop(1, 'rgba(147, 197, 253, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(w * s.x, h * s.y, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  // Soft moonlight mist behind the cruiser
  const horizonY = h * 0.61;
  const moonGlow = ctx.createRadialGradient(w * 0.32, horizonY - 50, 10, w * 0.32, horizonY - 50, 260);
  moonGlow.addColorStop(0, 'rgba(116, 172, 223, 0.25)');
  moonGlow.addColorStop(1, 'rgba(116, 172, 223, 0)');
  ctx.fillStyle = moonGlow;
  ctx.fillRect(0, 0, w, horizonY + 40);

  // Detailed Profile Silhouette of Cruiser ARA General Belgrano (C-4) gliding peacefully
  const shipX = w * 0.52 - localT * 9;
  const shipY = horizonY;
  ctx.save();
  ctx.translate(shipX, shipY);

  // Hull
  ctx.fillStyle = '#070F1C';
  ctx.beginPath();
  ctx.moveTo(-210, 0);
  ctx.lineTo(200, 0);
  ctx.lineTo(222, -16);
  ctx.lineTo(140, -16);
  ctx.lineTo(132, -22);
  ctx.lineTo(-140, -22);
  ctx.lineTo(-185, -14);
  ctx.lineTo(-208, -12);
  ctx.closePath();
  ctx.fill();

  // Turrets A, B, X, Y + Superstructure + Dual Funnels + Lattice Masts
  ctx.fillRect(-135, -32, 34, 10); // Aft turret
  ctx.fillRect(-165, -28, 28, 6);
  ctx.fillRect(102, -32, 34, 10); // Forward B turret
  ctx.fillRect(138, -27, 28, 6);  // A turret
  // Gun barrels
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#1E3A5F';
  ctx.beginPath();
  ctx.moveTo(134, -29);
  ctx.lineTo(174, -33);
  ctx.moveTo(166, -24);
  ctx.lineTo(202, -26);
  ctx.moveTo(-135, -29);
  ctx.lineTo(-175, -33);
  ctx.stroke();

  // Bridge & Deckhouses
  ctx.fillStyle = '#081222';
  ctx.fillRect(-95, -42, 185, 20);
  ctx.fillRect(28, -64, 52, 24);
  ctx.fillRect(42, -78, 22, 14);
  // Twin Funnels
  ctx.fillRect(-10, -68, 22, 26);
  ctx.fillRect(-56, -64, 20, 22);
  // Lattice Masts
  ctx.strokeStyle = '#132642';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(52, -78);
  ctx.lineTo(52, -118);
  ctx.moveTo(38, -98);
  ctx.lineTo(66, -98);
  ctx.moveTo(-42, -64);
  ctx.lineTo(-42, -104);
  ctx.stroke();

  // Gentle rim light on deck & masthead white lantern
  ctx.strokeStyle = 'rgba(147, 197, 253, 0.38)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-208, -12);
  ctx.lineTo(220, -16);
  ctx.stroke();
  ctx.restore();

  // Rising 323 Golden Star Lanterns ascending softly from the sea
  for (let i = 0; i < 68; i++) {
    const seed = i * 37.7;
    const lx = ((seed * 19.3) % (w - 80)) + 40;
    const cycle = (localT * 0.14 + (seed % 1)) % 1;
    const ly = horizonY + 120 - cycle * (horizonY + 110);
    const sway = Math.sin(localT * 1.4 + seed) * 14;
    const alpha = Math.sin(cycle * Math.PI) * 0.82;
    const rad = 1.5 + (i % 3) * 0.9;
    const g = ctx.createRadialGradient(lx + sway, ly, 0.2, lx + sway, ly, rad * 4.5);
    g.addColorStop(0, `rgba(254, 243, 199, ${alpha})`);
    g.addColorStop(0.5, `rgba(246, 180, 14, ${alpha * 0.45})`);
    g.addColorStop(1, 'rgba(246, 180, 14, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(lx + sway, ly, rad * 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Calm dark sea swells foreground
  for (let r = 0; r < 10; r++) {
    const wy = horizonY + 12 + r * 20;
    ctx.strokeStyle = `rgba(116, 172, 223, ${0.14 - r * 0.01})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 24) {
      const yOff = Math.sin(x * 0.015 - localT * 1.1 + r) * 2.5;
      if (x === 0) ctx.moveTo(x, wy + yOff);
      else ctx.lineTo(x, wy + yOff);
    }
    ctx.stroke();
  }
}

function renderScene3DarwinCrosses(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  localT: number
): void {
  // Breaking cold celeste-and-rose southern dawn over Malvinas hills
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.62);
  sky.addColorStop(0, '#10243E');
  sky.addColorStop(0.5, '#3A6690');
  sky.addColorStop(0.84, '#8BB8DC');
  sky.addColorStop(1, '#F3CFA0');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const panX = localT * 12;

  // Distant Malvinas mountain ridge (Monte Longdon / Tumbledown silhouette)
  ctx.fillStyle = '#25384B';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.6);
  for (let x = 0; x <= w; x += 30) {
    const ridgeY =
      h * 0.52 -
      Math.sin((x + panX * 0.35) * 0.008) * 26 -
      Math.cos((x + panX * 0.35) * 0.021) * 14;
    ctx.lineTo(x, ridgeY);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Rolling olive-ochre peat hillside of Darwin Cemetery
  const turfGrad = ctx.createLinearGradient(0, h * 0.56, 0, h);
  turfGrad.addColorStop(0, '#3C4D33');
  turfGrad.addColorStop(0.5, '#2A3623');
  turfGrad.addColorStop(1, '#141B11');
  ctx.fillStyle = turfGrad;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.62);
  for (let x = 0; x <= w; x += 24) {
    const hillY = h * 0.6 + Math.sin((x + panX) * 0.006) * 16;
    ctx.lineTo(x, hillY);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Stone perimeter wall & Argentine mast with slow-waving Flag
  const mastX = w * 0.78 - panX * 0.4;
  const mastBaseY = h * 0.63;
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(mastX, mastBaseY);
  ctx.lineTo(mastX, mastBaseY - 125);
  ctx.stroke();

  // Waving Argentine Flag atop the mast
  const flagW = 74;
  const flagH = 44;
  const fx0 = mastX;
  const fy0 = mastBaseY - 122;
  for (let slice = 0; slice < flagW; slice += 2) {
    const wave = Math.sin(localT * 3.1 + slice * 0.14) * (2.2 + (slice / flagW) * 3.5);
    ctx.fillStyle = '#74ACDF';
    ctx.fillRect(fx0 + slice, fy0 + wave, 2.5, flagH * 0.33);
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(fx0 + slice, fy0 + flagH * 0.33 + wave, 2.5, flagH * 0.34);
    ctx.fillStyle = '#74ACDF';
    ctx.fillRect(fx0 + slice, fy0 + flagH * 0.67 + wave, 2.5, flagH * 0.33);
  }
  // Golden Sol de Mayo on the flag center
  const sunWave = Math.sin(localT * 3.1 + flagW * 0.5 * 0.14) * 3.8;
  ctx.fillStyle = '#F6B40E';
  ctx.beginPath();
  ctx.arc(fx0 + flagW * 0.48, fy0 + flagH * 0.5 + sunWave, 5.2, 0, Math.PI * 2);
  ctx.fill();

  // Perspective rows of dignified white Darwin crosses
  const rows = [
    { y: h * 0.68, scale: 0.56, count: 11, offset: 95 },
    { y: h * 0.76, scale: 0.78, count: 9, offset: 50 },
    { y: h * 0.87, scale: 1.06, count: 7, offset: 15 },
  ];
  for (const row of rows) {
    for (let i = 0; i < row.count; i++) {
      const cx =
        row.offset + i * (112 * row.scale) - panX * (0.55 + row.scale * 0.35);
      if (cx < -40 || cx > w + 40) continue;
      const cy = row.y + Math.sin(cx * 0.01) * 4;
      const ch = 46 * row.scale;
      const cw = 28 * row.scale;
      const thick = 6.5 * row.scale;

      // Ground shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.beginPath();
      ctx.ellipse(cx + 6 * row.scale, cy + 2, cw * 0.42, 3 * row.scale, 0, 0, Math.PI * 2);
      ctx.fill();

      // White cross
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(cx - thick * 0.5, cy - ch, thick, ch);
      ctx.fillRect(cx - cw * 0.5, cy - ch * 0.72, cw, thick * 0.88);
      // Warm dawn rim on left edge
      ctx.fillStyle = '#FDE68A';
      ctx.fillRect(cx - thick * 0.5, cy - ch, 1.5, ch);
    }
  }

  // Swaying golden tussock grass & soft drifting petals/light embers
  ctx.strokeStyle = '#6B7745';
  ctx.lineWidth = 1.6;
  for (let g = 0; g < 55; g++) {
    const gx = ((g * 31 - panX * 1.1) % (w + 60)) - 20;
    const gy = h - 6 - (g % 5) * 8;
    const bend = Math.sin(localT * 2.4 + g) * 7 + 5;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.quadraticCurveTo(gx + bend * 0.5, gy - 14, gx + bend, gy - 26);
    ctx.stroke();
  }

  for (let p = 0; p < 24; p++) {
    const px = ((p * 97 + localT * 28) % (w + 60)) - 30;
    const py = h * 0.82 - ((localT * 22 + p * 33) % (h * 0.55));
    ctx.fillStyle = p % 3 === 0 ? 'rgba(251, 191, 36, 0.55)' : 'rgba(248, 250, 252, 0.45)';
    ctx.beginPath();
    ctx.arc(px, py, 2.1, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderScene4FlagDawn(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  localT: number
): void {
  // Radiant golden dawn sky
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#071426');
  sky.addColorStop(0.5, '#193E66');
  sky.addColorStop(0.85, '#C48A47');
  sky.addColorStop(1, '#101C2C');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Monumental silk-waving Argentine Flag filling center-right canvas
  const fx = w * 0.16;
  const fy = h * 0.15;
  const fw = w * 0.68;
  const fh = h * 0.58;
  const sliceW = 4;

  for (let sx = 0; sx < fw; sx += sliceW) {
    const u = sx / fw;
    const waveY = Math.sin(u * 5.2 - localT * 2.6) * (6 + u * 12);
    const shade = 0.84 + 0.16 * Math.cos(u * 5.2 - localT * 2.6);

    const rTop = Math.round(116 * shade);
    const gTop = Math.round(172 * shade);
    const bTop = Math.round(223 * shade);
    const celeste = `rgb(${rTop}, ${gTop}, ${bTop})`;

    const wVal = Math.round(246 * shade);
    const white = `rgb(${wVal}, ${Math.round(248 * shade)}, ${Math.round(252 * shade)})`;

    ctx.fillStyle = celeste;
    ctx.fillRect(fx + sx, fy + waveY, sliceW + 0.5, fh * 0.335);
    ctx.fillStyle = white;
    ctx.fillRect(fx + sx, fy + fh * 0.335 + waveY, sliceW + 0.5, fh * 0.33);
    ctx.fillStyle = celeste;
    ctx.fillRect(fx + sx, fy + fh * 0.665 + waveY, sliceW + 0.5, fh * 0.335);
  }

  // Radiant Sol de Mayo centered on the white stripe
  const centerU = 0.5;
  const sunWaveY = Math.sin(centerU * 5.2 - localT * 2.6) * (6 + centerU * 12);
  const sx = fx + fw * centerU;
  const sy = fy + fh * 0.5 + sunWaveY;

  const halo = ctx.createRadialGradient(sx, sy, 8, sx, sy, 90);
  halo.addColorStop(0, 'rgba(246, 180, 14, 0.55)');
  halo.addColorStop(1, 'rgba(246, 180, 14, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(sx, sy, 90, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(sx, sy);
  ctx.strokeStyle = '#D97706';
  ctx.fillStyle = '#F6B40E';
  for (let r = 0; r < 16; r++) {
    const a = (r / 16) * Math.PI * 2 + localT * 0.08;
    const len = r % 2 === 0 ? 34 : 26;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a - 0.1) * 14, Math.sin(a - 0.1) * 14);
    ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
    ctx.lineTo(Math.cos(a + 0.1) * 14, Math.sin(a + 0.1) * 14);
    ctx.closePath();
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function renderScene5FinalMemorialBg(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  localT: number
): void {
  const grad = ctx.createRadialGradient(w * 0.5, h * 0.42, 30, w * 0.5, h * 0.48, w * 0.72);
  grad.addColorStop(0, '#0D213B');
  grad.addColorStop(0.55, '#061120');
  grad.addColorStop(1, '#02050B');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Soft rising golden embers & gentle stars around the memorial plaque
  for (let i = 0; i < 48; i++) {
    const px = ((i * 157 + 41) % (w - 40)) + 20;
    const py = h - ((localT * 18 + i * 31) % h);
    const pulse = 0.25 + 0.45 * Math.sin(localT * 1.6 + i);
    ctx.fillStyle = i % 3 === 0 ? `rgba(246, 180, 14, ${pulse})` : `rgba(116, 172, 223, ${pulse})`;
    ctx.beginPath();
    ctx.arc(px, py, i % 4 === 0 ? 2.2 : 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function VictoryTributeVideo({
  hud,
  muted,
  musicMuted,
  onToggleMute,
  onToggleMusic,
  onShowSummary,
  onRestart,
}: VictoryTributeVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timeRef = useRef<number>(0);
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const spec = getAircraftSpec(hud.aircraftId);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rafId = 0;
    let lastTs = performance.now();

    const frame = (ts: number) => {
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;

      if (isPlaying) {
        timeRef.current = Math.min(
          TOTAL_DURATION + 60,
          timeRef.current + (prefersReduced ? dt * 0.7 : dt)
        );
        setElapsed(timeRef.current);
      }

      const currentTime = timeRef.current;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);

          if (currentTime < 7.2) {
            renderScene1MissingMan(ctx, w, h, currentTime, hud.aircraftId);
          } else if (currentTime < 14.8) {
            renderScene2BelgranoVigil(ctx, w, h, currentTime - 7.2);
          } else if (currentTime < 22.4) {
            renderScene3DarwinCrosses(ctx, w, h, currentTime - 14.8);
          } else if (currentTime < 28.8) {
            renderScene4FlagDawn(ctx, w, h, currentTime - 22.4);
          } else {
            renderScene5FinalMemorialBg(ctx, w, h, currentTime - 28.8);
          }

          // Smooth cinematic cross-dissolve black veil at act boundaries
          const boundaries = [0, 7.2, 14.8, 22.4, 28.8];
          let fadeDark = 0;
          for (const b of boundaries) {
            const dist = Math.abs(currentTime - b);
            if (dist < 0.75) {
              fadeDark = Math.max(fadeDark, 1 - dist / 0.75);
            }
          }
          if (fadeDark > 0.01) {
            ctx.fillStyle = `rgba(2, 5, 11, ${fadeDark * 0.92})`;
            ctx.fillRect(0, 0, w, h);
          }

          // Warm film vignette
          const vig = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.25, w * 0.5, h * 0.5, w * 0.65);
          vig.addColorStop(0, 'rgba(0,0,0,0)');
          vig.addColorStop(1, 'rgba(2,5,11,0.58)');
          ctx.fillStyle = vig;
          ctx.fillRect(0, 0, w, h);
        }
      }

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, hud.aircraftId]);

  const activeAct = TRIBUTE_ACTS.find((a) => elapsed >= a.start && elapsed < a.end) ?? null;
  const showFinalMemorial = elapsed >= 28.8;
  const finalAlpha = clamp01((elapsed - 29.0) / 1.4);
  const progressPct = clamp01(elapsed / TOTAL_DURATION) * 100;

  const handleReplay = () => {
    timeRef.current = 0;
    setElapsed(0);
    setIsPlaying(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#02050B]/98 px-4 py-4 select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Homenaje a los Héroes de Malvinas"
    >
      {/* Top Cinema Control Bar */}
      <div className="mb-3 flex w-full max-w-5xl items-center justify-between gap-4 text-xs text-slate-300">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="font-arcade text-[10px] text-[#F6B40E]">CAMPAÑA COMPLETADA</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-300">
            {spec.name} · {String(hud.score).padStart(7, '0')} PTS
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="flex h-9 cursor-pointer items-center gap-1.5 border border-slate-700 bg-[#071120] px-3 text-xs font-semibold text-slate-200 transition-colors hover:border-[#74ACDF] whitespace-nowrap shrink-0"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isPlaying ? 'Pausar' : 'Reanudar'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleMusic}
            title="Música de homenaje"
            className="flex h-9 cursor-pointer items-center gap-1.5 border border-slate-700 bg-[#071120] px-3 text-xs font-semibold text-slate-200 transition-colors hover:border-[#74ACDF] whitespace-nowrap shrink-0"
          >
            <Music className={`h-3.5 w-3.5 ${musicMuted ? 'text-slate-500' : 'text-[#74ACDF]'}`} />
            <span>{musicMuted ? 'Música OFF' : 'Música ON'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? 'Activar audio' : 'Silenciar audio'}
            className="flex h-9 w-9 cursor-pointer items-center justify-center border border-slate-700 bg-[#071120] text-slate-200 transition-colors hover:border-[#74ACDF] shrink-0"
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>

          <button
            type="button"
            onClick={onShowSummary}
            className="flex h-9 cursor-pointer items-center gap-1.5 border border-slate-700 bg-[#071120] px-3 text-xs font-semibold text-slate-200 transition-colors hover:border-[#F6B40E] hover:text-white whitespace-nowrap shrink-0"
          >
            <SkipForward className="h-3.5 w-3.5" />
            <span>Ver resumen</span>
          </button>
        </div>
      </div>

      {/* Widescreen 16:9 Cinema Frame */}
      <div className="relative w-full max-w-5xl aspect-video overflow-hidden border border-slate-800 bg-black shadow-[0_0_80px_rgba(116,172,223,0.18)]">
        {/* Top & Bottom Argentine Ribbon Hairlines */}
        <div className="pointer-events-none absolute top-0 right-0 left-0 z-20 flex h-1">
          <div className="h-full flex-1 bg-[#74ACDF]" />
          <div className="h-full flex-1 bg-white" />
          <div className="h-full flex-1 bg-[#74ACDF]" />
        </div>

        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className="block h-full w-full"
        />

        {/* Cinema Letterbox Scrim + Poignant Subtitles for Acts I–IV */}
        {activeAct && !showFinalMemorial && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-6 pt-16 pb-6 sm:px-12 sm:pb-8">
            <p className="text-xs font-semibold tracking-widest text-[#74ACDF]">
              {activeAct.kicker}
            </p>
            <p
              className="font-display mt-2 max-w-3xl text-base leading-relaxed font-semibold text-slate-100 sm:text-xl"
              style={{ textWrap: 'balance' }}
            >
              {activeAct.verse}
            </p>
          </div>
        )}

        {/* Final Monumental Tribute Title Card (Act V) */}
        {showFinalMemorial && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center transition-opacity duration-700"
            style={{ opacity: finalAlpha }}
          >
            {/* Argentine Tricolor Emblem + Sun of Mayo */}
            <div className="mb-5 flex items-center gap-3">
              <span className="h-0.5 w-10 bg-[#74ACDF]" />
              <svg viewBox="0 0 36 36" className="h-9 w-9" aria-hidden="true">
                <circle cx="18" cy="18" r="8" fill="#F6B40E" stroke="#D97706" strokeWidth="1" />
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  const x1 = 18 + Math.cos(angle) * 10;
                  const y1 = 18 + Math.sin(angle) * 10;
                  const x2 = 18 + Math.cos(angle) * (i % 2 === 0 ? 16 : 13);
                  const y2 = 18 + Math.sin(angle) * (i % 2 === 0 ? 16 : 13);
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#F6B40E"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>
              <span className="h-0.5 w-10 bg-[#74ACDF]" />
            </div>

            <p className="font-arcade mb-3 text-[10px] tracking-widest text-[#74ACDF] sm:text-xs">
              1982 · MALVINAS ARGENTINAS
            </p>

            <h2
              className="font-display max-w-4xl text-2xl leading-tight font-bold tracking-wide text-[#FDE68A] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] sm:text-4xl lg:text-5xl"
              style={{ textWrap: 'balance' }}
            >
              EN HOMENAJE A TODOS NUESTROS HÉROES DE MALVINAS
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
              A los 649 compatriotas que dieron su vida en defensa de la Patria y a todos los Veteranos de Guerra. Honor, gratitud y gloria eterna.
            </p>

            <p className="mt-5 text-xs font-semibold tracking-wide text-slate-400">
              Cóndores del Sur 1982 · Hecho por Juan Martin Echegaray
            </p>

            {elapsed >= 29.8 && (
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReplay}
                  className="flex cursor-pointer items-center gap-2 border border-slate-600 bg-[#0A1628]/90 px-4 py-2 text-xs font-semibold text-slate-100 transition-colors hover:border-[#74ACDF] whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Repetir homenaje</span>
                </button>

                <button
                  type="button"
                  onClick={onShowSummary}
                  className="flex cursor-pointer items-center gap-2 border-2 border-[#FDE047] bg-[#74ACDF] px-4 py-2 text-xs font-bold text-[#050A14] transition-colors hover:bg-[#93C5FD] whitespace-nowrap shrink-0"
                >
                  <Trophy className="h-3.5 w-3.5" />
                  <span>Ver estadísticas finales</span>
                </button>

                <button
                  type="button"
                  onClick={onRestart}
                  className="flex cursor-pointer items-center gap-2 border border-slate-600 bg-[#0A1628]/90 px-4 py-2 text-xs font-semibold text-slate-100 transition-colors hover:border-[#F6B40E] whitespace-nowrap shrink-0"
                >
                  <span>Jugar de nuevo</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bottom Progress Track */}
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-30 h-1 bg-slate-900">
          <div
            className="h-full bg-gradient-to-r from-[#74ACDF] via-white to-[#F6B40E] transition-[width] duration-150"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
