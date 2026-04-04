
import { Game } from './types';

export const ESCAPE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=833467272&single=true&output=csv';

export const ESCAPE_FALLBACK = [
  { etapa: 1, tipo: 'evidencia', texto: 'Arnés de seguridad con fecha de inspección vencida', es_correcto: 'SI', pista: 'Revisa las etiquetas de los equipos.', explicacion: 'El equipo no estaba apto para el uso.' },
  { etapa: 1, tipo: 'evidencia', texto: 'Andamio sin barandas perimetrales completas', es_correcto: 'SI', pista: 'Mira la estructura de trabajo.', explicacion: 'Falta de protección colectiva básica.' },
  { etapa: 1, tipo: 'evidencia', texto: 'Falta de permiso de trabajo en altura firmado', es_correcto: 'SI', pista: 'Busca la documentación administrativa.', explicacion: 'No se evaluaron los riesgos antes de iniciar.' },
  { etapa: 1, tipo: 'evidencia', texto: 'Casco de seguridad con barbijo colocado', es_correcto: 'NO', pista: '¿Esto es un problema?', explicacion: 'El casco estaba bien utilizado, no es evidencia de falla.' },
  { etapa: 1, tipo: 'evidencia', texto: 'Botiquín de primeros auxilios completo', es_correcto: 'NO', pista: '¿Influye en la caída?', explicacion: 'Es una medida de respuesta, no causa del accidente.' },
  { etapa: 2, tipo: 'testigo', texto: '"El operario estaba usando su arnés enganchado a la línea de vida"', es_correcto: 'SI', pista: 'Compara con la evidencia del arnés roto.', explicacion: 'Inconsistencia: El arnés se encontró en el suelo sin rastros de tensión.' },
  { etapa: 2, tipo: 'testigo', texto: '"Habíamos realizado la charla de 5 minutos esa mañana"', es_correcto: 'SI', pista: 'Revisa el registro de firmas.', explicacion: 'Inconsistencia: No existe registro de charla para esa fecha.' },
  { etapa: 2, tipo: 'testigo', texto: '"La supervisión estuvo presente durante toda la maniobra"', es_correcto: 'SI', pista: '¿Dónde estaba el capataz?', explicacion: 'Inconsistencia: El capataz estaba en el obrador al momento del suceso.' },
  { etapa: 2, tipo: 'testigo', texto: '"El clima estaba despejado y sin viento"', es_correcto: 'NO', pista: '¿El clima fue factor?', explicacion: 'Esto coincide con el reporte meteorológico.' },
  { etapa: 3, tipo: 'causa_inmediata', texto: 'Uso de equipo defectuoso', es_correcto: 'SI', pista: 'Actos o condiciones inseguras.', explicacion: 'Causa Inmediata: Condición peligrosa directa.' },
  { etapa: 3, tipo: 'causa_basica', texto: 'Falta de programa de mantenimiento', es_correcto: 'SI', pista: 'Factores personales o de trabajo.', explicacion: 'Causa Básica: Falla en el sistema de gestión.' },
  { etapa: 4, tipo: 'porque', texto: '¿Por qué cayó? Porque falló el punto de anclaje.', es_correcto: 'SI', pista: 'Sigue la cadena lógica.', explicacion: 'Paso 1: La falla física.' },
  { etapa: 5, tipo: 'medida', texto: 'Implementar software de gestión de activos', es_correcto: 'SI', pista: 'Control administrativo y técnico.', explicacion: 'Asegura trazabilidad de inspecciones.' },
  { etapa: 5, tipo: 'medida', texto: 'Sancionar al operario accidentado', es_correcto: 'NO', pista: '¿Esto previene futuros casos?', explicacion: 'La sanción no ataca la causa raíz sistémica.' }
];

export const WORDLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=392450905&single=true&output=csv';

export const WORDLE_FALLBACK = [
  { palabra: 'ARNES', definicion: 'EPP obligatorio para trabajos en altura que detiene la caída libre.', categoria: 'EPP', dificultad: 'Básico', referencia: 'Res. SRT 35/98' },
  { palabra: 'CASCO', definicion: 'Elemento de protección personal que protege la cabeza de impactos.', categoria: 'EPP', dificultad: 'Básico', referencia: 'IRAM 3620' },
  { palabra: 'RUIDO', definicion: 'Contaminante físico medido en decibeles que puede causar hipoacusia.', categoria: 'Higiene', dificultad: 'Básico', referencia: 'Dec. 351/79 Anexo V' },
  { palabra: 'POLVO', definicion: 'Contaminante particulado que puede causar enfermedades respiratorias.', categoria: 'Higiene', dificultad: 'Medio', referencia: 'Dec. 351/79' },
  { palabra: 'LOTO', definicion: 'Procedimiento de bloqueo y etiquetado de energías peligrosas.', categoria: 'Legislación', dificultad: 'Medio', referencia: 'IRAM 3625' },
  { palabra: 'NORMA', definicion: 'Documento técnico que establece requisitos mínimos obligatorios.', categoria: 'Legislación', dificultad: 'Básico', referencia: '-' },
  { palabra: 'TRAMO', definicion: 'Sector de una obra o instalación delimitado para la gestión.', categoria: 'Legislación', dificultad: 'Experto', referencia: 'Res. SRT 51/97' },
  { palabra: 'SIPSA', definicion: 'Sistema de Información sobre Prevención y Seguridad en el Trabajo.', categoria: 'Legislación', dificultad: 'Experto', referencia: '-' },
  { palabra: 'OHSAS', definicion: 'Estándar de gestión de seguridad laboral predecesor de ISO 45001.', categoria: 'Gestión', dificultad: 'Experto', referencia: 'OHSAS 18001' },
  { palabra: 'DOSIS', definicion: 'Cantidad de un agente físico o químico recibida por un trabajador.', categoria: 'Higiene', dificultad: 'Experto', referencia: 'Dec. 351/79' },
  { palabra: 'AUDIT', definicion: 'Proceso sistemático de evaluación del cumplimiento de un sistema.', categoria: 'Gestión', dificultad: 'Medio', referencia: 'ISO 45001' },
  { palabra: 'TURNO', definicion: 'Período de trabajo de un grupo de empleados en rotación.', categoria: 'Gestión', dificultad: 'Básico', referencia: '-' },
  { palabra: 'RIESGO', definicion: 'Posibilidad de que un peligro cause daño considerando probabilidad y consecuencia.', categoria: 'Gestión', dificultad: 'Básico', referencia: '-' },
  { palabra: 'ZONA', definicion: 'Área delimitada con características de riesgo definidas.', categoria: 'Señalética', dificultad: 'Básico', referencia: '-' },
  { palabra: 'ALERTA', definicion: 'Estado de advertencia activa ante una condición de riesgo inminente.', categoria: 'Emergencias', dificultad: 'Básico', referencia: '-' },
  { palabra: 'ESCAPE', definicion: 'Vía habilitada para la evacuación segura ante una emergencia.', categoria: 'Emergencias', dificultad: 'Básico', referencia: '-' },
  { palabra: 'BRIGADA', definicion: 'Grupo de trabajadores capacitados para actuar ante emergencias.', categoria: 'Emergencias', dificultad: 'Medio', referencia: 'Dec. 351/79' },
  { palabra: 'TRAUMA', definicion: 'Lesión física causada por un agente externo como impacto o caída.', categoria: 'Emergencias', dificultad: 'Medio', referencia: '-' },
  { palabra: 'SIRENA', definicion: 'Dispositivo sonoro de alerta que indica inicio de evacuación.', categoria: 'Emergencias', dificultad: 'Básico', referencia: '-' },
  { palabra: 'COTEP', definicion: 'Comité Técnico de Prevención, organismo de gestión mixta.', categoria: 'Legislación', dificultad: 'Experto', referencia: '-' },
  { palabra: 'ERGON', definicion: 'Disciplina que adapta el trabajo a las capacidades del trabajador.', categoria: 'Gestión', dificultad: 'Experto', referencia: 'Res. 295/03' },
  { palabra: 'ACIDO', definicion: 'Sustancia corrosiva de pH bajo que causa quemaduras químicas.', categoria: 'Químico', dificultad: 'Medio', referencia: 'GHS/SGA' },
  { palabra: 'VAPOR', definicion: 'Estado gaseoso de una sustancia que puede ser tóxico o inflamable.', categoria: 'Químico', dificultad: 'Medio', referencia: 'Dec. 351/79' },
  { palabra: 'VIBRA', definicion: 'Movimiento oscilatorio transmitido al cuerpo por herramientas.', categoria: 'Higiene', dificultad: 'Experto', referencia: 'Res. 295/03' },
  { palabra: 'LASER', definicion: 'Radiación óptica coherente que puede causar daño ocular grave.', categoria: 'Higiene', dificultad: 'Experto', referencia: 'Dec. 351/79' }
];

