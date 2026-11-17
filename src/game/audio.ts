type MusicMode = 'none' | 'title' | 'battle' | 'tribute';

interface ChipStep {
  lead: number | null;
  leadSteps?: number;
  riff: number | null;
  riffSteps?: number;
  chug?: boolean;
  bass: number | null;
  bassSteps?: number;
  drum?: 'k' | 's' | 'h' | 'ks' | 'c' | 't1' | 't2' | null;
}

// Authentic 16-bit (SNES SPC700 / Sega Genesis YM2612 + Neo Geo Stereo PCM) Heavy Metal arrangement of
// "El Visitante" - Almafuerte (A Fondo Blanco, 1999)
// Key: D Minor / Drop-D (D-A-D-G-B-E), 4/4 time, 16 steps per bar.
// Uses stereo double-tracked Drop-D rhythm guitars, 2-operator FM metal bass,
// vibrato lead guitar with slapback delay, studio reverb impulse, and 16-bit drum fills.

const EL_VISITANTE_MAIN_RIFF: ChipStep[] = [
  // Bar 1: Drop-D Main Riff — D5-D5 ... F5-D5-G5~~~ (0-0--3-0-5)
  { lead: null, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 1, drum: 'c' },
  { lead: null, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 1, drum: 'k' },
  { lead: null, riff: null, bass: null, drum: 'h' },
  { lead: 65, leadSteps: 1, riff: 53, riffSteps: 1, chug: false, bass: 41, bassSteps: 1, drum: null },
  { lead: 62, leadSteps: 1, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 1, drum: 's' },
  { lead: 67, leadSteps: 5, riff: 55, riffSteps: 5, chug: false, bass: 43, bassSteps: 5, drum: null },
  { lead: null, riff: null, bass: null, drum: 'h' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: null, riff: null, bass: null, drum: 'k' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: null, riff: null, bass: null, drum: 'h' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: null, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 1, drum: 's' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: null, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 1, drum: 'k' },
  { lead: null, riff: null, bass: null, drum: 'h' },

  // Bar 2: Drop-D Main Riff — D5-D5 ... F5-D5-Ab5~~~ (0-0--3-0-6 Tritone answer)
  { lead: null, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 1, drum: 'k' },
  { lead: null, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 1, drum: 'k' },
  { lead: null, riff: null, bass: null, drum: 'h' },
  { lead: 65, leadSteps: 1, riff: 53, riffSteps: 1, chug: false, bass: 41, bassSteps: 1, drum: null },
  { lead: 62, leadSteps: 1, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 1, drum: 's' },
  { lead: 68, leadSteps: 5, riff: 56, riffSteps: 5, chug: false, bass: 44, bassSteps: 5, drum: null },
  { lead: null, riff: null, bass: null, drum: 'h' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: null, riff: null, bass: null, drum: 'k' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: null, riff: null, bass: null, drum: 'h' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: null, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 1, drum: 's' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: null, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 1, drum: 'k' },
  { lead: null, riff: null, bass: null, drum: 'h' },

  // Bar 3: Answer — 0-0--3-0-5-3-0 ... C5 -> G5
  { lead: null, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 1, drum: 'k' },
  { lead: null, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 1, drum: 'k' },
  { lead: null, riff: null, bass: null, drum: 'h' },
  { lead: 65, leadSteps: 1, riff: 53, riffSteps: 1, chug: false, bass: 41, bassSteps: 1, drum: null },
  { lead: 62, leadSteps: 1, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 1, drum: 's' },
  { lead: 67, leadSteps: 1, riff: 55, riffSteps: 1, chug: false, bass: 43, bassSteps: 1, drum: null },
  { lead: 65, leadSteps: 1, riff: 53, riffSteps: 1, chug: false, bass: 41, bassSteps: 1, drum: 'h' },
  { lead: 62, leadSteps: 1, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 1, drum: null },
  { lead: 65, leadSteps: 1, riff: 53, riffSteps: 1, chug: false, bass: 41, bassSteps: 1, drum: 'k' },
  { lead: 67, leadSteps: 2, riff: 55, riffSteps: 2, chug: false, bass: 43, bassSteps: 2, drum: null },
  { lead: null, riff: null, bass: null, drum: 'h' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: 72, leadSteps: 2, riff: 48, riffSteps: 2, chug: false, bass: 36, bassSteps: 2, drum: 's' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: 67, leadSteps: 2, riff: 55, riffSteps: 2, chug: false, bass: 43, bassSteps: 2, drum: 'k' },
  { lead: null, riff: null, bass: null, drum: 'h' },

  // Bar 4: Heavy Ring-out Cadence — D5 -> F5 -> E5
  { lead: 62, leadSteps: 3, riff: 50, riffSteps: 3, chug: false, bass: 38, bassSteps: 3, drum: 'c' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: null, riff: null, bass: null, drum: 'h' },
  { lead: null, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 1, drum: null },
  { lead: 65, leadSteps: 3, riff: 53, riffSteps: 3, chug: false, bass: 41, bassSteps: 3, drum: 's' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: null, riff: null, bass: null, drum: 'h' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: 64, leadSteps: 4, riff: 52, riffSteps: 4, chug: false, bass: 40, bassSteps: 4, drum: 'k' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: null, riff: null, bass: null, drum: 'h' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: null, riff: 52, riffSteps: 1, chug: true, bass: 40, bassSteps: 1, drum: 't1' },
  { lead: null, riff: null, bass: null, drum: 't1' },
  { lead: null, riff: 52, riffSteps: 1, chug: true, bass: 40, bassSteps: 1, drum: 't2' },
  { lead: null, riff: null, bass: null, drum: 't2' },
];

