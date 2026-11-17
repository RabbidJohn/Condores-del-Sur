import { CompiledSprite, getSpriteBank } from './pixelSprites';
import {
  CarrierSequence,
  EnemyEntity,
  EnemyProjectile,
  ExocetMissile,
  FloatingText,
  OceanFeature,
  Particle,
  PlayerBomb,
  PlayerBullet,
  PlayerState,
  PowerUpEntity,
} from './types';
import { getLevelTheme } from './waves';

// Authentic 90s Capcom/Psikyo vertical arcade resolution
export const PLAYFIELD_W = 380;
export const PLAYFIELD_H = 492;

let oceanTileCache: HTMLCanvasElement | null = null;
let cachedTileLevel = -1;

function getOceanTile(levelNumber: number): HTMLCanvasElement {
  if (oceanTileCache && cachedTileLevel === levelNumber) return oceanTileCache;

  const theme = getLevelTheme(levelNumber);
  const size = 192;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;

  // Distinct per-mission oceanic base color
  ctx.fillStyle = theme.oceanBase;
  ctx.fillRect(0, 0, size, size);

  // Seamless periodic organic bathymetry & current veins (tiled smoothly)
  for (let i = 0; i < 42; i++) {
    const sx = (i * 73) % size;
    const sy = (i * 109) % size;
    const rx = 20 + (i % 4) * 10;
    const ry = 10 + (i % 3) * 6;
    ctx.fillStyle = i % 2 === 0 ? theme.oceanLight : theme.oceanDeep;
    for (const ox of [-size, 0, size]) {
      for (const oy of [-size, 0, size]) {
        ctx.beginPath();
        ctx.ellipse(sx + ox, sy + oy, rx, ry, (i % 5) * 0.2 - 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Soft Atlantic swell highlight lines & troughs tinted for this sector
  for (let i = 0; i < 36; i++) {
    const wx = (i * 47 + 13) % size;
    const wy = (i * 29 + 7) % size;
    const len = 12 + (i % 4) * 7;
    ctx.strokeStyle = i % 3 === 0 ? theme.swellColor : theme.oceanLight;
    ctx.lineWidth = 1.2;
    for (const ox of [-size, 0, size]) {
      ctx.beginPath();
      ctx.moveTo(wx + ox, wy);
      ctx.quadraticCurveTo(wx + ox + len * 0.5, wy - 2.5, wx + ox + len, wy);
      ctx.stroke();
    }
  }

  oceanTileCache = c;
  cachedTileLevel = levelNumber;
  return c;
}

export function renderGameFrame(
  ctx: CanvasRenderingContext2D,
  time: number,
  scrollY: number,
  shakeX: number,
  shakeY: number,
  oceanFeatures: OceanFeature[],
  player: PlayerState,
  bullets: PlayerBullet[],
  bombs: PlayerBomb[],
  exocets: ExocetMissile[],
  enemies: EnemyEntity[],
  enemyProjectiles: EnemyProjectile[],
  powerUps: PowerUpEntity[],
  particles: Particle[],
  floatingTexts: FloatingText[],
  lockedTargetId: number | null,
  levelNumber: number,
  carrier: CarrierSequence | null = null
): void {
  const bank = getSpriteBank();
  const theme = getLevelTheme(levelNumber);

  ctx.save();
  // Backing canvas is 2x logical resolution (760x984) so curved hulls & coastlines render crystal sharp
  ctx.scale(2, 2);
  ctx.translate(Math.round(shakeX * 2) / 2, Math.round(shakeY * 2) / 2);

  // 1. Dynamic Per-Level South Atlantic Ocean + Moving Swell Glints
  drawPixelOcean(ctx, scrollY, time, levelNumber);

  // 2. Diverse Top-Down Malvinas Coastlines, Peninsulas, Reefs, Craters & National Flags
  for (const feat of oceanFeatures) {
    if (feat.kind === 'island') {
      const spr = bank.islands[feat.variant % bank.islands.length];
      const cx = Math.round(feat.x);
      const cy = Math.round(feat.y);
      const sc = feat.scale ?? 1;
      ctx.save();
      ctx.translate(cx, cy);
      if (feat.angle) ctx.rotate(feat.angle);
      ctx.scale((feat.flipX ? -1 : 1) * sc, (feat.flipY ? -1 : 1) * sc);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(spr.canvas, -spr.w / 2, -spr.h / 2, spr.w, spr.h);
      ctx.restore();

      // Animated breaking coastal white surf collar
      const wavePhase = Math.sin(time * 4.2 + feat.seed);
      if (wavePhase > -0.2) {
        ctx.fillStyle = `rgba(224, 242, 254, ${0.42 + wavePhase * 0.28})`;
        ctx.fillRect(cx - Math.round(spr.w * 0.25 * sc), cy + Math.round(spr.h * 0.25 * sc), 6, 1.2);
        ctx.fillRect(cx + Math.round(spr.w * 0.20 * sc), cy - Math.round(spr.h * 0.24 * sc), 5, 1.2);
      }

      // Draw scorched organic blast craters from destroyed coastal batteries
      for (const cr of feat.craters) {
        const rx = Math.round(feat.x + cr.dx);
        const ry = Math.round(feat.y + cr.dy);
        ctx.fillStyle = 'rgba(27, 36, 48, 0.85)';
        ctx.beginPath();
        ctx.ellipse(rx, ry, cr.r, cr.r * 0.78, 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#090D14';
        ctx.beginPath();
        ctx.ellipse(rx, ry, Math.max(1.8, cr.r * 0.45), Math.max(1.4, cr.r * 0.36), 0.25, 0, Math.PI * 2);
        ctx.fill();
      }

      // Waving Argentine or British flag mounted prominently on the island!
      if (feat.flag) {
        drawWavingFlag(ctx, cx + Math.round(6 * sc), cy - Math.round(4 * sc), feat.flag, time + feat.seed);
      }
    } else if (feat.kind === 'kelp') {
      const reef = bank.reefs[feat.variant % bank.reefs.length];
      ctx.save();
      ctx.translate(Math.round(feat.x), Math.round(feat.y));
      if (feat.angle) ctx.rotate(feat.angle);
      ctx.scale(feat.flipX ? -1 : 1, feat.flipY ? -1 : 1);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(reef.canvas, -reef.w / 2, -reef.h / 2, reef.w, reef.h);
      ctx.restore();
    }
  }

  // 3. Lower Cloud Layer (drifting gently over the sea, under planes!)
  for (const feat of oceanFeatures) {
    if (feat.kind === 'cloud' && feat.speedScale < 1.35) {
      const spr = bank.clouds[feat.variant % bank.clouds.length];
      ctx.save();
      ctx.globalAlpha = 0.42;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(spr.canvas, Math.round(feat.x - spr.w / 2), Math.round(feat.y - spr.h / 2), spr.w, spr.h);
      ctx.restore();
    }
  }

  // 4a. Land-Based Ground Enemies (AA Batteries, Rapier SAMs, Radar Bunkers) anchored on islands
  for (const enemy of enemies) {
    if (enemy.active && enemy.isGround) {
      drawEnemySprite(ctx, enemy, bank, time);
    }
  }

  // 4b. Surface Fleet Ships (drawn below aircraft with crisp cenital photographic shading & Kelvin wakes!)
  for (const enemy of enemies) {
    if (enemy.active && enemy.isSurface && !enemy.isGround) {
      drawPixelWake(ctx, enemy, time);
      drawEnemySprite(ctx, enemy, bank, time);
    }
  }

  // 4c. Friendly Argentine Aircraft Carrier ARA Veinticinco de Mayo (V-2) during takeoff & landing
  if (carrier) {
    drawCarrierShip(ctx, carrier, bank.argentineCarrier, time);
  }

  // 5. Sea-level splash rings & water geysers
  ctx.imageSmoothingEnabled = false;
  for (const p of particles) {
    if (p.active && (p.kind === 'water' || p.kind === 'ring')) {
      drawPixelParticle(ctx, p);
    }
  }

  // 6. Falling Mk-82 Bombs (pixel body + pixel shadow on sea)
  for (const b of bombs) {
    if (b.active) {
      drawPixelBomb(ctx, b);
    }
  }

  // 7. AM-39 Exocet Missiles
  for (const m of exocets) {
    if (m.active) {
      drawPixelExocet(ctx, m, time);
    }
  }

  // 8. Exocet Target Lock Reticle
  if (lockedTargetId !== null && !carrier) {
    const target = enemies.find((e) => e.active && e.id === lockedTargetId);
    if (target) {
      drawPixelReticle(ctx, target.x, target.y, time);
    }
  }

  // 9. Power-Up Arcade Icons
  for (const pu of powerUps) {
    if (pu.active) {
      drawPixelPowerUp(ctx, pu, time);
    }
  }

  // 10. Airborne Enemy Shadows & Sprites (Sea Harriers, Sea Kings, Lynx, Vulcan)
  for (const enemy of enemies) {
    if (enemy.active && !enemy.isSurface) {
      drawPixelShadow(ctx, enemy.x + 10, enemy.y + 16, enemy.width * 0.7, enemy.height * 0.65);
      drawEnemySprite(ctx, enemy, bank, time);
    }
  }

  // 11. Varied Player Cannon Tracers (distinct munition silhouettes per aircraft!)
  for (const bul of bullets) {
    if (bul.active) {
      drawPlayerBullet(ctx, bul);
    }
  }

  // 12. Player Argentine Warplane (with takeoff/landing altitude scale on carrier deck!)
  drawPixelPlayer(ctx, player, bank, time, carrier);

  // 13. Pixel Explosions, Fireballs & Smoke
  for (const p of particles) {
    if (p.active && p.kind !== 'water' && p.kind !== 'ring') {
      drawPixelParticle(ctx, p);
    }
  }

  // 14. Enemy Bullets, Flak & Missiles (high-contrast blinking arcade orbs!)
  for (const ep of enemyProjectiles) {
    if (ep.active) {
      drawPixelEnemyProjectile(ctx, ep, time);
    }
  }

  // 15. High Volumetric Painted Clouds (drifting softly above)
  for (const feat of oceanFeatures) {
    if (feat.kind === 'cloud' && feat.speedScale >= 1.35) {
      const spr = bank.clouds[feat.variant % bank.clouds.length];
      ctx.save();
      ctx.globalAlpha = 0.72;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(spr.canvas, Math.round(feat.x - spr.w / 2), Math.round(feat.y - spr.h / 2), spr.w, spr.h);
      ctx.restore();
    }
  }

  // 15b. Atmospheric Sector Lighting & Storm Rain Streaks for Storm Missions
  if (theme.atmosphereTint) {
    ctx.fillStyle = theme.atmosphereTint;
    ctx.fillRect(0, 0, PLAYFIELD_W, PLAYFIELD_H);
  }
  if (theme.rain) {
    drawStormRain(ctx, time);
  }

  // 16. Floating Crisp Pixel Score Popups
  for (const ft of floatingTexts) {
    if (ft.active) {
      const fx = Math.round(ft.x);
      const fy = Math.round(ft.y);
      ctx.font = '7px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#05080F';
      ctx.fillText(ft.text, fx + 1, fy + 1);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, fx, fy);
    }
  }

  ctx.restore();
}

function drawCarrierShip(
  ctx: CanvasRenderingContext2D,
  carrier: CarrierSequence,
  spr: CompiledSprite,
  time: number
): void {
  const cx = carrier.carrierX;
  const cy = carrier.carrierY;
  const halfW = spr.w * 0.32;
  const bowY = cy - spr.h * 0.45;
  const sternY = cy + spr.h * 0.46;
  const ripple = Math.sin(time * 7) * 1.4;

  // North-heading Kelvin wake trailing south astern of ARA Veinticinco de Mayo (V-2)
  ctx.save();
  for (const side of [-1, 1]) {
    const wakeGrad = ctx.createLinearGradient(cx, sternY, cx + side * (halfW + 22), sternY + 64);
    wakeGrad.addColorStop(0, 'rgba(224, 242, 254, 0.76)');
    wakeGrad.addColorStop(0.5, 'rgba(147, 197, 253, 0.36)');
    wakeGrad.addColorStop(1, 'rgba(147, 197, 253, 0)');

    ctx.strokeStyle = wakeGrad;
    ctx.lineWidth = 3.8;
    ctx.beginPath();
    ctx.moveTo(cx + side * (halfW * 0.48), bowY + 20);
    ctx.quadraticCurveTo(
      cx + side * (halfW * 0.92),
      sternY - 6,
      cx + side * (halfW + 20 + ripple),
      sternY + 64
    );
    ctx.stroke();
  }

  const washGrad = ctx.createLinearGradient(cx, sternY - 4, cx, sternY + 56);
  washGrad.addColorStop(0, 'rgba(248, 250, 252, 0.78)');
  washGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.34)');
  washGrad.addColorStop(1, 'rgba(186, 230, 253, 0)');
  ctx.fillStyle = washGrad;
  ctx.beginPath();
  ctx.moveTo(cx - halfW * 0.42, sternY - 4);
  ctx.lineTo(cx + halfW * 0.42, sternY - 4);
  ctx.lineTo(cx + halfW * 0.9, sternY + 56);
  ctx.lineTo(cx - halfW * 0.9, sternY + 56);
  ctx.closePath();
  ctx.fill();

  // Sharp V bow foam at forward prow
  ctx.strokeStyle = 'rgba(248, 250, 252, 0.85)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(cx - halfW * 0.56, bowY + 12 + ripple * 0.3);
  ctx.quadraticCurveTo(cx, bowY - 2, cx + halfW * 0.56, bowY + 12 + ripple * 0.3);
  ctx.stroke();

  // Crisp hi-res top-down aircraft carrier hull
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(spr.canvas, Math.round(cx - spr.w / 2), Math.round(cy - spr.h / 2), spr.w, spr.h);

  // Blinking landing-deck optical guidance lights (LSO "meatball" & stern line-up strobes)
  const guideFlash = Math.floor(time * 8) % 2 === 0;
  ctx.fillStyle = carrier.mode === 'landing' ? (guideFlash ? '#4ADE80' : '#22C55E') : '#FACC15';
  ctx.fillRect(Math.round(cx - 14), Math.round(cy + 6), 2.5, 2.5);
  ctx.fillStyle = guideFlash ? '#F8FAFC' : '#74ACDF';
  ctx.fillRect(Math.round(cx - 4), Math.round(sternY - 4), 2, 2);

  // Argentine Flag flying on ARA Veinticinco de Mayo island mast!
  drawWavingFlag(ctx, Math.round(cx + 18), Math.round(cy - 6), 'ar', time);
  ctx.restore();
}

function drawWavingFlag(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  country: 'ar' | 'uk' | 'uk_navy',
  time: number
): void {
  const w = country === 'uk_navy' ? 14 : 13;
  const h = country === 'uk_navy' ? 9 : 8.5;
  ctx.save();
  // Cast flagpole shadow onto terrain/deck
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(x + 0.8, y + 1);
  ctx.lineTo(x + 0.8, y - 11.5);
  ctx.stroke();

  // Metallic flagpole + golden finial
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 12);
  ctx.stroke();
  ctx.fillStyle = '#FACC15';
  ctx.fillRect(x - 0.8, y - 13, 1.6, 1.3);

  const fx = x + 0.6;
  const fy = y - 12;
  const wave1 = Math.sin(time * 7.5) * 1.1;
  const wave2 = Math.cos(time * 7.5 + 1.2) * 1.4;

  // Cloth drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(fx + 1, fy + 1.2 + wave1 * 0.4, w, h);

  const slices = 4;
  const sw = w / slices;
  for (let s = 0; s < slices; s++) {
    const sx = fx + s * sw;
    const dy = (s / slices) * wave1 + Math.sin(time * 8.5 + s * 1.3) * 0.65 + (s === 3 ? wave2 * 0.25 : 0);
    const sy = fy + dy;

    if (country === 'ar') {
      ctx.fillStyle = '#5B9BD5';
      ctx.fillRect(sx, sy, sw + 0.4, h * 0.34);
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(sx, sy + h * 0.34, sw + 0.4, h * 0.32);
      ctx.fillStyle = '#5B9BD5';
      ctx.fillRect(sx, sy + h * 0.66, sw + 0.4, h * 0.34);
      if (s === 1) {
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(sx + sw * 0.8, sy + h * 0.5, 1.25, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (country === 'uk_navy') {
      // Royal Navy White Ensign field
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(sx, sy, sw + 0.4, h);
    } else {
      ctx.fillStyle = '#1E3A8A';
      ctx.fillRect(sx, sy, sw + 0.4, h);
    }
  }

  if (country === 'uk_navy') {
    const midDy = wave1 * 0.45;
    // Bold Red St. George's Cross across full White Ensign
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(fx, fy + h * 0.41 + midDy * 0.4, w, h * 0.18);
    ctx.fillRect(fx + w * 0.43, fy + midDy * 0.4, w * 0.14, h);

    // Union Jack in upper hoist canton
    const cw = w * 0.45;
    const ch = h * 0.46;
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(fx, fy, cw, ch);
    ctx.strokeStyle = '#F8FAFC';
    ctx.lineWidth = 0.85;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx + cw, fy + ch);
    ctx.moveTo(fx + cw, fy);
    ctx.lineTo(fx, fy + ch);
    ctx.stroke();
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(fx, fy + ch * 0.33, cw, ch * 0.34);
    ctx.fillRect(fx + cw * 0.36, fy, cw * 0.28, ch);
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(fx, fy + ch * 0.4, cw, ch * 0.2);
    ctx.fillRect(fx + cw * 0.42, fy, cw * 0.16, ch);
  } else if (country === 'uk') {
    const midDy = wave1 * 0.5;
    ctx.strokeStyle = '#F8FAFC';
    ctx.lineWidth = 1.35;
    ctx.beginPath();
    ctx.moveTo(fx, fy + 0.4);
    ctx.lineTo(fx + w, fy + h - 0.4 + wave1);
    ctx.moveTo(fx + w, fy + 0.4 + wave1);
    ctx.lineTo(fx, fy + h - 0.4);
    ctx.stroke();

    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(fx, fy + h * 0.33 + midDy * 0.4, w, h * 0.34);
    ctx.fillRect(fx + w * 0.38, fy + midDy * 0.4, w * 0.24, h);

    ctx.fillStyle = '#DC2626';
    ctx.fillRect(fx, fy + h * 0.4 + midDy * 0.4, w, h * 0.2);
    ctx.fillRect(fx + w * 0.43, fy + midDy * 0.4, w * 0.14, h);
  }

  // Crisp 1px dark fabric rim
  ctx.strokeStyle = '#090D16';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(fx, fy + wave1 * 0.3, w, h);
  ctx.restore();
}

function drawStormRain(ctx: CanvasRenderingContext2D, time: number): void {
  ctx.save();
  ctx.strokeStyle = 'rgba(203, 213, 225, 0.24)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < 42; i++) {
    const rx = ((i * 61 + time * 115) % (PLAYFIELD_W + 40)) - 20;
    const ry = ((i * 89 + time * 420) % (PLAYFIELD_H + 40)) - 20;
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 6, ry + 16);
  }
  ctx.stroke();
  ctx.restore();
}

function drawPixelOcean(
  ctx: CanvasRenderingContext2D,
  scrollY: number,
  time: number,
  levelNumber: number
): void {
  const tile = getOceanTile(levelNumber);
  const theme = getLevelTheme(levelNumber);
  const tileSize = tile.width;
  const oy = Math.floor(scrollY) % tileSize;

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  for (let y = oy - tileSize; y < PLAYFIELD_H; y += tileSize) {
    for (let x = 0; x < PLAYFIELD_W; x += tileSize) {
      ctx.drawImage(tile, x, y, tileSize, tileSize);
    }
  }

  // Layer 2 subtle drifting sea-current parallax for liquid ocean depth
  ctx.globalAlpha = 0.24;
  const driftX = Math.sin(time * 0.55) * 16;
  const oy2 = Math.floor(scrollY * 1.28) % tileSize;
  for (let y = oy2 - tileSize; y < PLAYFIELD_H; y += tileSize) {
    for (let x = -tileSize; x < PLAYFIELD_W + tileSize; x += tileSize) {
      ctx.drawImage(tile, x + driftX, y, tileSize, tileSize);
    }
  }
  ctx.globalAlpha = 1;

  // Dynamic rolling South Atlantic ocean waves (troughs, undulating crests & foaming whitecaps!)
  for (let row = 0; row < 16; row++) {
    const wy = ((row * 34 + scrollY * 1.22) % (PLAYFIELD_H + 40)) - 20;
    const phase = time * 2.1 + row * 1.3;
    const baseWx = ((row * 83 + 28) % (PLAYFIELD_W - 40)) + 20 + Math.sin(phase) * 14;
    const waveLen = 22 + (row % 4) * 9;

    // Deep wave trough shadow below swell
    ctx.strokeStyle = theme.oceanDeep;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(baseWx - waveLen * 0.5, wy + 2.5);
    ctx.quadraticCurveTo(baseWx, wy - 1.2 + Math.cos(phase) * 1.4, baseWx + waveLen * 0.5, wy + 2.5);
    ctx.stroke();

    // Rolling cyan/sunlit wave slope
    ctx.strokeStyle = theme.swellColor;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(baseWx - waveLen * 0.5, wy);
    ctx.quadraticCurveTo(baseWx, wy - 3.6 + Math.cos(phase) * 1.4, baseWx + waveLen * 0.5, wy);
    ctx.stroke();

    // Crisp animated whitecap foam crest breaking on top of alternating waves
    if (Math.sin(phase * 1.2) > 0.15) {
      ctx.strokeStyle = 'rgba(240, 249, 255, 0.62)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(baseWx - waveLen * 0.22, wy - 1.6);
      ctx.quadraticCurveTo(baseWx, wy - 3.4, baseWx + waveLen * 0.22, wy - 1.4);
      ctx.stroke();
    }
  }

  // Sparkling sunlight/moonlight ocean surface glints
  for (let g = 0; g < 14; g++) {
    const pulse = Math.sin(time * 5.2 + g * 2.1);
    if (pulse <= 0.35) continue;
    const gx = (g * 79 + 31) % PLAYFIELD_W;
    const gy = ((g * 67 + scrollY * 1.15) % (PLAYFIELD_H + 20)) - 10;
    ctx.fillStyle = `rgba(224, 242, 254, ${0.35 + pulse * 0.4})`;
    ctx.fillRect(Math.round(gx) - 2, Math.round(gy), 4, 1);
  }
  ctx.restore();
}

function drawPixelShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  const rx = Math.max(4, w * 0.44);
  const ry = Math.max(4, h * 0.44);
  ctx.fillStyle = 'rgba(4, 10, 20, 0.34)';
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawPixelWake(ctx: CanvasRenderingContext2D, enemy: EnemyEntity, time: number): void {
  const ex = enemy.x;
  const ey = enemy.y;
  const halfW = enemy.width * 0.34;
  const tailY = ey - enemy.height * 0.46;
  const bowY = ey + enemy.height * 0.48;
  const ripple = Math.sin(time * 8 + enemy.id) * 1.2;

  ctx.save();
  // Smooth Kelvin V-wake arms diverging behind hull
  for (const side of [-1, 1]) {
    const grad = ctx.createLinearGradient(ex, tailY, ex + side * (halfW + 18), tailY - 46);
    grad.addColorStop(0, 'rgba(224, 242, 254, 0.72)');
    grad.addColorStop(0.45, 'rgba(147, 197, 253, 0.38)');
    grad.addColorStop(1, 'rgba(147, 197, 253, 0)');

    ctx.strokeStyle = grad;
    ctx.lineWidth = Math.max(1.4, halfW * 0.24);
    ctx.beginPath();
    ctx.moveTo(ex + side * (halfW * 0.42), bowY - enemy.height * 0.14);
    ctx.quadraticCurveTo(
      ex + side * (halfW * 0.85),
      tailY + 4,
      ex + side * (halfW + 16 + ripple),
      tailY - 46
    );
    ctx.stroke();
  }

  // Churning aerated propeller wash trailing directly astern
  const washGrad = ctx.createLinearGradient(ex, tailY + 2, ex, tailY - 38);
  washGrad.addColorStop(0, 'rgba(248, 250, 252, 0.75)');
  washGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.35)');
  washGrad.addColorStop(1, 'rgba(186, 230, 253, 0)');
  ctx.fillStyle = washGrad;
  ctx.beginPath();
  ctx.moveTo(ex - halfW * 0.36, tailY + 2);
  ctx.lineTo(ex + halfW * 0.36, tailY + 2);
  ctx.lineTo(ex + halfW * 0.85, tailY - 38);
  ctx.lineTo(ex - halfW * 0.85, tailY - 38);
  ctx.closePath();
  ctx.fill();

  // Sharp V bow wave foam splitting water ahead
  ctx.strokeStyle = 'rgba(248, 250, 252, 0.85)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(ex - halfW * 0.72, bowY - 8 + ripple * 0.4);
  ctx.quadraticCurveTo(ex, bowY + 2.5, ex + halfW * 0.72, bowY - 8 + ripple * 0.4);
  ctx.stroke();
  ctx.restore();
}

function drawPixelPlayer(
  ctx: CanvasRenderingContext2D,
  player: PlayerState,
  bank: ReturnType<typeof getSpriteBank>,
  time: number,
  carrier: CarrierSequence | null
): void {
  if (player.hp <= 0 || player.lives <= 0) {
    return;
  }
  if (!carrier && player.invulnTimer > 0 && Math.floor(time * 22) % 2 === 0) {
    return;
  }

  const px = player.x;
  const py = player.y;
  const pScale = carrier ? carrier.playerScale : 1;
  // Shadow sits snug under aircraft on carrier deck (0.72), drops to sea altitude offset at 1.0
  const altRatio = Math.max(0, Math.min(1, (pScale - 0.72) / 0.28));
  const shadowOffX = 2 + altRatio * 9;
  const shadowOffY = 3 + altRatio * 14;
  drawPixelShadow(ctx, px + shadowOffX, py + shadowOffY, 24 * pScale, 24 * pScale);

  // Select bank sprite frame (center / left / right) for active aircraft
  const set = bank.playerSprites[player.aircraftId] ?? bank.playerSprites.skyhawk;
  let spr = set.center;
  if (player.roll < -0.25) spr = set.left;
  else if (player.roll > 0.25) spr = set.right;

  ctx.save();
  ctx.translate(Math.round(px), Math.round(py));
  ctx.scale(pScale, pScale);

  // Tapered supersonic Mach-diamond jet afterburner cone aligned precisely to exhaust nozzle
  const enginesLit = !carrier || (carrier.mode === 'takeoff' ? carrier.timer > 0.45 : !carrier.arrested);
  if (player.aircraftId !== 'pucara' && enginesLit) {
    const nozzleY = player.aircraftId === 'skyhawk' ? 17.0 : player.aircraftId === 'super_etendard' ? 18.0 : 18.6;
    const flameH =
      (carrier && carrier.mode === 'takeoff' ? 7.5 : 5.5) + (Math.sin(time * 48) * 1.8 + 1.8);
    const outerCol =
      player.aircraftId === 'super_etendard' ? 'rgba(56, 189, 248, 0.85)' : 'rgba(249, 115, 22, 0.88)';
    ctx.fillStyle = outerCol;
    ctx.beginPath();
    ctx.moveTo(-1.3, nozzleY);
    ctx.quadraticCurveTo(0, nozzleY + flameH * 1.2, 1.3, nozzleY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.moveTo(-0.7, nozzleY);
    ctx.quadraticCurveTo(0, nozzleY + flameH * 0.78, 0.7, nozzleY);
    ctx.closePath();
    ctx.fill();
  }

  const img = player.hitFlash > 0 ? spr.flashCanvas : spr.canvas;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, Math.round(-spr.w / 2), Math.round(-spr.h / 2), spr.w, spr.h);

  // Realistic translucent spinning turboprop discs for IA-58 Pucará (spinners at ±7.6, -11.4)
  if (player.aircraftId === 'pucara') {
    const spinHalf = 4.6 + Math.sin(time * 52) * 0.8;
    for (const pxOff of [-7.6, 7.6]) {
      ctx.fillStyle = 'rgba(226, 232, 240, 0.34)';
      ctx.beginPath();
      ctx.ellipse(pxOff, -11.4, spinHalf, 1.15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(248, 250, 252, 0.78)';
      ctx.lineWidth = 0.65;
      ctx.beginPath();
      ctx.moveTo(pxOff - spinHalf * 0.85, -11.4);
      ctx.lineTo(pxOff + spinHalf * 0.85, -11.4);
      ctx.stroke();
      ctx.fillStyle = '#F6B40E';
      ctx.beginPath();
      ctx.arc(pxOff, -11.4, 0.75, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Directional wing-root cannon muzzle flash cones
  if (player.muzzleFlash > 0 && !carrier) {
    ctx.fillStyle = '#FEF08A';
    for (const mx of [-4.4, 4.4]) {
      ctx.beginPath();
      ctx.moveTo(mx, -12.5);
      ctx.lineTo(mx + 1.3, -6.5);
      ctx.lineTo(mx - 1.3, -6.5);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Subtle amber precision hitbox dot during combat
  if (!carrier) {
    ctx.fillStyle = '#F6B40E';
    ctx.beginPath();
    ctx.arc(0, 0, 1.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Shield protective ring
  if (player.shieldTimer > 0 && !carrier) {
    const blink = player.shieldTimer < 2.2 && Math.floor(time * 12) % 2 === 0;
    if (!blink) {
      const r = 20;
      ctx.strokeStyle = Math.floor(time * 10) % 2 === 0 ? '#74ACDF' : '#F8FAFC';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Rapid-fire wingtip booster glow
  if (player.rapidFireTimer > 0 && !carrier) {
    const tipX = player.aircraftId === 'pucara' ? 19.8 : 15.6;
    const tipY = player.aircraftId === 'pucara' ? -3.0 : 6.0;
    ctx.fillStyle = '#F0ABFC';
    ctx.beginPath();
    ctx.arc(-tipX, tipY, 1.3, 0, Math.PI * 2);
    ctx.arc(tipX, tipY, 1.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawEnemySprite(
  ctx: CanvasRenderingContext2D,
  e: EnemyEntity,
  bank: ReturnType<typeof getSpriteBank>,
  time: number
): void {
  const ex = Math.round(e.x);
  const ey = Math.round(e.y);
  const flash = e.hitFlash > 0;

  let spr: CompiledSprite = bank.seaHarrier;
  let scale = 1;

  switch (e.kind) {
    case 'sea_harrier':
      spr = bank.seaHarrier;
      break;
    case 'boss_harrier_ace':
      spr = bank.seaHarrier;
      scale = 1.45;
      break;
    case 'sea_king':
      spr = bank.seaKing;
      break;
    case 'lynx':
      spr = bank.lynx;
      break;
    case 'vulcan':
      spr = bank.vulcan;
      break;
    case 'boss_vulcan':
      spr = bank.vulcan;
      scale = 1.35;
      break;
    case 'patrol_boat':
      spr = bank.patrolBoat;
      break;
    case 'minesweeper':
      spr = bank.minesweeper;
      break;
    case 'corvette':
      spr = bank.corvette;
      break;
    case 'type21_frigate':
      spr = bank.type21Frigate;
      break;
    case 'boss_frigate':
      spr = bank.bossFrigate;
      break;
    case 'type42_destroyer':
      spr = bank.type42Destroyer;
      break;
    case 'boss_destroyer':
      spr = bank.bossDestroyer;
      break;
    case 'sir_galahad':
      spr = bank.assaultShip;
      break;
    case 'supply_tanker':
      spr = bank.supplyTanker;
      break;
    case 'boss_assault':
      spr = bank.bossAssault;
      break;
    case 'boss_carrier':
      spr = bank.carrierBoss;
      break;
    case 'bofors_aa':
      spr = bank.boforsAA;
      break;
    case 'rapier_sam':
      spr = bank.rapierSam;
      break;
    case 'radar_bunker':
      spr = bank.radarBunker;
      break;
  }

  const drawW = Math.round(spr.w * scale);
  const drawH = Math.round(spr.h * scale);
  const img = flash ? spr.flashCanvas : spr.canvas;
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, ex - drawW / 2, ey - drawH / 2, drawW, drawH);
  ctx.restore();

  // Realistic spinning helicopter main rotor blur disc & tail rotor glint
  if (e.kind === 'sea_king' || e.kind === 'lynx') {
    const isSK = e.kind === 'sea_king';
    const bladeLen = isSK ? 18.5 : 14.5;
    const blades = isSK ? 5 : 4;
    const hubY = ey + 2;

    ctx.strokeStyle = 'rgba(226, 232, 240, 0.22)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(ex, hubY, bladeLen, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(226, 232, 240, 0.85)';
    ctx.lineWidth = 1.05;
    for (let i = 0; i < blades; i++) {
      const ang = e.rotorAngle + (i * Math.PI * 2) / blades;
      ctx.beginPath();
      ctx.moveTo(ex, hubY);
      ctx.lineTo(ex + Math.cos(ang) * bladeLen, hubY + Math.sin(ang) * bladeLen);
      ctx.stroke();
    }
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(ex, hubY, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#CBD5E1';
    ctx.beginPath();
    ctx.arc(ex, hubY, 0.7, 0, Math.PI * 2);
    ctx.fill();

    // Spinning tail rotor blur
    const trY = ey - (isSK ? 20 : 15);
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.55)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(ex - 2.6, trY);
    ctx.lineTo(ex - 2.6, trY - 3.6);
    ctx.stroke();
  }

  // Animated Ground Emplacement Barrels & Radars
  if (e.kind === 'bofors_aa') {
    const aim = e.turretAngle + Math.PI / 2;
    const flashCol = e.telegraphTimer > 0 && Math.floor(time * 22) % 2 === 0 ? '#FDE047' : '#CBD5E1';
    const px = -Math.sin(aim) * 1.4;
    const py = Math.cos(aim) * 1.4;
    ctx.strokeStyle = flashCol;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(ex + px, ey + py);
    ctx.lineTo(ex + px + Math.cos(aim) * 9, ey + py + Math.sin(aim) * 9);
    ctx.moveTo(ex - px, ey - py);
    ctx.lineTo(ex - px + Math.cos(aim) * 9, ey - py + Math.sin(aim) * 9);
    ctx.stroke();
  } else if (e.kind === 'radar_bunker') {
    const ang = e.age * 3.8;
    const dx = Math.cos(ang) * 7.2;
    const dy = Math.sin(ang) * 7.2;
    const dishCol = e.telegraphTimer > 0 && Math.floor(time * 20) % 2 === 0 ? '#F97316' : '#E2E8F0';
    ctx.strokeStyle = dishCol;
    ctx.lineWidth = 1.9;
    ctx.beginPath();
    ctx.moveTo(ex - dx, ey - dy);
    ctx.lineTo(ex + dx, ey + dy);
    ctx.stroke();
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(ex, ey, 1.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (e.kind === 'rapier_sam') {
    if (e.telegraphTimer > 0 && Math.floor(time * 20) % 2 === 0) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
      ctx.beginPath();
      ctx.arc(ex, ey, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // British Union Jack flag mounted next to British coastal defenses
  if (e.isGround) {
    drawWavingFlag(ctx, ex + 10, ey + 2, 'uk', time + e.id);
  } else if (e.isSurface) {
    // Prominent Royal Navy White Ensign flying off the aft mast of every British warship
    const mastX = e.kind === 'boss_carrier' ? ex + 17 : ex;
    const mastY = ey - Math.round(drawH * 0.14);
    drawWavingFlag(ctx, mastX, mastY, 'uk_navy', time + e.id * 0.7);
  }

  // Live aiming naval gun barrel + telegraph muzzle warning on armed Royal Navy warships
  if (
    e.isSurface &&
    !e.isGround &&
    e.kind !== 'boss_carrier' &&
    e.kind !== 'supply_tanker' &&
    e.kind !== 'sir_galahad'
  ) {
    const turretColor = e.telegraphTimer > 0 && Math.floor(time * 20) % 2 === 0 ? '#FDE047' : '#E2E8F0';
    const tx = ex;
    const ty = ey + Math.round(drawH * 0.26);
    const bx = tx + Math.cos(e.turretAngle + Math.PI / 2) * 5.2;
    const by = ty + Math.sin(e.turretAngle + Math.PI / 2) * 5.2;
    ctx.strokeStyle = turretColor;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(bx, by);
    ctx.stroke();

    if (e.telegraphTimer > 0 && Math.floor(time * 20) % 2 === 0) {
      ctx.fillStyle = 'rgba(253, 224, 71, 0.85)';
      ctx.beginPath();
      ctx.arc(bx, by, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Non-boss wounded unit pixel health strip
  if (!e.isBoss && e.hp < e.maxHp) {
    const bw = Math.min(28, drawW);
    const bx = Math.round(ex - bw / 2);
    const by = Math.round(ey - drawH / 2 - 5);
    ctx.fillStyle = '#05080F';
    ctx.fillRect(bx - 1, by - 1, bw + 2, 4);
    ctx.fillStyle = e.hp / e.maxHp > 0.4 ? '#F6B40E' : '#EF4444';
    ctx.fillRect(bx, by, Math.max(1, Math.round(bw * (e.hp / e.maxHp))), 2);
  }
}

function drawPixelBomb(ctx: CanvasRenderingContext2D, b: PlayerBomb): void {
  const sx = b.x + b.altitude * 8;
  const sy = b.y + b.altitude * 10;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(sx, sy, 1.8, 3.2, 0, 0, Math.PI * 2);
  ctx.fill();

  const sc = 0.72 + b.altitude * 0.42;
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.scale(sc, sc);
  // Mk-82 Snakeye cruciform stabilizing tail fins
  ctx.fillStyle = '#94A3B8';
  ctx.beginPath();
  ctx.moveTo(-2.6, 4.4);
  ctx.lineTo(2.6, 4.4);
  ctx.lineTo(1.2, 1.8);
  ctx.lineTo(-1.2, 1.8);
  ctx.closePath();
  ctx.fill();
  // Streamlined olive drab bomb casing
  ctx.fillStyle = '#4E5D38';
  ctx.beginPath();
  ctx.ellipse(0, -0.4, 1.85, 3.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 0.45;
  ctx.stroke();
  // Nose fuze & yellow high-explosive band
  ctx.fillStyle = '#FACC15';
  ctx.fillRect(-1.45, -2.4, 2.9, 0.9);
  ctx.restore();
}

function drawPixelExocet(ctx: CanvasRenderingContext2D, m: ExocetMissile, time: number): void {
  ctx.save();
  ctx.translate(m.x, m.y);
  ctx.rotate(m.angle + Math.PI / 2);

  // Tapered rocket motor exhaust plume
  const fl = 5 + Math.sin(time * 42) * 1.8 + 1.8;
  ctx.fillStyle = '#F97316';
  ctx.beginPath();
  ctx.moveTo(-1.1, 6.2);
  ctx.lineTo(0, 6.2 + fl);
  ctx.lineTo(1.1, 6.2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#FEF08A';
  ctx.beginPath();
  ctx.moveTo(-0.55, 6.2);
  ctx.lineTo(0, 6.2 + fl * 0.65);
  ctx.lineTo(0.55, 6.2);
  ctx.closePath();
  ctx.fill();

  // Delta swept guidance fins
  ctx.fillStyle = '#94A3B8';
  ctx.beginPath();
  ctx.moveTo(-3.4, 4.4);
  ctx.lineTo(3.4, 4.4);
  ctx.lineTo(1.2, 0.8);
  ctx.lineTo(-1.2, 0.8);
  ctx.closePath();
  ctx.fill();

  // Streamlined ogive missile fuselage
  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  ctx.moveTo(0, -7.2);
  ctx.quadraticCurveTo(1.4, -3.5, 1.35, 6.0);
  ctx.lineTo(-1.35, 6.0);
  ctx.quadraticCurveTo(-1.4, -3.5, 0, -7.2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 0.45;
  ctx.stroke();

  ctx.fillStyle =
    m.kind === 'shafrir' ? '#38BDF8' : m.kind === 'pescador' ? '#4ADE80' : '#74ACDF';
  ctx.fillRect(-1.15, -2.5, 2.3, 1.8);
  ctx.fillStyle = '#F6B40E';
  ctx.fillRect(-1.15, 2.6, 2.3, 1.0);
  ctx.restore();
}

function drawPixelReticle(ctx: CanvasRenderingContext2D, x: number, y: number, time: number): void {
  const rx = Math.round(x);
  const ry = Math.round(y);
  const r = 14 + (Math.floor(time * 8) % 2);
  ctx.fillStyle = '#34D399';
  ctx.fillRect(rx - r, ry - r, 5, 1);
  ctx.fillRect(rx - r, ry - r, 1, 5);

  ctx.fillRect(rx + r - 4, ry - r, 5, 1);
  ctx.fillRect(rx + r, ry - r, 1, 5);

  ctx.fillRect(rx - r, ry + r, 5, 1);
  ctx.fillRect(rx - r, ry + r - 4, 1, 5);

  ctx.fillRect(rx + r - 4, ry + r, 5, 1);
  ctx.fillRect(rx + r, ry + r - 4, 1, 5);
}

function drawPlayerBullet(ctx: CanvasRenderingContext2D, bul: PlayerBullet): void {
  ctx.save();
  ctx.translate(bul.x, bul.y);
  ctx.rotate(bul.angle);

  const style = bul.style ?? 'tracer';
  if (style === 'defa30') {
    // Super Étendard: heavy electric-blue armor-piercing 30mm naval plasma-tipped round
    ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.fillRect(-2.2, -7, 4.4, 14);
    ctx.fillStyle = '#0284C7';
    ctx.fillRect(-1.4, -6, 2.8, 12);
    ctx.fillStyle = '#E0F2FE';
    ctx.beginPath();
    ctx.moveTo(0, -8.5);
    ctx.lineTo(1.6, -4);
    ctx.lineTo(0.8, 5);
    ctx.lineTo(-0.8, 5);
    ctx.lineTo(-1.6, -4);
    ctx.closePath();
    ctx.fill();
  } else if (style === 'delta_dart') {
    // IAI Dagger: supersonic razor needle dart
    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(1.7, 3);
    ctx.lineTo(0, 1.2);
    ctx.lineTo(-1.7, 3);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-0.45, -6, 0.9, 6.5);
  } else if (style === 'gunship_twin') {
    // IA-58 Pucará: sharp green-white copper-jacketed gunship tracer pair
    ctx.fillStyle = '#15803D';
    ctx.fillRect(-1.4, -5, 2.8, 9);
    ctx.fillStyle = bul.color || '#4ADE80';
    ctx.fillRect(-0.9, -6, 1.8, 8);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-0.4, -6.5, 0.8, 4.5);
  } else {
    // A-4B Skyhawk: sharp copper/gold ballistic 20mm tracer shell with glowing streak
    ctx.fillStyle = '#92400E';
    ctx.fillRect(-1.3, -4.5, 2.6, 9);
    ctx.fillStyle = bul.color || '#FACC15';
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(1.2, -3.5);
    ctx.lineTo(1.0, 4.5);
    ctx.lineTo(-1.0, 4.5);
    ctx.lineTo(-1.2, -3.5);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FEF9C3';
    ctx.fillRect(-0.4, -5.5, 0.8, 6);
  }
  ctx.restore();
}

function drawPixelPowerUp(ctx: CanvasRenderingContext2D, pu: PowerUpEntity, time: number): void {
  const px = Math.round(pu.x);
  const py = Math.round(pu.y + Math.sin(time * 5 + pu.age * 3) * 1.4);
  const blink = Math.floor(time * 9) % 2 === 0;

  const frames: Record<PowerUpEntity['kind'], { bg: string; rim: string }> = {
    cannon: { bg: '#0C4A6E', rim: '#38BDF8' },
    exocet: { bg: '#1E3A8A', rim: '#74ACDF' },
    bomb: { bg: '#422006', rim: '#FACC15' },
    repair: { bg: '#064E3B', rim: '#34D399' },
    medal: { bg: '#713F12', rim: '#FDE047' },
    rapid_fire: { bg: '#581C87', rim: '#E879F9' },
    shield: { bg: '#0C4A6E', rim: '#BAE6FD' },
    cluster_bomb: { bg: '#7C2D12', rim: '#FB923C' },
  };
  const cfg = frames[pu.kind];

  ctx.save();
  ctx.translate(px, py);

  // Crisp beveled Neo Geo collectible capsule (NO LETTERS!)
  ctx.fillStyle = '#05080F';
  ctx.beginPath();
  ctx.roundRect(-9.5, -9.5, 19, 19, 3);
  ctx.fill();

  ctx.fillStyle = blink ? cfg.rim : '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(-8.5, -8.5, 17, 17, 2.5);
  ctx.fill();

  ctx.fillStyle = cfg.bg;
  ctx.beginPath();
  ctx.roundRect(-7.2, -7.2, 14.4, 14.4, 2);
  ctx.fill();

  // Subtle top highlight inside box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.fillRect(-6.5, -6.5, 13, 4);

  switch (pu.kind) {
    case 'cannon': {
      // Twin brass/steel 20mm autocannons + golden muzzle flashes
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(-3.6, -5, 2.2, 8.5);
      ctx.fillRect(1.4, -5, 2.2, 8.5);
      ctx.fillStyle = '#475569';
      ctx.fillRect(-4.4, 1.5, 8.8, 3.8);
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(-3.2, -6.2, 1.4, 1.5);
      ctx.fillRect(1.8, -6.2, 1.4, 1.5);
      break;
    }
    case 'exocet': {
      // Angled AM-39 Exocet missile icon (white body, celeste & yellow warhead bands, fins)
      ctx.rotate(-Math.PI / 4);
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.moveTo(0, -6.5);
      ctx.lineTo(1.7, -3.5);
      ctx.lineTo(1.7, 5);
      ctx.lineTo(-1.7, 5);
      ctx.lineTo(-1.7, -3.5);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#74ACDF';
      ctx.fillRect(-1.7, -1.5, 3.4, 2.2);
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(-1.7, 1.8, 3.4, 1.2);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(-3.4, 2.8, 6.8, 1.6);
      break;
    }
    case 'bomb': {
      // Mk-82 Snakeye bomb with cruciform tail fins & yellow nose ring
      ctx.rotate(-Math.PI / 5);
      ctx.fillStyle = '#576B3B';
      ctx.beginPath();
      ctx.ellipse(0, -0.5, 2.6, 5.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(-2.1, -3.2, 4.2, 1.2);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(-3.5, 3.2, 7, 2);
      ctx.fillRect(-1.2, 3.5, 2.4, 2.8);
      break;
    }
    case 'repair': {
      // Steel field repair wrench + bright red/white medical cross
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.roundRect(-5.5, -5.5, 11, 11, 2);
      ctx.fill();
      ctx.fillStyle = '#16A34A';
      ctx.fillRect(-1.8, -4.4, 3.6, 8.8);
      ctx.fillRect(-4.4, -1.8, 8.8, 3.6);
      break;
    }
    case 'medal': {
      // Argentine Gold Honor Medal with celeste-white-celeste ribbon!
      ctx.fillStyle = '#74ACDF';
      ctx.fillRect(-4.5, -5.8, 9, 4.2);
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(-1.5, -5.8, 3, 4.2);
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.arc(0, 1.8, 4.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#CA8A04';
      ctx.beginPath();
      ctx.arc(0, 1.8, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(-0.8, 1.0, 1.6, 1.6);
      break;
    }
    case 'rapid_fire': {
      // Golden twin lightning turbo cadence bolt
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.moveTo(1.5, -6);
      ctx.lineTo(-4.2, 0.5);
      ctx.lineTo(-0.5, 0.5);
      ctx.lineTo(-2.0, 6);
      ctx.lineTo(4.2, -0.8);
      ctx.lineTo(0.4, -0.8);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'shield': {
      // Argentine Sky-Blue & White Heater Shield Emblem
      ctx.fillStyle = '#74ACDF';
      ctx.beginPath();
      ctx.moveTo(-5, -5.2);
      ctx.lineTo(5, -5.2);
      ctx.lineTo(5, 0.5);
      ctx.lineTo(0, 5.8);
      ctx.lineTo(-5, 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(-4.2, -1.6, 8.4, 2.2);
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.arc(0, -0.5, 1.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'cluster_bomb': {
      // Triple bundled cluster bombs
      for (const ox of [-3.4, 0, 3.4]) {
        const oy = ox === 0 ? -0.6 : 0.8;
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.ellipse(ox, oy, 1.5, 3.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F97316';
        ctx.fillRect(ox - 1.2, oy - 2.2, 2.4, 1.2);
      }
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(-4.5, 1.8, 9, 1.3);
      break;
    }
  }
  ctx.restore();
}

function drawPixelEnemyProjectile(
  ctx: CanvasRenderingContext2D,
  ep: EnemyProjectile,
  time: number
): void {
  const x = ep.x;
  const y = ep.y;
  const blink = Math.floor(time * 18) % 2 === 0;
  const moveAngle = Math.atan2(ep.vy, ep.vx) + Math.PI / 2;

  if (ep.kind === 'missile') {
    // Realistic pointed British Sea Cat / AIM-9 Sidewinder / Sea Dart guided missile
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(moveAngle);
    // Rocket plume
    ctx.fillStyle = blink ? '#E0F2FE' : '#F87171';
    ctx.beginPath();
    ctx.moveTo(-0.85, 4.8);
    ctx.lineTo(0, 8.2);
    ctx.lineTo(0.85, 4.8);
    ctx.closePath();
    ctx.fill();
    // Swept stabilizing fins
    ctx.fillStyle = '#94A3B8';
    ctx.beginPath();
    ctx.moveTo(-2.8, 4.0);
    ctx.lineTo(2.8, 4.0);
    ctx.lineTo(1.0, 1.4);
    ctx.lineTo(-1.0, 1.4);
    ctx.closePath();
    ctx.fill();
    // Ogive body
    ctx.fillStyle = '#F1F5F9';
    ctx.beginPath();
    ctx.moveTo(0, -5.8);
    ctx.quadraticCurveTo(1.25, -2.5, 1.15, 4.8);
    ctx.lineTo(-1.15, 4.8);
    ctx.quadraticCurveTo(-1.25, -2.5, 0, -5.8);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#090D14';
    ctx.lineWidth = 0.45;
    ctx.stroke();
    // Crimson warhead seeker nose
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.moveTo(0, -5.8);
    ctx.quadraticCurveTo(0.95, -4.0, 1.0, -3.0);
    ctx.lineTo(-1.0, -3.0);
    ctx.quadraticCurveTo(-0.95, -4.0, 0, -5.8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return;
  }

  if (ep.kind === 'flak') {
    // Rotating metallic 4-blade Bofors AA shrapnel shell / spinning star cross (NO orange balls!)
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time * 14 + ep.age * 6);
    const arm = Math.max(3.2, ep.radius * 1.45);
    ctx.fillStyle = '#090D14';
    ctx.fillRect(-arm - 0.6, -1.5, (arm + 0.6) * 2, 3);
    ctx.fillRect(-1.5, -arm - 0.6, 3, (arm + 0.6) * 2);

    ctx.fillStyle = blink ? '#F8FAFC' : '#CBD5E1';
    ctx.fillRect(-arm, -0.9, arm * 2, 1.8);
    ctx.fillRect(-0.9, -arm, 1.8, arm * 2);

    ctx.fillStyle = '#DC2626';
    ctx.fillRect(-1.2, -1.2, 2.4, 2.4);
    ctx.restore();
    return;
  }

  // 'bullet': Crisp high-speed directional steel/crimson tracer dart (NO orange balls!)
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(moveAngle);
  ctx.fillStyle = '#090D14';
  ctx.beginPath();
  ctx.moveTo(0, -5.2);
  ctx.lineTo(2.3, 1.8);
  ctx.lineTo(1.2, 4.2);
  ctx.lineTo(-1.2, 4.2);
  ctx.lineTo(-2.3, 1.8);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = blink ? '#F87171' : '#EF4444';
  ctx.beginPath();
  ctx.moveTo(0, -4.4);
  ctx.lineTo(1.6, 1.6);
  ctx.lineTo(0.8, 3.6);
  ctx.lineTo(-0.8, 3.6);
  ctx.lineTo(-1.6, 1.6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-0.55, -3.0, 1.1, 4.2);
  ctx.restore();
}

function drawPixelParticle(ctx: CanvasRenderingContext2D, p: Particle): void {
  const t = 1 - p.life / p.maxLife;
  const r = Math.max(1, Math.round(p.size + (p.endSize - p.size) * t));
  const px = Math.round(p.x);
  const py = Math.round(p.y);

  if (p.kind === 'ring') {
    ctx.save();
    ctx.globalAlpha = Math.max(0.1, 1 - t * 0.78);
    ctx.strokeStyle = t < 0.3 ? '#FFFFFF' : p.color;
    ctx.lineWidth = t < 0.35 ? 2.2 : 1.3;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    return;
  }

  if (p.kind === 'debris') {
    // Tumbling jagged hull/wing shrapnel fragment glowing hot
    ctx.save();
    ctx.globalAlpha = Math.max(0.2, 1 - t * 0.82);
    ctx.translate(px, py);
    ctx.rotate(t * 9 + (p.vx + p.vy) * 0.05);
    ctx.fillStyle = t < 0.25 ? '#FEF08A' : p.color;
    ctx.fillRect(-r, -Math.max(1, r * 0.45), r * 2, Math.max(1.5, r * 0.9));
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 0.45;
    ctx.strokeRect(-r, -Math.max(1, r * 0.45), r * 2, Math.max(1.5, r * 0.9));
    ctx.restore();
    return;
  }

  let col = p.color;
  if (p.kind === 'fire') {
    col = t < 0.2 ? '#FFFFFF' : t < 0.48 ? '#FDE047' : t < 0.76 ? '#F97316' : '#475569';
  } else if (p.kind === 'water') {
    col = t < 0.4 ? '#FFFFFF' : '#7DD3FC';
  }

  ctx.save();
  ctx.globalAlpha = Math.max(0.15, 1 - t * 0.72);
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.arc(px, py, Math.max(0.9, r * 0.92), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