export const SITIOS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=1753638195&single=true&output=csv'; 
export const AREAS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=980501442&single=true&output=csv'; 
export const CONFIG_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=2102419216&single=true&output=csv'; 
export const CAZADOR_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=123456789&single=true&output=csv';
export const JENGA_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=1277101713&single=true&output=csv';
export const RESOLVE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=1792989854&single=true&output=csv';
export const OCA_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=0&single=true&output=csv';
export const MATCH_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=1194527809&single=true&output=csv';
export const CARRERA_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=373988263&single=true&output=csv';
export const DECISIONES_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=841550883&single=true&output=csv';
export const ESPEJO_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=1346735467&single=true&output=csv';
export const PARE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=1987480223&single=true&output=csv';
export const PROTOCOLO_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=2015417175&output=csv';
export const LOGS_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbw9PuaIDOyw6X3za0xGKzkK9CggUw_hs817ms18ZtpsPbBH16oF5ZGNg2mfHkuTgHqgzw/exec';
export const LOGS_READ_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=463017101&single=true&output=csv';
export const FEEDBACK_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=38170247&single=true&output=csv';

export const JENGA_FALLBACK = [
  { numero: 1, pregunta: "¿Cuál es el EPP básico para planta?", respuesta: "Casco, lentes, zapatos de seguridad y protección auditiva.", nivel: "Básico", categoria: "EPP", explicacion: "El EPP básico protege las partes más vulnerables del cuerpo en un entorno industrial estándar." },
  { numero: 2, pregunta: "¿Qué significa LOTO?", respuesta: "Lock Out - Tag Out (Bloqueo y Etiquetado).", nivel: "Medio", categoria: "Bloqueo", explicacion: "Es un procedimiento de seguridad para asegurar que las máquinas peligrosas se apaguen correctamente y no se vuelvan a encender antes de que se complete el trabajo de mantenimiento." },
  { numero: 3, pregunta: "¿Qué hacer ante un derrame químico?", respuesta: "Identificar, delimitar, informar y usar kit de derrames si se está capacitado.", nivel: "Experto", categoria: "Sustancias", explicacion: "La respuesta rápida y técnica evita la contaminación ambiental y lesiones al personal." }
];

export const OCA_FALLBACK = {
  riesgos: [6, 12, 19, 25, 31, 38, 44, 50, 56],
  barreras: [9, 15, 22, 29, 35, 42, 48, 55],
  trivias: [4, 10, 17, 24, 33, 40, 47, 53, 59],
  preguntas: [
    { sq: 6, tipo: 'riesgo', q: "¿Cuál es el color de seguridad para prohibición?", a: "Rojo. Retrocedés 3 casillas.", o: ["Rojo", "Azul", "Amarillo", "Verde"] },
    { sq: 12, tipo: 'riesgo', q: "¿Qué significa LOTO?", a: "Bloqueo y Etiquetado. Retrocedés 4 casillas.", o: ["Luz y Todo", "Bloqueo y Etiquetado", "Logística Total", "Lote de Obra"] },
    { sq: 9, tipo: 'barrera', q: "¿Cada cuánto se debe revisar un extintor?", a: "Mensualmente. Avanzás 3 casillas.", o: ["Cada 2 años", "Nunca", "Mensualmente", "Semanalmente"] },
    { sq: 15, tipo: 'barrera', q: "¿Qué EPP es vital para ruidos mayores a 85dB?", a: "Protección Auditiva. Avanzás 4 casillas.", o: ["Casco", "Guantes", "Protección Auditiva", "Lentes"] },
    { sq: 4, tipo: 'trivia', q: "¿Qué ley regula la HyS en Argentina?", a: "Ley 19.587", o: ["Ley 24.557", "Ley 19.587", "Ley de Contrato de Trabajo", "Ley 20.744"] }
  ]
};

