import { getAircraftSpec } from './aircraft';
import { SoundEngine } from './audio';
import { PLAYFIELD_H, PLAYFIELD_W, renderGameFrame } from './renderer';
import {
  AircraftId,
  BossIntroInfo,
  CarrierSequence,
  EnemyEntity,
  EnemyKind,
  EnemyProjectile,
  EnemyTactic,
  ExocetMissile,
  FloatingText,
  GamePhase,
  HudSnapshot,
  InputState,
  OceanFeature,
  Particle,
  PlayerBomb,
  PlayerBullet,
  PlayerState,
  PowerUpEntity,
  PowerUpKind,
} from './types';
import { CAMPAIGN_WAVES } from './waves';

const HIGH_SCORE_KEY = 'halcones_del_sur_highscore_v1';
const MAX_LIVES = 15;

interface EnemyStats {
  isSurface: boolean;
  isGround: boolean;
  isBoss: boolean;
  label: string;
  width: number;
  height: number;
  hp: number;
  score: number;
  vy: number;
  fireInterval: number;
}

const ENEMY_SPECS: Record<EnemyKind, EnemyStats> = {
  patrol_boat: {
    isSurface: true,
    isGround: false,
    isBoss: false,
    label: 'Lancha Armada HMS',
    width: 22,
    height: 50,
    hp: 68,
    score: 240,
    vy: 36,
    fireInterval: 2.55,
  },
  minesweeper: {
    isSurface: true,
    isGround: false,
    isBoss: false,
    label: 'Patrullero Polar HMS Endurance',
    width: 24,
    height: 58,
    hp: 115,
    score: 420,
    vy: 32,
    fireInterval: 2.5,
  },
  corvette: {
    isSurface: true,
    isGround: false,
    isBoss: false,
    label: 'Fragata HMS Rothesay (Tipo 12)',
    width: 26,
    height: 72,
    hp: 175,
    score: 650,
    vy: 30,
    fireInterval: 2.45,
  },
  bofors_aa: {
    isSurface: true,
    isGround: true,
    isBoss: false,
    label: 'Batería Británica Bofors 40mm',
    width: 24,
    height: 24,
    hp: 86,
    score: 520,
    vy: 48,
    fireInterval: 2.3,
  },
  rapier_sam: {
    isSurface: true,
    isGround: true,
    isBoss: false,
    label: 'Lanzador Británico Rapier SAM',
    width: 26,
    height: 26,
    hp: 105,
    score: 680,
    vy: 48,
    fireInterval: 2.65,
  },
  radar_bunker: {
    isSurface: true,
    isGround: true,
    isBoss: false,
    label: 'Búnker Radar Real Británico',
    width: 28,
    height: 28,
    hp: 155,
    score: 940,
    vy: 48,
    fireInterval: 2.4,
  },
  lynx: {
    isSurface: false,
    isGround: false,
    isBoss: false,
    label: 'Westland Lynx RN',
    width: 27,
    height: 29,
    hp: 42,
    score: 280,
    vy: 72,
    fireInterval: 2.25,
  },
  sea_king: {
    isSurface: false,
    isGround: false,
    isBoss: false,
    label: 'Westland Sea King RN',
    width: 33,
    height: 39,
    hp: 84,
    score: 460,
    vy: 54,
    fireInterval: 2.45,
  },
  sea_harrier: {
    isSurface: false,
    isGround: false,
    isBoss: false,
    label: 'BAe Sea Harrier RN',
    width: 33,
    height: 30,
    hp: 68,
    score: 500,
    vy: 92,
    fireInterval: 2.15,
  },
  vulcan: {
    isSurface: false,
    isGround: false,
    isBoss: false,
    label: 'Bombardero RAF Avro Vulcan',
    width: 53,
    height: 26,
    hp: 225,
    score: 1050,
    vy: 42,
    fireInterval: 2.05,
  },
  type21_frigate: {
    isSurface: true,
    isGround: false,
    isBoss: false,
    label: 'Fragata HMS Tipo 21',
    width: 28,
    height: 82,
    hp: 245,
    score: 920,
    vy: 28,
    fireInterval: 2.4,
  },
  type42_destroyer: {
    isSurface: true,
    isGround: false,
    isBoss: false,
    label: 'Destructor HMS Tipo 42',
    width: 32,
    height: 92,
    hp: 330,
    score: 1350,
    vy: 25,
    fireInterval: 2.35,
  },
  sir_galahad: {
    isSurface: true,
    isGround: false,
    isBoss: false,
    label: 'Buque Real RFA Sir Galahad',
    width: 36,
    height: 84,
    hp: 285,
    score: 1150,
    vy: 24,
    fireInterval: 2.65,
  },
  supply_tanker: {
    isSurface: true,
    isGround: false,
    isBoss: false,
    label: 'Cisterna Real RFA Tidespring',
    width: 32,
    height: 90,
    hp: 300,
    score: 1200,
    vy: 23,
    fireInterval: 2.7,
  },
  boss_frigate: {
    isSurface: true,
    isGround: false,
    isBoss: true,
    label: 'Fragata Real Británica',
    width: 36,
    height: 104,
    hp: 560,
    score: 3400,
    vy: 25,
    fireInterval: 1.9,
  },
  boss_assault: {
    isSurface: true,
    isGround: false,
    isBoss: true,
    label: 'Buque Real de Asalto',
    width: 44,
    height: 110,
    hp: 660,
    score: 4000,
    vy: 23,
    fireInterval: 1.85,
  },
  boss_harrier_ace: {
    isSurface: false,
    isGround: false,
    isBoss: true,
    label: 'Escuadrón Líder Sea Harrier RN',
    width: 39,
    height: 36,
    hp: 600,
    score: 4200,
    vy: 34,
    fireInterval: 1.75,
  },
  boss_vulcan: {
    isSurface: false,
    isGround: false,
    isBoss: true,
    label: 'Bombardero Real Avro Vulcan',
    width: 60,
    height: 34,
    hp: 740,
    score: 4600,
    vy: 28,
    fireInterval: 1.8,
  },
  boss_destroyer: {
    isSurface: true,
    isGround: false,
    isBoss: true,
    label: 'Destructor Real HMS Tipo 42',
    width: 40,
    height: 118,
    hp: 840,
    score: 5400,
    vy: 23,
    fireInterval: 1.8,
  },
  boss_carrier: {
    isSurface: true,
    isGround: false,
    isBoss: true,
    label: 'Portaaviones Real Británico',
    width: 58,
    height: 136,
    hp: 1180,
    score: 9000,
    vy: 21,
    fireInterval: 1.7,
  },
};

interface PendingExplosion {
  delay: number;
  x: number;
  y: number;
  burstCount: number;
  ringRadius: number;
  primaryColor: string;
  soundScale?: 'small' | 'medium' | 'large';
  waterSpray?: boolean;
}

