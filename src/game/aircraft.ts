import { AircraftId } from './types';

export interface AircraftSpec {
  id: AircraftId;
  name: string;
  callsign: string;
  pilot: string;
  squadron: string;
  base: string;
  historicalAction: string;
  role: string;
  speed: number;
  maxHp: number;
  startBombs: number;
  maxBombs: number;
  startExocets: number;
  maxExocets: number;
  cannonLabel: string;
  bombLabel: string;
  specialLabel: string;
  accentColor: string;
  statSpeed: number; // 1..5
  statPower: number; // 1..5
  statArmor: number; // 1..5
}

export const AIRCRAFT_ROSTER: AircraftSpec[] = [
  {
    id: 'skyhawk',
    name: 'A-4B Skyhawk',
    callsign: 'HALCÓN C-207',
    pilot: 'Cap. Pablo Carballo',
    squadron: 'Grupo 5 de Caza · FAA',
    base: 'BAM Río Gallegos / Portaviones V-2',
    historicalAction: 'Bautismo de Fuego (1/5) · Hundimiento HMS Coventry (25/5)',
    role: 'Ataque Naval Rasante',
    speed: 185,
    maxHp: 5,
    startBombs: 4,
    maxBombs: 8,
    startExocets: 3,
    maxExocets: 6,
    cannonLabel: '20mm Gemelo + Abanico',
    bombLabel: 'Bomba Mk-82 (250kg)',
    specialLabel: 'Misil Exocet AM-39',
    accentColor: '#F6B40E',
    statSpeed: 3,
    statPower: 4,
    statArmor: 4,
  },
  {
    id: 'super_etendard',
    name: 'Super Étendard',
    callsign: 'TIBURÓN 3-A-202',
    pilot: 'Cap. Augusto Bedacarratz',
    squadron: '2ª Escuadrilla Aeronaval · COAN',
    base: 'Base Aeronaval Río Grande (Tierra del Fuego)',
    historicalAction: 'Impacto mortal al HMS Sheffield (4/5) y Atlantic Conveyor (25/5)',
    role: 'Cazador Antibuque',
    speed: 196,
    maxHp: 4,
    startBombs: 3,
    maxBombs: 7,
    startExocets: 4,
    maxExocets: 7,
    cannonLabel: '30mm DEFA Concentrado',
    bombLabel: 'Salva Cohetes Zuni x2',
    specialLabel: 'Exocet AM-39 Pesado',
    accentColor: '#74ACDF',
    statSpeed: 4,
    statPower: 5,
    statArmor: 3,
  },
  {
    id: 'dagger',
    name: 'IAI Dagger M-5',
    callsign: 'DAGA C-432',
    pilot: 'Tte. José Ardiles',
    squadron: 'Escuadrón La Marinete · Grupo 6 · FAA',
    base: 'BAM San Julián / BAM Río Grande',
    historicalAction: 'Escuadrilla Torno (1/5) · Callejón de las Bombas en San Carlos',
    role: 'Interceptor Supersónico',
    speed: 218,
    maxHp: 4,
    startBombs: 4,
    maxBombs: 8,
    startExocets: 3,
    maxExocets: 6,
    cannonLabel: '30mm + Abanico Amplio',
    bombLabel: 'Bomba Táctica Rápida',
    specialLabel: 'Doble Misil Shafrir II',
    accentColor: '#38BDF8',
    statSpeed: 5,
    statPower: 4,
    statArmor: 3,
  },
  {
    id: 'pucara',
    name: 'IA-58 Pucará',
    callsign: 'CÓNDOR A-528',
    pilot: 'Tte. Miguel Giménez',
    squadron: 'Escuadrón Pucará · BAM Cóndor · FAA',
    base: 'Pradera del Ganso (Goose Green) · Isla Soledad',
    historicalAction: 'Defensa del istmo de Darwin (28/5) y patrullas desde pista de turba',
    role: 'Fortaleza de Apoyo Pesado',
    speed: 165,
    maxHp: 6,
    startBombs: 5,
    maxBombs: 10,
    startExocets: 3,
    maxExocets: 6,
    cannonLabel: '4x 7.62 + 2x 20mm Muro',
    bombLabel: 'Cohetera Triple LAU-61',
    specialLabel: 'Misil Martín Pescador',
    accentColor: '#4ADE80',
    statSpeed: 2,
    statPower: 5,
    statArmor: 5,
  },
];

export function getAircraftSpec(id: AircraftId): AircraftSpec {
  return AIRCRAFT_ROSTER.find((a) => a.id === id) ?? AIRCRAFT_ROSTER[0];
}