export const MATCH_FALLBACK = [
  { riesgo: "Trabajo en Altura", medida: "Arnés de Seguridad", nivel: "easy", emoji_r: "🏗️", emoji_m: "🦺", exp: "El arnés previene caídas a distinto nivel." },
  { riesgo: "Riesgo Eléctrico", medida: "Bloqueo y Etiquetado", nivel: "easy", emoji_r: "⚡", emoji_m: "🔒", exp: "LOTO asegura que la energía esté controlada." },
  { riesgo: "Ruido Excesivo", medida: "Protectores Auditivos", nivel: "easy", emoji_r: "🔊", emoji_m: "🎧", exp: "La protección auditiva previene la hipoacusia." },
  { riesgo: "Sustancias Químicas", medida: "Ducha de Emergencia", nivel: "easy", emoji_r: "🧪", emoji_m: "🚿", exp: "Actuación inmediata ante salpicaduras." },
  { riesgo: "Espacio Confinado", medida: "Medición de Gases", nivel: "easy", emoji_r: "🕳️", emoji_m: "📊", exp: "Verificar atmósfera segura antes de entrar." },
  { riesgo: "Cargas Suspendidas", medida: "Delimitación de Área", nivel: "easy", emoji_r: "🏗️", emoji_m: "🚧", exp: "Mantener distancia de seguridad bajo la carga." },
  { riesgo: "Proyección de Partículas", medida: "Gafas de Seguridad", nivel: "medium", emoji_r: "💥", emoji_m: "🥽", exp: "Protección ocular contra impactos." },
  { riesgo: "Atrapamiento", medida: "Guardas de Seguridad", nivel: "medium", emoji_r: "⚙️", emoji_m: "🛡️", exp: "Barreras físicas en partes móviles." },
  { riesgo: "Vibraciones", medida: "Guantes Antivibración", nivel: "medium", emoji_r: "📳", emoji_m: "🧤", exp: "Reduce el impacto en articulaciones." },
  { riesgo: "Radiación UV", medida: "Protector Solar", nivel: "medium", emoji_r: "☀️", emoji_m: "🧴", exp: "Protección de la piel en trabajos al exterior." },
  { riesgo: "Incendio", medida: "Extintor PQS", nivel: "expert", emoji_r: "🔥", emoji_m: "🧯", exp: "Control inicial de focos ígneos." },
  { riesgo: "Estrés Térmico", medida: "Hidratación y Pausas", nivel: "expert", emoji_r: "🌡️", emoji_m: "💧", exp: "Evita el golpe de calor en ambientes extremos." }
];

export const CARRERA_CATEGORIES: any = {
  epp: { id: 'epp', label: 'EPP', icon: '🦺', color: '#3b82f6', bg: 'bg-blue-500' },
  legislacion: { id: 'legislacion', label: 'Legislación', icon: '⚖️', color: '#10b981', bg: 'bg-emerald-500' },
  senaletica: { id: 'senaletica', label: 'Señalética', icon: '🔴', color: '#f43f5e', bg: 'bg-rose-500' },
  emergencias: { id: 'emergencias', label: 'Emergencias', icon: '🚨', color: '#f59e0b', bg: 'bg-orange-500' },
  gestion: { id: 'gestion', label: 'Gestión EHS', icon: '📋', color: '#a855f7', bg: 'bg-purple-500' }
};

export const CARRERA_FALLBACK = [
  { cat: 'epp', q: "¿Qué EPP es obligatorio para trabajos en altura?", a: "Arnés de seguridad", o: ["Casco", "Arnés de seguridad", "Guantes", "Lentes"], exp: "El arnés previene caídas a distinto nivel." },
  { cat: 'epp', q: "¿Cuándo se deben usar protectores auditivos?", a: "Sobre los 85 dB", o: ["Siempre", "Sobre los 85 dB", "Solo en obras", "Nunca"], exp: "El ruido excesivo causa daño irreversible." },
  { cat: 'legislacion', q: "¿Cuál es la ley de Higiene y Seguridad en Argentina?", a: "19.587", o: ["24.557", "19.587", "20.744", "26.773"], exp: "Es la ley base de la prevención en el país." },
  { cat: 'senaletica', q: "¿Qué indica el color azul en seguridad?", a: "Obligación", o: ["Prohibición", "Advertencia", "Obligación", "Información"], exp: "El azul indica una acción obligatoria (ej. usar casco)." },
  { cat: 'emergencias', q: "¿Qué es lo primero que se debe hacer ante un incendio?", a: "Dar la voz de alarma", o: ["Correr", "Dar la voz de alarma", "Esconderse", "Abrir ventanas"], exp: "Alertar a los demás es vital para la evacuación." },
  { cat: 'gestion', q: "¿Qué es un 'incidente'?", a: "Suceso que pudo ser un accidente", o: ["Un accidente grave", "Suceso que pudo ser un accidente", "Una multa", "Una reunión"], exp: "Es un aviso de que algo anda mal antes de que alguien se lastime." }
];

export const DECISIONES_FALLBACK = [
  {
    escenario: "Andamio sin barandas",
    descripcion: "Te encontrás con un andamio de 3 cuerpos de altura que no posee barandas de seguridad ni rodapiés. Un compañero se dispone a subir.",
    imagen_url: "",
    opcion_a: "Autorizar el trabajo con precaución",
    opcion_b: "Parar la tarea y reportar",
    opcion_c: "Avisar al capataz al final del día",
    correcta: "B",
    consecuencia_correcta: "Evitaste una caída a distinto nivel. La seguridad no es negociable.",
    consecuencia_incorrecta: "Riesgo crítico de caída. Nunca se debe trabajar en altura sin protecciones colectivas.",
    principio: "Derecho a decir NO ante condiciones inseguras.",
    dificultad: "Baja"
  },
  {
    escenario: "EPP deteriorado",
    descripcion: "Tus guantes de protección mecánica tienen agujeros y el recubrimiento está gastado. Tenés que manipular chapas con bordes filosos.",
    imagen_url: "",
    opcion_a: "Usarlos igual con cuidado",
    opcion_b: "Descartarlos y pedir nuevos",
    opcion_c: "Dejarlos para que otro los use",
    correcta: "B",
    consecuencia_correcta: "Protegiste tus manos. El EPP en mal estado no protege.",
    consecuencia_incorrecta: "Riesgo de corte severo. El EPP debe estar en óptimas condiciones.",
    principio: "El EPP es la última barrera, debe ser íntegro.",
    dificultad: "Baja"
  },
  {
    escenario: "Derrame de aceite",
    descripcion: "En un pasillo de alto tránsito peatonal y de autoelevadores, detectás una mancha de aceite importante.",
    imagen_url: "",
    opcion_a: "Rodear la mancha",
    opcion_b: "Limpiar y señalizar el área",
    opcion_c: "Ignorar y seguir tu ruta",
    correcta: "B",
    consecuencia_correcta: "Previniste resbalones y choques. Orden y limpieza son seguridad.",
    consecuencia_incorrecta: "Riesgo de accidente múltiple. Los derrames deben tratarse de inmediato.",
    principio: "Mantener el área limpia es responsabilidad de todos.",
    dificultad: "Media"
  },
  {
    escenario: "Compañero sin casco",
    descripcion: "Entrás a una zona de carga suspendida y ves a un compañero trabajando sin su casco de seguridad.",
    imagen_url: "",
    opcion_a: "Ignorar la situación",
    opcion_b: "Avisarle que use el casco",
    opcion_c: "Reportar directo al supervisor",
    correcta: "B",
    consecuencia_correcta: "Cuidado mutuo. Ayudaste a un compañero a estar seguro.",
    consecuencia_incorrecta: "Riesgo de golpe fatal. La omisión nos hace cómplices del riesgo.",
    principio: "Yo te cuido, vos me cuidás.",
    dificultad: "Baja"
  },
  {
    escenario: "Trabajo en caliente sin permiso",
    descripcion: "Se requiere realizar una soldadura de emergencia, pero el emisor de permisos no está disponible y el permiso venció hace una hora.",
    imagen_url: "",
    opcion_a: "Comenzar igual por la urgencia",
    opcion_b: "Detener y tramitar nuevo permiso",
    opcion_c: "Pedir permiso verbal por radio",
    correcta: "B",
    consecuencia_correcta: "Respetaste los procesos críticos. Las urgencias no justifican riesgos.",
    consecuencia_incorrecta: "Riesgo de incendio o explosión. Los permisos de trabajo son vitales.",
    principio: "Ninguna urgencia justifica saltarse un procedimiento de seguridad.",
    dificultad: "Alta"
  }
];

