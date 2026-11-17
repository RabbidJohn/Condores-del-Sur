// High-Detail 16-bit Neo Geo "Metal Slug" & Hi-Res Cenital Naval Sprite Compiler
import {
  buildAllMalvinasIslands,
  buildHiResArgentineCarrier,
  buildHiResAssaultShip,
  buildHiResBossAssault,
  buildHiResBossDestroyer,
  buildHiResBossFrigate,
  buildHiResCarrierBoss,
  buildHiResCorvette,
  buildHiResMinesweeper,
  buildHiResPatrolBoat,
  buildHiResSupplyTanker,
  buildHiResType21Frigate,
  buildHiResType42Destroyer,
} from './hiResNavalSprites';
import {
  buildMSBoforsAA,
  buildMSCloud,
  buildMSDagger,
  buildMSLynx,
  buildMSPucara,
  buildMSRadarBunker,
  buildMSRapierSam,
  buildMSSeaHarrier,
  buildMSSeaKing,
  buildMSSkyhawk,
  buildMSSuperEtendard,
  buildMSVulcan,
} from './metalSlugSprites';
import { AircraftId } from './types';

export interface CompiledSprite {
  canvas: HTMLCanvasElement;
  flashCanvas: HTMLCanvasElement;
  w: number;
  h: number;
}

function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function compileFromDraw(
  w: number,
  h: number,
  drawFn: (ctx: CanvasRenderingContext2D) => void
): CompiledSprite {
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  drawFn(ctx);

  const flashCanvas = makeCanvas(w, h);
  const fctx = flashCanvas.getContext('2d')!;
  fctx.drawImage(canvas, 0, 0);
  fctx.globalCompositeOperation = 'source-in';
  fctx.fillStyle = '#FFFFFF';
  fctx.fillRect(0, 0, w, h);

  return { canvas, flashCanvas, w, h };
}

function hash2(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  return n - Math.floor(n);
}

function buildReefSprite(variant: 0 | 1 | 2): CompiledSprite {
  const w = 52;
  const h = 38;
  return compileFromDraw(w, h, (ctx) => {
    const seed = 4.2 + variant * 3.7;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = (x - w / 2) / (w * 0.36);
        const dy = (y - h / 2) / (h * 0.34);
        const ang = Math.atan2(dy, dx);
        const mod =
          1 + 0.25 * Math.sin(ang * (3 + variant) + seed) + 0.14 * Math.cos(ang * 5 - seed);
        const dist = Math.hypot(dx, dy) / mod;
        if (dist > 1) continue;
        const n = hash2(x, y, seed);
        if (dist < 0.32 && n > 0.45) {
          ctx.fillStyle = n > 0.8 ? '#93C5FD' : '#244A58';
          ctx.fillRect(x, y, 1, 1);
        } else if (dist < 0.72 && n > 0.25) {
          ctx.fillStyle = n > 0.65 ? '#165D56' : '#134747';
          ctx.fillRect(x, y, 1, 1);
        } else if (n > 0.55) {
          ctx.fillStyle = '#144B6E';
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  });
}

export interface PlayerSpriteSet {
  center: CompiledSprite;
  left: CompiledSprite;
  right: CompiledSprite;
}

export interface SpriteBank {
  playerSprites: Record<AircraftId, PlayerSpriteSet>;
  skyhawkCenter: CompiledSprite;
  skyhawkLeft: CompiledSprite;
  skyhawkRight: CompiledSprite;
  seaHarrier: CompiledSprite;
  seaKing: CompiledSprite;
  lynx: CompiledSprite;
  vulcan: CompiledSprite;
  patrolBoat: CompiledSprite;
  minesweeper: CompiledSprite;
  corvette: CompiledSprite;
  type21Frigate: CompiledSprite;
  type42Destroyer: CompiledSprite;
  assaultShip: CompiledSprite;
  supplyTanker: CompiledSprite;
  bossFrigate: CompiledSprite;
  bossAssault: CompiledSprite;
  bossDestroyer: CompiledSprite;
  carrierBoss: CompiledSprite;
  argentineCarrier: CompiledSprite;
  boforsAA: CompiledSprite;
  rapierSam: CompiledSprite;
  radarBunker: CompiledSprite;
  clouds: [CompiledSprite, CompiledSprite, CompiledSprite];
  islands: CompiledSprite[];
  reefs: [CompiledSprite, CompiledSprite, CompiledSprite];
}

let cachedBank: SpriteBank | null = null;

export function getSpriteBank(): SpriteBank {
  if (cachedBank) return cachedBank;
  const skyhawkSet: PlayerSpriteSet = {
    center: buildMSSkyhawk(0),
    left: buildMSSkyhawk(-1),
    right: buildMSSkyhawk(1),
  };
  cachedBank = {
    playerSprites: {
      skyhawk: skyhawkSet,
      super_etendard: {
        center: buildMSSuperEtendard(0),
        left: buildMSSuperEtendard(-1),
        right: buildMSSuperEtendard(1),
      },
      dagger: {
        center: buildMSDagger(0),
        left: buildMSDagger(-1),
        right: buildMSDagger(1),
      },
      pucara: {
        center: buildMSPucara(0),
        left: buildMSPucara(-1),
        right: buildMSPucara(1),
      },
    },
    skyhawkCenter: skyhawkSet.center,
    skyhawkLeft: skyhawkSet.left,
    skyhawkRight: skyhawkSet.right,
    seaHarrier: buildMSSeaHarrier(),
    seaKing: buildMSSeaKing(),
    lynx: buildMSLynx(),
    vulcan: buildMSVulcan(),
    patrolBoat: buildHiResPatrolBoat(),
    minesweeper: buildHiResMinesweeper(),
    corvette: buildHiResCorvette(),
    type21Frigate: buildHiResType21Frigate(),
    type42Destroyer: buildHiResType42Destroyer(),
    assaultShip: buildHiResAssaultShip(),
    supplyTanker: buildHiResSupplyTanker(),
    bossFrigate: buildHiResBossFrigate(),
    bossAssault: buildHiResBossAssault(),
    bossDestroyer: buildHiResBossDestroyer(),
    carrierBoss: buildHiResCarrierBoss(),
    argentineCarrier: buildHiResArgentineCarrier(),
    boforsAA: buildMSBoforsAA(),
    rapierSam: buildMSRapierSam(),
    radarBunker: buildMSRadarBunker(),
    clouds: [buildMSCloud(0), buildMSCloud(1), buildMSCloud(2)],
    islands: buildAllMalvinasIslands(),
    reefs: [buildReefSprite(0), buildReefSprite(1), buildReefSprite(2)],
  };
  return cachedBank;
}
