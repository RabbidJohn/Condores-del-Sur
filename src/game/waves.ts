import { EnemyKind, EnemyTactic, LevelTheme, PowerUpKind, WaveConfig, WaveSpawnEvent } from './types';

interface LevelBlueprint {
  title: string;
  sector: string;
  subtitle: string;
  bossKind: EnemyKind;
  bossName: string;
  bossClass: string;
  bossGreeting: string;
  bossWeapons: string[];
  theme: LevelTheme;
  enemyRoster: EnemyKind[];
}

const LEVEL_BLUEPRINTS: LevelBlueprint[] = [
  {
    // Nivel 1: Turquesa brillante costero de San Carlos
    title: 'DEFIENDE LA ISLA',
    sector: '1 de Mayo · Bautismo de Fuego · Estrecho de San Carlos',
    subtitle: 'Primer rechazo aeronaval tras el bombardeo Black Buck sobre Puerto Argentino',
    bossKind: 'boss_frigate',
    bossName: 'Fragata HMS Plymouth (Tipo 12)',
    bossClass: 'FRAGATA ANTISUBMARINA CLASE ROTHESAY · ROYAL NAVY',
    bossGreeting: '«¡Intruso argentino en el estrecho! Aquí HMS Plymouth. ¡Preparen piezas de 114mm y misiles Sea Cat!»',
    bossWeapons: [
      'Cañón Doble Vickers 114mm Mk.6 (Tiro Guiado)',
      'Lanzador Cuádruple de Misiles Sea Cat',
      'Ametralladoras Antiaéreas Oerlikon 20mm',
    ],
    theme: {
      oceanBase: '#0A4B6C',
      oceanDeep: 'rgba(5, 42, 66, 0.42)',
      oceanLight: 'rgba(14, 148, 180, 0.30)',
      swellColor: 'rgba(186, 230, 253, 0.38)',
      atmosphereTint: 'rgba(14, 165, 233, 0.05)',
    },
    enemyRoster: ['patrol_boat', 'bofors_aa', 'minesweeper', 'lynx', 'patrol_boat'],
  },
  {
    // Nivel 2: Azul cobalto profundo austral
    title: 'Nivel 2: Puerto San Carlos (21 de Mayo)',
    sector: 'Isla Soledad · Operación Sutton · Desembarco',
    subtitle: 'Ataque rasante a la cabeza de playa y cobertura de Sea King',
    bossKind: 'boss_assault',
    bossName: 'Buque Logístico RFA Sir Tristram',
    bossClass: 'BUQUE DE DESEMBARCO LOGÍSTICO LSL · ROYAL FLEET AUXILIARY',
    bossGreeting: '«¡Desembarco en curso en San Carlos! Aquí RFA Sir Tristram: ¡Baterías Bofors, protejan la cubierta!»',
    bossWeapons: [
      'Baterías Antiaéreas Bofors 40mm de Proa y Popa',
      'Cañones Rápidos Oerlikon 20mm en Puente',
      'Cobertura Aérea de Helicópteros Sea King',
    ],
    theme: {
      oceanBase: '#0A3664',
      oceanDeep: 'rgba(4, 24, 54, 0.44)',
      oceanLight: 'rgba(37, 99, 235, 0.28)',
      swellColor: 'rgba(147, 197, 253, 0.36)',
      atmosphereTint: 'rgba(37, 99, 235, 0.06)',
    },
    enemyRoster: ['minesweeper', 'sea_king', 'patrol_boat', 'bofors_aa', 'sir_galahad', 'corvette'],
  },
  {
    // Nivel 3: Gris acero glaciar del Mar del Sur
    title: 'Nivel 3: Callejón de las Bombas',
    sector: 'Brazo San Carlos · 21 de Mayo · Grupo 5 de Caza',
    subtitle: 'Pasada a ras del agua bajo fuego de cañones y Sea Cat sobre HMS Ardent',
    bossKind: 'boss_frigate',
    bossName: 'Fragata HMS Ardent (F184 · Tipo 21)',
    bossClass: 'FRAGATA CLASE AMAZON TIPO 21 · ROYAL NAVY',
    bossGreeting: '«¡Aeronaves hostiles a baja cota sobre el brazo! HMS Ardent fijando blanco. ¡Fuego antiaéreo sostenido!»',
    bossWeapons: [
      'Cañón Automático Vickers 114mm Mk.8',
      'Lanzador Cuádruple Sea Cat + Radar de Tiro',
      'Fuego Cruzado de 20mm y Escolta Lynx HAS.2',
    ],
    theme: {
      oceanBase: '#113B56',
      oceanDeep: 'rgba(8, 28, 46, 0.44)',
      oceanLight: 'rgba(56, 132, 168, 0.30)',
      swellColor: 'rgba(203, 213, 225, 0.36)',
      atmosphereTint: 'rgba(148, 163, 184, 0.08)',
    },
    enemyRoster: ['bofors_aa', 'corvette', 'rapier_sam', 'lynx', 'type21_frigate', 'patrol_boat'],
  },
  {
    // Nivel 4: Cerúleo despejado de alta cota
    title: 'Nivel 4: Escuadrillas Torno y Daga',
    sector: 'Cielos de Gran Malvina · 1 de Mayo de 1982',
    subtitle: 'Combate aéreo abierto contra cazas Sea Harrier FRS.1 del Escuadrón 800',
    bossKind: 'boss_harrier_ace',
    bossName: 'Líder Sea Harrier XZ451 (800 NAS)',
    bossClass: 'CAZA EMBARCADO BAE SEA HARRIER FRS.1 · 800 NAS',
    bossGreeting: '«¡Escuadrón 800 enganchando bandidos en el Atlántico Sur! Veamos cómo esquivan nuestros AIM-9L Sidewinder.»',
    bossWeapons: [
      'Misiles Aire-Aire AIM-9L Sidewinder (Todo Aspecto)',
      'Cañones Dobles ADEN 30mm de Alta Cadencia',
      'Maniobra V/STOL "VIFF" y Sección en Pinza',
    ],
    theme: {
      oceanBase: '#0B4E8A',
      oceanDeep: 'rgba(6, 40, 82, 0.38)',
      oceanLight: 'rgba(56, 189, 248, 0.32)',
      swellColor: 'rgba(224, 242, 254, 0.42)',
      atmosphereTint: 'rgba(56, 189, 248, 0.06)',
    },
    enemyRoster: ['sea_harrier', 'lynx', 'sea_harrier', 'sea_king', 'corvette', 'sea_harrier'],
  },
  {
    // Nivel 5: Turquesa cristalino de bahía poco profunda
    title: 'Nivel 5: Bahía Agradable (8 de Junio)',
    sector: 'Fitz Roy · El Día Más Negro de la Flota Británica',
    subtitle: 'Golpe decisivo de Skyhawk A-4B y Dagger sobre el desembarco en Sir Galahad',
    bossKind: 'boss_assault',
    bossName: 'Buque de Desembarco RFA Sir Galahad (L3005)',
    bossClass: 'BUQUE DE DESEMBARCO ANFIBIO LSL · FITZ ROY',
    bossGreeting: '«¡Alerta roja en Bahía Agradable! RFA Sir Galahad solicita cobertura total. ¡Todas las piezas abran fuego!»',
    bossWeapons: [
      'Montajes Dobles Antiaéreos Bofors 40mm',
      'Cortina Defensiva de Trazadoras 20mm',
      'Patrulla Armada de Helicópteros Westland',
    ],
    theme: {
      oceanBase: '#09526A',
      oceanDeep: 'rgba(4, 42, 58, 0.40)',
      oceanLight: 'rgba(20, 184, 166, 0.28)',
      swellColor: 'rgba(165, 243, 252, 0.38)',
      atmosphereTint: 'rgba(6, 182, 212, 0.06)',
    },
    enemyRoster: ['supply_tanker', 'sir_galahad', 'minesweeper', 'bofors_aa', 'sea_king', 'rapier_sam'],
  },
  {
    // Nivel 6: Océano azul profundo al atardecer dorado
    title: 'Nivel 6: Piquete de Radar (4 de Mayo)',
    sector: 'Base Aeronaval Río Grande · 2ª Escuadrilla COAN',
    subtitle: 'Vuelo rasante con AM-39 Exocet y Neptune 2-P-112 sobre HMS Sheffield',
    bossKind: 'boss_destroyer',
    bossName: 'Destructor HMS Sheffield (D80 · Tipo 42)',
    bossClass: 'DESTRUCTOR LANZAMISILES TIPO 42 · ROYAL NAVY',
    bossGreeting: '«Piquete radar HMS Sheffield detecta emisión Agave entrante. ¡Preparen lanzador Sea Dart y bengalas Chaff!»',
    bossWeapons: [
      'Lanzador Doble de Misiles Sea Dart GWS.30',
      'Cañón Automático Vickers 114mm Mk.8',
      'Ametralladoras Oerlikon 20mm + Radar Tipo 965',
    ],
    theme: {
      oceanBase: '#0C2D56',
      oceanDeep: 'rgba(6, 20, 44, 0.44)',
      oceanLight: 'rgba(37, 99, 235, 0.26)',
      swellColor: 'rgba(253, 186, 116, 0.36)',
      atmosphereTint: 'rgba(217, 119, 6, 0.06)',
    },
    enemyRoster: ['radar_bunker', 'corvette', 'type42_destroyer', 'sea_harrier', 'minesweeper', 'type21_frigate'],
  },
  {
    // Nivel 7: Verde azulado profundo del estrecho
    title: 'Nivel 7: Estrecho Choiseul (23 de Mayo)',
    sector: 'Bahía San Carlos · Escuadrilla Nene (A-4B)',
    subtitle: 'Ataque rasante a baja cota contra helicópteros Lynx y la fragata HMS Antelope',
    bossKind: 'boss_frigate',
    bossName: 'Fragata HMS Antelope (F170 · Tipo 21)',
    bossClass: 'FRAGATA CLASE AMAZON TIPO 21 · ROYAL NAVY',
    bossGreeting: '«HMS Antelope cerrando el acceso a Bahía San Carlos. ¡No permitiré que sus bombas toquen nuestro casco!»',
    bossWeapons: [
      'Cañón 114mm Mk.8 con Predictor Digital',
      'Batería Cuádruple Sea Cat + Barrera Flak',
      'Doble Escolta Aérea Lynx / Sea King',
    ],
    theme: {
      oceanBase: '#07485E',
      oceanDeep: 'rgba(4, 34, 48, 0.42)',
      oceanLight: 'rgba(45, 212, 191, 0.24)',
      swellColor: 'rgba(153, 246, 228, 0.36)',
      atmosphereTint: 'rgba(13, 148, 136, 0.06)',
    },
    enemyRoster: ['lynx', 'type21_frigate', 'radar_bunker', 'bofors_aa', 'patrol_boat', 'sea_king'],
  },
  {
    // Nivel 8: Azul índigo de tormenta con lluvia diagonal
    title: 'Nivel 8: Operación Black Buck',
    sector: 'Mar Argentino · 80 Millas · Temporal Austral',
    subtitle: 'Borrasca en ruta del bombardero estratégico Avro Vulcan B.2 desde Ascensión',
    bossKind: 'boss_vulcan',
    bossName: 'Bombardero Avro Vulcan B.2 (XM607)',
    bossClass: 'BOMBARDERO ESTRATÉGICO DELTA · ROYAL AIR FORCE',
    bossGreeting: '«Aquí RAF Black Buck XM607 en rumbo de ataque sobre Malvinas. ¡Escolta y ráfaga de saturación listas!»',
    bossWeapons: [
      'Radar de Navegación y Contramedidas ECM',
      'Cortina Pesada de Fragmentación Dirigida',
      'Patrulla Escolta Sea Harrier en Pinza',
    ],
    theme: {
      oceanBase: '#0E2444',
      oceanDeep: 'rgba(5, 13, 32, 0.48)',
      oceanLight: 'rgba(59, 130, 246, 0.24)',
      swellColor: 'rgba(186, 230, 253, 0.36)',
      atmosphereTint: 'rgba(30, 41, 59, 0.16)',
      rain: true,
    },
    enemyRoster: ['vulcan', 'sea_harrier', 'supply_tanker', 'sea_king', 'type21_frigate', 'lynx'],
  },
  {
    // Nivel 9: Alba clara sobre el mar turquesa del istmo
    title: 'Nivel 9: Pradera del Ganso (28 de Mayo)',
    sector: 'BAM Cóndor · Istmo de Darwin · Goose Green',
    subtitle: 'Apoyo cercano con IA-58 Pucará contra baterías Rapier y Harrier GR.3',
    bossKind: 'boss_harrier_ace',
    bossName: 'Ala Embarcada Harrier GR.3 "Shark"',
    bossClass: 'CAZABOMBARDERO BAE HARRIER GR.3 · ESCUADRÓN 1 RAF',
    bossGreeting: '«¡Harrier GR.3 en picada sobre Darwin! Hemos fijado tu firma térmica. ¡Ríndete o serás interceptado!»',
    bossWeapons: [
      'Cañones Dobles ADEN 30mm de Alta Velocidad',
      'Misiles Aire-Aire AIM-9L Sidewinder',
      'Ataque Coordinado en Formación V',
    ],
    theme: {
      oceanBase: '#0E3F62',
      oceanDeep: 'rgba(7, 29, 49, 0.42)',
      oceanLight: 'rgba(14, 165, 233, 0.26)',
      swellColor: 'rgba(254, 240, 138, 0.34)',
      atmosphereTint: 'rgba(56, 189, 248, 0.05)',
    },
    enemyRoster: ['rapier_sam', 'sea_harrier', 'bofors_aa', 'radar_bunker', 'sea_king', 'corvette'],
  },
  {
    // Nivel 10: Cobalto eléctrico marino
    title: 'Nivel 10: Barrera Sea Wolf (12 de Mayo)',
    sector: 'Sector Marítimo Norte · Escuadrilla Oro (A-4B)',
    subtitle: 'Ruptura de la escolta de misiles Sea Wolf sobre HMS Glasgow y HMS Brilliant',
    bossKind: 'boss_frigate',
    bossName: 'Fragata HMS Brilliant (F90 · Tipo 22)',
    bossClass: 'FRAGATA ANTIMISIL CLASE BROADSWORD TIPO 22',
    bossGreeting: '«HMS Brilliant desplegando paraguas Sea Wolf. ¡Nuestros sistemas automáticos derribarán cada incursión!»',
    bossWeapons: [
      'Dos Lanzadores Séxtuples de Misiles Sea Wolf',
      'Baterías Antiaéreas Bofors 40mm Mk.9',
      'Escolta Embarcada de Helicópteros Sea King',
    ],
    theme: {
      oceanBase: '#072F68',
      oceanDeep: 'rgba(3, 18, 48, 0.44)',
      oceanLight: 'rgba(37, 99, 235, 0.32)',
      swellColor: 'rgba(147, 197, 253, 0.38)',
      atmosphereTint: 'rgba(29, 78, 216, 0.07)',
    },
    enemyRoster: ['type21_frigate', 'minesweeper', 'sea_harrier', 'type42_destroyer', 'rapier_sam', 'lynx'],
  },
  {
    // Nivel 11: Mar zafiro bajo crepúsculo rojo
    title: 'Nivel 11: Trampa de los 42 (25 de Mayo)',
    sector: 'Norte de Isla Borbón · Día de la Patria',
    subtitle: 'Incursión heroica de Carballo y Rinke en A-4B sobre el destructor HMS Coventry',
    bossKind: 'boss_destroyer',
    bossName: 'Destructor HMS Coventry (D118 · Tipo 42)',
    bossClass: 'DESTRUCTOR DE DEFENSA AÉREA TIPO 42 · BARRERA 42/22',
    bossGreeting: '«¡25 de Mayo al norte de Borbón! Aquí HMS Coventry: ¡Fijación de radar 909 activa, disparen Sea Dart!»',
    bossWeapons: [
      'Salvas Dobles de Misiles Sea Dart Guiados',
      'Cañón Rápido Vickers 114mm Mk.8',
      'Barrera Antiaérea de 20mm + Sea Harrier de Escolta',
    ],
    theme: {
      oceanBase: '#0E2448',
      oceanDeep: 'rgba(7, 14, 34, 0.46)',
      oceanLight: 'rgba(30, 64, 175, 0.26)',
      swellColor: 'rgba(253, 164, 175, 0.30)',
      atmosphereTint: 'rgba(190, 18, 60, 0.06)',
    },
    enemyRoster: ['type42_destroyer', 'sea_harrier', 'radar_bunker', 'corvette', 'rapier_sam', 'type21_frigate'],
  },
  {
    // Nivel 12: Azul pizarra polar brumoso
    title: 'Nivel 12: Convoy del Atlántico (25 de Mayo)',
    sector: 'Ruta Noreste · Super Étendard 3-A-203 y 3-A-204',
    subtitle: 'Doble impacto de Exocet AM-39 al portahelicópteros SS Atlantic Conveyor',
    bossKind: 'boss_assault',
    bossName: 'Portacontenedores SS Atlantic Conveyor',
    bossClass: 'BUQUE LOGÍSTICO PORTAHELICÓPTEROS · FUERZA DE TAREAS',
    bossGreeting: '«¡Alerta de Exocet en cubierta del Atlantic Conveyor! ¡Helicópteros de escolta al aire, cortina defensiva ya!»',
    bossWeapons: [
      'Ametralladoras Antiaéreas Pesadas de Cubierta',
      'Cañones Rápidos 20mm y Bengalas Señuelo',
      'Escuadrilla Defensiva de Sea King y Sea Harrier',
    ],
    theme: {
      oceanBase: '#133650',
      oceanDeep: 'rgba(8, 22, 36, 0.42)',
      oceanLight: 'rgba(56, 118, 160, 0.28)',
      swellColor: 'rgba(226, 232, 240, 0.36)',
      atmosphereTint: 'rgba(100, 116, 139, 0.10)',
    },
    enemyRoster: ['supply_tanker', 'sir_galahad', 'vulcan', 'minesweeper', 'sea_king', 'type21_frigate'],
  },
  {
    // Nivel 13: Azul violáceo estratosférico
    title: 'Nivel 13: Monte Longdon y Dos Hermanas',
    sector: 'Perímetro de Puerto Argentino · 11 de Junio',
    subtitle: 'Cobertura aérea sobre las alturas de Soledad bajo incursión Sea Harrier',
    bossKind: 'boss_vulcan',
    bossName: 'Avro Vulcan XM597 + Escolta Harrier',
    bossClass: 'BOMBARDERO ESTRATÉGICO RAF · OPERACIÓN BLACK BUCK 6',
    bossGreeting: '«¡XM597 armado con misiles antirradar Shrike sobre Puerto Argentino! ¡Escolta Harrier, cierren el cielo!»',
    bossWeapons: [
      'Misiles Antirradar AGM-45 Shrike Dirigidos',
      'Cortina de Fuego Flak Multipunto',
      'Cazas Interceptores Sea Harrier en Tenaza',
    ],
    theme: {
      oceanBase: '#122652',
      oceanDeep: 'rgba(8, 16, 40, 0.44)',
      oceanLight: 'rgba(99, 102, 241, 0.24)',
      swellColor: 'rgba(196, 181, 253, 0.32)',
      atmosphereTint: 'rgba(91, 33, 182, 0.07)',
    },
    enemyRoster: ['sea_harrier', 'vulcan', 'lynx', 'sea_king', 'sea_harrier', 'rapier_sam'],
  },
  {
    // Nivel 14: Mar nocturno plateado
    title: 'Nivel 14: Batería Exocet ITB (12 de Junio)',
    sector: 'Península Fresinet · Apostadero Naval Malvinas',
    subtitle: 'Combate nocturno con misil ITB costero contra el destructor HMS Glamorgan',
    bossKind: 'boss_destroyer',
    bossName: 'Destructor HMS Glamorgan (D19 · Clase County)',
    bossClass: 'DESTRUCTOR PESADO CLASE COUNTY · ROYAL NAVY',
    bossGreeting: '«Aquí HMS Glamorgan cañoneando la costa de Soledad. ¡Preparen baterías dobles de 114mm y misiles Seaslug!»',
    bossWeapons: [
      'Misiles Antiaéreos Pesados Seaslug & Sea Cat',
      'Torre Doble Vickers 114mm Mk.6',
      'Fuego Trazador Nocturno + Helicóptero Wessex',
    ],
    theme: {
      oceanBase: '#051A36',
      oceanDeep: 'rgba(2, 10, 24, 0.52)',
      oceanLight: 'rgba(30, 58, 138, 0.30)',
      swellColor: 'rgba(186, 230, 253, 0.32)',
      atmosphereTint: 'rgba(2, 6, 23, 0.16)',
    },
    enemyRoster: ['type42_destroyer', 'patrol_boat', 'radar_bunker', 'bofors_aa', 'corvette', 'type21_frigate'],
  },
  {
    // Nivel 15: Mar Caribe Austral aguamarina profundo
    title: 'Nivel 15: Centro Anfibio San Carlos',
    sector: 'Rada de San Carlos · Buque Insignia Real',
    subtitle: 'Incursión a la estación de mando anfibio británica HMS Fearless',
    bossKind: 'boss_assault',
    bossName: 'Buque de Asalto HMS Fearless (L10)',
    bossClass: 'BUQUE DE ASALTO ANFIBIO LPD · COMANDO COMMODORE',
    bossGreeting: '«Centro de Comando Anfibio HMS Fearless bajo ataque. ¡Cortina de misiles Sea Cat y defensa de punto!»',
    bossWeapons: [
      'Cuatro Lanzadores Cuádruples Sea Cat',
      'Cañones Antiaéreos Bofors 40mm en Bandas',
      'Escuadrilla Defensiva de Sea King y Harrier',
    ],
    theme: {
      oceanBase: '#084358',
      oceanDeep: 'rgba(4, 28, 42, 0.42)',
      oceanLight: 'rgba(13, 148, 136, 0.28)',
      swellColor: 'rgba(165, 243, 252, 0.34)',
      atmosphereTint: 'rgba(14, 116, 144, 0.06)',
    },
    enemyRoster: ['sir_galahad', 'minesweeper', 'rapier_sam', 'sea_king', 'supply_tanker', 'bofors_aa'],
  },
  {
    // Nivel 16: Cian ártico helado
    title: 'Nivel 16: Patrulla 801 Fleet Air Arm',
    sector: 'Alta Mar · 100 Millas al Este de Puerto Argentino',
    subtitle: 'Duelo a baja cota frente a los cazas veteranos del portaaviones HMS Invincible',
    bossKind: 'boss_harrier_ace',
    bossName: 'Escuadrón 801 Fleet Air Arm Líder',
    bossClass: 'AS DE CAZA SEA HARRIER FRS.1 · PORTAAVIONES INVINCIBLE',
    bossGreeting: '«¡Escuadrón 801 en patrulla CAP interceptando rumbo al grupo de batalla! ¡Nadie regresa sin combatir!»',
    bossWeapons: [
      'Salvas Dobles de Misiles AIM-9L Sidewinder',
      'Cañones Gemelos ADEN 30mm Perforantes',
      'Pinza Aérea Coordinada de Sea Harrier',
    ],
    theme: {
      oceanBase: '#074569',
      oceanDeep: 'rgba(4, 30, 50, 0.40)',
      oceanLight: 'rgba(34, 211, 238, 0.28)',
      swellColor: 'rgba(186, 230, 253, 0.40)',
      atmosphereTint: 'rgba(6, 182, 212, 0.07)',
    },
    enemyRoster: ['sea_harrier', 'type21_frigate', 'vulcan', 'sea_harrier', 'lynx', 'type42_destroyer'],
  },
  {
    // Nivel 17: Azul borrasca tormentoso + lluvia
    title: 'Nivel 17: Escudo del Almirantazgo',
    sector: 'Fuerza de Tareas 317 · Mar Tempestuoso',
    subtitle: 'Ruptura de la defensa antiaérea del destructor pesado HMS Bristol bajo temporal',
    bossKind: 'boss_destroyer',
    bossName: 'Destructor HMS Bristol (D23 · Tipo 82)',
    bossClass: 'DESTRUCTOR PESADO TIPO 82 · ESCOLTA PRINCIPAL DE FLOTA',
    bossGreeting: '«HMS Bristol asumiendo mando de defensa aérea. ¡Radar de largo alcance fijado, cortina de Sea Dart!»',
    bossWeapons: [
      'Lanzador Pesado Sea Dart GWS.30 de Salva Rápida',
      'Cañón Automático Vickers 114mm Mk.8',
      'Fuego Cruzado de 20mm + Interceptores Embarcados',
    ],
    theme: {
      oceanBase: '#111F46',
      oceanDeep: 'rgba(7, 12, 32, 0.50)',
      oceanLight: 'rgba(79, 70, 229, 0.24)',
      swellColor: 'rgba(216, 180, 254, 0.32)',
      atmosphereTint: 'rgba(30, 27, 75, 0.16)',
      rain: true,
    },
    enemyRoster: ['type42_destroyer', 'rapier_sam', 'sea_harrier', 'corvette', 'radar_bunker', 'vulcan'],
  },
  {
    // Nivel 18: Mar azul cobalto con reflejos cálidos
    title: 'Nivel 18: Operación 30 de Mayo',
    sector: 'Grupo de Batalla Alfa · Super Étendard + A-4C Zonda',
    subtitle: 'Ataque conjunto al grupo aeronaval británico escoltado por HMS Hermes',
    bossKind: 'boss_carrier',
    bossName: 'Portaaviones HMS Hermes (R12)',
    bossClass: 'PORTAAVIONES BUQUE INSIGNIA CLASE CENTAUR · ROYAL NAVY',
    bossGreeting: '«¡Alerta máxima en el HMS Hermes! ¡Lanzadores Sea Cat en caliente y escuadrón Sea Harrier al despegue!»',
    bossWeapons: [
      'Doble Batería de Misiles Sea Cat Dirigidos',
      'Cortina de Fuego Antiaéreo de Cubierta Corrida',
      'Despliegue Continuo de Cazas Sea Harrier 800 NAS',
    ],
    theme: {
      oceanBase: '#0D2A4E',
      oceanDeep: 'rgba(6, 18, 38, 0.44)',
      oceanLight: 'rgba(37, 99, 235, 0.26)',
      swellColor: 'rgba(253, 186, 116, 0.34)',
      atmosphereTint: 'rgba(234, 88, 12, 0.06)',
    },
    enemyRoster: ['type42_destroyer', 'type21_frigate', 'sea_harrier', 'supply_tanker', 'sea_king', 'corvette'],
  },
  {
    // Nivel 19: Mar nocturno profundo en alerta
    title: 'Nivel 19: Monte Tumbledown (13 de Junio)',
    sector: 'Última Defensa de Puerto Argentino · BIM 5',
    subtitle: 'Máxima barrera antiaérea naval alrededor de HMS Exeter en alerta roja',
    bossKind: 'boss_destroyer',
    bossName: 'Destructor HMS Exeter (D89 · Tipo 42)',
    bossClass: 'DESTRUCTOR TIPO 42 LOTE 2 · RADAR TIPO 1022',
    bossGreeting: '«¡HMS Exeter bloqueando el último corredor hacia Puerto Argentino! ¡Misiles Sea Dart en máxima cadencia!»',
    bossWeapons: [
      'Salvas Triples de Misiles Sea Dart Mejorados',
      'Radar Digital Tipo 1022 + Pieza 114mm Mk.8',
      'Escolta Aérea Doble de Cazas Sea Harrier',
    ],
    theme: {
      oceanBase: '#0A1934',
      oceanDeep: 'rgba(5, 10, 24, 0.50)',
      oceanLight: 'rgba(30, 58, 138, 0.26)',
      swellColor: 'rgba(252, 165, 165, 0.30)',
      atmosphereTint: 'rgba(153, 27, 27, 0.08)',
    },
    enemyRoster: ['type42_destroyer', 'vulcan', 'rapier_sam', 'sea_harrier', 'radar_bunker', 'type21_frigate'],
  },
  {
    // Nivel 20: Azul prusiano austral heroico
    title: 'DEFIENDE AL CRUCERO GENERAL BELGRANO',
    sector: 'Misión 20 · Atlántico Sur · 2 de Mayo de 1982 (ARA C-4)',
    subtitle: 'Protege al crucero argentino junto a Bouchard y Piedrabuena, hunde al HMS Invincible',
    bossKind: 'boss_carrier',
    bossName: 'Portaaviones HMS Invincible (R05)',
    bossClass: 'PORTAAVIONES DE FLOTA CLASE INVINCIBLE · TASK FORCE 317',
    bossGreeting: '«¡Aquí HMS Invincible! Toda la Fuerza de Tareas 317 converge para destruirte. ¡Sea Dart y ala aérea al ataque!»',
    bossWeapons: [
      'Lanzador Doble de Misiles Sea Dart de Alto Poder',
      'Anillos Flak Antiaéreos de 360° y Fuego Predictivo',
      'Ala Embarcada Sea Harrier en Formación de Cerco',
    ],
    theme: {
      oceanBase: '#06264B',
      oceanDeep: 'rgba(3, 15, 34, 0.48)',
      oceanLight: 'rgba(14, 116, 144, 0.30)',
      swellColor: 'rgba(253, 224, 71, 0.38)',
      atmosphereTint: 'rgba(2, 132, 199, 0.07)',
    },
    enemyRoster: ['type42_destroyer', 'sea_harrier', 'vulcan', 'sir_galahad', 'type21_frigate', 'supply_tanker', 'sea_harrier'],
  },
];