export const ESPEJO_FALLBACK = [
  { 
    id: '1', 
    situacion: "A veces apuro el último paso porque ya terminó el turno.", 
    categoria: "Conducta", 
    pregunta_debate: "¿Qué riesgos reales corremos al apurarnos al final?", 
    reflexion: "El cansancio del final del turno es el momento de mayor riesgo. Pausar asegura llegar a casa sano.",
    opcion_segura: "Pausar y terminar con calma",
    opcion_riesgosa: "Apurar para salir rápido"
  },
  { 
    id: '2', 
    situacion: "Usé un EPP deteriorado porque no había otro disponible.", 
    categoria: "Autocuidado", 
    pregunta_debate: "¿Por qué a veces aceptamos EPP en mal estado?", 
    reflexion: "Tu seguridad depende de la integridad de tu equipo. Si no es seguro, no se usa.",
    opcion_segura: "Reportar y esperar EPP nuevo",
    opcion_riesgosa: "Usar el EPP dañado"
  },
  { 
    id: '3', 
    situacion: "Vi una condición insegura y no la reporté para no demorar.", 
    categoria: "Confianza", 
    pregunta_debate: "¿Qué nos frena a reportar condiciones inseguras?", 
    reflexion: "Reportar hoy evita el accidente de mañana. Tu voz es la mejor herramienta de prevención.",
    opcion_segura: "Detenerse y reportar",
    opcion_riesgosa: "Seguir y omitir el reporte"
  },
  { 
    id: '4', 
    situacion: "Operé una máquina con la guarda abierta por un momento.", 
    categoria: "Conducta", 
    pregunta_debate: "¿Por qué creemos que 'un momento' no es peligroso?", 
    reflexion: "Los accidentes ocurren en fracciones de segundo. Las guardas son barreras de vida.",
    opcion_segura: "Cerrar guarda antes de operar",
    opcion_riesgosa: "Operar con guarda abierta"
  },
  { 
    id: '5', 
    situacion: "Empecé una tarea sin AST porque ya la conozco de memoria.", 
    categoria: "Conocimiento", 
    pregunta_debate: "¿El exceso de confianza nos hace olvidar pasos críticos?", 
    reflexion: "El AST no es solo un papel, es el momento de pensar antes de actuar.",
    opcion_segura: "Realizar AST completo",
    opcion_riesgosa: "Confiar en la memoria"
  },
  { 
    id: '6', 
    situacion: "Levanté una carga pesado solo para no molestar a nadie.", 
    categoria: "Autocuidado", 
    pregunta_debate: "¿Por qué nos cuesta pedir ayuda para tareas físicas?", 
    reflexion: "Tu espalda tiene memoria. Pedir ayuda o usar medios mecánicos es de profesionales.",
    opcion_segura: "Pedir ayuda o usar equipo",
    opcion_riesgosa: "Levantar solo la carga"
  },
  { 
    id: '7', 
    situacion: "Usé una herramienta en mal estado porque era la única.", 
    categoria: "Conducta", 
    pregunta_debate: "¿Qué impacto tiene una herramienta defectuosa en la calidad y seguridad?", 
    reflexion: "Una herramienta improvisada es un accidente anunciado. Exigí lo necesario para trabajar bien.",
    opcion_segura: "Solicitar herramienta apta",
    opcion_riesgosa: "Improvisar con la dañada"
  },
  { 
    id: '8', 
    situacion: "Vine con mucho cansancio sin avisar a nadie cómo me sentía.", 
    categoria: "Autocuidado", 
    pregunta_debate: "¿Cómo afecta el cansancio nuestra percepción del riesgo?", 
    reflexion: "Estar apto es el primer paso de la tarea. Avisar a tiempo permite reasignar tareas críticas.",
    opcion_segura: "Informar estado de fatiga",
    opcion_riesgosa: "Ocultar el cansancio"
  },
  { 
    id: '9', 
    situacion: "Vi a un compañero en riesgo y no le dije nada por no generar conflicto.", 
    categoria: "Confianza", 
    pregunta_debate: "¿Cómo podemos decir algo sin que se sienta como un ataque?", 
    reflexion: "Cuidar al compañero es la base de la cultura de seguridad. El silencio puede ser fatal.",
    opcion_segura: "Intervenir con respeto",
    opcion_riesgosa: "Ignorar la situación"
  },
  { 
    id: '10', 
    situacion: "Sé exactamente dónde está el punto de encuentro de mi sector.", 
    categoria: "Conocimiento", 
    pregunta_debate: "¿Podríamos llegar a ciegas en caso de humo o corte de luz?", 
    reflexion: "En una emergencia, el instinto debe estar entrenado. Conocer las rutas salva vidas.",
    opcion_segura: "Repasar ruta de evacuación",
    opcion_riesgosa: "Asumir que ya lo sé"
  },
  { 
    id: '11', 
    situacion: "Puedo explicar los pasos del CATA sin consultar nada.", 
    categoria: "Conocimiento", 
    pregunta_debate: "¿Qué paso del CATA es el que más solemos olvidar?", 
    reflexion: "El CATA es nuestra brújula. Dominarlo es dominar nuestra propia seguridad.",
    opcion_segura: "Verificar pasos del CATA",
    opcion_riesgosa: "Seguir sin consultar"
  },
  { 
    id: '12', 
    situacion: "Puedo nombrar dos operaciones críticas de mi sector.", 
    categoria: "Conocimiento", 
    pregunta_debate: "¿Cuáles son los riesgos fatales de esas operaciones?", 
    reflexion: "Identificar el peligro es el 50% de la prevención. No pierdas de vista lo crítico.",
    opcion_segura: "Analizar riesgos fatales",
    opcion_riesgosa: "Ignorar criticidad"
  },
  { 
    id: '13', 
    situacion: "Sé cómo reportar un incidente en la app Estoy Seguro.", 
    categoria: "Conocimiento", 
    pregunta_debate: "¿Qué nos frena a veces para reportar un incidente?", 
    reflexion: "Reportar es prevenir. Tu reporte de hoy es el accidente que evitamos mañana.",
    opcion_segura: "Reportar incidente ahora",
    opcion_riesgosa: "Dejarlo para después"
  },
];

