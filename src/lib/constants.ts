
import { Game } from '../types';

export const SITIOS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=1753638195&single=true&output=csv'; 
export const AREAS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=980501442&single=true&output=csv'; 
export const CONFIG_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=2102419216&single=true&output=csv'; 
export const RESULTS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz_placeholder/exec'; // This should be the client's Apps Script URL
export const CAZADOR_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=123456789&single=true&output=csv'; 
export const RESOLVE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=1792989854&single=true&output=csv';

export const CAZADOR_FALLBACK = [
  {
    id: 'f1',
    escena: 'Planta Industrial',
    imagen_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200',
    peligros: [
      { id: 1, peligro: 'Derrame de Aceite', x: 400, y: 300, radio: 40, medida: 'Limpieza inmediata y señalización', norma: 'ISO 45001' },
      { id: 2, peligro: 'Cable Expuesto', x: 200, y: 150, radio: 30, medida: 'Aislamiento y reparación', norma: 'NFPA 70E' }
    ]
  }
];

export const RESOLVE_FALLBACK = [
  {
    id: '1',
    titulo: 'Guarda de prensa retirada',
    descripcion: 'Al iniciar el turno, notás que la guarda de seguridad de la prensa hidráulica no está colocada.',
    imagen_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    pasos_correctos: ['Falta de protección mecánica', 'Riesgo de atrapamiento por partes móviles', 'Bloquear equipo y reportar a mantenimiento', 'Verificar que la guarda esté instalada y el sensor activo'],
    opciones: [
      ['Falta de protección mecánica', 'Desorden en el área', 'Falta de iluminación'],
      ['Riesgo de atrapamiento por partes móviles', 'Riesgo de caída al mismo nivel', 'Riesgo eléctrico'],
      ['Bloquear equipo y reportar a mantenimiento', 'Seguir operando con cuidado', 'Buscar la guarda por la planta'],
      ['Verificar que la guarda esté instalada y el sensor activo', 'Limpiar la máquina', 'Firmar el registro de producción']
    ],
    aprendizaje: 'Nunca operes sin protecciones. El bloqueo es vital.',
    dificultad: 'Media'
  },
  {
    id: '2',
    titulo: 'Derrame de aceite en pasillo',
    descripcion: 'Se detecta una mancha de aceite importante en el pasillo principal de logística.',
    imagen_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    pasos_correctos: ['Condición insegura: Superficie resbaladiza', 'Riesgo de caída al mismo nivel', 'Delimitar zona y usar kit antiderrames', 'Confirmar que el piso esté seco y limpio'],
    opciones: [
      ['Condición insegura: Superficie resbaladiza', 'Falta de EPP', 'Ruido excesivo'],
      ['Riesgo de caída al mismo nivel', 'Riesgo de incendio', 'Riesgo de corte'],
      ['Delimitar zona y usar kit antiderrames', 'Poner un cartón encima', 'Esperar al turno de limpieza'],
      ['Confirmar que el piso esté seco y limpio', 'Seguir caminando', 'Avisar por radio']
    ],
    aprendizaje: 'La limpieza y el orden (5S) previenen la mayoría de los accidentes.',
    dificultad: 'Baja'
  },
  {
    id: '3',
    titulo: 'Uso incorrecto de autoelevador',
    descripcion: 'Un compañero circula con la carga elevada obstruyendo su visión.',
    imagen_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    pasos_correctos: ['Acto inseguro: Conducción temeraria', 'Riesgo de choque o vuelco', 'Intervenir con respeto y pedir bajar la carga', 'Asegurar que circule con carga baja y visión clara'],
    opciones: [
      ['Acto inseguro: Conducción temeraria', 'Falla mecánica', 'Carga mal estibada'],
      ['Riesgo de choque o vuelco', 'Riesgo de explosión', 'Riesgo ergonómico'],
      ['Intervenir con respeto y pedir bajar la carga', 'Sacar una foto de lejos', 'Ignorar si no es de mi área'],
      ['Asegurar que circule con carga baja y visión clara', 'Verificar el nivel de combustible', 'Controlar la velocidad']
    ],
    aprendizaje: 'La seguridad es responsabilidad de todos. Intervenir a tiempo salva vidas.',
    dificultad: 'Alta'
  },
  {
    id: '4',
    titulo: 'Ruido extraño en ventilador',
    descripcion: 'Un extractor de aire en el techo emite un chirrido metálico constante.',
    imagen_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    pasos_correctos: ['Falla potencial de rodamiento', 'Riesgo de rotura y proyección de partes', 'Informar a mantenimiento preventivo', 'Validar que el ruido desapareció tras la reparación'],
    opciones: [
      ['Falla potencial de rodamiento', 'Falta de limpieza', 'Uso de aire comprimido'],
      ['Riesgo de rotura y proyección de partes', 'Riesgo de sordera', 'Riesgo de incendio'],
      ['Informar a mantenimiento preventivo', 'Usar protectores auditivos', 'Subir el volumen de la música'],
      ['Validar que el ruido desapareció tras la reparación', 'Encender el equipo', 'Limpiar el área']
    ],
    aprendizaje: 'Escuchar a las máquinas es parte de la prevención.',
    dificultad: 'Media'
  },
  {
    id: '5',
    titulo: 'EPP dañado',
    descripcion: 'Tus guantes de protección contra cortes tienen un agujero en la palma.',
    imagen_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    pasos_correctos: ['EPP en mal estado', 'Riesgo de herida cortante', 'Solicitar cambio inmediato de guantes', 'Verificar que el nuevo EPP sea el adecuado'],
    opciones: [
      ['EPP en mal estado', 'Falta de capacitación', 'Herramienta defectuosa'],
      ['Riesgo de herida cortante', 'Riesgo de dermatitis', 'Riesgo de golpe'],
      ['Solicitar cambio inmediato de guantes', 'Poner cinta sobre el agujero', 'Usarlos al revés'],
      ['Verificar que el nuevo EPP sea el adecuado', 'Guardar los viejos', 'Seguir trabajando']
    ],
    aprendizaje: 'Tu EPP es tu última barrera de defensa. Mantenelo impecable.',
    dificultad: 'Baja'
  }
];