export function getLevelTheme(levelNumber: number): LevelTheme {
  const idx = Math.max(0, Math.min(LEVEL_BLUEPRINTS.length - 1, levelNumber - 1));
  return LEVEL_BLUEPRINTS[idx].theme;
}

function isSurfaceShipKind(kind: EnemyKind): boolean {
  return (
    kind === 'patrol_boat' ||
    kind === 'minesweeper' ||
    kind === 'corvette' ||
    kind === 'type21_frigate' ||
    kind === 'type42_destroyer' ||
    kind === 'sir_galahad' ||
    kind === 'supply_tanker'
  );
}

function isGroundKind(kind: EnemyKind): boolean {
  return kind === 'bofors_aa' || kind === 'rapier_sam' || kind === 'radar_bunker';
}

function isAirKind(kind: EnemyKind): boolean {
  return (
    kind === 'lynx' ||
    kind === 'sea_king' ||
    kind === 'sea_harrier' ||
    kind === 'vulcan'
  );
}

function pickFormationXRatio(beatIdx: number, level: number): number {
  const lanes = [0.22, 0.78, 0.5, 0.34, 0.66, 0.26, 0.74, 0.42, 0.58];
  return lanes[(beatIdx + level) % lanes.length];
}

function buildWaveEvents(levelIndex: number, bp: LevelBlueprint): WaveSpawnEvent[] {
  const level = levelIndex + 1;
  const events: WaveSpawnEvent[] = [];

  // 100% longer missions (2x duration & tactical waves compared to original 13..26 beats!)
  const baseBeats = 13 + Math.min(13, Math.floor(level * 0.7));
  const totalBeats = baseBeats * 2;
  const spacing = Math.max(0.76, 1.14 - level * 0.018);

  const landUnits = bp.enemyRoster.filter((k) => isGroundKind(k));
  const airUnits = bp.enemyRoster.filter((k) => isAirKind(k));
  const shipUnits = bp.enemyRoster.filter((k) => isSurfaceShipKind(k));

  const effectiveAir: EnemyKind[] =
    airUnits.length > 0 ? airUnits : ['sea_harrier', 'lynx', 'sea_king'];
  const effectiveLand: EnemyKind[] =
    landUnits.length > 0 ? landUnits : ['bofors_aa'];
  const effectiveShips: EnemyKind[] =
    shipUnits.length > 0 ? shipUnits : ['patrol_boat', 'corvette'];

  const bossIsSurface =
    bp.bossKind === 'boss_frigate' ||
    bp.bossKind === 'boss_assault' ||
    bp.bossKind === 'boss_destroyer' ||
    bp.bossKind === 'boss_carrier';

  const powerUps: PowerUpKind[] = [
    'cannon',
    'exocet',
    'bomb',
    'repair',
    'rapid_fire',
    'shield',
    'cluster_bomb',
    'medal',
  ];

  // Divide the 100%-longer mission into 4 tactical chapters preserving strict land vs. sea separation:
  // Chapter 1 (0..22%): Coastal / Overland Approach (ground AA + organized helo/fighter pincers)
  // Chapter 2 (22..50%): First Open-Sea Vanguard Fleet (naval escorts + air cap)
  // Chapter 3 (50..72%): Deep Inland Perimeter / Air Intercept (radar/Rapier + V-formations)
  // Chapter 4 (72..100%): Main Royal Navy Task Force Screen before Boss
  const ch1End = Math.floor(totalBeats * 0.22);
  const ch2End = Math.floor(totalBeats * 0.50);
  const ch3End = Math.floor(totalBeats * 0.72);

  let t = 0.7;
  for (let i = 0; i < totalBeats; i++) {
    const inOverland = i < ch1End || (i >= ch2End && i < ch3End);
    let kind: EnemyKind;
    let tactic: EnemyTactic = 'standard';

    if (inOverland) {
      if (landUnits.length > 0 && i % 2 === 0) {
        kind = effectiveLand[(Math.floor(i / 2) + level) % effectiveLand.length];
        tactic = 'standard';
      } else {
        kind = effectiveAir[(i + level) % effectiveAir.length];
        tactic =
          kind === 'sea_harrier'
            ? 'intercept_track'
            : kind === 'lynx' || kind === 'sea_king'
              ? 'flank_hover'
              : 'standard';
      }
    } else {
      if (i % 3 === 1 && level >= 2) {
        kind = effectiveAir[(i + level) % effectiveAir.length];
        tactic = kind === 'sea_harrier' ? 'intercept_track' : 'flank_hover';
      } else {
        kind = effectiveShips[(i + level) % effectiveShips.length];
        tactic = 'escort_wall';
      }
    }

    const groundUnit = isGroundKind(kind);
    const xRatio = groundUnit ? (i % 2 === 0 ? 0.23 : 0.77) : pickFormationXRatio(i, level);

    let drop: PowerUpKind | null = null;
    if (i === 2 || i === Math.floor(totalBeats * 0.52)) drop = 'cannon';
    else if (i === 6 || i === Math.floor(totalBeats * 0.74)) drop = 'exocet';
    else if (i === totalBeats - 1 || i === Math.floor(totalBeats * 0.45))
      drop = level % 2 === 0 ? 'repair' : 'bomb';
    else if (i % 5 === 4) drop = powerUps[(i + level) % powerUps.length];

    events.push({
      time: Number(t.toFixed(2)),
      kind,
      xRatio,
      dropPowerUp: drop,
      tactic,
      tacticSlot: i % 3,
    });

    // Organized Squadron & Fleet Formations (Zero random stragglers!)
    if (groundUnit) {
      // Tactical pincer helicopters or fighter pair defending the land battery
      events.push({
        time: Number((t + 0.22).toFixed(2)),
        kind: level >= 5 && i % 4 === 0 ? 'sea_harrier' : 'lynx',
        xRatio: 0.16,
        dropPowerUp: null,
        tactic: 'pincer_left',
        tacticSlot: 0,
      });
      events.push({
        time: Number((t + 0.22).toFixed(2)),
        kind: level >= 5 && i % 4 === 0 ? 'sea_harrier' : 'sea_king',
        xRatio: 0.84,
        dropPowerUp: null,
        tactic: 'pincer_right',
        tacticSlot: 1,
      });
    } else if (kind === 'sea_harrier') {
      // Classic 3-ship V-Wedge Interceptor Squadron tracking the player
      events.push({
        time: Number((t + 0.16).toFixed(2)),
        kind: 'sea_harrier',
        xRatio: Math.max(0.14, xRatio - 0.17),
        dropPowerUp: null,
        tactic: 'v_wing_left',
        tacticSlot: 1,
      });
      events.push({
        time: Number((t + 0.16).toFixed(2)),
        kind: 'sea_harrier',
        xRatio: Math.min(0.86, xRatio + 0.17),
        dropPowerUp: i % 6 === 0 ? 'rapid_fire' : null,
        tactic: 'v_wing_right',
        tacticSlot: 2,
      });
    } else if ((kind === 'lynx' || kind === 'sea_king') && i % 2 === 1) {
      // Coordinated flanking gunship pair locking both lanes
      events.push({
        time: Number((t + 0.2).toFixed(2)),
        kind,
        xRatio: Math.min(0.84, Math.max(0.16, 1 - xRatio)),
        dropPowerUp: null,
        tactic: xRatio < 0.5 ? 'pincer_right' : 'pincer_left',
        tacticSlot: 1,
      });
    } else if (kind === 'patrol_boat' || kind === 'minesweeper') {
      // Line-abreast naval blockade pair
      if (i % 2 === 1) {
        events.push({
          time: Number((t + 0.26).toFixed(2)),
          kind,
          xRatio: xRatio < 0.5 ? Math.min(0.82, xRatio + 0.32) : Math.max(0.18, xRatio - 0.32),
          dropPowerUp: null,
          tactic: 'escort_wall',
          tacticSlot: 1,
        });
      }
    } else if ((kind === 'type21_frigate' || kind === 'corvette' || kind === 'type42_destroyer') && i % 3 === 0) {
      // Protected naval formation: capital warship + port/starboard gunboat escort
      events.push({
        time: Number((t + 0.32).toFixed(2)),
        kind: 'patrol_boat',
        xRatio: xRatio < 0.5 ? Math.min(0.84, xRatio + 0.25) : Math.max(0.16, xRatio - 0.25),
        dropPowerUp: 'medal',
        tactic: 'escort_wall',
        tacticSlot: 2,
      });
    }

    // Smooth open-water buffer whenever switching between overland/coastal chapters and open-sea fleet chapters
    if (i === ch1End - 1 || i === ch2End - 1 || i === ch3End - 1) {
      t += spacing + 1.55;
    } else {
      t += spacing;
    }
  }

  // Boss arrives after the full 2x extended mission concludes
  events.push({
    time: Number((t + (bossIsSurface ? 1.65 : 1.35)).toFixed(2)),
    kind: bp.bossKind,
    xRatio: 0.5,
    dropPowerUp: level % 3 === 0 ? 'cannon' : 'exocet',
    customLabel: bp.bossName,
    tactic: 'boss_tactical',
    tacticSlot: 0,
  });

  return events;
}

export const CAMPAIGN_WAVES: WaveConfig[] = LEVEL_BLUEPRINTS.map((bp, idx) => {
  const level = idx + 1;
  return {
    number: level,
    title: bp.title,
    sector: bp.sector,
    subtitle: bp.subtitle,
    // Progressive campaign escalation from 1.00 (Lvl 1) up to 3.66 (Lvl 20)
    difficultyScale: Number((1 + idx * 0.14).toFixed(2)),
    bossKind: bp.bossKind,
    bossName: bp.bossName,
    bossClass: bp.bossClass,
    bossGreeting: bp.bossGreeting,
    bossWeapons: bp.bossWeapons,
    theme: bp.theme,
    events: buildWaveEvents(idx, bp),
  };
});
