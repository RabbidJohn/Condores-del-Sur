export type GamePhase = 'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'VICTORY' | 'GAME_OVER';

export type AircraftId = 'skyhawk' | 'super_etendard' | 'dagger' | 'pucara';

export type EnemyKind =
  | 'sea_harrier'
  | 'sea_king'
  | 'lynx'
  | 'vulcan'
  | 'patrol_boat'
  | 'minesweeper'
  | 'corvette'
  | 'type21_frigate'
  | 'type42_destroyer'
  | 'sir_galahad'
  | 'supply_tanker'
  | 'bofors_aa'
  | 'rapier_sam'
  | 'radar_bunker'
  | 'boss_frigate'
  | 'boss_destroyer'
  | 'boss_vulcan'
  | 'boss_harrier_ace'
  | 'boss_assault'
  | 'boss_carrier';

export type EnemyTactic =
  | 'standard'
  | 'pincer_left'
  | 'pincer_right'
  | 'v_wing_left'
  | 'v_wing_right'
  | 'intercept_track'
  | 'flank_hover'
  | 'escort_wall'
  | 'boss_tactical';

export interface BossIntroInfo {
  level: number;
  name: string;
  vesselClass: string;
  greeting: string;
  weapons: string[];
  secondsLeft: number;
  totalSeconds: number;
}

export type PowerUpKind =
  | 'cannon'
  | 'exocet'
  | 'bomb'
  | 'repair'
  | 'medal'
  | 'rapid_fire'
  | 'shield'
  | 'cluster_bomb';

export interface PlayerState {
  aircraftId: AircraftId;
  x: number;
  y: number;
  vx: number;
  vy: number;
  roll: number;
  hp: number;
  maxHp: number;
  lives: number;
  cannonLevel: number; // 1..3
  bombs: number;
  maxBombs: number;
  exocets: number;
  maxExocets: number;
  fireCooldown: number;
  bombCooldown: number;
  exocetCooldown: number;
  invulnTimer: number;
  hitFlash: number;
  muzzleFlash: number;
  rapidFireTimer: number;
  shieldTimer: number;
  clusterTimer: number;
}

export interface PlayerBullet {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  angle: number;
  color: string;
  style?: 'tracer' | 'defa30' | 'delta_dart' | 'gunship_twin';
}

export interface PlayerBomb {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  altitude: number;
  flightTime: number;
  maxFlightTime: number;
  radius: number;
  damage: number;
}

export interface ExocetMissile {
  active: boolean;
  kind: 'exocet' | 'shafrir' | 'pescador';
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  targetId: number | null;
  age: number;
  damage: number;
  smokeTimer: number;
}

export interface EnemyEntity {
  id: number;
  active: boolean;
  kind: EnemyKind;
  isSurface: boolean;
  isGround: boolean;
  isBoss: boolean;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  scoreValue: number;
  age: number;
  fireTimer: number;
  telegraphTimer: number;
  phase: number;
  hitFlash: number;
  rotorAngle: number;
  turretAngle: number;
  dropPowerUp: PowerUpKind | null;
  difficultyScale: number;
  bossTier: number;
  tactic: EnemyTactic;
  tacticAnchorX: number;
  tacticSlot: number;
}

export interface EnemyProjectile {
  active: boolean;
  kind: 'bullet' | 'flak' | 'missile';
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  age: number;
  color: string;
}

export interface PowerUpEntity {
  active: boolean;
  kind: PowerUpKind;
  x: number;
  y: number;
  vy: number;
  age: number;
}

export interface Particle {
  active: boolean;
  kind: 'spark' | 'fire' | 'smoke' | 'water' | 'ring' | 'debris';
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  endSize: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
}

export interface FloatingText {
  active: boolean;
  x: number;
  y: number;
  vy: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}

export interface TerrainCrater {
  dx: number;
  dy: number;
  r: number;
}

export interface OceanFeature {
  x: number;
  y: number;
  width: number;
  height: number;
  kind: 'island' | 'kelp' | 'cloud';
  variant: number;
  flipX: boolean;
  flipY?: boolean;
  angle?: number;
  seed: number;
  speedScale: number;
  scale?: number;
  flag?: 'ar' | 'uk';
  ephemeral?: boolean;
  craters: TerrainCrater[];
}

export interface WaveSpawnEvent {
  time: number;
  kind: EnemyKind;
  xRatio: number;
  dropPowerUp?: PowerUpKind | null;
  customLabel?: string;
  tactic?: EnemyTactic;
  tacticSlot?: number;
}

export interface LevelTheme {
  oceanBase: string;
  oceanDeep: string;
  oceanLight: string;
  swellColor: string;
  atmosphereTint: string;
  rain?: boolean;
}

export interface WaveConfig {
  number: number;
  title: string;
  sector: string;
  subtitle: string;
  difficultyScale: number;
  bossKind: EnemyKind;
  bossName: string;
  bossClass: string;
  bossGreeting: string;
  bossWeapons: string[];
  theme: LevelTheme;
  events: WaveSpawnEvent[];
}

export interface CarrierSequence {
  mode: 'takeoff' | 'landing';
  carrierX: number;
  carrierY: number;
  carrierVy: number;
  playerScale: number;
  timer: number;
  duration: number;
  arrested: boolean;
}

export interface HudSnapshot {
  phase: GamePhase;
  aircraftId: AircraftId;
  score: number;
  highScore: number;
  waveNumber: number;
  totalWaves: number;
  waveTitle: string;
  sectorName: string;
  hp: number;
  maxHp: number;
  lives: number;
  cannonLevel: number;
  bombs: number;
  exocets: number;
  rapidFireSec: number;
  shieldSec: number;
  clusterSec: number;
  enemiesDefeated: number;
  shipsSunk: number;
  bossName: string | null;
  bossHp: number;
  bossMaxHp: number;
  bossIntro: BossIntroInfo | null;
  bannerText: string | null;
  bannerSubtext: string | null;
}

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  fire: boolean;
  autoFire: boolean;
  bombJustPressed: boolean;
  exocetJustPressed: boolean;
}