export const GAMES = [
  { id: 'truco', title: 'TRUCO SEGURO', subtitle: 'MISIÓN_01', icon: 'precision_manufacturing', active: true, color: 'bg-emerald-500', level: 'EXPERTO', stats: '42 VIC / 12 RGO', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800' },
  { id: 'match', title: 'CAZA DE RIESGOS', subtitle: 'MISIÓN_02', icon: 'visibility', active: true, color: 'bg-rose-500', level: 'PRINCIPIANTE', stats: '8 VIC / 5 RGO', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800' },
  { id: 'oca', title: 'LA OCA', subtitle: 'MISIÓN_03', icon: 'grid_view', active: true, color: 'bg-orange-500', level: 'INTERMEDIO', stats: '15 VIC / 3 RGO', img: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&q=80&w=800' },
  { id: 'carrera', title: 'CARRERA MENTE', subtitle: 'MISIÓN_04', icon: 'psychology', active: true, color: 'bg-blue-500', level: 'EXPERTO', stats: '22 VIC / 8 RGO', img: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=800' },
  { id: 'escape', title: 'ESCAPE ROOM', subtitle: 'MISIÓN_05', icon: 'lock_open', active: true, color: 'bg-amber-500', level: 'INTERMEDIO', stats: '10 VIC / 2 RGO', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800' },
  { id: 'memoria', title: 'MEMORY PREVENTIVO', subtitle: 'MISIÓN_06', icon: 'brain', active: true, color: 'bg-yellow-500', level: 'PRINCIPIANTE', stats: '30 VIC / 1 RGO', img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800' },
  { id: 'wordle', title: 'PREVENWORDLE', subtitle: 'MISIÓN_07', icon: 'spellcheck', active: true, color: 'bg-emerald-600', level: 'INTERMEDIO', stats: '12 VIC / 4 RGO', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800' },
  { id: 'jenga', title: 'JENGA SEGURO', subtitle: 'MISIÓN_08', icon: 'view_in_ar', active: true, color: 'bg-amber-600', level: 'EXPERTO', stats: '5 VIC / 0 RGO', img: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&q=80&w=800' },
  { id: 'decisiones', title: 'DECISIONES SEGURAS', subtitle: 'MISIÓN_09', icon: 'fact_check', active: true, color: 'bg-indigo-600', level: 'INTERMEDIO', stats: '0 VIC / 0 RGO', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800' },
  { id: 'espejo', title: 'EL ESPEJO DEL TURNO', subtitle: 'MISIÓN_10', icon: 'visibility', active: true, color: 'bg-purple-600', level: 'INTERMEDIO', stats: '0 VIC / 0 RGO', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800' },
  { id: 'resolve', title: 'RESOLVÉ EN EL PUESTO', subtitle: 'MISIÓN_13', icon: 'build', active: true, color: 'bg-blue-600', level: 'INTERMEDIO', stats: '0 VIC / 0 RGO', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800' },
];

export const DECK_BASE = [
  { id: 1, n: 1, s: 'Espadas', p: 14, l: 'Paro y\nPido Ayuda', e: '🛑', icon: 'swords', iconColor: 'text-blue-500' },
  { id: 2, n: 1, s: 'Bastos', p: 13, l: 'Reporto Cond.\nInseguras', e: '📢', icon: 'handyman', iconColor: 'text-emerald-500' },
  { id: 3, n: 7, s: 'Espadas', p: 12, l: 'Equipamiento\nSeguro', e: '🚧', icon: 'swords', iconColor: 'text-blue-500' },
  { id: 4, n: 7, s: 'Oros', p: 11, l: 'Engranaje de\nPrecisión', e: '⚙️', icon: 'token', iconColor: 'text-yellow-600' },
  { id: 5, n: 3, s: 'Espadas', p: 10, l: 'Cumplo\nEstándares', e: '📋', icon: 'swords', iconColor: 'text-blue-500' },
  { id: 6, n: 3, s: 'Bastos', p: 10, l: 'Madera\nLOTO-Locked', e: '🪵', icon: 'handyman', iconColor: 'text-emerald-800' },
  { id: 7, n: 3, s: 'Oros', p: 10, l: 'Cumplo\nEstándares', e: '📋', icon: 'token', iconColor: 'text-yellow-600' },
  { id: 8, n: 3, s: 'Copas', p: 10, l: 'Cumplo\nEstándares', e: '📋', icon: 'wine_bar', iconColor: 'text-orange-600' },
  { id: 9, n: 2, s: 'Espadas', p: 9, l: 'Uso Correcto\nde EPP', e: '🦺', icon: 'swords', iconColor: 'text-blue-500' },
  { id: 10, n: 2, s: 'Bastos', p: 9, l: 'Uso Correcto\nde EPP', e: '🦺', icon: 'handyman', iconColor: 'text-emerald-500' },
  { id: 11, n: 2, s: 'Oros', p: 9, l: 'Uso Correcto\nde EPP', e: '🦺', icon: 'token', iconColor: 'text-yellow-500' },
  { id: 12, n: 2, s: 'Copas', p: 9, l: 'Uso Correcto\nde EPP', e: '🦺', icon: 'wine_bar', iconColor: 'text-orange-500' },
  { id: 13, n: 1, s: 'Copas', p: 8, l: 'Gemba y\nAuditorías', e: '🔍', icon: 'wine_bar', iconColor: 'text-orange-500' },
  { id: 14, n: 1, s: 'Oros', p: 8, l: 'Gemba y\nAuditorías', e: '🔍', icon: 'token', iconColor: 'text-yellow-500' },
  { id: 15, n: 12, s: 'Espadas', p: 7, l: 'Estándares\na Medias', e: '⚠️', icon: 'swords', iconColor: 'text-blue-400' },
  { id: 16, n: 12, s: 'Bastos', p: 7, l: 'Estándares\na Medias', e: '⚠️', icon: 'handyman', iconColor: 'text-emerald-400' },
  { id: 17, n: 12, s: 'Oros', p: 7, l: 'Estándares\na Medias', e: '⚠️', icon: 'token', iconColor: 'text-yellow-400' },
  { id: 18, n: 12, s: 'Copas', p: 7, l: 'Chaleco\nAlta-Vis', e: '🚨', icon: 'wine_bar', iconColor: 'text-orange-600' },
  { id: 19, n: 11, s: 'Espadas', p: 6, l: 'Estándares\na Medias', e: '⚠️', icon: 'swords', iconColor: 'text-blue-400' },
  { id: 20, n: 11, s: 'Bastos', p: 6, l: 'Estándares\na Medias', e: '⚠️', icon: 'handyman', iconColor: 'text-emerald-400' },
  { id: 21, n: 11, s: 'Oros', p: 6, l: 'Estándares\na Medias', e: '⚠️', icon: 'token', iconColor: 'text-yellow-400' },
  { id: 22, n: 11, s: 'Copas', p: 6, l: 'Estándares\na Medias', e: '⚠️', icon: 'wine_bar', iconColor: 'text-orange-400' },
  { id: 23, n: 10, s: 'Espadas', p: 5, l: 'Estándares\na Medias', e: '⚠️', icon: 'swords', iconColor: 'text-blue-400' },
  { id: 24, n: 10, s: 'Bastos', p: 5, l: 'Estándares\na Medias', e: '⚠️', icon: 'handyman', iconColor: 'text-emerald-400' },
  { id: 25, n: 10, s: 'Oros', p: 5, l: 'Estándares\na Medias', e: '⚠️', icon: 'token', iconColor: 'text-yellow-400' },
  { id: 26, n: 10, s: 'Copas', p: 5, l: 'Estándares\na Medias', e: '⚠️', icon: 'wine_bar', iconColor: 'text-orange-400' },
  { id: 27, n: 7, s: 'Copas', p: 4, l: 'Estándares\na Medias', e: '⚠️', icon: 'wine_bar', iconColor: 'text-orange-400' },
  { id: 28, n: 7, s: 'Bastos', p: 4, l: 'Estándares\na Medias', e: '⚠️', icon: 'handyman', iconColor: 'text-emerald-400' },
  { id: 29, n: 6, s: 'Espadas', p: 3, l: 'Acto\nInseguro', e: '❌', icon: 'swords', iconColor: 'text-blue-500' },
  { id: 30, n: 6, s: 'Bastos', p: 3, l: 'Acto\nInseguro', e: '❌', icon: 'handyman', iconColor: 'text-emerald-500' },
  { id: 31, n: 6, s: 'Oros', p: 3, l: 'Acto\nInseguro', e: '❌', icon: 'token', iconColor: 'text-yellow-500' },
  { id: 32, n: 6, s: 'Copas', p: 3, l: 'Acto\nInseguro', e: '❌', icon: 'wine_bar', iconColor: 'text-orange-500' },
  { id: 33, n: 5, s: 'Espadas', p: 2, l: 'Acto\nInseguro', e: '❌', icon: 'swords', iconColor: 'text-blue-500' },
  { id: 34, n: 5, s: 'Bastos', p: 2, l: 'Acto\nInseguro', e: '❌', icon: 'handyman', iconColor: 'text-emerald-500' },
  { id: 35, n: 5, s: 'Oros', p: 2, l: 'Acto\nInseguro', e: '❌', icon: 'token', iconColor: 'text-yellow-500' },
  { id: 36, n: 5, s: 'Copas', p: 2, l: 'Acto\nInseguro', e: '❌', icon: 'wine_bar', iconColor: 'text-orange-500' },
  { id: 37, n: 4, s: 'Espadas', p: 1, l: 'Acto\nInseguro', e: '❌', icon: 'swords', iconColor: 'text-blue-500' },
  { id: 38, n: 4, s: 'Bastos', p: 1, l: 'Acto\nInseguro', e: '❌', icon: 'handyman', iconColor: 'text-emerald-500' },
  { id: 39, n: 4, s: 'Oros', p: 1, l: 'Acto\nInseguro', e: '❌', icon: 'token', iconColor: 'text-yellow-500' },
  { id: 40, n: 4, s: 'Copas', p: 1, l: 'Acto\nInseguro', e: '❌', icon: 'wine_bar', iconColor: 'text-orange-500' },
];

export const MISSIONS_OF_THE_WEEK = [
  { id: 'm1', title: 'INSPECTOR NOVATO', desc: 'Completá 3 misiones diferentes.', target: 3, xp: 500, icon: 'verified' },
  { id: 'm2', title: 'MAESTRO DEL ORDEN', desc: 'Lográ un puntaje perfecto en 2 misiones.', target: 2, xp: 750, icon: 'pending' },
  { id: 'm3', title: 'PERSISTENCIA EHS', desc: 'Jugá un total de 10 misiones.', target: 10, xp: 1200, icon: 'lock' },
];

export const GAMES_ENHANCED: Game[] = [
  { 
    id: 'truco', 
    title: 'TRUCO SEGURO', 
    subtitle: 'MISIÓN_01', 
    icon: 'precision_manufacturing', 
    active: true, 
    color: 'bg-emerald-500', 
    level: 'EXPERTO', 
    stats: '42 VIC / 12 RGO', 
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    desc: 'Un duelo de cartas donde la estrategia y el conocimiento de seguridad son tus mejores aliados.',
    obj: 'Superar al bot EHS aplicando las mejores medidas de control preventivo.',
    rules: [
      'Se juega con un mazo de cartas de seguridad industrial.',
      'Cada carta tiene un nivel de "Control" (Poder).',
      'Gana la vuelta quien tire la carta con mayor efectividad de control.',
      'Puedes "Intervenir" (Truco) para aumentar el valor de la mano.',
      'Gana la partida quien llegue primero a 15 puntos.'
    ]
  },
  { 
    id: 'match', 
    title: 'CAZA DE RIESGOS', 
    subtitle: 'MISIÓN_02', 
    icon: 'visibility', 
    active: true, 
    color: 'bg-rose-500', 
    level: 'PRINCIPIANTE', 
    stats: '8 VIC / 5 RGO', 
    img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    desc: 'Encuentra y asocia los riesgos con sus respectivas medidas de mitigación.',
    obj: 'Identificar correctamente todos los pares de riesgo-control en el menor tiempo posible.',
    rules: [
      'Haz clic en una tarjeta de riesgo para ver su descripción.',
      'Busca la tarjeta de mitigación que corresponda a ese riesgo.',
      'Si coinciden, el riesgo queda mitigado.',
      'El juego termina cuando todos los riesgos han sido controlados.'
    ]
  },
  { 
    id: 'oca', 
    title: 'LA OCA', 
    subtitle: 'MISIÓN_03', 
    icon: 'grid_view', 
    active: true, 
    color: 'bg-orange-500', 
    level: 'INTERMEDIO', 
    stats: '15 VIC / 3 RGO', 
    img: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&q=80&w=800',
    desc: 'Recorre la planta industrial enfrentando desafíos y validando protocolos.',
    obj: 'Llegar a la meta superando los obstáculos de seguridad en el camino.',
    rules: [
      'Lanza los dados para avanzar por el tablero.',
      'Ciertas casillas activan eventos de seguridad o preguntas.',
      'Responder correctamente te permite seguir avanzando.',
      'Evita las casillas de "Accidente" que te retrasarán.'
    ]
  },
  { 
    id: 'carrera', 
    title: 'CARRERA MENTE', 
    subtitle: 'MISIÓN_04', 
    icon: 'psychology', 
    active: true, 
    color: 'bg-blue-500', 
    level: 'EXPERTO', 
    stats: '22 VIC / 8 RGO', 
    img: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=800',
    desc: 'Pon a prueba tus conocimientos teóricos sobre normativas y estándares de seguridad.',
    obj: 'Responder correctamente la mayor cantidad de preguntas técnicas.',
    rules: [
      'Se te presentarán preguntas de opción múltiple.',
      'Tienes un tiempo limitado para responder cada una.',
      'Las respuestas correctas suman puntos y validan tu competencia.',
      'Tres errores consecutivos terminan la evaluación.'
    ]
  },
  { 
    id: 'escape', 
    title: 'ESCAPE ROOM', 
    subtitle: 'MISIÓN_05', 
    icon: 'lock_open', 
    active: true, 
    color: 'bg-amber-500', 
    level: 'INTERMEDIO', 
    stats: '10 VIC / 2 RGO', 
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    desc: 'Estás atrapado en un sector crítico. Solo el cumplimiento de protocolos te permitirá salir.',
    obj: 'Resolver los acertijos de seguridad para desbloquear la salida.',
    rules: [
      'Inspecciona los elementos del entorno.',
      'Encuentra códigos y llaves basados en señales de seguridad.',
      'Sigue las instrucciones de emergencia para avanzar.',
      'Debes salir antes de que se agote el tiempo de oxígeno/energía.'
    ]
  },
  { 
    id: 'memoria', 
    title: 'MEMORY PREVENTIVO', 
    subtitle: 'MISIÓN_06', 
    icon: 'memory', 
    active: true, 
    color: 'bg-purple-500', 
    level: 'PRINCIPIANTE', 
    stats: '18 VIC / 4 RGO', 
    img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
    desc: 'Entrena tu memoria visual para recordar la ubicación de elementos de seguridad críticos.',
    obj: 'Encontrar todos los pares de elementos de seguridad en el menor tiempo.',
    rules: [
      'Gira las cartas para revelar los iconos de seguridad.',
      'Memoriza la posición de cada elemento.',
      'Forma parejas idénticas para despejar el tablero.',
      'Completa el desafío antes de que el tiempo se agote.'
    ]
  },
  { 
    id: 'wordle', 
    title: 'PREVENWORDLE', 
    subtitle: 'MISIÓN_07', 
    icon: 'spellcheck', 
    active: true, 
    color: 'bg-emerald-600', 
    level: 'INTERMEDIO', 
    stats: '12 VIC / 4 RGO', 
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    desc: 'Descifra la palabra clave de seguridad del día utilizando pistas técnicas.',
    obj: 'Adivinar la palabra oculta relacionada con EHS en 6 intentos.',
    rules: [
      'Escribe una palabra de seguridad del largo indicado en la cuadrícula.',
      'Verde: La letra está en la palabra y en la posición correcta.',
      'Amarillo: La letra está en la palabra pero en otra posición.',
      'Gris: La letra no forma parte de la palabra.',
      'Pista: Puedes activar la definición técnica si necesitas ayuda.'
    ]
  },
  { 
    id: 'jenga', 
    title: 'JENGA SEGURO', 
    subtitle: 'MISIÓN_08', 
    icon: 'view_in_ar', 
    active: true, 
    color: 'bg-amber-600', 
    level: 'EXPERTO', 
    stats: '5 VIC / 0 RGO', 
    img: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&q=80&w=800',
    desc: 'Mantén la estabilidad de la estructura industrial retirando piezas críticas.',
    obj: 'Retirar bloques sin que la torre (el sistema) colapse.',
    rules: [
      'Selecciona un bloque para retirarlo de la torre.',
      'Cada bloque representa un proceso o control.',
      'Si la torre cae, se produce un colapso del sistema.',
      'Ganas puntos por cada retiro exitoso y seguro.'
    ]
  },
  { 
    id: 'decisiones', 
    title: 'DECISIONES SEGURAS', 
    subtitle: 'MISIÓN_09', 
    icon: 'alt_route', 
    active: true, 
    color: 'bg-cyan-500', 
    level: 'INTERMEDIO', 
    stats: '14 VIC / 6 RGO', 
    img: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&q=80&w=800',
    desc: 'Enfréntate a dilemas éticos y operativos donde cada decisión impacta en la seguridad del equipo.',
    obj: 'Tomar las decisiones más seguras para completar la jornada sin incidentes.',
    rules: [
      'Se te presentarán situaciones críticas de planta.',
      'Elige entre dos o más cursos de acción.',
      'Cada elección tiene consecuencias en el nivel de riesgo.',
      'Llega al final del turno con el indicador de riesgo en verde.'
    ]
  },
  { 
    id: 'espejo', 
    title: 'EL ESPEJO DEL TURNO', 
    subtitle: 'MISIÓN_10', 
    icon: 'auto_awesome', 
    active: true, 
    color: 'bg-indigo-500', 
    level: 'PRINCIPIANTE', 
    stats: '20 VIC / 1 RGO', 
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    desc: 'Refleja las mejores prácticas de seguridad identificando comportamientos seguros e inseguros.',
    obj: 'Validar comportamientos seguros en una serie de escenarios visuales.',
    rules: [
      'Observa la escena industrial presentada.',
      'Identifica rápidamente los actos inseguros.',
      'Propón la corrección inmediata para cada riesgo.',
      'Acumula puntos por cada detección correcta y rápida.'
    ]
  },
  { 
    id: 'pare', 
    title: 'PARE Y PIDA AYUDA', 
    subtitle: 'MISIÓN_11', 
    icon: 'pan_tool', 
    active: true, 
    color: 'bg-red-600', 
    level: 'INTERMEDIO', 
    stats: '12 VIC / 2 RGO', 
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    desc: 'Simulador de situaciones críticas con narrativa ramificada. El foco es la reflexión y el aprendizaje.',
    obj: 'Tomar las decisiones correctas ante escenarios de alto riesgo.',
    rules: [
      'Seleccioná una historia de la lista.',
      'Leé atentamente la situación planteada.',
      'Elegí una de las opciones disponibles.',
      'Observá las consecuencias de tus actos y aprendé de ellas.'
    ]
  },
  { 
    id: 'protocolo', 
    title: 'PROTOCOLO DE EMERGENCIA', 
    subtitle: 'MISIÓN_12', 
    icon: 'shield_alert', 
    active: true, 
    color: 'bg-red-700', 
    level: 'EXPERTO', 
    stats: '8 VIC / 1 RGO', 
    img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    desc: 'Ordená los pasos de respuesta ante emergencias bajo presión de tiempo.',
    obj: 'Validar la secuencia correcta del protocolo de seguridad.',
    rules: [
      'Seleccioná el tipo de emergencia.',
      'Arrastrá los pasos para ordenarlos correctamente.',
      'Verificá antes de que se agote el tiempo.',
      'Los aciertos y el tiempo restante suman puntos.'
    ]
  },
  { 
    id: 'resolve', 
    title: 'RESOLVÉ EN EL PUESTO', 
    subtitle: 'MISIÓN_13', 
    icon: 'build', 
    active: true, 
    color: 'bg-teal-500', 
    level: 'EXPERTO', 
    stats: '30 VIC / 5 RGO', 
    img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800',
    desc: 'Soluciona problemas técnicos de seguridad directamente en el puesto de trabajo.',
    obj: 'Aplicar controles de ingeniería y administrativos para resolver fallas de seguridad.',
    rules: [
      'Se detecta una anomalía en un equipo o proceso.',
      'Selecciona las herramientas y EPP adecuados.',
      'Aplica el protocolo de bloqueo y etiquetado (LOTO).',
      'Restaura la operación segura en el menor tiempo posible.'
    ]
  }
];