export const ESPEJO_CATEGORY_COLORS: { [key: string]: string } = {
  "Autocuidado": "bg-emerald-500 shadow-emerald-500/50",
  "Conducta": "bg-blue-500 shadow-blue-500/50",
  "Confianza": "bg-purple-500 shadow-purple-500/50",
  "Conocimiento": "bg-amber-500 shadow-amber-500/50",
  "Entorno": "bg-rose-500 shadow-rose-500/50"
};

export const PARE_FALLBACK: { [key: string]: any } = {
  "inicio_1": {
    id: "inicio_1",
    historia: "Historia 1: Fuga de Gas",
    situacion: "Encontrás una fuga de gas en el sector de calderas. El olor es penetrante y se escucha un silbido fuerte.",
    opciones: [
      { texto: "Intentar cerrar la válvula manualmente", siguiente: "exposicion_gas" },
      { texto: "Evacuar el área y activar la alarma", siguiente: "esperar_brigada" },
      { texto: "Avisar solo a tu compañero cercano", siguiente: "demora_respuesta" }
    ]
  },
  "exposicion_gas": {
    id: "exposicion_gas",
    situacion: "Al intentar cerrar la válvula sin protección, inhalás una alta concentración de gas y perdés el conocimiento.",
    es_final: "SI",
    tipo_final: "critico",
    aprendizaje: "Nunca intentes controlar una fuga crítica sin el equipo y entrenamiento adecuado. La prioridad es la evacuación y el aviso a emergencias."
  },
  "esperar_brigada": {
    id: "esperar_brigada",
    situacion: "Activaste la alarma y evacuaste a todos. La brigada llega en minutos y controla la fuga de forma segura.",
    es_final: "SI",
    tipo_final: "correcto",
    aprendizaje: "Actuar según el plan de emergencia salva vidas. Identificar el riesgo, alejarse y dar aviso es la conducta correcta."
  },
  "demora_respuesta": {
    id: "demora_respuesta",
    situacion: "El aviso informal no llega a los responsables. La fuga aumenta y se produce una pequeña explosión que daña equipos.",
    es_final: "SI",
    tipo_final: "incidente",
    aprendizaje: "Las comunicaciones de emergencia deben ser formales y masivas (alarmas) para asegurar una respuesta inmediata."
  },
  "inicio_2": {
    id: "inicio_2",
    historia: "Historia 2: Procedimiento LOTO",
    situacion: "Tu compañero propone saltear el bloqueo LOTO para ganar tiempo en una reparación simple.",
    opciones: [
      { texto: "Aceptar porque confías en él", siguiente: "accidente_loto" },
      { texto: "Negarte y explicar el procedimiento", siguiente: "buscar_supervisor" },
      { texto: "Pedir opinión a otro compañero", siguiente: "decision_grupal" }
    ]
  },
  "accidente_loto": {
    id: "accidente_loto",
    situacion: "Alguien energiza la máquina mientras trabajás. Sufrís una descarga eléctrica grave.",
    es_final: "SI",
    tipo_final: "critico",
    aprendizaje: "LOTO no es una cuestión de confianza, es una barrera física de seguridad. Nunca operes sin bloqueo propio."
  },
  "buscar_supervisor": {
    id: "buscar_supervisor",
    situacion: "El supervisor refuerza la importancia del bloqueo. La tarea se hace de forma segura, aunque tome 10 minutos más.",
    es_final: "SI",
    tipo_final: "correcto",
    aprendizaje: "Hacer lo correcto a veces implica enfrentar la presión de los pares. La seguridad no se negocia por tiempo."
  },
  "decision_grupal": {
    id: "decision_grupal",
    situacion: "El tercer compañero duda, pero terminan trabajando sin bloqueo. La máquina arranca sola y daña la herramienta.",
    es_final: "SI",
    tipo_final: "incidente",
    aprendizaje: "La presión de grupo puede llevar a decisiones riesgosas. Los procedimientos están por encima de las opiniones."
  }
};