const EL_VISITANTE_VERSE_AND_CHORUS: ChipStep[] = [
  // Bar 5 — Estrofa 1: "Olvidar, yo sé bien que no podés..." (Pure D5 -> F5 -> E5)
  { lead: 65, leadSteps: 2, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 2, drum: 'k' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: 64, leadSteps: 2, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 2, drum: 'h' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: 62, leadSteps: 3, riff: 50, riffSteps: 2, chug: false, bass: 38, bassSteps: 2, drum: 's' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: null, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 1, drum: 'h' },
  { lead: 62, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 64, leadSteps: 1, riff: 53, riffSteps: 2, chug: false, bass: 41, bassSteps: 2, drum: 'k' },
  { lead: 65, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 69, leadSteps: 1, riff: 53, riffSteps: 1, chug: true, bass: 41, bassSteps: 1, drum: 'h' },
  { lead: 67, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 65, leadSteps: 1, riff: 52, riffSteps: 2, chug: false, bass: 40, bassSteps: 2, drum: 's' },
  { lead: 64, leadSteps: 3, riff: null, bass: null, drum: null },
  { lead: null, riff: 52, riffSteps: 1, chug: true, bass: 40, bassSteps: 1, drum: 'h' },
  { lead: null, riff: null, bass: null, drum: null },

  // Bar 6 — Estrofa 2: "Apocalipsis del sustento interior..." (Consonant A5 -> G5 -> F5 -> E5 groove)
  { lead: 69, leadSteps: 2, riff: 45, riffSteps: 1, chug: true, bass: 45, bassSteps: 2, drum: 'k' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: 72, leadSteps: 1, riff: 45, riffSteps: 1, chug: true, bass: 45, bassSteps: 1, drum: 'h' },
  { lead: 71, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 69, leadSteps: 3, riff: 45, riffSteps: 2, chug: false, bass: 45, bassSteps: 2, drum: 's' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: null, riff: 45, riffSteps: 1, chug: true, bass: 45, bassSteps: 1, drum: 'h' },
  { lead: 67, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 69, leadSteps: 2, riff: 43, riffSteps: 2, chug: false, bass: 43, bassSteps: 2, drum: 'k' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: 72, leadSteps: 1, riff: 41, riffSteps: 2, chug: false, bass: 41, bassSteps: 2, drum: 'h' },
  { lead: 71, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 69, leadSteps: 1, riff: 40, riffSteps: 2, chug: false, bass: 40, bassSteps: 2, drum: 's' },
  { lead: 67, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 64, leadSteps: 2, riff: 40, riffSteps: 1, chug: true, bass: 40, bassSteps: 1, drum: 'ks' },
  { lead: null, riff: null, bass: null, drum: 'h' },

  // Bar 7 — Pre-Estribillo Punteo (Clean Marciello arpeggio over steady A5 -> F5)
  { lead: 64, leadSteps: 1, riff: 45, riffSteps: 1, chug: true, bass: 45, bassSteps: 2, drum: 'c' },
  { lead: 72, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 71, leadSteps: 1, riff: 45, riffSteps: 1, chug: true, bass: 45, bassSteps: 2, drum: 'h' },
  { lead: 69, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 64, leadSteps: 1, riff: 45, riffSteps: 1, chug: true, bass: 45, bassSteps: 2, drum: 's' },
  { lead: 64, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 72, leadSteps: 1, riff: 45, riffSteps: 1, chug: true, bass: 45, bassSteps: 2, drum: 'h' },
  { lead: 71, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 69, leadSteps: 1, riff: 41, riffSteps: 1, chug: true, bass: 41, bassSteps: 2, drum: 'k' },
  { lead: 64, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 65, leadSteps: 1, riff: 41, riffSteps: 1, chug: true, bass: 41, bassSteps: 2, drum: 'h' },
  { lead: 72, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 71, leadSteps: 1, riff: 43, riffSteps: 1, chug: true, bass: 43, bassSteps: 2, drum: 's' },
  { lead: 69, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 67, leadSteps: 1, riff: 43, riffSteps: 1, chug: true, bass: 43, bassSteps: 2, drum: 'k' },
  { lead: 69, leadSteps: 1, riff: null, bass: null, drum: 'h' },

  // Bar 8 — Punteo Parte 2 (Ascending climb into Chorus: A5 -> F5 -> D5 -> G5)
  { lead: 72, leadSteps: 1, riff: 45, riffSteps: 1, chug: true, bass: 45, bassSteps: 2, drum: 'k' },
  { lead: 71, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 69, leadSteps: 1, riff: 45, riffSteps: 1, chug: true, bass: 45, bassSteps: 2, drum: 'h' },
  { lead: 67, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 65, leadSteps: 1, riff: 41, riffSteps: 1, chug: true, bass: 41, bassSteps: 2, drum: 's' },
  { lead: 72, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 71, leadSteps: 1, riff: 41, riffSteps: 1, chug: true, bass: 41, bassSteps: 2, drum: 'h' },
  { lead: 69, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 74, leadSteps: 1, riff: 50, riffSteps: 2, chug: false, bass: 38, bassSteps: 2, drum: 'k' },
  { lead: 72, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 74, leadSteps: 1, riff: 50, riffSteps: 2, chug: false, bass: 38, bassSteps: 2, drum: 'h' },
  { lead: 76, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 74, leadSteps: 1, riff: 55, riffSteps: 2, chug: false, bass: 43, bassSteps: 2, drum: 's' },
  { lead: 72, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 69, leadSteps: 1, riff: 55, riffSteps: 1, chug: true, bass: 43, bassSteps: 1, drum: 'ks' },
  { lead: 67, leadSteps: 1, riff: null, bass: null, drum: 'h' },

  // Bar 9 — Estribillo 1: "Fui elegido para cantarte / por quienes quieren olvido restarte" (C5 -> D5 | F5 -> D5)
  { lead: 67, leadSteps: 1, riff: 48, riffSteps: 3, chug: false, bass: 36, bassSteps: 3, drum: 'c' },
  { lead: 69, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 72, leadSteps: 1, riff: null, bass: null, drum: 'h' },
  { lead: 71, leadSteps: 1, riff: 50, riffSteps: 3, chug: false, bass: 38, bassSteps: 3, drum: null },
  { lead: 69, leadSteps: 2, riff: null, bass: null, drum: 's' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: 67, leadSteps: 1, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 1, drum: 'h' },
  { lead: 65, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 69, leadSteps: 1, riff: 53, riffSteps: 3, chug: false, bass: 41, bassSteps: 3, drum: 'k' },
  { lead: 72, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 74, leadSteps: 1, riff: null, bass: null, drum: 'h' },
  { lead: 72, leadSteps: 1, riff: 50, riffSteps: 3, chug: false, bass: 38, bassSteps: 3, drum: null },
  { lead: 69, leadSteps: 2, riff: null, bass: null, drum: 's' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: 67, leadSteps: 1, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 1, drum: 'k' },
  { lead: 65, leadSteps: 1, riff: null, bass: null, drum: 'h' },

  // Bar 10 — Estribillo 2: "Grabé pesado mas no inconsciente / yo te lo mando ex-combatiente!" (C5 -> D5 | F5 -> E5 -> D5!)
  { lead: 72, leadSteps: 1, riff: 48, riffSteps: 3, chug: false, bass: 36, bassSteps: 3, drum: 'c' },
  { lead: 74, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 76, leadSteps: 1, riff: null, bass: null, drum: 'h' },
  { lead: 74, leadSteps: 1, riff: 50, riffSteps: 3, chug: false, bass: 38, bassSteps: 3, drum: null },
  { lead: 72, leadSteps: 2, riff: null, bass: null, drum: 's' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: 69, leadSteps: 1, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 1, drum: 'h' },
  { lead: 67, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 69, leadSteps: 1, riff: 53, riffSteps: 3, chug: false, bass: 41, bassSteps: 3, drum: 'k' },
  { lead: 67, leadSteps: 1, riff: null, bass: null, drum: null },
  { lead: 65, leadSteps: 1, riff: null, bass: null, drum: 'h' },
  { lead: 64, leadSteps: 1, riff: 52, riffSteps: 1, chug: false, bass: 40, bassSteps: 1, drum: null },
  { lead: 62, leadSteps: 3, riff: 50, riffSteps: 2, chug: false, bass: 38, bassSteps: 2, drum: 'c' },
  { lead: null, riff: null, bass: null, drum: null },
  { lead: null, riff: 50, riffSteps: 1, chug: true, bass: 38, bassSteps: 1, drum: 't1' },
  { lead: null, riff: null, bass: null, drum: 't2' },
];

const EL_VISITANTE_FULL: ChipStep[] = [
  ...EL_VISITANTE_MAIN_RIFF,
  ...EL_VISITANTE_VERSE_AND_CHORUS,
];

interface TributeStep {
  arp: number | null;
  pad?: number[] | null;
  horn?: number | null;
  hornSteps?: number;
}

// Solemn Memorial Elegía in D Minor / F Major (64 BPM, 8th-note steps = 0.468s)
// Acoustic nylon arpeggio + warm strings pad + reverent "Toque de Silencio" cornet motif
const MALVINAS_TRIBUTE_SCORE: TributeStep[] = [
  // Bar 1: Dm (D3-A3-F4-A3) — Cornet enters gently on A4 -> D5
  { arp: 50, pad: [50, 57, 65], horn: 69, hornSteps: 2 },
  { arp: 57 },
  { arp: 65, horn: 74, hornSteps: 4 },
  { arp: 57 },
  { arp: 62 },
  { arp: 57 },
  { arp: 65, horn: 72, hornSteps: 2 },
  { arp: 57 },

  // Bar 2: Bbmaj7 (Bb2-F3-D4-A4) — Rising warmth
  { arp: 46, pad: [46, 53, 62], horn: 74, hornSteps: 3 },
  { arp: 53 },
  { arp: 62 },
  { arp: 58, horn: 77, hornSteps: 3 },
  { arp: 65 },
  { arp: 58 },
  { arp: 62, horn: 76, hornSteps: 2 },
  { arp: 53 },

  // Bar 3: F Major (F3-C4-A4) -> C/E (E3-C4-G4) — Hopeful sunrise swell
  { arp: 53, pad: [53, 60, 69], horn: 74, hornSteps: 4 },
  { arp: 60 },
  { arp: 69 },
  { arp: 65 },
  { arp: 52, pad: [52, 60, 67], horn: 72, hornSteps: 4 },
  { arp: 60 },
  { arp: 67 },
  { arp: 64 },

  // Bar 4: Gm7 -> A7 -> Dm — Poignant Toque de Silencio cadence
  { arp: 55, pad: [55, 62, 70], horn: 70, hornSteps: 2 },
  { arp: 62 },
  { arp: 67, horn: 69, hornSteps: 2 },
  { arp: 62 },
  { arp: 57, pad: [57, 64, 69], horn: 67, hornSteps: 2 },
  { arp: 64 },
  { arp: 69, horn: 64, hornSteps: 2 },
  { arp: 61 },

  // Bar 5: Dm -> F — High soaring cornet salute (A4 -> D5 -> F5 -> A5!)
  { arp: 50, pad: [50, 57, 65], horn: 69, hornSteps: 2 },
  { arp: 57 },
  { arp: 62, horn: 74, hornSteps: 2 },
  { arp: 57 },
  { arp: 53, pad: [53, 60, 69], horn: 77, hornSteps: 2 },
  { arp: 60 },
  { arp: 65, horn: 81, hornSteps: 4 },
  { arp: 60 },

  // Bar 6: C -> Bb -> A -> Dm — Peaceful eternal rest
  { arp: 48, pad: [48, 55, 64] },
  { arp: 55 },
  { arp: 64, horn: 79, hornSteps: 2 },
  { arp: 55 },
  { arp: 46, pad: [46, 53, 62], horn: 77, hornSteps: 2 },
  { arp: 53 },
  { arp: 62, horn: 76, hornSteps: 2 },
  { arp: 57 },

  // Bar 7-8 Resolve: Dm sustained serene chord
  { arp: 50, pad: [50, 57, 62, 65], horn: 74, hornSteps: 6 },
  { arp: 57 },
  { arp: 62 },
  { arp: 65 },
  { arp: 69 },
  { arp: 65 },
  { arp: 62 },
  { arp: 57 },
];

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function makeSoftClipCurve(drive: number): Float32Array<ArrayBuffer> {
  const samples = 256;
  const curve = new Float32Array(new ArrayBuffer(samples * 4));
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    curve[i] = Math.tanh(x * drive) / Math.tanh(drive);
  }
  return curve;
}