export class MalvinasGameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private sound: SoundEngine;
  private onHudUpdate: (snapshot: HudSnapshot) => void;

  private rafId: number | null = null;
  private lastTimestamp = 0;
  private simTime = 0;
  private scrollY = 0;
  private hitstopTimer = 0;
  private shakeIntensity = 0;

  private phase: GamePhase = 'TITLE_MENU';
  private score = 0;
  private highScore = 0;
  private enemiesDefeated = 0;
  private shipsSunk = 0;

  private waveIndex = 0;
  private waveTimer = 0;
  private nextEventIndex = 0;
  private waveClearDelay = 0;
  private bossWarnedForWave = -1;
  private bannerText: string | null = null;
  private bannerSubtext: string | null = null;
  private bannerTimer = 0;

  private nextEnemyId = 1;
  private comboCount = 0;
  private comboTimer = 0;
  private selectedAircraft: AircraftId = 'skyhawk';
  private carrierSequence: CarrierSequence | null = null;
  private carrierCatapultFired = false;
  private player: PlayerState;
  private bullets: PlayerBullet[] = [];
  private bombs: PlayerBomb[] = [];
  private exocets: ExocetMissile[] = [];
  private enemies: EnemyEntity[] = [];
  private enemyProjectiles: EnemyProjectile[] = [];
  private powerUps: PowerUpEntity[] = [];
  private particles: Particle[] = [];
  private floatingTexts: FloatingText[] = [];
  private oceanFeatures: OceanFeature[] = [];
  private pendingExplosions: PendingExplosion[] = [];
  private pendingGameOverTimer = 0;
  private playerRespawnTimer = 0;
  private landPatrolCooldown = 0;
  private bossIntroTimer = 0;
  private readonly bossIntroDuration = 4.6;

  private input: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    fire: false,
    autoFire: false,
    bombJustPressed: false,
    exocetJustPressed: false,
  };

  private lastHudHash = '';

  constructor(
    canvas: HTMLCanvasElement,
    sound: SoundEngine,
    onHudUpdate: (snapshot: HudSnapshot) => void
  ) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('No se pudo inicializar el contexto 2D');
    }
    this.ctx = context;
    this.sound = sound;
    this.onHudUpdate = onHudUpdate;
    this.highScore = this.loadHighScore();
    this.player = this.createInitialPlayer();

    this.initPools();
    this.initOceanFeatures();
    this.bindInputEvents();
  }

  private loadHighScore(): number {
    try {
      const raw = localStorage.getItem(HIGH_SCORE_KEY);
      const parsed = raw ? parseInt(raw, 10) : 0;
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    } catch {
      return 0;
    }
  }

  private saveHighScore(val: number): void {
    try {
      localStorage.setItem(HIGH_SCORE_KEY, String(val));
    } catch {
      // Ignore storage failures in restricted contexts
    }
  }

  private createInitialPlayer(aircraftId: AircraftId = this.selectedAircraft): PlayerState {
    const spec = getAircraftSpec(aircraftId);
    return {
      aircraftId,
      x: PLAYFIELD_W / 2,
      y: PLAYFIELD_H - 58,
      vx: 0,
      vy: 0,
      roll: 0,
      hp: spec.maxHp,
      maxHp: spec.maxHp,
      lives: 5,
      cannonLevel: 1,
      bombs: spec.startBombs,
      maxBombs: spec.maxBombs,
      exocets: spec.startExocets,
      maxExocets: spec.maxExocets,
      fireCooldown: 0,
      bombCooldown: 0,
      exocetCooldown: 0,
      invulnTimer: 1.5,
      hitFlash: 0,
      muzzleFlash: 0,
      rapidFireTimer: 0,
      shieldTimer: 0,
      clusterTimer: 0,
    };
  }

  private initPools(): void {
    this.bullets = Array.from({ length: 180 }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      damage: 10,
      angle: 0,
      color: '#F59E0B',
      style: 'tracer',
    }));
    this.bombs = Array.from({ length: 16 }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      altitude: 1,
      flightTime: 0,
      maxFlightTime: 0.55,
      radius: 86,
      damage: 110,
    }));
    this.exocets = Array.from({ length: 12 }, () => ({
      active: false,
      kind: 'exocet',
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      angle: -Math.PI / 2,
      targetId: null,
      age: 0,
      damage: 240,
      smokeTimer: 0,
    }));
    this.enemyProjectiles = Array.from({ length: 240 }, () => ({
      active: false,
      kind: 'bullet',
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: 5,
      age: 0,
      color: '#EF4444',
    }));
    this.particles = Array.from({ length: 640 }, () => ({
      active: false,
      kind: 'fire',
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 4,
      endSize: 12,
      alpha: 1,
      life: 0,
      maxLife: 0.4,
      color: '#F59E0B',
    }));
    this.floatingTexts = Array.from({ length: 32 }, () => ({
      active: false,
      x: 0,
      y: 0,
      vy: -38,
      text: '',
      color: '#FDE047',
      life: 0,
      maxLife: 0.9,
    }));
  }

  private initOceanFeatures(): void {
    this.oceanFeatures = [];
    // Diverse Malvinas coastal islands & headlands (14 unique shapes + mirroring, scale & national flags)
    const initialOrder = [0, 11, 5, 13];
    for (let i = 0; i < 4; i++) {
      const coastalEdge = i % 2 === 0 ? 38 + Math.random() * 58 : PLAYFIELD_W - 38 - Math.random() * 58;
      const variant = initialOrder[i];
      this.oceanFeatures.push({
        x: i === 1 ? PLAYFIELD_W * (0.35 + Math.random() * 0.3) : coastalEdge,
        y: (i * PLAYFIELD_H) / 4 - 20,
        width: 136,
        height: 120,
        kind: 'island',
        variant,
        flipX: i % 2 === 1,
        flipY: i >= 2,
        angle: (Math.random() - 0.5) * 0.32,
        scale: 0.9 + (i % 3) * 0.1,
        flag: i === 1 || i === 3 ? 'ar' : i === 0 ? 'uk' : undefined,
        seed: Math.random() * 10,
        speedScale: 1.0,
        craters: [],
      });
    }
    // Underwater kelp & rocky shoal patches
    for (let i = 0; i < 4; i++) {
      this.oceanFeatures.push({
        x: 34 + Math.random() * (PLAYFIELD_W - 68),
        y: (i * PLAYFIELD_H) / 4 + 45,
        width: 52,
        height: 38,
        kind: 'kelp',
        variant: i % 3,
        flipX: i % 2 === 1,
        flipY: i % 3 === 1,
        angle: (Math.random() - 0.5) * 0.5,
        seed: Math.random() * 10,
        speedScale: 0.78,
        craters: [],
      });
    }
    // Lower and upper volumetric pixel-art cloud banks
    for (let i = 0; i < 8; i++) {
      this.oceanFeatures.push({
        x: Math.random() * PLAYFIELD_W,
        y: Math.random() * PLAYFIELD_H,
        width: 80,
        height: 46,
        kind: 'cloud',
        variant: i % 3,
        flipX: false,
        seed: i * 0.37,
        speedScale: i % 2 === 0 ? 1.12 : 1.65,
        craters: [],
      });
    }
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    const code = e.code;
    if (
      code === 'ArrowUp' ||
      code === 'ArrowDown' ||
      code === 'ArrowLeft' ||
      code === 'ArrowRight' ||
      code === 'Space'
    ) {
      e.preventDefault();
    }

    if (code === 'Escape' || code === 'KeyP') {
      if (this.phase === 'PLAYING') {
        this.pauseGame();
      } else if (this.phase === 'PAUSED') {
        this.resumeGame();
      }
      return;
    }

    if (code === 'KeyW' || code === 'ArrowUp') this.input.up = true;
    if (code === 'KeyS' || code === 'ArrowDown') this.input.down = true;
    if (code === 'KeyA' || code === 'ArrowLeft') this.input.left = true;
    if (code === 'KeyD' || code === 'ArrowRight') this.input.right = true;
    if (code === 'Space' || code === 'KeyZ') this.input.fire = true;

    if (!e.repeat) {
      if (code === 'KeyX') this.input.bombJustPressed = true;
      if (code === 'KeyC') this.input.exocetJustPressed = true;
      if (code === 'KeyF') this.input.autoFire = !this.input.autoFire;
    }
  };

  private handleKeyUp = (e: KeyboardEvent): void => {
    const code = e.code;
    if (code === 'KeyW' || code === 'ArrowUp') this.input.up = false;
    if (code === 'KeyS' || code === 'ArrowDown') this.input.down = false;
    if (code === 'KeyA' || code === 'ArrowLeft') this.input.left = false;
    if (code === 'KeyD' || code === 'ArrowRight') this.input.right = false;
    if (code === 'Space' || code === 'KeyZ') this.input.fire = false;
  };

  private handleBlur = (): void => {
    this.clearHeldInputs();
  };

  private clearHeldInputs(): void {
    this.input.up = false;
    this.input.down = false;
    this.input.left = false;
    this.input.right = false;
    this.input.fire = false;
    this.input.bombJustPressed = false;
    this.input.exocetJustPressed = false;
  }

  private bindInputEvents(): void {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
  }

  public destroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
  }

  public setTouchInput(partial: Partial<InputState>): void {
    Object.assign(this.input, partial);
  }

  public triggerBomb(): void {
    this.input.bombJustPressed = true;
  }

  public triggerExocet(): void {
    this.input.exocetJustPressed = true;
  }

  public startLoop(): void {
    if (this.rafId !== null) return;
    this.lastTimestamp = performance.now();
    const tick = (now: number) => {
      const rawDt = (now - this.lastTimestamp) / 1000;
      this.lastTimestamp = now;
      const dt = Math.min(Math.max(rawDt, 0), 0.05);

      this.update(dt);
      this.render();
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  public startNewCampaign(aircraftId?: AircraftId): void {
    if (aircraftId) {
      this.selectedAircraft = aircraftId;
    }
    this.sound.unlock();
    this.clearHeldInputs();
    this.score = 0;
    this.enemiesDefeated = 0;
    this.shipsSunk = 0;
    this.waveIndex = 0;
    this.hitstopTimer = 0;
    this.shakeIntensity = 0;
    this.carrierSequence = null;
    this.carrierCatapultFired = false;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.player = this.createInitialPlayer(this.selectedAircraft);
    this.enemies = [];
    this.powerUps = [];
    this.pendingExplosions = [];
    this.pendingGameOverTimer = 0;
    this.playerRespawnTimer = 0;
    this.landPatrolCooldown = 0;
    this.bossIntroTimer = 0;
    this.bullets.forEach((b) => (b.active = false));
    this.bombs.forEach((b) => (b.active = false));
    this.exocets.forEach((m) => (m.active = false));
    this.enemyProjectiles.forEach((p) => (p.active = false));
    this.particles.forEach((p) => (p.active = false));
    this.floatingTexts.forEach((ft) => (ft.active = false));

    this.phase = 'PLAYING';
    this.sound.startMusic('battle');
    this.startWave(0);
    this.emitHud(true);
  }

  public pauseGame(): void {
    if (this.phase === 'PLAYING') {
      this.phase = 'PAUSED';
      // Music stays rocking seamlessly without interruption ("que nunca cese")
      this.clearHeldInputs();
      this.emitHud(true);
    }
  }

  public resumeGame(): void {
    if (this.phase === 'PAUSED') {
      this.sound.unlock();
      this.phase = 'PLAYING';
      this.sound.startMusic('battle');
      this.lastTimestamp = performance.now();
      this.emitHud(true);
    }
  }

  public returnToTitle(): void {
    this.clearHeldInputs();
    this.carrierSequence = null;
    this.pendingExplosions = [];
    this.pendingGameOverTimer = 0;
    this.playerRespawnTimer = 0;
    this.bossIntroTimer = 0;
    this.phase = 'TITLE_MENU';
    this.sound.startMusic('title');
    this.emitHud(true);
  }

  public skipBossIntro(): void {
    if (this.bossIntroTimer > 0) {
      this.bossIntroTimer = 0;
      this.showBanner('¡FUEGO LIBRE!', 'Objetivo británico en rango de combate', 1.5);
      this.emitHud(true);
    }
  }

  private startWave(index: number): void {
    this.waveIndex = index;
    this.waveTimer = 0;
    this.nextEventIndex = 0;
    this.waveClearDelay = 0;
    this.bossWarnedForWave = -1;
    this.bossIntroTimer = 0;

    // Launch player's plane off ARA Veinticinco de Mayo (V-2) at the start of every mission
    this.carrierCatapultFired = false;
    this.carrierSequence = {
      mode: 'takeoff',
      carrierX: PLAYFIELD_W / 2,
      carrierY: PLAYFIELD_H - 96,
      carrierVy: 0,
      playerScale: 0.72,
      timer: 0,
      duration: 2.35,
      arrested: false,
    };
    this.player.x = PLAYFIELD_W / 2 - 4;
    this.player.y = PLAYFIELD_H - 96 + 34;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.roll = 0;
    this.player.invulnTimer = 2.6;

    const wave = CAMPAIGN_WAVES[index];
    this.showBanner(wave.title, wave.subtitle, 3.0);
  }

  private startCarrierLanding(): void {
    for (const ep of this.enemyProjectiles) ep.active = false;
    this.player.invulnTimer = 4.0;
    this.carrierSequence = {
      mode: 'landing',
      carrierX: PLAYFIELD_W / 2,
      carrierY: -108,
      carrierVy: 118,
      playerScale: 1.0,
      timer: 0,
      duration: 3.15,
      arrested: false,
    };
    this.spawnFloatingText(
      PLAYFIELD_W / 2,
      180,
      'APROXIMACIÓN A PORTAAVIONES ARA V-2',
      '#74ACDF'
    );
  }

  private updateCarrierSequence(dt: number): void {
    const seq = this.carrierSequence;
    if (!seq) return;
    seq.timer += dt;
    const p = this.player;

    if (seq.mode === 'takeoff') {
      const prepTime = 0.65;
      if (seq.timer < prepTime) {
        // Hold on aft flight deck while catapult pressurizes & emit deck steam
        p.x = seq.carrierX - 4;
        p.y = seq.carrierY + 34;
        p.roll = 0;
        seq.playerScale = 0.72;
        if (Math.random() < dt * 16) {
          this.spawnParticle(
            'smoke',
            seq.carrierX - 7 + (Math.random() - 0.5) * 6,
            seq.carrierY - 28,
            (Math.random() - 0.5) * 18,
            24 + Math.random() * 16,
            2.5,
            6.5,
            0.42,
            '#E2E8F0'
          );
        }
      } else {
        if (!this.carrierCatapultFired) {
          this.carrierCatapultFired = true;
          this.sound.playCarrierLaunch();
          for (let i = 0; i < 10; i++) {
            this.spawnParticle(
              'smoke',
              seq.carrierX - 6 + (Math.random() - 0.5) * 10,
              seq.carrierY + 20 - i * 4,
              (Math.random() - 0.5) * 26,
              32 + Math.random() * 24,
              3,
              8,
              0.48,
              '#F1F5F9'
            );
          }
        }

        const u = Math.min(1, (seq.timer - prepTime) / (seq.duration - prepTime));
        const ease = 1 - Math.pow(1 - u, 2.2);
        seq.carrierY += (95 + u * 125) * dt;
        p.x = (seq.carrierX - 4) + 4 * ease;
        p.y = (PLAYFIELD_H - 62) - 8 * Math.sin(u * Math.PI * 0.5);
        p.roll = 0;
        seq.playerScale = 0.72 + 0.28 * ease;
      }

      if (seq.timer >= seq.duration) {
        this.carrierSequence = null;
        p.invulnTimer = Math.max(p.invulnTimer, 1.0);
        p.y = PLAYFIELD_H - 68;
      }
      return;
    }

    // === LANDING SEQUENCE ON RECOVERY CARRIER ===
    const targetCarrierY = 212;
    if (!seq.arrested) {
      seq.carrierY += (targetCarrierY - seq.carrierY) * Math.min(1, dt * 2.2);
    } else {
      seq.carrierY += 16 * dt;
    }

    const deckX = seq.carrierX - 6;
    const deckY = seq.carrierY + 26;

    if (seq.timer < 1.05) {
      // Line up on final stern approach vector
      const u = seq.timer / 1.05;
      const targetApproachY = 392;
      const prevX = p.x;
      p.x += (deckX - p.x) * Math.min(1, dt * 5.2);
      p.y += (targetApproachY - p.y) * Math.min(1, dt * 4.5);
      p.roll = Math.max(-0.8, Math.min(0.8, (p.x - prevX) * 18));
      seq.playerScale = 1.0 - 0.04 * u;
    } else if (seq.timer < 2.3) {
      // Descend down glideslope onto arresting wires
      const v = Math.min(1, (seq.timer - 1.05) / 1.25);
      const smooth = v * v * (3 - 2 * v);
      p.x += (deckX - p.x) * Math.min(1, dt * 8);
      p.y = 392 * (1 - smooth) + deckY * smooth;
      p.roll *= 0.85;
      seq.playerScale = 0.96 - 0.24 * smooth;

      if (seq.timer >= 2.18 && !seq.arrested) {
        seq.arrested = true;
        this.sound.playCarrierArrest();
        for (let i = 0; i < 8; i++) {
          this.spawnParticle(
            'smoke',
            deckX + (Math.random() - 0.5) * 10,
            deckY + 8,
            (Math.random() - 0.5) * 28,
            18 + Math.random() * 14,
            2,
            6,
            0.38,
            '#CBD5E1'
          );
        }

        const wave = CAMPAIGN_WAVES[this.waveIndex];
        p.exocets = Math.min(p.maxExocets, p.exocets + 1);
        p.bombs = Math.min(p.maxBombs, p.bombs + 2);
        if (wave.number % 2 === 0 && p.lives < MAX_LIVES) {
          p.lives = Math.min(MAX_LIVES, p.lives + 1);
          this.spawnFloatingText(deckX, deckY - 38, '+1 VIDA · +1 EXOCET', '#6EE7B7');
        } else {
          this.spawnFloatingText(deckX, deckY - 38, '¡GANCHO ENGANCHADO! +1 EXOCET', '#F6B40E');
        }
        this.score += 500 * wave.number;
        this.updateHighScore();
        this.emitHud(true);
      }
    } else {
      // Secured on flight deck moving with carrier before catapult launch
      p.x = deckX;
      p.y = deckY;
      p.roll = 0;
      seq.playerScale = 0.72;
    }

    if (seq.timer >= seq.duration) {
      this.carrierSequence = null;
      if (this.waveIndex + 1 < CAMPAIGN_WAVES.length) {
        this.startWave(this.waveIndex + 1);
      } else {
        this.score += 10000;
        this.updateHighScore();
        this.phase = 'VICTORY';
        this.sound.playVictory();
        this.sound.startMusic('tribute');
        this.emitHud(true);
      }
    }
  }

  private showBanner(text: string, subtext: string | null, duration: number): void {
    this.bannerText = text;
    this.bannerSubtext = subtext;
    this.bannerTimer = duration;
    this.emitHud(true);
  }

  private hasActiveWarship(): boolean {
    return this.enemies.some((e) => e.active && e.isSurface && !e.isGround);
  }

  private hasVisibleIsland(): boolean {
    return this.oceanFeatures.some(
      (f) => f.kind === 'island' && f.y + f.height * 0.55 > -24 && f.y - f.height * 0.55 < PLAYFIELD_H + 12
    );
  }

  private isNavalSpawnImminent(): boolean {
    const wave = CAMPAIGN_WAVES[this.waveIndex];
    if (!wave) return false;
    for (let i = this.nextEventIndex; i < Math.min(wave.events.length, this.nextEventIndex + 3); i++) {
      const ev = wave.events[i];
      const spec = ENEMY_SPECS[ev.kind];
      if (spec.isSurface && !spec.isGround && ev.time - this.waveTimer < 4.5) {
        return true;
      }
    }
    return false;
  }

  private updatePendingExplosions(dt: number): void {
    for (let i = this.pendingExplosions.length - 1; i >= 0; i--) {
      const ex = this.pendingExplosions[i];
      ex.delay -= dt;
      if (ex.delay <= 0) {
        this.pendingExplosions.splice(i, 1);
        this.spawnExplosionBurst(ex.x, ex.y, ex.burstCount, ex.primaryColor, true);
        if (ex.ringRadius > 0) {
          this.spawnParticle('ring', ex.x, ex.y, 0, 0, 4, ex.ringRadius, 0.34, '#FDE047');
        }
        if (ex.waterSpray) {
          for (let w = 0; w < 6; w++) {
            const ang = Math.random() * Math.PI * 2;
            const spd = 16 + Math.random() * 44;
            this.spawnParticle(
              'water',
              ex.x,
              ex.y,
              Math.cos(ang) * spd,
              Math.sin(ang) * spd - 14,
              2,
              5,
              0.42,
              '#CBE8F8'
            );
          }
        }
        if (ex.soundScale) {
          this.sound.playExplosion(ex.soundScale);
        }
      }
    }
  }

  private update(dt: number): void {
    if (this.phase === 'PAUSED') return;

    this.simTime += dt;
    this.scrollY += dt * (this.phase === 'PLAYING' ? 48 : 24);
    this.updateOceanFeatures(dt);

    if (this.phase !== 'PLAYING') {
      return;
    }

    if (this.bannerTimer > 0) {
      this.bannerTimer -= dt;
      if (this.bannerTimer <= 0) {
        this.bannerText = null;
        this.bannerSubtext = null;
        this.emitHud(true);
      }
    }

    if (this.shakeIntensity > 0) {
      this.shakeIntensity = Math.max(0, this.shakeIntensity - dt * 16);
    }

    if (this.bossIntroTimer > 0) {
      this.bossIntroTimer = Math.max(0, this.bossIntroTimer - dt);
      for (const ep of this.enemyProjectiles) {
        if (ep.active) ep.active = false;
      }
      if (this.bossIntroTimer <= 0) {
        this.showBanner('¡FUEGO LIBRE!', 'Armamento enemigo activo', 1.6);
        this.emitHud(true);
      }
    }

    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
      }
    }

    this.updatePendingExplosions(dt);

    if (this.hitstopTimer > 0) {
      this.hitstopTimer -= dt;
      return;
    }

    // Handle dramatic fatal crash sequence before showing GAME_OVER modal
    if (this.pendingGameOverTimer > 0) {
      this.pendingGameOverTimer -= dt;
      this.updateBullets(dt);
      this.updateBombs(dt);
      this.updateExocets(dt);
      this.updateEnemies(dt);
      this.updateEnemyProjectiles(dt);
      this.updateParticles(dt);
      this.updateFloatingTexts(dt);
      if (this.pendingGameOverTimer <= 0) {
        this.phase = 'GAME_OVER';
        this.emitHud(true);
      }
      return;
    }

    // Brief respawn delay after losing a life so player witnesses the full explosion
    if (this.playerRespawnTimer > 0) {
      this.playerRespawnTimer -= dt;
      if (this.playerRespawnTimer <= 0) {
        const p = this.player;
        const spec = getAircraftSpec(p.aircraftId);
        p.hp = p.maxHp;
        p.invulnTimer = 2.6;
        p.x = PLAYFIELD_W / 2;
        p.y = PLAYFIELD_H - 58;
        this.spawnFloatingText(p.x, p.y - 18, `NUEVO ${spec.callsign.split(' ')[0]}`, '#74ACDF');
        for (const ep of this.enemyProjectiles) {
          if (ep.active) ep.active = false;
        }
        this.emitHud(true);
      }
    }

    if (this.carrierSequence) {
      this.updateCarrierSequence(dt);
    } else {
      if (this.playerRespawnTimer <= 0) {
        this.updatePlayer(dt);
      }
      this.updateWaveSpawning(dt);
    }
    this.updateBullets(dt);
    this.updateBombs(dt);
    this.updateExocets(dt);
    this.updateEnemies(dt);
    this.updateEnemyProjectiles(dt);
    this.updatePowerUps(dt);
    this.updateParticles(dt);
    this.updateFloatingTexts(dt);

    this.emitHud(false);
  }

  private updateOceanFeatures(dt: number): void {
    const baseSpeed = this.phase === 'PLAYING' ? 48 : 24;
    const shipActive = this.phase === 'PLAYING' && this.hasActiveWarship();
    const navalSoon = this.phase === 'PLAYING' && this.isNavalSpawnImminent();
    const wave = CAMPAIGN_WAVES[this.waveIndex];
    const nextEv = wave?.events[this.nextEventIndex];
    const shipWaitingForLand =
      this.phase === 'PLAYING' &&
      Boolean(
        nextEv &&
          ENEMY_SPECS[nextEv.kind].isSurface &&
          !ENEMY_SPECS[nextEv.kind].isGround &&
          this.waveTimer >= nextEv.time - 0.5
      );

    for (let i = this.oceanFeatures.length - 1; i >= 0; i--) {
      const f = this.oceanFeatures[i];

      if (f.kind === 'island' && (shipActive || navalSoon)) {
        // Never allow islands near surface warships!
        if (f.y < 14) {
          if (f.ephemeral) {
            this.oceanFeatures.splice(i, 1);
          } else {
            // Park offscreen above until open-sea naval phase clears
            f.y = -f.height - 165;
          }
          continue;
        }
        // Any island already past the top clears briskly southward out of ship lanes
        f.y += baseSpeed * f.speedScale * (shipWaitingForLand ? 2.2 : 1.4) * dt;
      } else {
        const islandFlushMult = f.kind === 'island' && shipWaitingForLand ? 2.0 : 1.0;
        f.y += baseSpeed * f.speedScale * islandFlushMult * dt;
      }

      if (f.y - f.height > PLAYFIELD_H + 64) {
        if (f.ephemeral) {
          this.oceanFeatures.splice(i, 1);
          continue;
        }
        f.y = -f.height - (shipActive || navalSoon ? 175 : 54 + Math.random() * 48);
        f.craters = [];
        if (f.kind === 'island') {
          f.variant = (f.variant + 1 + Math.floor(Math.random() * 11)) % 14;
          f.flipX = Math.random() > 0.5;
          f.flipY = Math.random() > 0.5;
          f.angle = (Math.random() - 0.5) * 0.36;
          f.scale = 0.85 + Math.random() * 0.32;
          const flagRoll = Math.random();
          f.flag =
            f.variant === 1 || f.variant === 11 || f.variant === 12
              ? 'ar'
              : f.variant === 13 || flagRoll < 0.34
                ? 'uk'
                : flagRoll < 0.72
                  ? 'ar'
                  : undefined;
          if (f.variant === 9) {
            f.x = f.flipX ? PLAYFIELD_W - 22 : 22;
            f.angle = 0;
            f.scale = 1.0;
          } else {
            const lane = Math.random();
            f.x =
              lane < 0.36
                ? 34 + Math.random() * 48
                : lane < 0.72
                  ? PLAYFIELD_W - 34 - Math.random() * 48
                  : 88 + Math.random() * (PLAYFIELD_W - 176);
          }
        } else if (f.kind === 'kelp') {
          f.variant = (f.variant + 1) % 3;
          f.flipX = Math.random() > 0.5;
          f.flipY = Math.random() > 0.5;
          f.angle = (Math.random() - 0.5) * 0.6;
          f.x = 28 + Math.random() * (PLAYFIELD_W - 56);
        } else {
          f.x = 24 + Math.random() * (PLAYFIELD_W - 48);
        }
      }
    }
  }

  private updatePlayer(dt: number): void {
    const p = this.player;
    const speed = getAircraftSpec(p.aircraftId).speed;
    let dx = 0;
    let dy = 0;
    if (this.input.left) dx -= 1;
    if (this.input.right) dx += 1;
    if (this.input.up) dy -= 1;
    if (this.input.down) dy += 1;

    if (dx !== 0 && dy !== 0) {
      const inv = 1 / Math.SQRT2;
      dx *= inv;
      dy *= inv;
    }

    p.vx = dx * speed;
    p.vy = dy * speed;
    p.x = Math.max(16, Math.min(PLAYFIELD_W - 16, p.x + p.vx * dt));
    p.y = Math.max(26, Math.min(PLAYFIELD_H - 22, p.y + p.vy * dt));

    // Smooth roll banking
    const targetRoll = dx;
    p.roll += (targetRoll - p.roll) * Math.min(1, dt * 14);

    if (p.invulnTimer > 0) p.invulnTimer = Math.max(0, p.invulnTimer - dt);
    if (p.hitFlash > 0) p.hitFlash = Math.max(0, p.hitFlash - dt);
    if (p.muzzleFlash > 0) p.muzzleFlash = Math.max(0, p.muzzleFlash - dt);
    if (p.rapidFireTimer > 0) p.rapidFireTimer = Math.max(0, p.rapidFireTimer - dt);
    if (p.shieldTimer > 0) p.shieldTimer = Math.max(0, p.shieldTimer - dt);
    if (p.clusterTimer > 0) p.clusterTimer = Math.max(0, p.clusterTimer - dt);
    if (p.fireCooldown > 0) p.fireCooldown -= dt;
    if (p.bombCooldown > 0) p.bombCooldown -= dt;
    if (p.exocetCooldown > 0) p.exocetCooldown -= dt;

    // Primary Cannon (autoFire or held)
    if ((this.input.fire || this.input.autoFire) && p.fireCooldown <= 0) {
      this.firePlayerCannon();
    }

    // Secondary Bomb / Rocket Salvo
    if (this.input.bombJustPressed) {
      this.input.bombJustPressed = false;
      if (p.bombs > 0 && p.bombCooldown <= 0) {
        this.launchBomb();
      }
    }

    // Special Guided Missile
    if (this.input.exocetJustPressed) {
      this.input.exocetJustPressed = false;
      if (p.exocets > 0 && p.exocetCooldown <= 0) {
        this.launchExocet();
      }
    }
  }

  private firePlayerCannon(): void {
    const p = this.player;
    p.muzzleFlash = 0.045;
    this.sound.playCannon(p.cannonLevel);

    const spawn = (
      ox: number,
      oy: number,
      vx: number,
      vy: number,
      dmg: number,
      color: string,
      style: PlayerBullet['style']
    ) => {
      const slot = this.bullets.find((b) => !b.active);
      if (!slot) return;
      slot.active = true;
      slot.x = p.x + ox;
      slot.y = p.y + oy;
      slot.vx = vx;
      slot.vy = vy;
      slot.damage = dmg;
      slot.angle = Math.atan2(vy, vx) + Math.PI / 2;
      slot.color = color;
      slot.style = style;
    };

    const turbo = p.rapidFireTimer > 0;
    let baseCd = 0.115;

    if (p.aircraftId === 'super_etendard') {
      // Twin 30mm DEFA high-velocity naval armor-piercing bolts + converging salvoes
      baseCd = p.cannonLevel >= 3 ? 0.1 : 0.12;
      spawn(-4.5, -10, 0, -470, 15, '#38BDF8', 'defa30');
      spawn(4.5, -10, 0, -470, 15, '#38BDF8', 'defa30');
      spawn(-10, -4, 18, -455, 8, '#BAE6FD', 'defa30');
      spawn(10, -4, -18, -455, 8, '#BAE6FD', 'defa30');
      if (p.cannonLevel >= 2) {
        spawn(-10, -4, -28, -455, 11, '#74ACDF', 'defa30');
        spawn(10, -4, 28, -455, 11, '#74ACDF', 'defa30');
      }
      if (p.cannonLevel >= 3) {
        spawn(0, -15, 0, -510, 17, '#E0F2FE', 'defa30');
        spawn(-13, -2, -64, -440, 10, '#38BDF8', 'defa30');
        spawn(13, -2, 64, -440, 10, '#38BDF8', 'defa30');
      }
      if (turbo) {
        spawn(-7, -12, -105, -430, 10, '#67E8F9', 'defa30');
        spawn(7, -12, 105, -430, 10, '#67E8F9', 'defa30');
      }
    } else if (p.aircraftId === 'dagger') {
      // Supersonic fan of golden delta darts (5-way to 9-way wide sweep!)
      baseCd = p.cannonLevel >= 3 ? 0.078 : 0.095;
      spawn(-4, -10, 0, -455, 10, '#FACC15', 'delta_dart');
      spawn(4, -10, 0, -455, 10, '#FACC15', 'delta_dart');
      spawn(-9, -4, -42, -435, 8, '#FDE047', 'delta_dart');
      spawn(9, -4, 42, -435, 8, '#FDE047', 'delta_dart');
      if (p.cannonLevel >= 2) {
        spawn(-11, -2, -88, -415, 8, '#FACC15', 'delta_dart');
        spawn(11, -2, 88, -415, 8, '#FACC15', 'delta_dart');
      }
      if (p.cannonLevel >= 3) {
        spawn(0, -15, 0, -485, 12, '#FEF08A', 'delta_dart');
        spawn(-13, 0, -142, -395, 8, '#FACC15', 'delta_dart');
        spawn(13, 0, 142, -395, 8, '#FACC15', 'delta_dart');
      }
      if (turbo) {
        spawn(-6, -10, -24, -470, 8, '#FEF9C3', 'delta_dart');
        spawn(6, -10, 24, -470, 8, '#FEF9C3', 'delta_dart');
      }
    } else if (p.aircraftId === 'pucara') {
      // Heavy twin-turboprop close air support wall: 4x 7.62 + 2x 20mm Hispano wing cannons
      baseCd = p.cannonLevel >= 3 ? 0.095 : 0.114;
      spawn(-8, -7, -8, -390, 7, '#4ADE80', 'gunship_twin');
      spawn(-2.5, -10, 0, -405, 8, '#BBF7D0', 'gunship_twin');
      spawn(2.5, -10, 0, -405, 8, '#BBF7D0', 'gunship_twin');
      spawn(8, -7, 8, -390, 7, '#4ADE80', 'gunship_twin');
      if (p.cannonLevel >= 2) {
        spawn(-12, -3, -36, -405, 10, '#4ADE80', 'gunship_twin');
        spawn(12, -3, 36, -405, 10, '#4ADE80', 'gunship_twin');
      }
      if (p.cannonLevel >= 3) {
        spawn(0, -13, 0, -430, 12, '#DCFCE7', 'gunship_twin');
        spawn(-15, -1, -78, -385, 9, '#4ADE80', 'gunship_twin');
        spawn(15, -1, 78, -385, 9, '#4ADE80', 'gunship_twin');
      }
      if (turbo) {
        spawn(-15, 0, -122, -370, 8, '#86EFAC', 'gunship_twin');
        spawn(15, 0, 122, -370, 8, '#86EFAC', 'gunship_twin');
      }
    } else {
      // A-4B Skyhawk: High-punch Mk.12 dual 20mm tracers + wide angled wing gun pods
      baseCd = p.cannonLevel >= 3 ? 0.092 : 0.11;
      spawn(-5.5, -9, 0, -420, 11, '#FACC15', 'tracer');
      spawn(5.5, -9, 0, -420, 11, '#FACC15', 'tracer');
      spawn(-9.5, -4, -22, -410, 6, '#FDE047', 'tracer');
      spawn(9.5, -4, 22, -410, 6, '#FDE047', 'tracer');
      if (p.cannonLevel >= 2) {
        spawn(-10, -4, -52, -400, 9, '#F59E0B', 'tracer');
        spawn(10, -4, 52, -400, 9, '#F59E0B', 'tracer');
      }
      if (p.cannonLevel >= 3) {
        spawn(0, -14, 0, -455, 13, '#FEF9C3', 'tracer');
        spawn(-13, -1, -96, -390, 9, '#F59E0B', 'tracer');
        spawn(13, -1, 96, -390, 9, '#F59E0B', 'tracer');
      }
      if (turbo) {
        spawn(-7, -11, -135, -375, 8, '#FDE047', 'tracer');
        spawn(7, -11, 135, -375, 8, '#FDE047', 'tracer');
      }
    }

    p.fireCooldown = turbo ? baseCd * 0.52 : baseCd;
  }

  private launchBomb(): void {
    const p = this.player;
    p.bombs -= 1;
    p.bombCooldown = p.aircraftId === 'dagger' ? 0.3 : 0.38;

    const isCluster = p.clusterTimer > 0;
    let offsets = [0];
    let vy = -92;
    let maxFlightTime = 0.56;
    let radius = 56;
    let damage = 155;
    let label = '';

    if (p.aircraftId === 'super_etendard') {
      offsets = isCluster ? [-76, -38, 0, 38, 76] : [-24, 24];
      vy = -155;
      maxFlightTime = isCluster ? 0.44 : 0.42;
      radius = isCluster ? 42 : 46;
      damage = isCluster ? 95 : 112;
      label = isCluster ? 'RACIMO ZUNI x5!' : 'SALVA ZUNI!';
    } else if (p.aircraftId === 'dagger') {
      offsets = isCluster ? [-86, -43, 0, 43, 86] : [0];
      vy = -132;
      maxFlightTime = isCluster ? 0.44 : 0.46;
      radius = isCluster ? 44 : 52;
      damage = isCluster ? 105 : 145;
      label = isCluster ? 'RACIMO x5!' : 'BOMBA TÁCTICA!';
    } else if (p.aircraftId === 'pucara') {
      offsets = isCluster ? [-88, -44, 0, 44, 88] : [-44, 0, 44];
      vy = -108;
      maxFlightTime = isCluster ? 0.48 : 0.5;
      radius = 42;
      damage = 98;
      label = isCluster ? 'RACIMO LAU-61 x5!' : 'COHETERA LAU-61!';
    } else {
      offsets = isCluster ? [-82, -41, 0, 41, 82] : [0];
      vy = -92;
      maxFlightTime = isCluster ? 0.5 : 0.56;
      radius = isCluster ? 44 : 56;
      damage = isCluster ? 110 : 160;
      label = isCluster ? 'RACIMO x5!' : '';
    }

    for (const spreadVx of offsets) {
      const slot = this.bombs.find((b) => !b.active);
      if (!slot) continue;
      slot.active = true;
      slot.x = p.x + spreadVx * 0.08;
      slot.y = p.y - 6;
      slot.vx = p.vx * 0.14 + spreadVx;
      slot.vy = vy;
      slot.altitude = 1;
      slot.flightTime = 0;
      slot.maxFlightTime = maxFlightTime;
      slot.radius = radius;
      slot.damage = damage;
    }

    if (label) {
      this.spawnFloatingText(p.x, p.y - 18, label, '#FDBA74');
    }

    this.sound.playBombDrop();
    this.emitHud(true);
  }

  private findBestExocetTarget(): EnemyEntity | null {
    const active = this.enemies.filter((e) => e.active && e.y > -12 && e.y < PLAYFIELD_H - 35);
    if (active.length === 0) return null;

    // Dagger's Shafrir II prefers air threats slightly when non-boss; naval planes prioritize ships & bosses
    const preferAir = this.player.aircraftId === 'dagger';
    active.sort((a, b) => {
      const scoreA =
        (a.isBoss ? 10000 : 0) +
        (preferAir ? (!a.isSurface ? 2200 : 800) : a.isSurface ? 2000 : 0) +
        a.hp;
      const scoreB =
        (b.isBoss ? 10000 : 0) +
        (preferAir ? (!b.isSurface ? 2200 : 800) : b.isSurface ? 2000 : 0) +
        b.hp;
      return scoreB - scoreA;
    });
    return active[0];
  }

  private launchExocet(): void {
    const p = this.player;
    p.exocets -= 1;
    p.exocetCooldown = 0.45;

    const target = this.findBestExocetTarget();

    if (p.aircraftId === 'dagger') {
      // Launches twin agile Shafrir II homing missiles
      let launched = 0;
      for (const side of [-1, 1]) {
        const slot = this.exocets.find((m) => !m.active);
        if (!slot) continue;
        launched++;
        slot.active = true;
        slot.kind = 'shafrir';
        slot.x = p.x + side * 10;
        slot.y = p.y - 6;
        slot.angle = -Math.PI / 2 + side * 0.22;
        slot.vx = Math.cos(slot.angle) * 220;
        slot.vy = Math.sin(slot.angle) * 220;
        slot.targetId = target ? target.id : null;
        slot.age = 0;
        slot.damage = 165;
        slot.smokeTimer = 0;
      }
      if (launched > 0) {
        this.shakeIntensity = Math.max(this.shakeIntensity, 2.5);
        this.sound.playExocetLaunch();
        this.spawnFloatingText(p.x, p.y - 20, '¡MISILES SHAFRIR!', '#FDE047');
        this.emitHud(true);
      }
      return;
    }

    const slot = this.exocets.find((m) => !m.active);
    if (!slot) return;

    const isPucara = p.aircraftId === 'pucara';
    const isSUE = p.aircraftId === 'super_etendard';
    slot.active = true;
    slot.kind = isPucara ? 'pescador' : 'exocet';
    slot.x = p.x;
    slot.y = p.y - 10;
    slot.angle = -Math.PI / 2;
    slot.vx = 0;
    slot.vy = -180;
    slot.targetId = target ? target.id : null;
    slot.age = 0;
    slot.damage = isPucara ? 340 : isSUE ? 325 : 280;
    slot.smokeTimer = 0;

    this.shakeIntensity = Math.max(this.shakeIntensity, 2.5);
    this.sound.playExocetLaunch();
    this.spawnFloatingText(
      p.x,
      p.y - 20,
      isPucara ? '¡MARTÍN PESCADOR!' : 'EXOCET AM-39!',
      isPucara ? '#4ADE80' : '#74ACDF'
    );
    this.emitHud(true);
  }

  private updateWaveSpawning(dt: number): void {
    const wave = CAMPAIGN_WAVES[this.waveIndex];
    if (!wave) return;

    if (this.landPatrolCooldown > 0) {
      this.landPatrolCooldown -= dt;
    }

    const activeCount = this.enemies.filter((e) => e.active).length;
    const maxConcurrent = this.waveIndex < 3 ? 6 : this.waveIndex < 10 ? 8 : 10;
    const nextEv = wave.events[this.nextEventIndex];
    const nextSpec = nextEv ? ENEMY_SPECS[nextEv.kind] : null;
    const nextIsBoss = nextSpec ? nextSpec.isBoss : false;
    const nextIsShip = nextSpec ? nextSpec.isSurface && !nextSpec.isGround : false;
    const nextIsGround = nextSpec ? nextSpec.isGround : false;

    const islandVisible = this.hasVisibleIsland();
    const warshipActive = this.hasActiveWarship();

    // Hold surface ships until land scrolls completely off screen; hold ground batteries until warships clear!
    const blockedByGeo = (nextIsShip && islandVisible) || (nextIsGround && warshipActive);

    // Over Malvinas landmasses, dispatch organized tactical pincer air support if skies are quiet
    if (
      islandVisible &&
      !warshipActive &&
      !nextIsBoss &&
      activeCount < 4 &&
      this.landPatrolCooldown <= 0
    ) {
      this.landPatrolCooldown = 2.8;
      const flankKind: EnemyKind =
        this.waveIndex >= 4 ? 'sea_harrier' : 'lynx';
      this.spawnEnemy(flankKind, 0.18, wave.difficultyScale, null, undefined, 'pincer_left', 0);
      this.spawnEnemy(
        this.waveIndex >= 2 ? 'sea_king' : flankKind,
        0.82,
        wave.difficultyScale,
        null,
        undefined,
        'pincer_right',
        1
      );
    }

    const canAdvanceWave =
      !blockedByGeo &&
      (nextIsBoss ? activeCount <= 1 : activeCount < maxConcurrent);

    if (canAdvanceWave) {
      this.waveTimer += dt;
    }

    while (
      this.nextEventIndex < wave.events.length &&
      this.waveTimer >= wave.events[this.nextEventIndex].time
    ) {
      const ev = wave.events[this.nextEventIndex];
      const spec = ENEMY_SPECS[ev.kind];
      const currentActive = this.enemies.filter((e) => e.active).length;
      if (spec.isBoss && currentActive > 1) {
        break;
      }
      if (!spec.isBoss && currentActive >= maxConcurrent) {
        break;
      }
      if (spec.isSurface && !spec.isGround && this.hasVisibleIsland()) {
        break;
      }
      if (spec.isGround && this.hasActiveWarship()) {
        break;
      }
      this.nextEventIndex++;
      this.spawnEnemy(
        ev.kind,
        ev.xRatio,
        wave.difficultyScale,
        ev.dropPowerUp ?? null,
        ev.customLabel,
        ev.tactic ?? 'standard',
        ev.tacticSlot ?? 0
      );
    }

    // Check if level is cleared (all events spawned + all enemies defeated/left)
    const remainingEnemies = this.enemies.some((e) => e.active);
    if (this.nextEventIndex >= wave.events.length && !remainingEnemies && this.pendingExplosions.length === 0) {
      this.waveClearDelay += dt;
      if (this.waveClearDelay >= 0.85 && !this.carrierSequence) {
        this.startCarrierLanding();
      }
    }
  }

  private spawnEnemy(
    kind: EnemyKind,
    xRatio: number,
    difficultyScale: number,
    dropPowerUp: PowerUpKind | null,
    customLabel?: string,
    tactic: EnemyTactic = 'standard',
    tacticSlot = 0
  ): void {
    const spec = ENEMY_SPECS[kind];
    const bossTier = this.waveIndex + 1;
    const bossHpMult = 1 + (bossTier - 1) * 0.22;
    const mobHpMult = 1 + (difficultyScale - 1) * 0.55;
    const hpScaled = Math.round(spec.hp * (spec.isBoss ? bossHpMult : mobHpMult));
    const margin = spec.isGround ? 54 : 26;
    const spawnX = Math.max(margin, Math.min(PLAYFIELD_W - margin, xRatio * PLAYFIELD_W));
    const spawnY = spec.isGround ? -46 : -spec.height * 0.6 - 10;

    // Anchor ground enemies firmly on a solid Malvinas island moving at ground speed (ONLY when no warship is active)
    if (spec.isGround && !this.hasActiveWarship()) {
      const existingLand = this.oceanFeatures.find(
        (f) =>
          f.kind === 'island' &&
          Math.abs(f.x - spawnX) < 34 &&
          Math.abs(f.y - spawnY) < 42
      );
      if (existingLand) {
        existingLand.flag = 'uk';
      } else {
        const solidVariants = [0, 3, 4, 5, 6, 8, 10, 13];
        const variant = solidVariants[Math.floor(Math.random() * solidVariants.length)];
        this.oceanFeatures.unshift({
          x: spawnX,
          y: spawnY,
          width: 132,
          height: 118,
          kind: 'island',
          variant,
          flipX: Math.random() > 0.5,
          flipY: Math.random() > 0.5,
          angle: (Math.random() - 0.5) * 0.28,
          scale: 0.94 + Math.random() * 0.16,
          flag: 'uk',
          seed: Math.random() * 10,
          speedScale: 1.0,
          ephemeral: true,
          craters: [],
        });
      }
    }

    const enemy: EnemyEntity = {
      id: this.nextEnemyId++,
      active: true,
      kind,
      isSurface: spec.isSurface,
      isGround: spec.isGround,
      isBoss: spec.isBoss,
      label: customLabel || spec.label,
      x: spawnX,
      y: spawnY,
      vx: 0,
      vy: spec.vy,
      width: spec.width,
      height: spec.height,
      hp: hpScaled,
      maxHp: hpScaled,
      scoreValue: Math.round(spec.score * (1 + (difficultyScale - 1) * 0.28)),
      age: 0,
      fireTimer: spec.isBoss
        ? 0.9
        : Math.max(0.7, spec.fireInterval * 0.72),
      telegraphTimer: 0,
      phase: 0,
      hitFlash: 0,
      rotorAngle: Math.random() * Math.PI * 2,
      turretAngle: 0,
      dropPowerUp,
      difficultyScale,
      bossTier,
      tactic: spec.isBoss ? 'boss_tactical' : tactic,
      tacticAnchorX: spawnX,
      tacticSlot,
    };

    this.enemies.push(enemy);

    if (spec.isBoss && this.bossWarnedForWave !== this.waveIndex) {
      this.bossWarnedForWave = this.waveIndex;
      this.sound.playBossWarning();
      // Trigger formal Boss Self-Presentation + Weapons Briefing before duel starts!
      this.bossIntroTimer = this.bossIntroDuration;
      for (const ep of this.enemyProjectiles) {
        if (ep.active) ep.active = false;
      }
      this.bannerText = null;
      this.bannerSubtext = null;
      this.bannerTimer = 0;
      this.emitHud(true);
    }
  }

  private updateBullets(dt: number): void {
    for (const b of this.bullets) {
      if (!b.active) continue;
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      if (b.y < -25 || b.x < -25 || b.x > PLAYFIELD_W + 25) {
        b.active = false;
        continue;
      }

      // Check collision against enemies
      for (const e of this.enemies) {
        if (!e.active) continue;
        if (
          Math.abs(b.x - e.x) < e.width * 0.5 + 4 &&
          Math.abs(b.y - e.y) < e.height * 0.5 + 6
        ) {
          b.active = false;
          // Surface armor takes slightly reduced 20mm damage compared to bombs/Exocet
          const dmg = e.isSurface ? b.damage * 0.72 : b.damage;
          this.damageEnemy(e, dmg, b.x, b.y, false);
          this.spawnParticle('spark', b.x, b.y, (Math.random() - 0.5) * 90, 40, 3, 1, 0.16, '#FDE047');
          break;
        }
      }
    }
  }

  private updateBombs(dt: number): void {
    for (const b of this.bombs) {
      if (!b.active) continue;
      b.flightTime += dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.altitude = Math.max(0, 1 - b.flightTime / b.maxFlightTime);

      if (b.flightTime >= b.maxFlightTime) {
        b.active = false;
        this.detonateBomb(b);
      }
    }
  }

  private detonateBomb(b: PlayerBomb): void {
    let hitAnySurface = false;
    for (const e of this.enemies) {
      if (!e.active) continue;
      const dist = Math.hypot(e.x - b.x, e.y - b.y);
      const effectiveRadius = b.radius + Math.max(e.width, e.height) * 0.35;
      if (dist <= effectiveRadius) {
        // Bombs crush ground emplacements & surface ships
        const mult = e.isGround ? 1.45 : e.isSurface ? 1.25 : 0.85;
        this.damageEnemy(e, b.damage * mult, b.x, b.y, true);
        if (e.isSurface || e.isGround) hitAnySurface = true;
      }
    }

    // Also clear nearby enemy bullets inside bomb blast! (classic arcade bomb utility)
    for (const ep of this.enemyProjectiles) {
      if (ep.active && Math.hypot(ep.x - b.x, ep.y - b.y) <= b.radius) {
        ep.active = false;
      }
    }

    this.shakeIntensity = Math.max(this.shakeIntensity, hitAnySurface ? 5 : 3);
    this.sound.playBombExplode(!hitAnySurface);

    if (hitAnySurface) {
      this.spawnExplosionBurst(b.x, b.y, 16, '#F59E0B');
      this.spawnParticle('ring', b.x, b.y, 0, 0, 6, b.radius, 0.35, '#FDE047');
    } else {
      for (let i = 0; i < 12; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 14 + Math.random() * 48;
        this.spawnParticle(
          'water',
          b.x,
          b.y,
          Math.cos(ang) * spd,
          Math.sin(ang) * spd - 18,
          2 + Math.random() * 2,
          5 + Math.random() * 3,
          0.45,
          '#CBE8F8'
        );
      }
      this.spawnParticle('ring', b.x, b.y, 0, 0, 5, 34, 0.4, '#E0F2FE');
    }
  }

  private updateExocets(dt: number): void {
    for (const m of this.exocets) {
      if (!m.active) continue;
      m.age += dt;
      m.smokeTimer -= dt;

      let target = m.targetId !== null ? this.enemies.find((e) => e.active && e.id === m.targetId) : undefined;
      if (!target) {
        target = this.findBestExocetTarget() ?? undefined;
        m.targetId = target ? target.id : null;
      }

      const speed = m.kind === 'shafrir' ? 305 : m.kind === 'pescador' ? 235 : 270;
      if (target) {
        const desiredAngle = Math.atan2(target.y - m.y, target.x - m.x);
        let diff = desiredAngle - m.angle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        const turnRate = m.kind === 'shafrir' ? 8.2 : 6.8;
        m.angle += Math.max(-turnRate * dt, Math.min(turnRate * dt, diff));
      }

      m.vx = Math.cos(m.angle) * speed;
      m.vy = Math.sin(m.angle) * speed;
      m.x += m.vx * dt;
      m.y += m.vy * dt;

      if (m.smokeTimer <= 0) {
        m.smokeTimer = 0.03;
        this.spawnParticle('smoke', m.x, m.y, (Math.random() - 0.5) * 10, 10, 2, 5, 0.36, '#CBD5E1');
      }

      if (m.y < -25 || m.x < -25 || m.x > PLAYFIELD_W + 25 || m.age > 4.5) {
        m.active = false;
        continue;
      }

      for (const e of this.enemies) {
        if (!e.active) continue;
        if (
          Math.abs(m.x - e.x) < e.width * 0.55 + 6 &&
          Math.abs(m.y - e.y) < e.height * 0.55 + 6
        ) {
          m.active = false;
          this.hitstopTimer = 0.055;
          this.shakeIntensity = Math.max(this.shakeIntensity, m.kind === 'pescador' ? 8.5 : 7);
          this.sound.playExocetImpact();
          this.spawnExplosionBurst(m.x, m.y, m.kind === 'pescador' ? 30 : 24, '#F97316');
          const ringColor =
            m.kind === 'shafrir' ? '#FDE047' : m.kind === 'pescador' ? '#4ADE80' : '#74ACDF';
          this.spawnParticle(
            'ring',
            m.x,
            m.y,
            0,
            0,
            6,
            m.kind === 'pescador' ? 76 : 56,
            0.42,
            ringColor
          );
          this.spawnFloatingText(
            m.x,
            m.y - 14,
            m.kind === 'shafrir'
              ? 'IMPACTO SHAFRIR!'
              : m.kind === 'pescador'
                ? '¡IMPACTO PESCADOR!'
                : 'IMPACTO EXOCET!',
            ringColor
          );
          const clearRadius = m.kind === 'pescador' ? 95 : 68;
          for (const ep of this.enemyProjectiles) {
            if (ep.active && Math.hypot(ep.x - m.x, ep.y - m.y) <= clearRadius) {
              ep.active = false;
            }
          }
          const mult = e.isSurface ? 1.35 : m.kind === 'shafrir' ? 1.2 : 1.0;
          this.damageEnemy(e, m.damage * mult, m.x, m.y, true);
          break;
        }
      }
    }
  }

  private computeAimAngle(
    ex: number,
    ey: number,
    projSpeed: number,
    leadWeight = 0.68
  ): number {
    const p = this.player;
    let predX = p.x;
    let predY = p.y;
    for (let iter = 0; iter < 2; iter++) {
      const dist = Math.hypot(predX - ex, predY - ey);
      const flightTime = Math.min(1.35, dist / Math.max(70, projSpeed));
      predX = Math.max(16, Math.min(PLAYFIELD_W - 16, p.x + p.vx * flightTime * leadWeight));
      predY = Math.max(24, Math.min(PLAYFIELD_H - 22, p.y + p.vy * flightTime * leadWeight * 0.72));
    }
    return Math.atan2(predY - ey, predX - ex);
  }

  private computeThreatAvoidance(e: EnemyEntity): number {
    // Scan nearby upward player bullets & player centerline so agile enemies jink out of raw bullet streams
    let dodge = 0;
    const scanY = e.isBoss ? 165 : 135;
    const laneHalf = e.width * 0.65 + 12;

    for (const b of this.bullets) {
      if (!b.active) continue;
      const dy = b.y - e.y;
      if (dy > 0 && dy < scanY) {
        const dx = b.x - e.x;
        if (Math.abs(dx) < laneHalf) {
          const weight = (1 - dy / scanY) * (dx >= 0 ? -1 : 1);
          dodge += weight;
        }
      }
    }

    // Softly nudge away from edges if pressured near boundary
    if (e.x < 54) dodge += 1.4;
    if (e.x > PLAYFIELD_W - 54) dodge -= 1.4;

    // Gentle separation from nearby flying allies so formations don't stack on one pixel
    if (!e.isSurface && !e.isBoss) {
      for (const other of this.enemies) {
        if (!other.active || other.id === e.id || other.isSurface) continue;
        const dx = e.x - other.x;
        const dy = e.y - other.y;
        if (Math.abs(dx) < 34 && Math.abs(dy) < 30) {
          dodge += dx >= 0 ? 0.9 : -0.9;
        }
      }
    }

    return Math.max(-1.6, Math.min(1.6, dodge));
  }

  private updateEnemies(dt: number): void {
    const p = this.player;

    for (const e of this.enemies) {
      if (!e.active) continue;
      e.age += dt;
      if (e.hitFlash > 0) e.hitFlash = Math.max(0, e.hitFlash - dt);
      e.rotorAngle += dt * 22;

      const angleToPlayer = this.computeAimAngle(e.x, e.y, 155, 0.55);
      e.turretAngle = angleToPlayer - Math.PI / 2;

      if (e.isBoss) {
        const patrolY = e.kind === 'boss_carrier' ? 86 : 74;
        if (e.y < patrolY) {
          e.y += e.vy * 1.65 * dt;
        }
        if (this.bossIntroTimer > 0) {
          // Glides proudly to center engagement station during its self-presentation
          const centerX = PLAYFIELD_W / 2;
          e.x += (centerX - e.x) * Math.min(1, dt * 3.0);
        } else {
          // Adaptive Tactical Boss AI (accelerates maneuvers below 55% HP!)
          const enraged = e.hp < e.maxHp * 0.55;
          const phaseDur = enraged ? 3.8 : 4.8;
          const cycle = Math.floor(e.age / phaseDur) % 3;
          const speedFactor = (enraged ? 3.1 : 2.5) + e.bossTier * 0.12;
          const threatAvoid = this.computeThreatAvoidance(e);
          const avoidScale = e.kind === 'boss_harrier_ace' || e.kind === 'boss_vulcan' ? 76 : 38;
          let targetX = PLAYFIELD_W / 2;
          let targetY = patrolY;

          if (cycle === 0) {
            // Tactic 1: Flanking Off-Axis Track — aligns heavy weapons while staying outside center gun barrel
            const offset = p.x > PLAYFIELD_W * 0.5 ? -44 : 44;
            targetX = Math.max(58, Math.min(PLAYFIELD_W - 58, p.x + offset + threatAvoid * avoidScale * 0.45));
            targetY = patrolY + (e.kind === 'boss_harrier_ace' ? 18 : 4);
          } else if (cycle === 1) {
            // Tactic 2: Wide Broadside Sweep across lanes + reactive jinking
            const flankDir = Math.floor(e.age / (phaseDur * 2)) % 2 === 0 ? 1 : -1;
            const sweep = Math.sin(((e.age % phaseDur) / phaseDur) * Math.PI) * (PLAYFIELD_W * 0.32);
            targetX = PLAYFIELD_W * 0.5 + flankDir * sweep + threatAvoid * avoidScale * 0.3;
            targetY = patrolY + 10;
          } else {
            // Tactic 3: Reactive Counter-Anchor opposite player while coordinating pincer wingmen
            const counterSide = p.x < PLAYFIELD_W * 0.5 ? 64 : -64;
            targetX = PLAYFIELD_W / 2 + counterSide + threatAvoid * avoidScale;
            targetY = patrolY - 4;
          }

          e.x += (targetX - e.x) * Math.min(1, dt * speedFactor);
          e.y += (targetY - e.y) * Math.min(1, dt * 2.4);
        }
      } else if (e.isGround) {
        // Stationary Malvinas landmass batteries stay locked on their island coordinates
        e.y += e.vy * dt;
      } else if (e.tactic === 'pincer_left' || e.tactic === 'pincer_right') {
        // Coordinated Flanking Pincer: bracket player on opposite diagonals & hold firing pocket cleanly
        const side = e.tactic === 'pincer_left' ? -1 : 1;
        const holdZone = e.y > 68 && e.age < 3.15;
        const threatAvoid = this.computeThreatAvoidance(e);
        const bracketX = p.x + side * 82 + threatAvoid * 36;
        const targetX = holdZone
          ? Math.max(24, Math.min(PLAYFIELD_W - 24, bracketX))
          : e.tacticAnchorX + side * 24;
        e.x += (targetX - e.x) * Math.min(1, dt * 3.2);
        e.y += e.vy * (holdZone ? 0.34 : 1.12) * dt;
      } else if (e.tactic === 'v_wing_left' || e.tactic === 'v_wing_right') {
        // Organized V-Wedge Interceptor Squadron: tracks ahead of player's escape vector while dodging nose fire
        const side = e.tactic === 'v_wing_left' ? -1 : 1;
        const engage = e.y > 54 && e.age < 2.65;
        const threatAvoid = this.computeThreatAvoidance(e);
        const wingX = Math.max(
          24,
          Math.min(PLAYFIELD_W - 24, p.x + p.vx * 0.22 + side * 62 + threatAvoid * 32)
        );
        e.x += (wingX - e.x) * Math.min(1, dt * 2.75);
        e.y += e.vy * (engage ? 0.5 : 1.08) * dt;
      } else if (e.tactic === 'intercept_track') {
        // Smart Sea Harrier Energy Dogfighter: attacks from lateral offset & peels past instead of flying head-on into cannons!
        const threatAvoid = this.computeThreatAvoidance(e);
        const divePhase = e.age < 1.35;
        const passSide = e.tacticAnchorX < PLAYFIELD_W / 2 ? -1 : 1;
        const desiredX = divePhase
          ? p.x + passSide * 58 + threatAvoid * 54
          : p.x - passSide * 48 + threatAvoid * 48;
        const boundedX = Math.max(24, Math.min(PLAYFIELD_W - 24, desiredX));
        e.x += (boundedX - e.x) * Math.min(1, dt * 3.1);
        const holdAttackBand = e.y > 74 && e.y < 185 && e.age < 3.0;
        e.y += e.vy * (holdAttackBand ? 0.42 : 1.06) * dt;
      } else if (e.tactic === 'flank_hover') {
        // Tactical Gunship Overwatch: stays ~74px clear of player's gun line & slides dynamically to dodge bursts
        const threatAvoid = this.computeThreatAvoidance(e);
        const hoverBand = e.y > 82 && e.y < 164 && e.age < 4.2;
        const preferSide = e.x < p.x ? -74 : 74;
        const targetX = Math.max(26, Math.min(PLAYFIELD_W - 26, p.x + preferSide + threatAvoid * 46));
        e.x += (targetX - e.x) * Math.min(1, dt * 2.45);
        e.y += e.vy * (hoverBand ? 0.22 : 0.98) * dt;
      } else if (e.tactic === 'escort_wall' || e.isSurface) {
        // Royal Navy vessels execute subtle tactical evasive course changes while keeping turrets locked on player
        const evasiveSway =
          e.kind === 'patrol_boat' || e.kind === 'minesweeper' || e.kind === 'corvette'
            ? Math.cos(e.age * 1.15 + e.tacticSlot * 1.9) * 14
            : Math.cos(e.age * 0.75 + e.tacticSlot * 1.5) * 6;
        e.x += evasiveSway * dt;
        e.y += e.vy * dt;
      } else {
        // Tactical Vulcan / Heavy Bomber track with slight threat drift
        const threatAvoid = this.computeThreatAvoidance(e);
        const trackTarget = Math.max(
          42,
          Math.min(PLAYFIELD_W - 42, e.tacticAnchorX * 0.4 + p.x * 0.6 + threatAvoid * 28)
        );
        e.x += (trackTarget - e.x) * Math.min(1, dt * 1.45);
        e.y += e.vy * dt;
      }

      e.x = Math.max(20, Math.min(PLAYFIELD_W - 20, e.x));

      if (!e.isBoss && e.y > PLAYFIELD_H + e.height + 24) {
        e.active = false;
        continue;
      }

      // Enemies actively aim and fire once in engagement airspace/sea zone (boss waits until intro presentation finishes!)
      const bossReady = !e.isBoss || this.bossIntroTimer <= 0;
      if (bossReady && e.y > 16 && e.y < PLAYFIELD_H - 42) {
        e.fireTimer -= dt;
        if (e.fireTimer <= 0.4 && e.fireTimer > 0) {
          e.telegraphTimer = e.fireTimer;
        } else {
          e.telegraphTimer = 0;
        }

        if (e.fireTimer <= 0) {
          this.fireEnemyPattern(e);
          const spec = ENEMY_SPECS[e.kind];
          if (e.isBoss) {
            const enraged = e.hp < e.maxHp * 0.55 ? 1.18 : 1.0;
            const bossRateBoost = (1 + (e.bossTier - 1) * 0.075) * enraged;
            e.fireTimer = Math.max(0.62, spec.fireInterval / bossRateBoost);
          } else {
            const rateBoost = Math.min(1.52, 1 + (e.difficultyScale - 1) * 0.16);
            e.fireTimer = Math.max(0.78, spec.fireInterval / rateBoost);
          }
        }
      }

      if (p.invulnTimer <= 0 && this.playerRespawnTimer <= 0 && this.pendingGameOverTimer <= 0 && !e.isSurface) {
        if (
          Math.abs(p.x - e.x) < e.width * 0.38 + 3 &&
          Math.abs(p.y - e.y) < e.height * 0.38 + 3
        ) {
          this.hitPlayer();
          if (!e.isBoss) {
            this.damageEnemy(e, 45, e.x, e.y, false);
          }
        }
      }
    }

    if (this.enemies.length > 48) {
      this.enemies = this.enemies.filter((e) => e.active);
    }
  }

  private fireEnemyPattern(e: EnemyEntity): void {
    const p = this.player;
    const baseSpeed = 112 + Math.min(62, (e.difficultyScale - 1) * 32);
    const activeBulletCount = () => this.enemyProjectiles.filter((ep) => ep.active).length;

    const spawnBullet = (ang: number, spd: number, kind: EnemyProjectile['kind'], color: string, radius = 2.5) => {
      if (activeBulletCount() >= 52) return;
      const slot = this.enemyProjectiles.find((ep) => !ep.active);
      if (!slot) return;
      slot.active = true;
      slot.kind = kind;
      slot.x = e.x;
      slot.y = e.y + (e.isSurface ? 6 : 8);
      slot.vx = Math.cos(ang) * spd;
      slot.vy = Math.sin(ang) * spd;
      slot.radius = radius;
      slot.age = 0;
      slot.color = color;
    };

    const aimDirect = (spd: number, lead = 0.72) => this.computeAimAngle(e.x, e.y, spd, lead);
    // Lateral cutoff bias punishes continuous one-way strafing cleanly
    const strafeBias = Math.abs(p.vx) > 45 ? Math.sign(p.vx) * 0.11 : 0;

    e.phase = (e.phase + 1) % 4;

    if (e.kind === 'patrol_boat' || e.kind === 'lynx' || e.kind === 'minesweeper') {
      const ang = aimDirect(baseSpeed * 1.06, 0.65);
      spawnBullet(ang, baseSpeed * 1.06, 'bullet', '#EF4444', 2.5);
      if (e.difficultyScale >= 1.4 && e.phase % 2 === 0) {
        spawnBullet(ang + strafeBias, baseSpeed * 1.12, 'bullet', '#F97316', 2.3);
      }
    } else if (e.kind === 'bofors_aa') {
      const ang = aimDirect(baseSpeed * 1.1, 0.72);
      spawnBullet(ang, baseSpeed * 1.1, 'flak', '#FDE047', 2.6);
      spawnBullet(ang + (strafeBias || (e.phase % 2 === 0 ? 0.08 : -0.08)), baseSpeed * 1.04, 'flak', '#FDE047', 2.4);
    } else if (e.kind === 'rapier_sam') {
      const ang = aimDirect(baseSpeed * 1.18, 0.82);
      spawnBullet(ang, baseSpeed * 1.18, 'missile', '#EF4444', 3.1);
      if (e.difficultyScale >= 1.65) {
        spawnBullet(ang + (strafeBias || 0.12), baseSpeed * 1.12, 'missile', '#EF4444', 2.8);
      }
    } else if (e.kind === 'radar_bunker') {
      const ang = aimDirect(baseSpeed * 1.02, 0.68);
      for (const offset of [-0.2, 0, 0.2]) {
        spawnBullet(ang + offset, baseSpeed * 1.02, 'flak', '#F97316', 2.8);
      }
    } else if (e.kind === 'sea_king') {
      const ang = aimDirect(baseSpeed, 0.72);
      spawnBullet(ang, baseSpeed * 1.04, 'bullet', '#F97316', 2.6);
      spawnBullet(ang + (strafeBias || (e.phase % 2 === 0 ? -0.14 : 0.14)), baseSpeed * 0.96, 'bullet', '#F97316', 2.4);
    } else if (e.kind === 'sea_harrier') {
      const ang = aimDirect(baseSpeed * 1.16, 0.82);
      spawnBullet(ang, baseSpeed * 1.16, 'missile', '#EF4444', 3.1);
      spawnBullet(ang + (strafeBias || -0.1), baseSpeed * 1.1, 'bullet', '#FDE047', 2.5);
    } else if (
      e.kind === 'corvette' ||
      e.kind === 'type21_frigate' ||
      e.kind === 'sir_galahad' ||
      e.kind === 'supply_tanker'
    ) {
      const ang = aimDirect(baseSpeed * 1.02, 0.72);
      const spread = e.difficultyScale >= 1.45 ? [-0.22, 0, 0.22] : [-0.14, 0, 0.14];
      for (const offset of spread) {
        spawnBullet(ang + offset, baseSpeed * 1.02, 'flak', '#F59E0B', 2.8);
      }
    } else if (e.kind === 'type42_destroyer') {
      const ang = aimDirect(baseSpeed * 1.12, 0.8);
      spawnBullet(ang, baseSpeed * 1.12, 'missile', '#EF4444', 3.1);
      for (const offset of [-0.2, 0, 0.2]) {
        spawnBullet(ang + offset, baseSpeed * 0.98, 'flak', '#F59E0B', 2.5);
      }
    } else if (e.kind === 'vulcan') {
      const ang = aimDirect(baseSpeed * 0.96, 0.72);
      for (const offset of [-0.2, 0, 0.2]) {
        spawnBullet(ang + offset, baseSpeed * 0.96, 'flak', '#F59E0B', 2.9);
      }
    } else if (e.isBoss) {
      // Progressive Per-Level Tactical Boss Arsenal across Levels 1..20 — Predictive Lead + Escape Cutoff + Guided Missiles!
      const tier = e.bossTier;
      const bossSpeed = 112 + Math.min(86, (tier - 1) * 4.5);
      const aimLead = aimDirect(bossSpeed, 0.82);
      const fanExtra = Math.floor((tier - 1) / 3);

      if (e.phase === 0 || e.phase === 2) {
        const rawTotal = 3 + fanExtra;
        const total = Math.min(9, rawTotal % 2 === 0 ? rawTotal + 1 : rawTotal);
        for (let i = 0; i < total; i++) {
          const offset = (i - (total - 1) / 2) * (total >= 7 ? 0.15 : 0.2);
          spawnBullet(aimLead + offset, bossSpeed, 'flak', '#F59E0B', 3);
        }
        if (e.phase === 2 && tier >= 4) {
          // Flanking cutoff shots catching strafing evasion
          spawnBullet(aimLead + (strafeBias || -0.26), bossSpeed * 1.1, 'bullet', '#EF4444', 2.8);
          spawnBullet(aimLead - (strafeBias || -0.26), bossSpeed * 1.1, 'bullet', '#EF4444', 2.8);
        }
      } else if (e.phase === 1) {
        const missileSpread =
          tier >= 13 ? [-0.2, 0, 0.2] : tier >= 4 ? [-0.13, 0, 0.13] : [0];
        for (const mOff of missileSpread) {
          spawnBullet(aimLead + mOff, bossSpeed * 1.14, 'missile', '#EF4444', 3.2);
        }
        const ringN = Math.min(14, 6 + Math.floor((tier - 1) * 0.45));
        for (let i = 0; i < ringN; i++) {
          const ang = aimLead + (i / ringN) * Math.PI * 2;
          spawnBullet(ang, bossSpeed * 0.8, 'bullet', '#EF4444', 2.6);
        }
      } else {
        const salvoCount = tier >= 11 ? 5 : 3;
        for (let i = 0; i < salvoCount; i++) {
          const off = (i - (salvoCount - 1) / 2) * 0.13;
          spawnBullet(aimLead + off, bossSpeed * 1.1, 'bullet', '#EF4444', 2.8);
        }
        const escortLimit = tier >= 10 ? 2 : 1;
        const activeEscorts = this.enemies.filter((x) => x.active && !x.isBoss).length;
        if (tier >= 3 && activeEscorts < escortLimit) {
          const escortKind: EnemyKind =
            e.kind === 'boss_carrier' || tier >= 8 ? 'sea_harrier' : tier >= 5 ? 'sea_king' : 'lynx';
          const tacticSide: EnemyTactic = activeEscorts % 2 === 0 ? 'pincer_left' : 'pincer_right';
          this.spawnEnemy(
            escortKind,
            tacticSide === 'pincer_left' ? 0.16 : 0.84,
            e.difficultyScale * 0.8,
            null,
            undefined,
            tacticSide,
            activeEscorts
          );
        }
      }
    }
  }

  private updateEnemyProjectiles(dt: number): void {
    const p = this.player;
    for (const ep of this.enemyProjectiles) {
      if (!ep.active) continue;
      ep.age += dt;

      // Enemy guided missiles (Rapier SAM, Sidewinder, Sea Dart) actively track toward player early in flight!
      if (ep.kind === 'missile' && ep.age > 0.14 && ep.age < 1.15 && p.hp > 0) {
        const speed = Math.hypot(ep.vx, ep.vy);
        if (speed > 10) {
          const currentAng = Math.atan2(ep.vy, ep.vx);
          const targetAng = Math.atan2(p.y - ep.y, p.x - ep.x);
          let diff = targetAng - currentAng;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          const maxTurn = 0.82 * dt;
          const newAng = currentAng + Math.max(-maxTurn, Math.min(maxTurn, diff));
          ep.vx = Math.cos(newAng) * speed;
          ep.vy = Math.sin(newAng) * speed;
        }
      }

      ep.x += ep.vx * dt;
      ep.y += ep.vy * dt;

      if (ep.x < -16 || ep.x > PLAYFIELD_W + 16 || ep.y < -16 || ep.y > PLAYFIELD_H + 16) {
        ep.active = false;
        continue;
      }

      if (p.invulnTimer <= 0 && this.playerRespawnTimer <= 0 && this.pendingGameOverTimer <= 0 && p.hp > 0) {
        const dist = Math.hypot(ep.x - p.x, ep.y - (p.y - 1));
        if (dist < ep.radius + 2.2) {
          ep.active = false;
          this.hitPlayer();
        }
      }
    }
  }

  private spawnImpressivePlayerExplosion(px: number, py: number, isFinalGameOver: boolean): void {
    this.shakeIntensity = Math.max(this.shakeIntensity, isFinalGameOver ? 14 : 11);
    this.hitstopTimer = 0.085;
    this.sound.playExplosion('large');
    this.sound.playExocetImpact();

    // Triple expanding concentric shockwave rings
    this.spawnParticle('ring', px, py, 0, 0, 8, 78, 0.55, '#FFFFFF');
    this.spawnParticle('ring', px, py, 0, 0, 5, 58, 0.45, '#FDE047');
    this.spawnParticle('ring', px, py, 0, 0, 4, 40, 0.36, '#F97316');

    // Primary incandescent fireball + dense tumbling metallic aircraft debris
    this.spawnExplosionBurst(px, py, 44, '#F97316', true);
    for (let i = 0; i < 16; i++) {
      const ang = (i / 16) * Math.PI * 2 + Math.random() * 0.3;
      const spd = 48 + Math.random() * 115;
      this.spawnParticle(
        'debris',
        px + (Math.random() - 0.5) * 10,
        py + (Math.random() - 0.5) * 10,
        Math.cos(ang) * spd,
        Math.sin(ang) * spd,
        2.6 + Math.random() * 2.2,
        1.4,
        0.75 + Math.random() * 0.4,
        i % 2 === 0 ? '#94A3B8' : '#74ACDF'
      );
    }

    // Schedule dramatic cascading aftershock fireballs around crash site!
    const offsets: [number, number, number][] = [
      [0.11, -18, -14],
      [0.24, 20, -10],
      [0.39, -14, 18],
      [0.54, 16, 16],
      [0.72, 0, -6],
    ];
    for (const [delay, dx, dy] of offsets) {
      this.pendingExplosions.push({
        delay,
        x: px + dx,
        y: py + dy,
        burstCount: 22,
        ringRadius: 46,
        primaryColor: '#EF4444',
        soundScale: delay === 0.24 || delay === 0.54 ? 'medium' : undefined,
      });
    }
  }

  private hitPlayer(): void {
    const p = this.player;
    if (p.hp <= 0 || this.playerRespawnTimer > 0 || this.pendingGameOverTimer > 0) return;

    if (p.shieldTimer > 0) {
      p.invulnTimer = 0.35;
      this.shakeIntensity = Math.max(this.shakeIntensity, 2.5);
      this.sound.playEnemyHit();
      this.spawnParticle('ring', p.x, p.y, 0, 0, 10, 28, 0.28, '#74ACDF');
      this.spawnFloatingText(p.x, p.y - 14, 'DESVIADO!', '#74ACDF');
      return;
    }

    p.hp -= 1;
    p.hitFlash = 0.18;
    p.invulnTimer = 1.4;
    this.shakeIntensity = Math.max(this.shakeIntensity, 6);
    this.hitstopTimer = 0.045;
    this.sound.playPlayerHit();
    this.spawnExplosionBurst(p.x, p.y, 16, '#EF4444', true);

    if (p.hp <= 0) {
      p.lives -= 1;
      const crashX = p.x;
      const crashY = p.y;
      if (p.lives <= 0) {
        // Music stays playing seamlessly; run 1.45s dramatic explosion before GAME_OVER overlay
        this.spawnImpressivePlayerExplosion(crashX, crashY, true);
        this.pendingGameOverTimer = 1.45;
        this.emitHud(true);
        return;
      }
      this.spawnImpressivePlayerExplosion(crashX, crashY, false);
      p.cannonLevel = Math.max(1, p.cannonLevel - 1);
      this.playerRespawnTimer = 0.72;
      this.emitHud(true);
      return;
    }

    this.emitHud(true);
  }

  private damageEnemy(
    e: EnemyEntity,
    amount: number,
    hitX: number,
    hitY: number,
    isHeavy: boolean
  ): void {
    if (e.isBoss && this.bossIntroTimer > 0) {
      e.hitFlash = 0.04;
      if (!isHeavy) {
        this.sound.playEnemyHit();
      }
      return;
    }

    e.hp -= amount;
    e.hitFlash = 0.06;
    if (!isHeavy) {
      this.sound.playEnemyHit();
    }

    if (e.hp <= 0) {
      e.active = false;
      this.enemiesDefeated += 1;
      if (e.isSurface && !e.isGround) this.shipsSunk += 1;

      this.comboCount += 1;
      this.comboTimer = 3.2;
      const comboMult = Math.min(5, 1 + Math.floor(this.comboCount / 3));
      const awardedScore = e.scoreValue * comboMult;
      this.score += awardedScore;
      this.updateHighScore();

      const isShip = e.isSurface && !e.isGround;
      const scale = e.isBoss ? 'large' : isShip || e.kind === 'vulcan' ? 'medium' : 'small';
      this.sound.playExplosion(scale);

      // Primary mega-blast + dual shockwave rings + hot flying debris everywhere!
      const primaryCount = e.isBoss ? 48 : isShip ? 28 : 18;
      this.spawnExplosionBurst(e.x, e.y, primaryCount, '#F59E0B', true);
      this.spawnParticle('ring', e.x, e.y, 0, 0, 6, e.isBoss ? 86 : isShip ? 48 : 34, 0.44, '#FDE047');
      if (e.isBoss || isShip) {
        this.spawnParticle('ring', e.x, e.y, 0, 0, 4, e.isBoss ? 56 : 32, 0.34, '#FFFFFF');
      }

      // Schedule staggered secondary chain explosions ALL ACROSS the defeated enemy!
      const chainCount = e.isBoss ? 9 : isShip ? 5 : e.kind === 'vulcan' || e.isGround ? 3 : 2;
      const spreadX = Math.max(12, e.width * 0.44);
      const spreadY = Math.max(12, e.height * 0.42);
      for (let c = 0; c < chainCount; c++) {
        const ox = (Math.random() - 0.5) * 2 * spreadX;
        const oy = (Math.random() - 0.5) * 2 * spreadY;
        const delay = 0.07 + c * (e.isBoss ? 0.11 : 0.085);
        this.pendingExplosions.push({
          delay,
          x: e.x + ox,
          y: e.y + oy,
          burstCount: e.isBoss ? 22 : isShip ? 16 : 10,
          ringRadius: e.isBoss ? 44 : 26,
          primaryColor: c % 2 === 0 ? '#F97316' : '#EF4444',
          soundScale: c % 2 === 1 ? (e.isBoss ? 'medium' : 'small') : undefined,
          waterSpray: isShip && c % 2 === 0,
        });
      }

      if (e.isGround) {
        const land = this.oceanFeatures.find(
          (f) => f.kind === 'island' && Math.abs(f.x - e.x) < 55 && Math.abs(f.y - e.y) < 55
        );
        if (land) {
          land.craters.push({ dx: e.x - land.x, dy: e.y - land.y, r: 9 });
        }
      }

      if (e.isBoss) {
        this.hitstopTimer = 0.095;
        this.shakeIntensity = Math.max(this.shakeIntensity, 12);
        this.spawnFloatingText(e.x, e.y - 12, `¡EXPLOSIÓN TOTAL +${awardedScore}!`, '#F6B40E');
        for (const ep of this.enemyProjectiles) ep.active = false;
      } else {
        this.shakeIntensity = Math.max(this.shakeIntensity, isShip ? 4.5 : 2.2);
        const comboTag = comboMult >= 2 ? ` x${comboMult}!` : '';
        this.spawnFloatingText(
          e.x,
          e.y - 8,
          e.isGround
            ? `¡VOLADO! +${awardedScore}${comboTag}`
            : e.isSurface
              ? `¡HUNDIDO! +${awardedScore}${comboTag}`
              : `+${awardedScore}${comboTag}`,
          comboMult >= 3 ? '#38BDF8' : '#FDE047'
        );
      }

      if (e.dropPowerUp) {
        this.spawnPowerUp(e.x, e.y, e.dropPowerUp);
      } else if (!e.isBoss) {
        const dropChance = e.isSurface || e.kind === 'vulcan' ? 0.52 : 0.28;
        if (Math.random() < dropChance) {
          const pool: PowerUpKind[] = [
            'rapid_fire',
            'shield',
            'cluster_bomb',
            'exocet',
            'bomb',
            'cannon',
            'repair',
            'medal',
          ];
          const picked = pool[Math.floor(Math.random() * pool.length)];
          this.spawnPowerUp(e.x, e.y, picked);
        }
      }

      this.emitHud(true);
    } else if (isHeavy) {
      this.spawnFloatingText(hitX, hitY - 8, `-${Math.round(amount)}`, '#FCA5A5');
    }
  }

  private spawnPowerUp(x: number, y: number, kind: PowerUpKind): void {
    this.powerUps.push({
      active: true,
      kind,
      x,
      y,
      vy: 42,
      age: 0,
    });
  }

  private updatePowerUps(dt: number): void {
    const p = this.player;
    for (const pu of this.powerUps) {
      if (!pu.active) continue;
      pu.age += dt;
      pu.y += pu.vy * dt;
      if (pu.y > PLAYFIELD_H + 20) {
        pu.active = false;
        continue;
      }

      if (Math.hypot(pu.x - p.x, pu.y - p.y) < 19) {
        pu.active = false;
        this.sound.playPowerUp();
        switch (pu.kind) {
          case 'cannon':
            if (p.cannonLevel < 3) {
              p.cannonLevel += 1;
              this.spawnFloatingText(p.x, p.y - 28, `CAÑÓN 20MM NIVEL ${p.cannonLevel}`, '#67E8F9');
            } else {
              this.score += 600;
              this.spawnFloatingText(p.x, p.y - 28, 'CAÑÓN MÁXIMO +600', '#67E8F9');
            }
            break;
          case 'exocet':
            p.exocets = Math.min(p.maxExocets, p.exocets + 1);
            this.spawnFloatingText(p.x, p.y - 28, '+1 MISIL ESPECIAL', '#74ACDF');
            break;
          case 'bomb':
            p.bombs = Math.min(p.maxBombs, p.bombs + 2);
            this.spawnFloatingText(p.x, p.y - 28, '+2 ARMAMENTO SECUNDARIO', '#FCD34D');
            break;
          case 'repair':
            if (p.hp < p.maxHp) {
              p.hp = Math.min(p.maxHp, p.hp + 2);
              this.spawnFloatingText(p.x, p.y - 28, '+2 BLINDAJE REPARADO', '#6EE7B7');
            } else if (p.lives < MAX_LIVES) {
              p.lives = Math.min(MAX_LIVES, p.lives + 1);
              this.spawnFloatingText(p.x, p.y - 28, '+1 VIDA EXTRA', '#6EE7B7');
            } else {
              this.score += 1000;
              this.spawnFloatingText(p.x, p.y - 28, 'VIDAS AL MÁXIMO +1000', '#6EE7B7');
            }
            break;
          case 'medal':
            this.score += 1200;
            this.spawnFloatingText(p.x, p.y - 28, 'MEDALLA DEL SUR +1200', '#FDE047');
            break;
          case 'rapid_fire':
            p.rapidFireTimer = 10;
            this.spawnFloatingText(p.x, p.y - 28, '¡CADENCIA TURBO 10s!', '#F0ABFC');
            break;
          case 'shield':
            p.shieldTimer = 9;
            this.spawnFloatingText(p.x, p.y - 28, '¡ESCUDO DEFLECTOR 9s!', '#BAE6FD');
            break;
          case 'cluster_bomb':
            p.clusterTimer = 12;
            p.bombs = Math.min(p.maxBombs, p.bombs + 2);
            this.spawnFloatingText(p.x, p.y - 28, '¡BOMBAS RACIMO x5 (12s)!', '#FDBA74');
            break;
        }
        this.updateHighScore();
        this.emitHud(true);
      }
    }

    if (this.powerUps.length > 24) {
      this.powerUps = this.powerUps.filter((pu) => pu.active);
    }
  }

  private spawnParticle(
    kind: Particle['kind'],
    x: number,
    y: number,
    vx: number,
    vy: number,
    size: number,
    endSize: number,
    maxLife: number,
    color: string
  ): void {
    const slot = this.particles.find((p) => !p.active);
    if (!slot) return;
    slot.active = true;
    slot.kind = kind;
    slot.x = x;
    slot.y = y;
    slot.vx = vx;
    slot.vy = vy;
    slot.size = size;
    slot.endSize = endSize;
    slot.alpha = 1;
    slot.life = maxLife;
    slot.maxLife = maxLife;
    slot.color = color;
  }

  private spawnExplosionBurst(
    x: number,
    y: number,
    count: number,
    primaryColor: string,
    includeDebris = false
  ): void {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 16 + Math.random() * 92;
      const isDebris = includeDebris && i % 5 === 4;
      const isSmoke = !isDebris && i % 3 === 0;
      this.spawnParticle(
        isDebris ? 'debris' : isSmoke ? 'smoke' : 'fire',
        x + (Math.random() - 0.5) * 11,
        y + (Math.random() - 0.5) * 11,
        Math.cos(ang) * spd,
        Math.sin(ang) * spd,
        isDebris ? 2.4 : isSmoke ? 4.5 : 3.6,
        isDebris ? 1.2 : isSmoke ? 13 : 1,
        isDebris ? 0.52 + Math.random() * 0.25 : isSmoke ? 0.64 : 0.36 + Math.random() * 0.18,
        isDebris ? '#CBD5E1' : isSmoke ? '#334155' : i % 2 === 0 ? primaryColor : '#FEF08A'
      );
    }
  }

  private spawnFloatingText(x: number, y: number, text: string, color: string): void {
    const slot = this.floatingTexts.find((ft) => !ft.active);
    if (!slot) return;
    slot.active = true;
    slot.x = Math.max(46, Math.min(PLAYFIELD_W - 46, x));
    slot.y = Math.max(34, y);
    slot.vy = -22;
    slot.text = text;
    slot.color = color;
    slot.life = 1.05;
    slot.maxLife = 1.05;
  }

  private updateParticles(dt: number): void {
    for (const p of this.particles) {
      if (!p.active) continue;
      p.life -= dt;
      if (p.life <= 0) {
        p.active = false;
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.96;
      p.vy *= 0.96;
    }
  }

  private updateFloatingTexts(dt: number): void {
    for (const ft of this.floatingTexts) {
      if (!ft.active) continue;
      ft.life -= dt;
      if (ft.life <= 0) {
        ft.active = false;
        continue;
      }
      ft.y += ft.vy * dt;
    }
  }

  private updateHighScore(): void {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore(this.highScore);
    }
  }

  private render(): void {
    // 2x supersampled canvas buffer (760x984) over 380x492 logical coordinates for ultra-crisp cenital warships
    const targetW = PLAYFIELD_W * 2;
    const targetH = PLAYFIELD_H * 2;
    if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
      this.canvas.width = targetW;
      this.canvas.height = targetH;
    }

    const shakeX = this.shakeIntensity > 0 ? (Math.random() - 0.5) * this.shakeIntensity * 2 : 0;
    const shakeY = this.shakeIntensity > 0 ? (Math.random() - 0.5) * this.shakeIntensity * 2 : 0;

    const lockedTarget =
      this.phase === 'PLAYING' && this.player.exocets > 0 ? this.findBestExocetTarget() : null;

    const wave = CAMPAIGN_WAVES[this.waveIndex] ?? CAMPAIGN_WAVES[0];

    renderGameFrame(
      this.ctx,
      this.simTime,
      this.scrollY,
      shakeX,
      shakeY,
      this.oceanFeatures,
      this.player,
      this.bullets,
      this.bombs,
      this.exocets,
      this.enemies,
      this.enemyProjectiles,
      this.powerUps,
      this.particles,
      this.floatingTexts,
      lockedTarget ? lockedTarget.id : null,
      wave.number,
      this.carrierSequence
    );
  }

  public getHudSnapshot(): HudSnapshot {
    const wave = CAMPAIGN_WAVES[this.waveIndex] ?? CAMPAIGN_WAVES[0];
    const activeBoss = this.enemies.find((e) => e.active && e.isBoss);
    const bossIntro: BossIntroInfo | null =
      activeBoss && this.bossIntroTimer > 0
        ? {
            level: wave.number,
            name: activeBoss.label,
            vesselClass: wave.bossClass,
            greeting: wave.bossGreeting,
            weapons: wave.bossWeapons,
            secondsLeft: Math.ceil(this.bossIntroTimer),
            totalSeconds: this.bossIntroDuration,
          }
        : null;

    return {
      phase: this.phase,
      aircraftId: this.player.aircraftId,
      score: this.score,
      highScore: this.highScore,
      waveNumber: wave.number,
      totalWaves: CAMPAIGN_WAVES.length,
      waveTitle: wave.title,
      sectorName: wave.sector,
      hp: this.player.hp,
      maxHp: this.player.maxHp,
      lives: this.player.lives,
      cannonLevel: this.player.cannonLevel,
      bombs: this.player.bombs,
      exocets: this.player.exocets,
      rapidFireSec: Math.ceil(this.player.rapidFireTimer),
      shieldSec: Math.ceil(this.player.shieldTimer),
      clusterSec: Math.ceil(this.player.clusterTimer),
      enemiesDefeated: this.enemiesDefeated,
      shipsSunk: this.shipsSunk,
      bossName: activeBoss ? activeBoss.label : null,
      bossHp: activeBoss ? Math.max(0, Math.round(activeBoss.hp)) : 0,
      bossMaxHp: activeBoss ? activeBoss.maxHp : 0,
      bossIntro,
      bannerText: this.bannerText,
      bannerSubtext: this.bannerSubtext,
    };
  }

  private emitHud(force: boolean): void {
    const snap = this.getHudSnapshot();
    const introHash = snap.bossIntro ? snap.bossIntro.secondsLeft : 0;
    const hash = `${snap.phase}|${snap.aircraftId}|${snap.score}|${snap.waveNumber}|${snap.hp}|${snap.lives}|${snap.cannonLevel}|${snap.bombs}|${snap.exocets}|${snap.rapidFireSec}|${snap.shieldSec}|${snap.clusterSec}|${snap.bossName ?? ''}|${snap.bossHp}|${introHash}|${snap.bannerText ?? ''}`;
    if (force || hash !== this.lastHudHash) {
      this.lastHudHash = hash;
      this.onHudUpdate(snap);
    }
  }
}