export const PROTOCOLO_FALLBACK: { [key: string]: any } = {
  "INCENDIO": {
    tiempo: 90,
    pasos: [
      { id: 1, paso: "Dar la alarma", detalle: "Activar el pulsador de alarma más cercano.", icono: "AlertTriangle" },
      { id: 2, paso: "Llamar al número de emergencias", detalle: "Informar ubicación exacta y magnitud del fuego.", icono: "Phone" },
      { id: 3, paso: "Evacuar el área", detalle: "Seguir las rutas de evacuación señalizadas.", icono: "Users" },
      { id: 4, paso: "Cerrar puertas sin llave", detalle: "Para retardar la propagación del fuego y humo.", icono: "DoorClosed" },
      { id: 5, paso: "Usar extintor solo si es seguro", detalle: "Solo si el fuego es pequeño y tenés entrenamiento.", icono: "Zap" },
      { id: 6, paso: "Reunirse en punto de encuentro", detalle: "Esperar el recuento de personal.", icono: "MapPin" },
      { id: 7, paso: "No reingresar hasta autorización", detalle: "Solo cuando los bomberos o brigada lo indiquen.", icono: "XCircle" }
    ]
  },
  "PERSONA LESIONADA": {
    tiempo: 120,
    pasos: [
      { id: 1, paso: "Asegurar la escena", detalle: "Verificar que no haya peligros adicionales para vos o la víctima.", icono: "Shield" },
      { id: 2, paso: "Llamar a emergencias", detalle: "Solicitar asistencia médica especializada.", icono: "Phone" },
      { id: 3, paso: "No mover al lesionado si hay trauma", detalle: "Evitar lesiones mayores en columna o cuello.", icono: "AlertCircle" },
      { id: 4, paso: "Aplicar primeros auxilios básicos", detalle: "Controlar hemorragias o realizar RCP si sabés.", icono: "Heart" },
      { id: 5, paso: "Mantener al lesionado abrigado y consciente", detalle: "Hablarle y evitar que entre en shock.", icono: "Thermometer" },
      { id: 6, paso: "Esperar al equipo médico", detalle: "No abandonar a la víctima hasta que llegue ayuda.", icono: "Clock" }
    ]
  },
  "DERRAME QUIMICO": {
    tiempo: 90,
    pasos: [
      { id: 1, paso: "Evacuar el área", detalle: "Alejarse del derrame y vapores inmediatamente.", icono: "LogOut" },
      { id: 2, paso: "Identificar la sustancia (consultar HDS)", detalle: "Saber qué se derramó para actuar correctamente.", icono: "Search" },
      { id: 3, paso: "Dar la alarma y llamar a emergencias", detalle: "Notificar a la brigada de materiales peligrosos.", icono: "AlertTriangle" },
      { id: 4, paso: "Ventilar el área si es seguro", detalle: "Abrir puertas y ventanas exteriores.", icono: "Wind" },
      { id: 5, paso: "Contener el derrame con kit específico", detalle: "Usar absorbentes y barreras del kit de derrames.", icono: "Layers" },
      { id: 6, paso: "Registrar el incidente", detalle: "Informar para la investigación y reposición de materiales.", icono: "FileText" }
    ]
  }
};

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