const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD_SEC = 0.14;
const BGM_CROSSFADE_SEC = 2.0;
const BGM_FALLBACK_LOOP_OUT = 226.0;
const EL_VISITANTE_TRACK_URL =
  '/assets/aistudio/El_Visitante_-_Almafuerte__Audio_Mejorado__cdd6db00.mp3';

interface ActiveBgmSource {
  source: AudioBufferSourceNode;
  gain: GainNode;
  startTime: number;
  startOffset: number;
  endCtxTime: number;
  crossfadeStarted: boolean;
}

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted = false;
  private musicMuted = false;
  private noiseBuffer: AudioBuffer | null = null;
  private musicMode: MusicMode = 'none';
  private musicTimer: number | null = null;
  private stepIndex = 0;
  private nextStepTime = 0;

  // Dual HTMLAudio fallback decks (instant start + crossfade if AudioBuffer still decoding)
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmDeckB: HTMLAudioElement | null = null;
  private bgmActiveDeck: 'a' | 'b' = 'a';
  private bgmDeckCrossfading = false;
  private bgmFailed = false;
  private bgmPlaying = false;

  // Sample-accurate hooked Web Audio instrumental looper
  private bgmRawBytes: ArrayBuffer | null = null;
  private bgmPrefetching = false;
  private bgmBuffer: AudioBuffer | null = null;
  private bgmBufferLoading = false;
  private bgmBufferLoadFailed = false;
  private bgmLoopStart = 0.08;
  private bgmLoopEnd = BGM_FALLBACK_LOOP_OUT;
  private bgmMasterGain: GainNode | null = null;
  private activeBgmSources: ActiveBgmSource[] = [];
  private bgmWatchTimer: number | null = null;

  // Dedicated 16-bit mastered stereo buses & algorithmic studio hall reverb
  private musicComp: DynamicsCompressorNode | null = null;
  private reverbBus: ConvolverNode | null = null;
  private guitarCabLeft: BiquadFilterNode | null = null;
  private guitarCabRight: BiquadFilterNode | null = null;
  private bassBus: BiquadFilterNode | null = null;
  private leadBus: BiquadFilterNode | null = null;
  private sfxBus: DynamicsCompressorNode | null = null;

  constructor() {
    this.prefetchBgmBytes();
  }

  private prefetchBgmBytes(): void {
    if (this.bgmRawBytes || this.bgmPrefetching || typeof window === 'undefined') return;
    this.bgmPrefetching = true;
    void fetch(EL_VISITANTE_TRACK_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Audio fetch error');
        return res.arrayBuffer();
      })
      .then((arr) => {
        this.bgmRawBytes = arr;
        this.bgmPrefetching = false;
        if (this.ctx && !this.bgmBuffer && !this.bgmBufferLoading) {
          this.ensureBgmBuffer();
        }
      })
      .catch(() => {
        this.bgmPrefetching = false;
      });
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public isMusicMuted(): boolean {
    return this.musicMuted;
  }

  public isAudioRunning(): boolean {
    return Boolean((this.ctx && this.ctx.state === 'running') || this.bgmPlaying);
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    this.syncBgmPlayback();
    return this.muted;
  }

  public toggleMusic(): boolean {
    this.musicMuted = !this.musicMuted;
    this.syncBgmPlayback();
    return this.musicMuted;
  }

  private getTargetBgmVolume(): number {
    if (this.muted || this.musicMuted) return 0;
    // Keep instrumental background subdued so gunfire, bombs & explosions cut cleanly above it
    return this.musicMode === 'battle' ? 0.095 : 0.18;
  }

  private createDeckElement(): HTMLAudioElement {
    const audio = new Audio(EL_VISITANTE_TRACK_URL);
    audio.loop = true;
    audio.preload = 'auto';
    audio.addEventListener('error', () => {
      this.bgmFailed = true;
      this.bgmPlaying = false;
    });
    audio.addEventListener('play', () => {
      this.bgmPlaying = true;
    });
    return audio;
  }

  private ensureBgmAudio(): HTMLAudioElement {
    if (!this.bgmAudio) {
      this.bgmAudio = this.createDeckElement();
    }
    if (!this.bgmDeckB) {
      this.bgmDeckB = this.createDeckElement();
    }
    return this.bgmActiveDeck === 'a' ? this.bgmAudio : this.bgmDeckB;
  }

  private analyzeLoopPoints(buffer: AudioBuffer): void {
    const ch0 = buffer.getChannelData(0);
    const sr = buffer.sampleRate;
    const duration = buffer.duration;
    const winSamples = Math.max(1, Math.floor(sr * 0.1));

    const rmsAt = (startSample: number, count: number): number => {
      let sum = 0;
      const end = Math.min(ch0.length, startSample + count);
      if (end <= startSample) return 0;
      for (let i = startSample; i < end; i++) {
        const s = ch0[i];
        sum += s * s;
      }
      return Math.sqrt(sum / (end - startSample));
    };

    // Trim leading silence so the looped riff hits cleanly on beat
    let loopStart = 0;
    const maxLeadScan = Math.min(ch0.length, Math.floor(sr * 4));
    for (let s = 0; s < maxLeadScan; s += Math.floor(sr * 0.02)) {
      if (rmsAt(s, Math.floor(sr * 0.04)) > 0.025) {
        loopStart = Math.max(0, s / sr - 0.02);
        break;
      }
    }

    // Measure median energetic RMS across main body of track
    const samplesRms: number[] = [];
    for (let t = 10; t < duration - 25; t += 2) {
      samplesRms.push(rmsAt(Math.floor(t * sr), winSamples));
    }
    samplesRms.sort((a, b) => a - b);
    const medianRms = samplesRms.length > 0 ? samplesRms[Math.floor(samplesRms.length * 0.5)] : 0.12;
    const energyFloor = Math.max(0.035, medianRms * 0.42);

    // Walk backwards from end to skip quiet acoustic/ambient fade-out tail
    let loopEnd = Math.max(loopStart + 20, duration - 1.5);
    const scanStart = Math.min(duration - 1.5, Math.max(loopStart + 30, duration - 36));
    let lastHeavyTime = duration - 1.5;
    for (let t = Math.floor(duration - 2); t >= scanStart; t -= 0.5) {
      const r = rmsAt(Math.floor(t * sr), Math.floor(sr * 0.4));
      if (r >= energyFloor) {
        lastHeavyTime = Math.min(duration - 0.8, t + 0.4);
        break;
      }
    }
    loopEnd = Math.max(loopStart + 20, Math.min(lastHeavyTime, BGM_FALLBACK_LOOP_OUT));
    if (duration < 60) {
      loopEnd = Math.max(loopStart + 5, duration - 1.2);
    }

    this.bgmLoopStart = loopStart;
    this.bgmLoopEnd = loopEnd;
  }

  private makeInstrumentalBuffer(ctxRef: AudioContext, decoded: AudioBuffer): AudioBuffer | null {
    // Strip centered lead vocals via Mid/Side spectral separation while preserving sub-bass (<195Hz),
    // drum snap (>5.6kHz), and wide stereo heavy-metal guitars!
    if (decoded.numberOfChannels < 2) {
      return null; // Fall back to pure instrumental 16-bit synth arrangement if source is mono
    }

    const ch0 = decoded.getChannelData(0);
    const ch1 = decoded.getChannelData(1);
    const len = decoded.length;
    const sr = decoded.sampleRate;

    // Quick stereo separation check across track body
    let sideSqSum = 0;
    let midSqSum = 0;
    const stride = Math.max(1, Math.floor(len / 24000));
    let count = 0;
    for (let i = 0; i < len; i += stride) {
      const m = 0.5 * (ch0[i] + ch1[i]);
      const s = 0.5 * (ch0[i] - ch1[i]);
      midSqSum += m * m;
      sideSqSum += s * s;
      count++;
    }
    const sideRms = Math.sqrt(sideSqSum / Math.max(1, count));
    const midRms = Math.sqrt(midSqSum / Math.max(1, count));
    if (sideRms < midRms * 0.08) {
      return null; // Track has negligible stereo Side energy; use pure instrumental synth
    }

    const out = ctxRef.createBuffer(2, len, sr);
    const outL = out.getChannelData(0);
    const outR = out.getChannelData(1);

    // 1-pole IIR crossover coefficients on Mid channel
    const aLow = 1 - Math.exp((-2 * Math.PI * 195) / sr);
    const aHigh = 1 - Math.exp((-2 * Math.PI * 5600) / sr);
    let lpLow = 0;
    let lpHigh = 0;

    for (let i = 0; i < len; i++) {
      const l = ch0[i];
      const r = ch1[i];
      const mid = 0.5 * (l + r);
      const side = 0.5 * (l - r);

      lpLow += aLow * (mid - lpLow);
      lpHigh += aHigh * (mid - lpHigh);

      const mBass = lpLow;
      const mVocal = lpHigh - lpLow;
      const mAir = mid - lpHigh;

      // Retain heavy bass & kick, nearly mute dead-center vocal range, boost stereo guitars cleanly
      const cleanMid = mBass * 0.96 + mVocal * 0.03 + mAir * 0.24;
      const wideSide = side * 1.38;

      outL[i] = Math.tanh((cleanMid + wideSide) * 0.92);
      outR[i] = Math.tanh((cleanMid - wideSide) * 0.92);
    }

    return out;
  }

  private ensureBgmBuffer(): void {
    if (this.bgmBuffer || this.bgmBufferLoading || this.bgmBufferLoadFailed) return;
    if (!this.ctx) return;
    this.bgmBufferLoading = true;
    const ctxRef = this.ctx;

    const loadBytes = this.bgmRawBytes
      ? Promise.resolve(this.bgmRawBytes.slice(0))
      : fetch(EL_VISITANTE_TRACK_URL).then((res) => {
          if (!res.ok) throw new Error('Audio fetch error');
          return res.arrayBuffer();
        });

    void loadBytes
      .then((arr) => ctxRef.decodeAudioData(arr))
      .then((decoded) => {
        const instrumental = this.makeInstrumentalBuffer(ctxRef, decoded);
        if (!instrumental) {
          // Track lacks separable stereo channels -> stay on pure instrumental 16-bit arrangement
          this.bgmBufferLoading = false;
          this.bgmBufferLoadFailed = true;
          this.bgmFailed = true;
          if (this.musicMode === 'title' || this.musicMode === 'battle') {
            this.startMusic(this.musicMode);
          }
          return;
        }
        this.bgmBuffer = instrumental;
        this.bgmBufferLoading = false;
        this.analyzeLoopPoints(instrumental);
        if (this.musicTimer !== null) {
          window.clearInterval(this.musicTimer);
          this.musicTimer = null;
        }
        if (
          (this.musicMode === 'title' || this.musicMode === 'battle') &&
          !this.muted &&
          !this.musicMuted
        ) {
          this.handoffHtmlToBuffer();
        }
      })
      .catch(() => {
        this.bgmBufferLoading = false;
        this.bgmBufferLoadFailed = true;
        this.bgmFailed = true;
        if (this.musicMode === 'title' || this.musicMode === 'battle') {
          this.startMusic(this.musicMode);
        }
      });
  }

  private ensureBgmMasterGain(): GainNode | null {
    if (!this.ctx) return null;
    if (!this.bgmMasterGain) {
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(this.getTargetBgmVolume(), this.ctx.currentTime);
      g.connect(this.ctx.destination);
      this.bgmMasterGain = g;
    }
    return this.bgmMasterGain;
  }

  private spawnBufferDeck(offsetSec: number, fadeInSec: number, when?: number): void {
    if (!this.ctx || !this.bgmBuffer) return;
    const master = this.ensureBgmMasterGain();
    if (!master) return;

    const now = this.ctx.currentTime;
    const startAt = when !== undefined ? Math.max(now, when) : now;
    const safeOffset = Math.max(
      0,
      Math.min(Math.max(0, this.bgmLoopEnd - 4), offsetSec)
    );
    const playLen = Math.max(2, this.bgmLoopEnd - safeOffset);

    const src = this.ctx.createBufferSource();
    src.buffer = this.bgmBuffer;

    const deckGain = this.ctx.createGain();
    if (fadeInSec > 0.02) {
      deckGain.gain.setValueAtTime(0.0001, startAt);
      deckGain.gain.linearRampToValueAtTime(1.0, startAt + fadeInSec);
    } else {
      deckGain.gain.setValueAtTime(1.0, startAt);
    }

    const fadeOutStart = Math.max(startAt + 0.2, startAt + playLen - BGM_CROSSFADE_SEC);
    const stopAt = startAt + playLen + 0.08;
    deckGain.gain.setValueAtTime(1.0, fadeOutStart);
    deckGain.gain.linearRampToValueAtTime(0.0001, stopAt);

    src.connect(deckGain);
    deckGain.connect(master);

    src.start(startAt, safeOffset, playLen + 0.12);
    src.stop(stopAt + 0.02);

    const entry: ActiveBgmSource = {
      source: src,
      gain: deckGain,
      startTime: startAt,
      startOffset: safeOffset,
      endCtxTime: startAt + playLen,
      crossfadeStarted: false,
    };
    this.activeBgmSources.push(entry);
    this.bgmPlaying = true;

    src.onended = () => {
      const idx = this.activeBgmSources.indexOf(entry);
      if (idx >= 0) this.activeBgmSources.splice(idx, 1);
    };
  }

  private stopAllBufferDecks(): void {
    for (const s of this.activeBgmSources) {
      try {
        s.source.onended = null;
        s.source.stop();
        s.source.disconnect();
        s.gain.disconnect();
      } catch {
        // Already stopped
      }
    }
    this.activeBgmSources = [];
  }

  private handoffHtmlToBuffer(): void {
    if (!this.ctx || this.ctx.state !== 'running' || !this.bgmBuffer) return;
    if (this.activeBgmSources.length > 0) return;

    const activeHtml = this.bgmActiveDeck === 'a' ? this.bgmAudio : this.bgmDeckB;
    let currentPos = this.bgmLoopStart;
    if (activeHtml && !activeHtml.paused && Number.isFinite(activeHtml.currentTime)) {
      currentPos = activeHtml.currentTime;
      if (currentPos >= this.bgmLoopEnd - 3.5 || currentPos < this.bgmLoopStart) {
        currentPos = this.bgmLoopStart;
      }
    }

    // Start Web Audio buffer smoothly overlapped over 0.35s and retire HTMLAudio cleanly
    this.spawnBufferDeck(currentPos, 0.35);
    const decks = [this.bgmAudio, this.bgmDeckB];
    for (const d of decks) {
      if (d && !d.paused) {
        d.pause();
      }
    }
  }

  private ensureBgmWatcher(): void {
    if (this.bgmWatchTimer !== null) return;
    this.bgmWatchTimer = window.setInterval(() => {
      this.tickBgmSeamlessLoop();
    }, 150);
  }

  private tickBgmSeamlessLoop(): void {
    const wantsBgm =
      (this.musicMode === 'title' || this.musicMode === 'battle') &&
      !this.muted &&
      !this.musicMuted &&
      !this.bgmFailed;

    if (!wantsBgm) return;

    // 1. Sample-accurate Web Audio crossfade looper (preferred, zero-gap hooked!)
    if (this.ctx && this.ctx.state === 'running' && this.bgmBuffer) {
      if (this.activeBgmSources.length === 0) {
        this.spawnBufferDeck(this.bgmLoopStart, 0.18);
        return;
      }
      const now = this.ctx.currentTime;
      const latest = this.activeBgmSources[this.activeBgmSources.length - 1];
      const timeRemaining = latest.endCtxTime - now;
      if (!latest.crossfadeStarted && timeRemaining <= BGM_CROSSFADE_SEC + 0.35) {
        latest.crossfadeStarted = true;
        const hookAt = Math.max(now + 0.04, latest.endCtxTime - BGM_CROSSFADE_SEC);
        this.spawnBufferDeck(this.bgmLoopStart, BGM_CROSSFADE_SEC, hookAt);
      }
      return;
    }

    // 2. Fallback dual-deck HTMLAudio crossfade before Web Audio buffer decode finishes
    const active = this.bgmActiveDeck === 'a' ? this.bgmAudio : this.bgmDeckB;
    const standby = this.bgmActiveDeck === 'a' ? this.bgmDeckB : this.bgmAudio;
    if (!active || !standby || active.paused || this.bgmDeckCrossfading) return;

    const targetEnd =
      Number.isFinite(active.duration) && active.duration > 35
        ? Math.min(active.duration - 1.8, BGM_FALLBACK_LOOP_OUT)
        : BGM_FALLBACK_LOOP_OUT;

    if (active.currentTime >= targetEnd - 1.6) {
      this.bgmDeckCrossfading = true;
      const targetVol = this.getTargetBgmVolume();
      try {
        standby.currentTime = 0.08;
      } catch {
        // Ignore seek error
      }
      standby.volume = 0.01;
      void standby.play().then(() => {
        let step = 0;
        const totalSteps = 12;
        const fadeTimer = window.setInterval(() => {
          step++;
          const u = step / totalSteps;
          active.volume = Math.max(0, targetVol * (1 - u));
          standby.volume = Math.min(targetVol, targetVol * u);
          if (step >= totalSteps) {
            window.clearInterval(fadeTimer);
            active.pause();
            this.bgmActiveDeck = this.bgmActiveDeck === 'a' ? 'b' : 'a';
            this.bgmDeckCrossfading = false;
          }
        }, 110);
      }).catch(() => {
        this.bgmDeckCrossfading = false;
      });
    }
  }

  private syncBgmPlayback(): void {
    const wantsBgm =
      (this.musicMode === 'title' || this.musicMode === 'battle') &&
      !this.muted &&
      !this.musicMuted &&
      !this.bgmFailed;

    const targetVol = this.getTargetBgmVolume();

    if (this.ctx && this.bgmMasterGain) {
      this.bgmMasterGain.gain.setTargetAtTime(targetVol, this.ctx.currentTime, 0.12);
    }

    if (!wantsBgm) {
      if (this.bgmAudio && !this.bgmAudio.paused) this.bgmAudio.pause();
      if (this.bgmDeckB && !this.bgmDeckB.paused) this.bgmDeckB.pause();
      if (this.musicMode === 'tribute' || this.musicMode === 'none') {
        this.stopAllBufferDecks();
      }
      this.bgmPlaying = false;
      return;
    }

    this.ensureBgmWatcher();
    this.ensureBgmBuffer();

    // If decoded Web Audio buffer is ready & AudioContext running, use seamless sample-accurate looper!
    if (this.ctx && this.ctx.state === 'running' && this.bgmBuffer) {
      if (this.activeBgmSources.length === 0) {
        this.handoffHtmlToBuffer();
      }
      if (this.bgmAudio && !this.bgmAudio.paused) this.bgmAudio.pause();
      if (this.bgmDeckB && !this.bgmDeckB.paused) this.bgmDeckB.pause();
      this.bgmPlaying = true;
      return;
    }

    // Never play un-stripped vocal HTMLAudio while waiting for instrumental decode:
    // Bridge seamlessly with the 16-bit pure instrumental rock synth until buffer is ready!
    if (this.ctx && this.ctx.state === 'running' && !this.bgmBufferLoadFailed) {
      if (this.musicTimer === null) {
        this.stepIndex = 0;
        this.nextStepTime = this.ctx.currentTime + 0.04;
        this.musicTimer = window.setInterval(() => {
          this.schedulerLoop();
        }, LOOKAHEAD_MS);
      }
      return;
    }

    const audio = this.ensureBgmAudio();
    audio.volume = targetVol;
    if (audio.paused) {
      void audio
        .play()
        .then(() => {
          this.bgmPlaying = true;
        })
        .catch(() => {
          this.bgmPlaying = false;
        });
    }
  }

  public unlock(): boolean {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.buildNoiseBuffer();
        this.buildAudioBuses();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume().then(() => {
        if (this.musicMode !== 'none' && this.ctx) {
          this.nextStepTime = this.ctx.currentTime + 0.04;
          if (this.musicMode === 'title' || this.musicMode === 'battle') {
            this.syncBgmPlayback();
          } else if (this.musicTimer === null && (this.musicMode === 'tribute' || this.bgmFailed)) {
            this.startMusic(this.musicMode);
          }
        }
      });
    }
    this.syncBgmPlayback();
    return Boolean((this.ctx && this.ctx.state === 'running') || this.bgmPlaying);
  }

  private buildGuitarCabinetChain(comp: AudioNode, panAmount: number): BiquadFilterNode | null {
    if (!this.ctx) return null;
    const gtrHp = this.ctx.createBiquadFilter();
    gtrHp.type = 'highpass';
    gtrHp.frequency.setValueAtTime(160, this.ctx.currentTime);

    const gtrMidScoop = this.ctx.createBiquadFilter();
    gtrMidScoop.type = 'peaking';
    gtrMidScoop.frequency.setValueAtTime(520, this.ctx.currentTime);
    gtrMidScoop.Q.setValueAtTime(1.1, this.ctx.currentTime);
    gtrMidScoop.gain.setValueAtTime(-3.2, this.ctx.currentTime);

    const gtrDrive = this.ctx.createWaveShaper();
    gtrDrive.curve = makeSoftClipCurve(2.05);
    gtrDrive.oversample = '2x';

    const gtrCab = this.ctx.createBiquadFilter();
    gtrCab.type = 'lowpass';
    gtrCab.frequency.setValueAtTime(2450, this.ctx.currentTime);

    const panner = this.ctx.createStereoPanner();
    panner.pan.setValueAtTime(panAmount, this.ctx.currentTime);

    gtrHp.connect(gtrMidScoop);
    gtrMidScoop.connect(gtrDrive);
    gtrDrive.connect(gtrCab);
    gtrCab.connect(panner);
    panner.connect(comp);
    if (this.reverbBus) {
      const revSend = this.ctx.createGain();
      revSend.gain.setValueAtTime(0.18, this.ctx.currentTime);
      panner.connect(revSend);
      revSend.connect(this.reverbBus);
    }
    return gtrHp;
  }

  private buildAudioBuses(): void {
    if (!this.ctx) return;

    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.setValueAtTime(-15, this.ctx.currentTime);
    comp.knee.setValueAtTime(12, this.ctx.currentTime);
    comp.ratio.setValueAtTime(4.2, this.ctx.currentTime);
    comp.attack.setValueAtTime(0.003, this.ctx.currentTime);
    comp.release.setValueAtTime(0.14, this.ctx.currentTime);

    const musicGain = this.ctx.createGain();
    musicGain.gain.setValueAtTime(0.16, this.ctx.currentTime);
    comp.connect(musicGain);
    musicGain.connect(this.ctx.destination);
    this.musicComp = comp;

    const irLen = Math.floor(this.ctx.sampleRate * 0.36);
    const irBuf = this.ctx.createBuffer(2, irLen, this.ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const chData = irBuf.getChannelData(ch);
      for (let i = 0; i < irLen; i++) {
        const env = Math.pow(1 - i / irLen, 2.6);
        chData[i] = (Math.random() * 2 - 1) * env;
      }
    }
    const convolver = this.ctx.createConvolver();
    convolver.buffer = irBuf;
    const wetFilter = this.ctx.createBiquadFilter();
    wetFilter.type = 'lowpass';
    wetFilter.frequency.setValueAtTime(3200, this.ctx.currentTime);
    const wetGain = this.ctx.createGain();
    wetGain.gain.setValueAtTime(0.24, this.ctx.currentTime);
    convolver.connect(wetFilter);
    wetFilter.connect(wetGain);
    wetGain.connect(comp);
    this.reverbBus = convolver;

    this.guitarCabLeft = this.buildGuitarCabinetChain(comp, -0.44);
    this.guitarCabRight = this.buildGuitarCabinetChain(comp, 0.44);

    const bassFilter = this.ctx.createBiquadFilter();
    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(840, this.ctx.currentTime);
    const bassBoost = this.ctx.createBiquadFilter();
    bassBoost.type = 'lowshelf';
    bassBoost.frequency.setValueAtTime(110, this.ctx.currentTime);
    bassBoost.gain.setValueAtTime(2.8, this.ctx.currentTime);
    bassBoost.connect(bassFilter);
    bassFilter.connect(comp);
    this.bassBus = bassBoost;

    const leadHp = this.ctx.createBiquadFilter();
    leadHp.type = 'highpass';
    leadHp.frequency.setValueAtTime(210, this.ctx.currentTime);

    const leadLp = this.ctx.createBiquadFilter();
    leadLp.type = 'lowpass';
    leadLp.frequency.setValueAtTime(3600, this.ctx.currentTime);

    const delayL = this.ctx.createDelay(0.45);
    delayL.delayTime.setValueAtTime(0.11, this.ctx.currentTime);
    const delayR = this.ctx.createDelay(0.45);
    delayR.delayTime.setValueAtTime(0.175, this.ctx.currentTime);
    const panL = this.ctx.createStereoPanner();
    panL.pan.setValueAtTime(-0.55, this.ctx.currentTime);
    const panR = this.ctx.createStereoPanner();
    panR.pan.setValueAtTime(0.55, this.ctx.currentTime);
    const echoWet = this.ctx.createGain();
    echoWet.gain.setValueAtTime(0.22, this.ctx.currentTime);
    const leadRevSend = this.ctx.createGain();
    leadRevSend.gain.setValueAtTime(0.26, this.ctx.currentTime);

    leadHp.connect(leadLp);
    leadLp.connect(comp);
    leadLp.connect(leadRevSend);
    leadRevSend.connect(convolver);
    leadLp.connect(delayL);
    leadLp.connect(delayR);
    delayL.connect(panL);
    delayR.connect(panR);
    panL.connect(echoWet);
    panR.connect(echoWet);
    echoWet.connect(comp);
    this.leadBus = leadHp;

    const sfxComp = this.ctx.createDynamicsCompressor();
    sfxComp.threshold.setValueAtTime(-5, this.ctx.currentTime);
    sfxComp.knee.setValueAtTime(8, this.ctx.currentTime);
    sfxComp.ratio.setValueAtTime(3.2, this.ctx.currentTime);
    sfxComp.attack.setValueAtTime(0.001, this.ctx.currentTime);
    sfxComp.release.setValueAtTime(0.1, this.ctx.currentTime);
    const sfxMaster = this.ctx.createGain();
    sfxMaster.gain.setValueAtTime(2.35, this.ctx.currentTime);
    sfxComp.connect(sfxMaster);
    sfxMaster.connect(this.ctx.destination);
    this.sfxBus = sfxComp;
  }

  public startMusic(mode: MusicMode): void {
    if (mode === 'none') {
      this.stopMusic();
      return;
    }

    const prevMode = this.musicMode;
    this.musicMode = mode;

    if (mode === 'title' || mode === 'battle') {
      if (this.musicTimer !== null && !this.bgmFailed) {
        window.clearInterval(this.musicTimer);
        this.musicTimer = null;
      }
      if (prevMode === 'tribute' && this.bgmAudio) {
        try {
          this.bgmAudio.currentTime = 0;
        } catch {
          // Ignore seek errors before metadata loads
        }
      }
      this.syncBgmPlayback();
      if (!this.bgmFailed) {
        return;
      }
    } else {
      // 'tribute' mode: silence rock track so solemn memorial elegía plays cleanly
      if (this.bgmAudio && !this.bgmAudio.paused) this.bgmAudio.pause();
      if (this.bgmDeckB && !this.bgmDeckB.paused) this.bgmDeckB.pause();
      this.stopAllBufferDecks();
    }

    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }

    this.stepIndex = 0;
    this.nextStepTime = this.ctx ? this.ctx.currentTime + 0.05 : 0;

    this.musicTimer = window.setInterval(() => {
      this.schedulerLoop();
    }, LOOKAHEAD_MS);
  }

  public stopMusic(): void {
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.bgmAudio && !this.bgmAudio.paused) {
      this.bgmAudio.pause();
    }
    if (this.bgmDeckB && !this.bgmDeckB.paused) {
      this.bgmDeckB.pause();
    }
    this.stopAllBufferDecks();
    this.bgmPlaying = false;
    this.musicMode = 'none';
  }

  private getStepDurationSec(): number {
    if (this.musicMode === 'tribute') {
      return 60 / 64 / 2; // Serene 8th-note memorial pulse (~0.468s)
    }
    const bpm = this.musicMode === 'title' ? 88 : 92;
    return 60 / bpm / 4;
  }

  private schedulerLoop(): void {
    if (!this.ctx || this.ctx.state !== 'running') return;
    if ((this.musicMode === 'title' || this.musicMode === 'battle') && this.bgmBuffer && !this.bgmFailed) {
      return;
    }
    const stepSec = this.getStepDurationSec();

    if (this.nextStepTime < this.ctx.currentTime - 0.08) {
      this.nextStepTime = this.ctx.currentTime + 0.04;
    }

    const patternLen =
      this.musicMode === 'tribute' ? MALVINAS_TRIBUTE_SCORE.length : EL_VISITANTE_FULL.length;

    while (this.nextStepTime < this.ctx.currentTime + SCHEDULE_AHEAD_SEC) {
      if (!this.muted && !this.musicMuted) {
        if (this.musicMode === 'tribute') {
          this.scheduleTributeStep(this.stepIndex, this.nextStepTime, stepSec);
        } else {
          this.scheduleStep(this.stepIndex, this.nextStepTime, stepSec);
        }
      }
      this.nextStepTime += stepSec;
      this.stepIndex = (this.stepIndex + 1) % patternLen;
    }
  }

  private scheduleTributeStep(stepIdx: number, when: number, stepSec: number): void {
    if (!this.ctx || !this.musicComp || !this.bassBus || !this.leadBus) return;
    const step = MALVINAS_TRIBUTE_SCORE[stepIdx % MALVINAS_TRIBUTE_SCORE.length];

    // Warm nylon guitar arpeggio
    if (step.arp !== null) {
      const freq = midiToFreq(step.arp);
      this.playEnvNote(freq, when, stepSec * 1.45, 'triangle', 0.075, this.bassBus);
      this.playEnvNote(freq * 2, when, stepSec * 0.7, 'sine', 0.018, this.musicComp);
    }

    // Lush slow-attack strings pad
    if (step.pad && step.pad.length > 0) {
      const padDur = stepSec * 3.8;
      for (const midi of step.pad) {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(midiToFreq(midi), when);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1100, when);
        gain.gain.setValueAtTime(0.0001, when);
        gain.gain.linearRampToValueAtTime(0.028, when + 0.35);
        gain.gain.setValueAtTime(0.024, when + padDur * 0.65);
        gain.gain.linearRampToValueAtTime(0.0001, when + padDur);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicComp);
        osc.start(when);
        osc.stop(when + padDur + 0.04);
      }
    }

    // Solemn "Toque de Silencio" cornet melody through warm delay
    if (step.horn != null) {
      const hornDur = (step.hornSteps ?? 2) * stepSec * 0.92;
      const hornFreq = midiToFreq(step.horn);
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(hornFreq, when);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1700, when);
      gain.gain.setValueAtTime(0.0001, when);
      gain.gain.linearRampToValueAtTime(0.068, when + 0.14);
      gain.gain.setValueAtTime(0.056, when + Math.max(0.16, hornDur * 0.72));
      gain.gain.linearRampToValueAtTime(0.0001, when + hornDur);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.leadBus);
      osc.start(when);
      osc.stop(when + hornDur + 0.04);
    }
  }

  private scheduleStep(_stepIdx: number, when: number, stepSec: number): void {
    if (!this.guitarCabLeft || !this.guitarCabRight || !this.bassBus || !this.leadBus || !this.musicComp) return;
    const step = EL_VISITANTE_FULL[this.stepIndex % EL_VISITANTE_FULL.length];
    const isBattle = this.musicMode === 'battle';

    // 1. 16-bit Sega Genesis YM2612-style Drop-D FM Metal Bass (punchy pick attack + warm sub)
    if (step.bass !== null) {
      const bassSteps = step.bassSteps ?? 1;
      const bassDur = Math.max(0.088, bassSteps * stepSec * 0.87);
      this.play16BitFMBass(midiToFreq(step.bass), when, bassDur, isBattle ? 0.145 : 0.135);
    }

    // 2. 16-bit Double-Tracked Stereo Drop-D Heavy Metal Rhythm Guitars (L/R detuned cabinets)
    if (step.riff !== null) {
      const riffSteps = step.riffSteps ?? 1;
      const riffDur = step.chug
        ? Math.min(0.095, stepSec * 0.66)
        : Math.max(0.11, riffSteps * stepSec * 0.87);
      const rootFreq = midiToFreq(step.riff);
      const fifthFreq = midiToFreq(step.riff + 7);
      const gtrVol = step.chug ? (isBattle ? 0.044 : 0.036) : isBattle ? 0.056 : 0.046;
      this.play16BitStereoGuitar(rootFreq, fifthFreq, when, riffDur, Boolean(step.chug), gtrVol);
    }

    // 3. 16-bit Singing Harmonic Lead Guitar / Vocal Line with Vibrato & Stereo Echo
    if (step.lead !== null) {
      const leadSteps = step.leadSteps ?? 1;
      const leadDur = Math.max(0.092, leadSteps * stepSec * 0.88);
      const leadVol = isBattle ? 0.062 : 0.068;
      this.play16BitLeadNote(midiToFreq(step.lead), when, leadDur, leadVol, leadSteps >= 2);
    }

    // 4. 16-bit Neo Geo / SNES Sampled-Style Heavy Metal Drum Kit
    if (step.drum === 'k' || step.drum === 'ks' || step.drum === 'c') {
      this.play16BitDrum(when, 'kick', 0.14);
    }
    if (step.drum === 's' || step.drum === 'ks') {
      this.play16BitDrum(when, 'snare', 0.085);
    }
    if (step.drum === 'h') {
      this.play16BitDrum(when, 'hihat', 0.026);
    }
    if (step.drum === 'c') {
      this.play16BitDrum(when, 'crash', 0.058);
    }
    if (step.drum === 't1') {
      this.play16BitDrum(when, 'tom1', 0.09);
    }
    if (step.drum === 't2') {
      this.play16BitDrum(when, 'tom2', 0.095);
    }
  }

  private play16BitFMBass(freq: number, startTime: number, duration: number, volume: number): void {
    if (!this.ctx || !this.bassBus) return;
    const carrier = this.ctx.createOscillator();
    const mod = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const subOsc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    const subAmp = this.ctx.createGain();

    // Classic YM2612 2-operator FM metal bass ratio (2:1)
    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(freq, startTime);
    mod.type = 'sine';
    mod.frequency.setValueAtTime(freq * 2, startTime);

    // Sharp pick transient FM index decaying into warm sustain
    modGain.gain.setValueAtTime(freq * 2.1, startTime);
    modGain.gain.exponentialRampToValueAtTime(Math.max(12, freq * 0.48), startTime + 0.065);

    mod.connect(modGain);
    modGain.connect(carrier.frequency);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq, startTime);

    const stopTime = startTime + duration + 0.018;
    amp.gain.setValueAtTime(0.0001, startTime);
    amp.gain.linearRampToValueAtTime(volume, startTime + 0.005);
    amp.gain.linearRampToValueAtTime(volume * 0.72, Math.min(startTime + duration, startTime + 0.05));
    amp.gain.setValueAtTime(volume * 0.72, Math.max(startTime + 0.01, startTime + duration - 0.016));
    amp.gain.linearRampToValueAtTime(0.0001, stopTime);

    subAmp.gain.setValueAtTime(0.0001, startTime);
    subAmp.gain.linearRampToValueAtTime(volume * 0.55, startTime + 0.006);
    subAmp.gain.linearRampToValueAtTime(0.0001, stopTime);

    carrier.connect(amp);
    subOsc.connect(subAmp);
    amp.connect(this.bassBus);
    subAmp.connect(this.bassBus);

    carrier.start(startTime);
    mod.start(startTime);
    subOsc.start(startTime);
    carrier.stop(stopTime + 0.01);
    mod.stop(stopTime + 0.01);
    subOsc.stop(stopTime + 0.01);
  }

  private play16BitStereoGuitar(
    rootFreq: number,
    fifthFreq: number,
    startTime: number,
    duration: number,
    palmMute: boolean,
    volume: number
  ): void {
    if (!this.ctx || !this.guitarCabLeft || !this.guitarCabRight) return;

    const channels: { bus: AudioNode; detuneCents: number }[] = [
      { bus: this.guitarCabLeft, detuneCents: -6 },
      { bus: this.guitarCabRight, detuneCents: 6 },
    ];

    for (const ch of channels) {
      const rootOsc = this.ctx.createOscillator();
      const fifthOsc = this.ctx.createOscillator();
      const pickFilter = this.ctx.createBiquadFilter();
      const amp = this.ctx.createGain();

      rootOsc.type = 'sawtooth';
      rootOsc.frequency.setValueAtTime(rootFreq, startTime);
      rootOsc.detune.setValueAtTime(ch.detuneCents, startTime);

      fifthOsc.type = 'sawtooth';
      fifthOsc.frequency.setValueAtTime(fifthFreq, startTime);
      fifthOsc.detune.setValueAtTime(ch.detuneCents * 0.8, startTime);

      // Dynamic palm-mute filter sweep gives chunky 16-bit Tano Marciello guitar pick bite!
      pickFilter.type = 'lowpass';
      pickFilter.Q.setValueAtTime(palmMute ? 2.4 : 1.1, startTime);
      pickFilter.frequency.setValueAtTime(palmMute ? 2400 : 3200, startTime);
      pickFilter.frequency.exponentialRampToValueAtTime(
        palmMute ? 780 : 1950,
        startTime + Math.min(duration, palmMute ? 0.055 : 0.14)
      );

      const stopTime = startTime + duration + 0.016;
      const v = volume * 0.52;
      amp.gain.setValueAtTime(0.0001, startTime);
      amp.gain.linearRampToValueAtTime(v, startTime + 0.004);
      amp.gain.linearRampToValueAtTime(v * (palmMute ? 0.42 : 0.72), Math.min(startTime + duration, startTime + 0.045));
      amp.gain.linearRampToValueAtTime(0.0001, stopTime);

      const fifthGain = this.ctx.createGain();
      fifthGain.gain.setValueAtTime(0.74, startTime);

      rootOsc.connect(pickFilter);
      fifthOsc.connect(fifthGain);
      fifthGain.connect(pickFilter);
      pickFilter.connect(amp);
      amp.connect(ch.bus);

      rootOsc.start(startTime);
      fifthOsc.start(startTime);
      rootOsc.stop(stopTime + 0.01);
      fifthOsc.stop(stopTime + 0.01);
    }
  }

  private play16BitLeadNote(
    freq: number,
    startTime: number,
    duration: number,
    volume: number,
    useVibrato: boolean
  ): void {
    if (!this.ctx || !this.leadBus) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    const subAmp = this.ctx.createGain();
    const harmonicLp = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    subOsc.type = 'triangle';

    // Subtle expressive pick slide-up on sustained vocal/lead phrases
    if (useVibrato) {
      osc1.frequency.setValueAtTime(freq * 0.985, startTime);
      osc1.frequency.exponentialRampToValueAtTime(freq, startTime + 0.025);
      osc2.frequency.setValueAtTime(freq * 0.985, startTime);
      osc2.frequency.exponentialRampToValueAtTime(freq, startTime + 0.025);
    } else {
      osc1.frequency.setValueAtTime(freq, startTime);
      osc2.frequency.setValueAtTime(freq, startTime);
    }
    osc2.detune.setValueAtTime(5, startTime);
    subOsc.frequency.setValueAtTime(freq * 0.5, startTime);

    let lfo: OscillatorNode | null = null;
    if (useVibrato && duration > 0.14) {
      lfo = this.ctx.createOscillator();
      const lfoDepth = this.ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(5.4, startTime);
      lfoDepth.gain.setValueAtTime(0, startTime);
      lfoDepth.gain.linearRampToValueAtTime(freq * 0.0085, startTime + 0.07);
      lfo.connect(lfoDepth);
      lfoDepth.connect(osc1.frequency);
      lfoDepth.connect(osc2.frequency);
      lfo.start(startTime);
      lfo.stop(startTime + duration + 0.02);
    }

    harmonicLp.type = 'lowpass';
    harmonicLp.frequency.setValueAtTime(3400, startTime);

    const stopTime = startTime + duration + 0.02;
    amp.gain.setValueAtTime(0.0001, startTime);
    amp.gain.linearRampToValueAtTime(volume, startTime + 0.008);
    amp.gain.linearRampToValueAtTime(volume * 0.78, Math.min(startTime + duration, startTime + 0.05));
    amp.gain.setValueAtTime(volume * 0.78, Math.max(startTime + 0.012, startTime + duration - 0.018));
    amp.gain.linearRampToValueAtTime(0.0001, stopTime);

    subAmp.gain.setValueAtTime(0.38, startTime);

    osc1.connect(harmonicLp);
    osc2.connect(harmonicLp);
    subOsc.connect(subAmp);
    subAmp.connect(harmonicLp);
    harmonicLp.connect(amp);
    amp.connect(this.leadBus);

    osc1.start(startTime);
    osc2.start(startTime);
    subOsc.start(startTime);
    osc1.stop(stopTime + 0.01);
    osc2.stop(stopTime + 0.01);
    subOsc.stop(stopTime + 0.01);
  }

  private playEnvNote(
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    dest: AudioNode
  ): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    const attackEnd = startTime + 0.007;
    const decayEnd = Math.min(startTime + duration, startTime + 0.048);
    const sustainLevel = volume * 0.72;
    const releaseStart = Math.max(decayEnd, startTime + duration - 0.016);
    const stopTime = startTime + duration + 0.016;

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(volume, attackEnd);
    if (decayEnd > attackEnd) {
      gain.gain.linearRampToValueAtTime(sustainLevel, decayEnd);
    }
    if (releaseStart > decayEnd) {
      gain.gain.setValueAtTime(sustainLevel, releaseStart);
    }
    gain.gain.linearRampToValueAtTime(0.0001, stopTime);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(startTime);
    osc.stop(stopTime + 0.008);
  }

  private play16BitDrum(
    startTime: number,
    kind: 'kick' | 'snare' | 'hihat' | 'crash' | 'tom1' | 'tom2',
    volume: number
  ): void {
    if (!this.ctx || !this.musicComp) return;

    if (kind === 'kick') {
      // 16-bit punchy metal kick: deep sub sweep + sharp beater click
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(158, startTime);
      osc.frequency.exponentialRampToValueAtTime(42, startTime + 0.085);
      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0008, startTime + 0.11);
      osc.connect(gain);
      gain.connect(this.musicComp);
      osc.start(startTime);
      osc.stop(startTime + 0.12);

      if (this.noiseBuffer) {
        const clickSrc = this.ctx.createBufferSource();
        clickSrc.buffer = this.noiseBuffer;
        const clickFilter = this.ctx.createBiquadFilter();
        clickFilter.type = 'bandpass';
        clickFilter.frequency.setValueAtTime(2200, startTime);
        const clickGain = this.ctx.createGain();
        clickGain.gain.setValueAtTime(volume * 0.35, startTime);
        clickGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.014);
        clickSrc.connect(clickFilter);
        clickFilter.connect(clickGain);
        clickGain.connect(this.musicComp);
        clickSrc.start(startTime);
        clickSrc.stop(startTime + 0.02);
      }
      return;
    }

    if (kind === 'tom1' || kind === 'tom2') {
      // 16-bit acoustic rack/floor tom-tom for bar fills
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startF = kind === 'tom1' ? 215 : 148;
      const endF = kind === 'tom1' ? 102 : 70;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(startF, startTime);
      osc.frequency.exponentialRampToValueAtTime(endF, startTime + 0.11);
      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.13);
      osc.connect(gain);
      gain.connect(this.musicComp);
      if (this.reverbBus) gain.connect(this.reverbBus);
      osc.start(startTime);
      osc.stop(startTime + 0.14);
      return;
    }

    if (kind === 'snare') {
      // 16-bit acoustic snare body + crisp wire rattle into studio hall reverb
      const bodyOsc = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      bodyOsc.type = 'triangle';
      bodyOsc.frequency.setValueAtTime(205, startTime);
      bodyOsc.frequency.exponentialRampToValueAtTime(118, startTime + 0.055);
      bodyGain.gain.setValueAtTime(volume * 0.85, startTime);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.075);
      bodyOsc.connect(bodyGain);
      bodyGain.connect(this.musicComp);
      bodyOsc.start(startTime);
      bodyOsc.stop(startTime + 0.085);

      if (!this.noiseBuffer) return;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2150, startTime);
      filter.Q.setValueAtTime(0.85, startTime);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0008, startTime + 0.115);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicComp);
      if (this.reverbBus) {
        const revSend = this.ctx.createGain();
        revSend.gain.setValueAtTime(0.42, startTime);
        gain.connect(revSend);
        revSend.connect(this.reverbBus);
      }
      src.start(startTime);
      src.stop(startTime + 0.13);
      return;
    }

    // Metallic 16-bit Hi-Hat & Crash Cymbal (inharmonic metallic partial shimmer + crisp filtered noise)
    const freqs = kind === 'crash' ? [342, 518, 764, 1120] : [580, 912, 1340];
    const dur = kind === 'crash' ? 0.34 : 0.032;
    for (const mf of freqs) {
      const mOsc = this.ctx.createOscillator();
      const mGain = this.ctx.createGain();
      mOsc.type = 'square';
      mOsc.frequency.setValueAtTime(mf, startTime);
      mGain.gain.setValueAtTime(volume * 0.16, startTime);
      mGain.gain.exponentialRampToValueAtTime(0.0005, startTime + dur);
      mOsc.connect(mGain);
      mGain.connect(this.musicComp);
      mOsc.start(startTime);
      mOsc.stop(startTime + dur + 0.01);
    }

    if (!this.noiseBuffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(kind === 'crash' ? 3600 : 6800, startTime);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.85, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0008, startTime + dur);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicComp);
    if (kind === 'crash' && this.reverbBus) {
      gain.connect(this.reverbBus);
    }
    src.start(startTime);
    src.stop(startTime + dur + 0.015);
  }

  private buildNoiseBuffer(): void {
    if (!this.ctx) return;
    const length = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
  }

  private ensureReady(): AudioContext | null {
    if (this.muted) return null;
    if (!this.ctx) this.unlock();
    if (!this.ctx || this.ctx.state === 'suspended') return null;
    return this.ctx;
  }

  private getSfxDest(ctx: AudioContext): AudioNode {
    return this.sfxBus ?? ctx.destination;
  }

  public playCarrierLaunch(): void {
    const ctx = this.ensureReady();
    if (!ctx || !this.noiseBuffer) return;
    const now = ctx.currentTime;
    const dest = this.getSfxDest(ctx);

    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, now);
    filter.frequency.exponentialRampToValueAtTime(1650, now + 0.55);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    noise.start(now);
    noise.stop(now + 0.68);

    const turbine = ctx.createOscillator();
    const tGain = ctx.createGain();
    turbine.type = 'sawtooth';
    turbine.frequency.setValueAtTime(150, now);
    turbine.frequency.exponentialRampToValueAtTime(420, now + 0.55);
    tGain.gain.setValueAtTime(0.04, now);
    tGain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
    turbine.connect(tGain);
    tGain.connect(dest);
    turbine.start(now);
    turbine.stop(now + 0.6);
  }

  public playCarrierArrest(): void {
    const ctx = this.ensureReady();
    if (!ctx || !this.noiseBuffer) return;
    const now = ctx.currentTime;
    const dest = this.getSfxDest(ctx);

    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thud.type = 'triangle';
    thud.frequency.setValueAtTime(240, now);
    thud.frequency.exponentialRampToValueAtTime(52, now + 0.14);
    thudGain.gain.setValueAtTime(0.16, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    thud.connect(thudGain);
    thudGain.connect(dest);
    thud.start(now);
    thud.stop(now + 0.18);

    const tireNoise = ctx.createBufferSource();
    tireNoise.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1400, now);
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.09, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    tireNoise.connect(filter);
    filter.connect(nGain);
    nGain.connect(dest);
    tireNoise.start(now);
    tireNoise.stop(now + 0.2);
  }

  public playCannon(level: number): void {
    const ctx = this.ensureReady();
    if (!ctx) return;
    const now = ctx.currentTime;
    const dest = this.getSfxDest(ctx);

    // Layer 1: Punchy low-mid 20mm/30mm cannon breech bark
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    const baseFreq = 340 + level * 28;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(74, now + 0.062);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2600, now);

    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.068);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.072);

    if (this.noiseBuffer) {
      // Layer 2: Crisp supersonic gunfire snap
      const snap = ctx.createBufferSource();
      snap.buffer = this.noiseBuffer;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(1950 + level * 150, now);
      bp.Q.setValueAtTime(0.85, now);
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.38, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.052);
      snap.connect(bp);
      bp.connect(nGain);
      nGain.connect(dest);
      snap.start(now);
      snap.stop(now + 0.056);

      // Layer 3: Sharp mechanical firing-pin attack transient
      const crack = ctx.createBufferSource();
      crack.buffer = this.noiseBuffer;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(3400, now);
      const cGain = ctx.createGain();
      cGain.gain.setValueAtTime(0.2, now);
      cGain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);
      crack.connect(hp);
      hp.connect(cGain);
      cGain.connect(dest);
      crack.start(now);
      crack.stop(now + 0.025);
    }
  }

  public playBombDrop(): void {
    const ctx = this.ensureReady();
    if (!ctx) return;
    const now = ctx.currentTime;
    const dest = this.getSfxDest(ctx);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(840, now);
    osc.frequency.exponentialRampToValueAtTime(185, now + 0.44);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.002, now + 0.46);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.47);
  }

  public playBombExplode(waterSplash: boolean): void {
    const ctx = this.ensureReady();
    if (!ctx || !this.noiseBuffer) return;
    const now = ctx.currentTime;
    const dest = this.getSfxDest(ctx);

    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(waterSplash ? 1250 : 880, now);
    filter.frequency.exponentialRampToValueAtTime(75, now + 0.56);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(waterSplash ? 0.52 : 0.72, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    noise.start(now);
    noise.stop(now + 0.62);

    // Heavy concussion shockwave boom
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(waterSplash ? 125 : 155, now);
    sub.frequency.exponentialRampToValueAtTime(30, now + 0.42);
    subGain.gain.setValueAtTime(waterSplash ? 0.36 : 0.58, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.44);
    sub.connect(subGain);
    subGain.connect(dest);
    sub.start(now);
    sub.stop(now + 0.46);
  }

  public playExocetLaunch(): void {
    const ctx = this.ensureReady();
    if (!ctx || !this.noiseBuffer) return;
    const now = ctx.currentTime;
    const dest = this.getSfxDest(ctx);

    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(420, now + 0.48);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.48, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    noise.start(now);
    noise.stop(now + 0.54);

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(980, now);
    osc.frequency.setValueAtTime(1320, now + 0.06);
    oscGain.gain.setValueAtTime(0.28, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(oscGain);
    oscGain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  public playExocetImpact(): void {
    const ctx = this.ensureReady();
    if (!ctx || !this.noiseBuffer) return;
    const now = ctx.currentTime;
    const dest = this.getSfxDest(ctx);

    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1080, now);
    filter.frequency.exponentialRampToValueAtTime(48, now + 0.8);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.76, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.82);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    noise.start(now);
    noise.stop(now + 0.84);

    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(145, now);
    sub.frequency.exponentialRampToValueAtTime(28, now + 0.48);
    subGain.gain.setValueAtTime(0.64, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    sub.connect(subGain);
    subGain.connect(dest);
    sub.start(now);
    sub.stop(now + 0.52);
  }

  public playEnemyHit(): void {
    const ctx = this.ensureReady();
    if (!ctx) return;
    const now = ctx.currentTime;
    const dest = this.getSfxDest(ctx);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(560, now);
    osc.frequency.exponentialRampToValueAtTime(175, now + 0.048);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.052);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.058);
  }

  public playExplosion(scale: 'small' | 'medium' | 'large'): void {
    const ctx = this.ensureReady();
    if (!ctx || !this.noiseBuffer) return;
    const now = ctx.currentTime;
    const dest = this.getSfxDest(ctx);

    const duration = scale === 'large' ? 0.78 : scale === 'medium' ? 0.46 : 0.25;
    const vol = scale === 'large' ? 0.76 : scale === 'medium' ? 0.54 : 0.36;

    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(scale === 'large' ? 920 : 1120, now);
    filter.frequency.exponentialRampToValueAtTime(65, now + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    noise.start(now);
    noise.stop(now + duration + 0.02);

    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(scale === 'large' ? 130 : scale === 'medium' ? 150 : 175, now);
    sub.frequency.exponentialRampToValueAtTime(30, now + duration * 0.65);
    subGain.gain.setValueAtTime(scale === 'large' ? 0.56 : scale === 'medium' ? 0.38 : 0.22, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.68);
    sub.connect(subGain);
    subGain.connect(dest);
    sub.start(now);
    sub.stop(now + duration * 0.7);
  }

  public playPlayerHit(): void {
    const ctx = this.ensureReady();
    if (!ctx) return;
    const now = ctx.currentTime;
    const dest = this.getSfxDest(ctx);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(46, now + 0.28);
    gain.gain.setValueAtTime(0.42, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  public playPowerUp(): void {
    const ctx = this.ensureReady();
    if (!ctx) return;
    const now = ctx.currentTime;
    const dest = this.getSfxDest(ctx);
    const notes = [523.25, 659.25, 783.99, 1046.5];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const t = now + idx * 0.055;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + 0.15);
    });
  }

  public playBossWarning(): void {
    const ctx = this.ensureReady();
    if (!ctx) return;
    const now = ctx.currentTime;
    const dest = this.getSfxDest(ctx);

    for (let i = 0; i < 3; i++) {
      const start = now + i * 0.34;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, start);
      osc.frequency.linearRampToValueAtTime(580, start + 0.14);
      osc.frequency.linearRampToValueAtTime(420, start + 0.28);
      gain.gain.setValueAtTime(0.28, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(start);
      osc.stop(start + 0.31);
    }
  }

  public playVictory(): void {
    const ctx = this.ensureReady();
    if (!ctx) return;
    const now = ctx.currentTime;
    const dest = this.getSfxDest(ctx);
    const melody = [392.0, 523.25, 659.25, 783.99, 1046.5];
    melody.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const t = now + idx * 0.11;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.11, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + 0.36);
    });
  }
}
