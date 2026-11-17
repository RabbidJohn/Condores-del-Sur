import { useCallback, useEffect, useRef, useState } from 'react';
import { AircraftSelectScreen } from './components/AircraftSelectScreen';
import { CondorSkyhawkLogo } from './components/CondorSkyhawkLogo';
import { GameModal } from './components/GameModal';
import { HudOverlay } from './components/HudOverlay';
import { IntroSplashScreen } from './components/IntroSplashScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { TitleScreen } from './components/TitleScreen';
import { VictoryTributeVideo } from './components/VictoryTributeVideo';
import { getAircraftSpec } from './game/aircraft';
import { SoundEngine } from './game/audio';
import { MalvinasGameEngine } from './game/engine';
import { AircraftId, HudSnapshot } from './game/types';

const INITIAL_HUD: HudSnapshot = {
  phase: 'TITLE_MENU',
  aircraftId: 'skyhawk',
  score: 0,
  highScore: 0,
  waveNumber: 1,
  totalWaves: 20,
  waveTitle: 'DEFIENDE LA ISLA',
  sectorName: '1 de Mayo · Bautismo de Fuego · Estrecho de San Carlos',
  hp: 5,
  maxHp: 5,
  lives: 5,
  cannonLevel: 1,
  bombs: 4,
  exocets: 3,
  rapidFireSec: 0,
  shieldSec: 0,
  clusterSec: 0,
  enemiesDefeated: 0,
  shipsSunk: 0,
  bossName: null,
  bossHp: 0,
  bossMaxHp: 0,
  bossIntro: null,
  bannerText: null,
  bannerSubtext: null,
};

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<MalvinasGameEngine | null>(null);
  const soundRef = useRef<SoundEngine | null>(null);

  const [hud, setHud] = useState<HudSnapshot>(INITIAL_HUD);
  const [menuScreen, setMenuScreen] = useState<'intro' | 'loading' | 'title' | 'select'>('intro');
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftId>('skyhawk');
  const [muted, setMuted] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const [showVictorySummary, setShowVictorySummary] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const sound = new SoundEngine();
    soundRef.current = sound;

    const engine = new MalvinasGameEngine(canvasRef.current, sound, (snapshot) => {
      setHud(snapshot);
    });
    engineRef.current = engine;
    setHud(engine.getHudSnapshot());
    engine.startLoop();

    sound.unlock();
    sound.startMusic('title');

    return () => {
      sound.stopMusic();
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (hud.phase !== 'VICTORY') {
      setShowVictorySummary(false);
    }
  }, [hud.phase]);

  const handleUnlockMusic = useCallback(() => {
    const sound = soundRef.current;
    if (!sound) return;
    sound.unlock();
    if (hud.phase === 'TITLE_MENU') {
      sound.startMusic('title');
    }
  }, [hud.phase]);

  const handleStart = useCallback(() => {
    setShowVictorySummary(false);
    engineRef.current?.startNewCampaign(selectedAircraft);
  }, [selectedAircraft]);

  const handleToggleMute = useCallback(() => {
    if (!soundRef.current) return;
    soundRef.current.unlock();
    const nextMuted = soundRef.current.toggleMute();
    setMuted(nextMuted);
    if (!nextMuted && hud.phase === 'TITLE_MENU') {
      soundRef.current.startMusic('title');
    }
  }, [hud.phase]);

  const handleToggleMusic = useCallback(() => {
    if (!soundRef.current) return;
    soundRef.current.unlock();
    const nextMusicMuted = soundRef.current.toggleMusic();
    setMusicMuted(nextMusicMuted);
    if (!nextMusicMuted) {
      soundRef.current.startMusic(
        hud.phase === 'VICTORY'
          ? 'tribute'
          : hud.phase === 'PLAYING'
            ? 'battle'
            : 'title'
      );
    }
  }, [hud.phase]);

  const handleTogglePause = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (hud.phase === 'PLAYING') {
      engine.pauseGame();
    } else if (hud.phase === 'PAUSED') {
      engine.resumeGame();
    }
  }, [hud.phase]);

  const handleResume = useCallback(() => {
    engineRef.current?.resumeGame();
  }, []);

  const handleReturnTitle = useCallback(() => {
    setMenuScreen('title');
    engineRef.current?.returnToTitle();
  }, []);

  const handleTouchMove = useCallback((dx: number, dy: number) => {
    engineRef.current?.setTouchInput({
      left: dx < 0,
      right: dx > 0,
      up: dy < 0,
      down: dy > 0,
    });
  }, []);

  const handleTouchFire = useCallback((firing: boolean) => {
    engineRef.current?.setTouchInput({ fire: firing });
  }, []);

  const handleBomb = useCallback(() => {
    engineRef.current?.triggerBomb();
  }, []);

  const handleExocet = useCallback(() => {
    engineRef.current?.triggerExocet();
  }, []);

  const handleSkipBossIntro = useCallback(() => {
    engineRef.current?.skipBossIntro();
  }, []);

  const showMenu = hud.phase === 'TITLE_MENU';
  const activeSpec = getAircraftSpec(hud.aircraftId);

  return (
    <main className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#04070E]">
      <div
        className={`relative flex h-full w-full items-center justify-center ${
          showMenu ? 'hidden' : 'flex'
        }`}
      >
        {/* Left Retro Arcade Cabinet Bezel Flank */}
        <aside className="hidden xl:flex h-full w-64 flex-col justify-between border-r-2 border-slate-800 bg-[#060B14] p-6 select-none">
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <CondorSkyhawkLogo className="h-11 w-11 shrink-0" />
              <span className="font-arcade block text-[8px] leading-relaxed text-[#74ACDF]">
                {activeSpec.squadron.toUpperCase()}
              </span>
            </div>
            <h1 className="font-arcade mt-1 text-sm leading-relaxed text-white">
              CÓNDORES DEL SUR
            </h1>
            <p className="mt-2 text-xs font-semibold text-[#F6B40E]">
              {activeSpec.name} · {activeSpec.callsign}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              {activeSpec.pilot}
            </p>

            <div className="mt-6 space-y-3 border-t border-slate-800 pt-4 text-xs text-slate-300">
              <div>
                <span className="block font-semibold text-cyan-300">Principal [Espacio]</span>
                <span className="text-slate-400">{activeSpec.cannonLabel}</span>
              </div>
              <div>
                <span className="block font-semibold text-[#F6B40E]">Secundaria [X]</span>
                <span className="text-slate-400">{activeSpec.bombLabel}</span>
              </div>
              <div>
                <span className="block font-semibold text-[#74ACDF]">Especial [C]</span>
                <span className="text-slate-400">{activeSpec.specialLabel}</span>
              </div>
              <div>
                <span className="block font-semibold text-fuchsia-300">Ítems Tácticos</span>
                <span className="text-slate-400">Turbo · Escudo · Racimo · Reparar</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 text-xs text-slate-400">
            <p className="font-semibold text-[#F6B40E]">Hecho por Juan Martin Echegaray</p>
            <p className="mt-1">20 niveles con jefe británico al final de cada sector.</p>
          </div>
        </aside>

        {/* Centered Vertical Arcade Monitor */}
        <div className="relative flex h-full max-h-[960px] aspect-[380/492] items-center justify-center border-x-2 border-slate-800 bg-[#05080F] shadow-[0_0_50px_rgba(0,0,0,0.95)]">
          <canvas
            ref={canvasRef}
            className="h-full w-full block"
          />

          {/* Subtle CRT arcade scanline overlay */}
          <div className="arcade-scanlines pointer-events-none absolute inset-0 opacity-20" />

          <HudOverlay
            hud={hud}
            muted={muted}
            musicMuted={musicMuted}
            onToggleMute={handleToggleMute}
            onToggleMusic={handleToggleMusic}
            onTogglePause={handleTogglePause}
            onTouchMove={handleTouchMove}
            onTouchFire={handleTouchFire}
            onBomb={handleBomb}
            onExocet={handleExocet}
            onSkipBossIntro={handleSkipBossIntro}
          />

          {(hud.phase !== 'VICTORY' || showVictorySummary) && (
            <GameModal
              hud={hud}
              onResume={handleResume}
              onRestart={handleStart}
              onReturnTitle={handleReturnTitle}
              onReplayTribute={() => setShowVictorySummary(false)}
            />
          )}
        </div>

        {/* Right Retro Arcade Control Card */}
        <aside className="hidden xl:flex h-full w-64 flex-col justify-between border-l-2 border-slate-800 bg-[#060B14] p-6 select-none">
          <div>
            <span className="font-arcade mb-3 block text-[9px] text-slate-400">
              CONTROLES
            </span>
            <dl className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <dt className="text-slate-400">Volar</dt>
                <dd className="font-arcade text-[9px] text-white">WASD / FLECHAS</dd>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <dt className="text-slate-400">Cañón</dt>
                <dd className="font-arcade text-[9px] text-white">ESPACIO / Z</dd>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <dt className="text-slate-400">Secundaria</dt>
                <dd className="font-arcade text-[9px] text-[#F6B40E]">TECLA X</dd>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <dt className="text-slate-400">Especial</dt>
                <dd className="font-arcade text-[9px] text-[#74ACDF]">TECLA C</dd>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <dt className="text-slate-400">Auto-fuego</dt>
                <dd className="font-arcade text-[9px] text-slate-200">TECLA F</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-400">Pausa</dt>
                <dd className="font-arcade text-[9px] text-slate-200">ESC / P</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-2 border-t border-slate-800 pt-4 text-xs">
            <span className="font-arcade block text-[9px] text-slate-400">
              ESTADÍSTICAS
            </span>
            <div className="flex items-center justify-between text-slate-200">
              <span>Nivel</span>
              <span className="font-arcade text-[10px] text-[#74ACDF]">
                {hud.waveNumber}/{hud.totalWaves}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-200">
              <span>Enemigos</span>
              <span className="font-arcade text-[10px]">{hud.enemiesDefeated}</span>
            </div>
            <div className="flex items-center justify-between text-slate-200">
              <span>Buques</span>
              <span className="font-arcade text-[10px]">{hud.shipsSunk}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Screen 0: 5-second Studio Intro -> Loading Screen -> Cover Title Screen -> Aircraft Select */}
      {showMenu && menuScreen === 'intro' && (
        <IntroSplashScreen
          onComplete={() => setMenuScreen('loading')}
          onUnlockMusic={handleUnlockMusic}
        />
      )}

      {showMenu && menuScreen === 'loading' && (
        <LoadingScreen
          onLoaded={() => {
            handleUnlockMusic();
            setMenuScreen('title');
          }}
          onUnlockMusic={handleUnlockMusic}
        />
      )}

      {showMenu && menuScreen === 'title' && (
        <TitleScreen
          highScore={hud.highScore}
          muted={muted}
          musicMuted={musicMuted}
          onProceedToSelect={() => setMenuScreen('select')}
          onToggleMute={handleToggleMute}
          onToggleMusic={handleToggleMusic}
          onUnlockMusic={handleUnlockMusic}
        />
      )}

      {showMenu && menuScreen === 'select' && (
        <AircraftSelectScreen
          selectedAircraft={selectedAircraft}
          muted={muted}
          musicMuted={musicMuted}
          onSelectAircraft={setSelectedAircraft}
          onBack={() => setMenuScreen('title')}
          onLaunchMission={handleStart}
          onToggleMute={handleToggleMute}
          onToggleMusic={handleToggleMusic}
          onUnlockMusic={handleUnlockMusic}
        />
      )}
      {hud.phase === 'VICTORY' && !showVictorySummary && (
        <VictoryTributeVideo
          hud={hud}
          muted={muted}
          musicMuted={musicMuted}
          onToggleMute={handleToggleMute}
          onToggleMusic={handleToggleMusic}
          onShowSummary={() => setShowVictorySummary(true)}
          onRestart={handleStart}
        />
      )}
    </main>
  );
}