export const MEMORY_PAIRS = [
  {
    riesgo: { emoji: '🔥', titulo: 'FUEGO', desc: 'Riesgo de incendio.', color: '#FFB3BA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🧯', titulo: 'EXTINTOR', desc: 'Uso de extintor ABC.', color: '#FFB3BA', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🔊', titulo: 'RUIDO', desc: 'Niveles > 85dB.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🎧', titulo: 'PROTECCIÓN', desc: 'Protectores auditivos.', color: '#BAE1FF', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🧱', titulo: 'CAÍDA OBJETOS', desc: 'Desprendimiento.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '👷', titulo: 'CASCO', desc: 'Casco industrial.', color: '#BAE1FF', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '✨', titulo: 'CHISPAS', desc: 'Proyección partículas.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🥽', titulo: 'ANTIPARRAS', desc: 'Protección ocular.', color: '#BAE1FF', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '⚡', titulo: 'ELECTRICIDAD', desc: 'Choque eléctrico.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🧤', titulo: 'GUANTES DIEL.', desc: 'Guantes dieléctricos.', color: '#BAE1FF', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🧪', titulo: 'QUÍMICOS', desc: 'Sustancias corrosivas.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🧤', titulo: 'GUANTES QUIM.', desc: 'Guantes de nitrilo.', color: '#BAE1FF', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🌫️', titulo: 'VAPORES', desc: 'Gases tóxicos.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '😷', titulo: 'RESPIRADOR', desc: 'Máscara con filtros.', color: '#BAE1FF', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🪜', titulo: 'ALTURA', desc: 'Trabajos > 1.8m.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🧗', titulo: 'ARNÉS', desc: 'Arnés y línea vida.', color: '#BAE1FF', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🌡️', titulo: 'CALOR', desc: 'Altas temperaturas.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🧤', titulo: 'GUANTES TÉRM.', desc: 'Guantes térmicos.', color: '#BAE1FF', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '⚙️', titulo: 'ATRAPAMIENTO', desc: 'Partes móviles.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🛑', titulo: 'PARADA EMERG.', desc: 'Parada emergencia.', color: '#FFB3BA', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '💦', titulo: 'DERRAME', desc: 'Fuga líquidos.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '📦', titulo: 'KIT DERRAMES', desc: 'Absorbentes.', color: '#BAFFC9', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '📦', titulo: 'CARGA PESADA', desc: 'Levantamiento manual.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🛒', titulo: 'CARRO', desc: 'Medios mecánicos.', color: '#BAFFC9', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🌑', titulo: 'OSCURIDAD', desc: 'Falta iluminación.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🔦', titulo: 'LINTERNA', desc: 'Iluminación emerg.', color: '#BAFFC9', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '⛸️', titulo: 'PISO RESBAL.', desc: 'Pisos mojados.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🥾', titulo: 'CALZADO', desc: 'Suela antideslizante.', color: '#BAE1FF', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🚑', titulo: 'ACCIDENTE', desc: 'Lesión inmediata.', color: '#FFB3BA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🩹', titulo: 'BOTIQUÍN', desc: 'Primeros auxilios.', color: '#BAFFC9', tipo: 'MITIGACIÓN' }
  }
];

export const GAMES: Game[] = [
  { id: 'truco', title: 'TRUCO SEGURO', subtitle: 'MISIÓN_01', icon: 'precision_manufacturing', active: true, color: 'bg-emerald-500', level: 'EXPERTO', stats: '42 VIC / 12 RGO', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800' },
  { id: 'cazador', title: 'CAZADOR DE RIESGOS', subtitle: 'MISIÓN_02', icon: 'visibility', active: false, color: 'bg-rose-500', level: 'PRINCIPIANTE', stats: '8 VIC / 5 RGO', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800' },
  { id: 'match', title: 'UNE EL RIESGO', subtitle: 'MISIÓN_03', icon: 'link', active: true, color: 'bg-orange-500', level: 'INTERMEDIO', stats: '15 VIC / 3 RGO', img: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&q=80&w=800' },
  { id: 'oca', title: 'LA OCA', subtitle: 'MISIÓN_04', icon: 'grid_view', active: true, color: 'bg-blue-500', level: 'INTERMEDIO', stats: '22 VIC / 8 RGO', img: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=800' },
  { id: 'carrera', title: 'CARRERA MENTE', subtitle: 'MISIÓN_05', icon: 'psychology', active: true, color: 'bg-amber-500', level: 'EXPERTO', stats: '10 VIC / 2 RGO', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800' },
  { id: 'escape', title: 'ESCAPE ROOM', subtitle: 'MISIÓN_06', icon: 'lock_open', active: true, color: 'bg-yellow-500', level: 'INTERMEDIO', stats: '30 VIC / 1 RGO', img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800' },
  { id: 'memoria', title: 'MEMORY PREVENTIVO', subtitle: 'MISIÓN_07', icon: 'brain', active: false, color: 'bg-emerald-600', level: 'PRINCIPIANTE', stats: '12 VIC / 4 RGO', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800' },
  { id: 'wordle', title: 'PREVENWORDLE', subtitle: 'MISIÓN_08', icon: 'spellcheck', active: true, color: 'bg-amber-600', level: 'INTERMEDIO', stats: '5 VIC / 0 RGO', img: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&q=80&w=800' },
  { id: 'jenga', title: 'JENGA SEGURO', subtitle: 'MISIÓN_09', icon: 'view_in_ar', active: true, color: 'bg-indigo-600', level: 'EXPERTO', stats: '0 VIC / 0 RGO', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800' },
  { id: 'decisiones', title: 'DECISIONES SEGURAS', subtitle: 'MISIÓN_10', icon: 'fact_check', active: true, color: 'bg-purple-600', level: 'INTERMEDIO', stats: '0 VIC / 0 RGO', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800' },
  { id: 'espejo', title: 'EL ESPEJO DEL TURNO', subtitle: 'MISIÓN_11', icon: 'visibility', active: true, color: 'bg-blue-600', level: 'INTERMEDIO', stats: '0 VIC / 0 RGO', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800', desc: 'Módulo de Integridad: Tomá decisiones ante riesgos reales y observá las consecuencias en tu reflejo.' },
  { id: 'resolve', title: 'RESOLVÉ EN EL PUESTO', subtitle: 'MISIÓN_12', icon: 'build', active: true, color: 'bg-emerald-700', level: 'INTERMEDIO', stats: '0 VIC / 0 RGO', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800' },
];

export const GAMES_ENHANCED: Game[] = [
  ...GAMES,
  { 
    id: 'pare', 
    title: 'PARE Y PIDA AYUDA', 
    subtitle: 'MISIÓN_13', 
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
    subtitle: 'MISIÓN_14', 
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
    id: 'sopa', 
    title: 'SOPA DE LETRAS', 
    subtitle: 'MISIÓN_15', 
    icon: 'search', 
    active: true, 
    color: 'bg-emerald-600', 
    level: 'PRINCIPIANTE', 
    stats: '0 VIC / 0 RGO', 
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    desc: 'Encontrá las palabras clave de seguridad ocultas en la grilla antes de que el tiempo expire.',
    obj: 'Identificar conceptos fundamentales de prevención de forma rápida.',
    rules: [
      'Buscá las palabras listadas en la sopa de letras.',
      'Hacé clic y arrastrá para seleccionar la palabra.',
      'Las palabras pueden estar en horizontal o vertical.',
      'Completá la lista para finalizar la misión.'
    ]
  },
  { 
    id: 'trivia', 
    title: 'TRIVIA PREVENTIVA', 
    subtitle: 'MISIÓN_16', 
    icon: 'help_circle', 
    active: true, 
    color: 'bg-blue-600', 
    level: 'INTERMEDIO', 
    stats: '0 VIC / 0 RGO', 
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    desc: 'Desafío de preguntas y respuestas sobre normativas, EPP y procedimientos críticos.',
    obj: 'Validar el conocimiento teórico sobre seguridad industrial.',
    rules: [
      'Respondé las preguntas de opción múltiple.',
      'Tenés un tiempo limitado por cada pregunta.',
      'Sumá puntos por respuestas correctas consecutivas.',
      'Al final verás tu nivel de conocimiento alcanzado.'
    ]
  },
  { 
    id: 'epp', 
    title: 'SIMULADOR DE EPP', 
    subtitle: 'MISIÓN_17', 
    icon: 'hard_hat', 
    active: true, 
    color: 'bg-orange-600', 
    level: 'INTERMEDIO', 
    stats: '0 VIC / 0 RGO', 
    img: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&q=80&w=800',
    desc: 'Equipá al operador con los elementos de protección correctos según el riesgo planteado.',
    obj: 'Asegurar la selección adecuada de barreras de protección personal.',
    rules: [
      'Leé el escenario de riesgo presentado.',
      'Seleccioná los EPP necesarios de la lista.',
      'No olvides ningún elemento crítico para ese riesgo.',
      'Validá tu selección para avanzar al siguiente nivel.'
    ]
  },
  { 
    id: 'stop', 
    title: 'STOP AL PELIGRO', 
    subtitle: 'MISIÓN_19', 
    icon: 'stop-circle', 
    active: true, 
    color: 'bg-red-600', 
    level: 'AVANZADO', 
    stats: '0 STOP / 0 RGO', 
    img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    desc: 'El Tutti Frutti de la Seguridad. Nombrá elementos EHS más rápido que tus compañeros.',
    obj: 'Reforzar el vocabulario técnico de seguridad bajo presión de tiempo.',
    rules: [
      'Se sorteará una letra al azar.',
      'Completá las 5 categorías con palabras que empiecen con esa letra.',
      'Gritá STOP (presioná el botón) antes de que se acabe el tiempo.',
      'Respuestas válidas suman 100 puntos. ¡Bonus por rapidez!'
    ]
  }
];

export const TRUCO_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=1981277272&single=true&output=csv';

export const TRUCO_FALLBACK = [
  // Poder 14
  { id: '1_espadas', n: 1, s: 'espadas', p: 14, l: 'Paro y Pido Ayuda', d: 'Detengo la tarea ante cualquier riesgo' },
  // Poder 13
  { id: '1_bastos', n: 1, s: 'bastos', p: 13, l: 'Reporto lo que Veo', d: 'Reporto condiciones inseguras siempre' },
  // Poder 12
  { id: '7_espadas', n: 7, s: 'espadas', p: 12, l: 'Equipamiento Seguro', d: 'Verifico mi EPP antes de cada tarea' },
  // Poder 11
  { id: '7_oros', n: 7, s: 'oros', p: 11, l: 'Equipamiento Seguro', d: 'Uso el EPP correcto para cada riesgo' },
  // Poder 10
  { id: '3_espadas', n: 3, s: 'espadas', p: 10, l: 'Cumplo el Estándar', d: 'Completo la AST antes de arrancar' },
  { id: '3_bastos', n: 3, s: 'bastos', p: 10, l: 'Cumplo el Estándar', d: 'Completo la AST antes de arrancar' },
  { id: '3_oros', n: 3, s: 'oros', p: 10, l: 'Cumplo el Estándar', d: 'Completo la AST antes de arrancar' },
  { id: '3_copas', n: 3, s: 'copas', p: 10, l: 'Cumplo el Estándar', d: 'Completo la AST antes de arrancar' },
  // Poder 9
  { id: '2_espadas', n: 2, s: 'espadas', p: 9, l: 'Uso Correcto de EPP', d: 'Mi EPP en condición apta siempre' },
  { id: '2_bastos', n: 2, s: 'bastos', p: 9, l: 'Uso Correcto de EPP', d: 'Mi EPP en condición apta siempre' },
  { id: '2_oros', n: 2, s: 'oros', p: 9, l: 'Uso Correcto de EPP', d: 'Mi EPP en condición apta siempre' },
  { id: '2_copas', n: 2, s: 'copas', p: 9, l: 'Uso Correcto de EPP', d: 'Mi EPP en condición apta siempre' },
  // Poder 8
  { id: '1_copas', n: 1, s: 'copas', p: 8, l: 'Gemba y Auditorías', d: 'Recorro y observo el sector' },
  { id: '1_oros', n: 1, s: 'oros', p: 8, l: 'Gemba y Auditorías', d: 'Identifico condiciones antes de actuar' },
  // Poder 7
  { id: '12_espadas', n: 12, s: 'espadas', p: 7, l: 'Estándares a Medias', d: 'Atención: cumplimiento parcial del estándar' },
  { id: '12_bastos', n: 12, s: 'bastos', p: 7, l: 'Estándares a Medias', d: 'Atención: cumplimiento parcial del estándar' },
  { id: '12_oros', n: 12, s: 'oros', p: 7, l: 'Estándares a Medias', d: 'Atención: cumplimiento parcial del estándar' },
  { id: '12_copas', n: 12, s: 'copas', p: 7, l: 'Estándares a Medias', d: 'Atención: cumplimiento parcial del estándar' },
  // Poder 6
  { id: '11_espadas', n: 11, s: 'espadas', p: 6, l: 'Estándares a Medias', d: 'Atención: procedimiento incompleto' },
  { id: '11_bastos', n: 11, s: 'bastos', p: 6, l: 'Estándares a Medias', d: 'Atención: procedimiento incompleto' },
  { id: '11_oros', n: 11, s: 'oros', p: 6, l: 'Estándares a Medias', d: 'Atención: procedimiento incompleto' },
  { id: '11_copas', n: 11, s: 'copas', p: 6, l: 'Estándares a Medias', d: 'Atención: procedimiento incompleto' },
  // Poder 5
  { id: '10_espadas', n: 10, s: 'espadas', p: 5, l: 'Estándares a Medias', d: 'Atención: control aplicado a medias' },
  { id: '10_bastos', n: 10, s: 'bastos', p: 5, l: 'Estándares a Medias', d: 'Atención: control aplicado a medias' },
  { id: '10_oros', n: 10, s: 'oros', p: 5, l: 'Estándares a Medias', d: 'Atención: control aplicado a medias' },
  { id: '10_copas', n: 10, s: 'copas', p: 5, l: 'Estándares a Medias', d: 'Atención: control aplicado a medias' },
  // Poder 4
  { id: '7_copas', n: 7, s: 'copas', p: 4, l: 'Estándares a Medias', d: 'Atención: barrera preventiva débil' },
  { id: '7_bastos', n: 7, s: 'bastos', p: 4, l: 'Estándares a Medias', d: 'Atención: CATA aplicado parcialmente' },
  // Poder 3
  { id: '6_espadas', n: 6, s: 'espadas', p: 3, l: 'Acto Inseguro', d: 'Conducta que expone al riesgo' },
  { id: '6_bastos', n: 6, s: 'bastos', p: 3, l: 'Acto Inseguro', d: 'Conducta que expone al riesgo' },
  { id: '6_oros', n: 6, s: 'oros', p: 3, l: 'Acto Inseguro', d: 'Conducta que expone al riesgo' },
  { id: '6_copas', n: 6, s: 'copas', p: 3, l: 'Acto Inseguro', d: 'Conducta que expone al riesgo' },
  // Poder 2
  { id: '5_espadas', n: 5, s: 'espadas', p: 2, l: 'Acto Inseguro', d: 'Decisión que ignora el peligro' },
  { id: '5_bastos', n: 5, s: 'bastos', p: 2, l: 'Acto Inseguro', d: 'Decisión que ignora el peligro' },
  { id: '5_oros', n: 5, s: 'oros', p: 2, l: 'Acto Inseguro', d: 'Decisión que ignora el peligro' },
  { id: '5_copas', n: 5, s: 'copas', p: 2, l: 'Acto Inseguro', d: 'Decisión que ignora el peligro' },
  // Poder 1
  { id: '4_espadas', n: 4, s: 'espadas', p: 1, l: 'Acto Inseguro', d: 'Omisión que genera accidente' },
  { id: '4_bastos', n: 4, s: 'bastos', p: 1, l: 'Acto Inseguro', d: 'Omisión que genera accidente' },
  { id: '4_oros', n: 4, s: 'oros', p: 1, l: 'Acto Inseguro', d: 'Omisión que genera accidente' },
  { id: '4_copas', n: 4, s: 'copas', p: 1, l: 'Acto Inseguro', d: 'Omisión que genera accidente' },
];

export const AVATARS = [
  { id: 'operator', icon: 'User', label: 'Operador', color: 'bg-blue-500' },
  { id: 'safety', icon: 'Shield', label: 'Seguridad', color: 'bg-emerald-500' },
  { id: 'maintenance', icon: 'Wrench', label: 'Mantenimiento', color: 'bg-amber-500' },
  { id: 'logistics', icon: 'Truck', label: 'Logística', color: 'bg-purple-500' },
  { id: 'quality', icon: 'Activity', label: 'Calidad', color: 'bg-rose-500' },
  { id: 'energy', icon: 'Zap', label: 'Energía', color: 'bg-yellow-500' },
  { id: 'champion', icon: 'Trophy', label: 'Campeón', color: 'bg-indigo-500' },
  { id: 'fire', icon: 'Flame', label: 'Brigadista', color: 'bg-orange-500' },
];

export const DECK_BASE = TRUCO_FALLBACK;
