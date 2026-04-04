
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StopCircle, Timer, Trophy, RotateCcw, Play, CheckCircle2, XCircle, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

// --- Types ---
interface StopData {
  letra: string;
  columna: string;
  respuesta_ok: string;
  descripcion: string;
  dificultad: string;
}

interface ValidEntry {
  respuesta: string;
  descripcion: string;
  dificultad: number;
}

type RoundResult = {
  category: string;
  value: string;
  isValid: boolean;
  points: number;
  example: string;
  descripcion?: string;
};

// --- Constants ---
const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=1520731584&single=true&output=csv';

const CATEGORIES = [
  { id: 'EPP', label: 'EPP', desc: 'Protección Personal' },
  { id: 'CONTROL', label: 'CONTROL', desc: 'Medida de Riesgo' },
  { id: 'PELIGRO', label: 'PELIGRO', desc: 'Riesgo Detectado' },
  { id: 'ACCION', label: 'ACCIÓN', desc: 'Prevención' }
];

const FALLBACK_DATA: Record<string, Record<string, ValidEntry[]>> = {
  'A': {
    'EPP': [
      { respuesta: 'ANTIPARRAS', descripcion: 'Protegen los ojos de proyecciones y salpicaduras en ensamble y conformado de chapa', dificultad: 100 },
      { respuesta: 'ARNES', descripcion: 'Equipo de proteccion contra caidas en trabajos en altura obligatorio a partir de 2 metros', dificultad: 100 }
    ],
    'CONTROL': [
      { respuesta: 'AST', descripcion: 'Analisis de Seguridad en el Trabajo — se completa antes de iniciar cualquier tarea de riesgo', dificultad: 100 },
      { respuesta: 'AISLAMIENTO', descripcion: 'Bloqueo de la fuente de energia antes de intervenir un equipo — base del procedimiento CATA', dificultad: 200 }
    ],
    'AREA': [
      { respuesta: 'ALMACEN', descripcion: 'Sector de materiales y producto terminado donde operan autoelevadores y personal a pie', dificultad: 100 }
    ],
    'PELIGRO': [
      { respuesta: 'ATRAPAMIENTO', descripcion: 'Riesgo de quedar atrapado entre partes moviles de una maquina sin guarda de proteccion', dificultad: 100 },
      { respuesta: 'ALTURA', descripcion: 'Riesgo de caida cuando se trabaja por encima de 2 metros sin EPP ni sistema de anclaje', dificultad: 100 }
    ],
    'ACCION': [
      { respuesta: 'AVISAR AL SUPERVISOR', descripcion: 'Reportar una condicion insegura al supervisor antes de continuar con la tarea', dificultad: 100 },
      { respuesta: 'APLICAR CATA', descripcion: 'Colocar el candado personal en el tablero antes de intervenir cualquier equipo energizado', dificultad: 100 }
    ]
  },
  'B': {
    'EPP': [
      { respuesta: 'BOTAS DE SEGURIDAD', descripcion: 'Calzado con puntera de acero que protege los pies de caida de objetos pesados', dificultad: 100 },
      { respuesta: 'BARBIJO', descripcion: 'Proteccion respiratoria basica para particulas en suspension en sectores de inyeccion', dificultad: 200 }
    ],
    'CONTROL': [
      { respuesta: 'BARANDA', descripcion: 'Proteccion colectiva perimetral que evita caidas en plataformas y alturas', dificultad: 100 },
      { respuesta: 'BARRERA FISICA', descripcion: 'Separacion fisica entre carriles de autoelevadores y zonas de circulacion peatonal', dificultad: 200 }
    ],
    'AREA': [
      { respuesta: 'BODEGA', descripcion: 'Zona de almacenamiento de materias primas e insumos con acceso restringido', dificultad: 200 }
    ],
    'PELIGRO': [
      { respuesta: 'BORDES FILOSOS', descripcion: 'Riesgo de corte por contacto con cantos de chapa en conformado y lineas de armado', dificultad: 100 },
      { respuesta: 'BURN — QUEMADURA', descripcion: 'Riesgo de contacto termico con moldes calientes en inyeccion de aluminio y plasticos', dificultad: 200 }
    ],
    'ACCION': [
      { respuesta: 'BLOQUEAR EL EQUIPO', descripcion: 'Aplicar el candado CATA antes de cualquier intervencion en equipos con energia activa', dificultad: 100 },
      { respuesta: 'BARRER LAS VIRUTAS', descripcion: 'Limpiar las virutas de chapa con escobilla larga antes de iniciar el turno en prensas', dificultad: 100 }
    ]
  },
  'C': {
    'EPP': [
      { respuesta: 'CASCO', descripcion: 'Protege la cabeza de impactos y caida de objetos en toda zona con riesgo de golpe', dificultad: 100 },
      { respuesta: 'CALZADO DE SEGURIDAD', descripcion: 'Bota con puntera reforzada obligatoria en toda la planta de MABE Cordoba', dificultad: 100 }
    ],
    'CONTROL': [
      { respuesta: 'CATA', descripcion: 'Candadeo y Tarjeteo — procedimiento de bloqueo de energias de MABE Cordoba', dificultad: 100 },
      { respuesta: 'CAPACITACION', descripcion: 'Formacion especifica sobre riesgos del puesto — obligatoria al menos una vez al ano', dificultad: 100 }
    ],
    'AREA': [
      { respuesta: 'CONFORMADO DE CHAPA', descripcion: 'Sector donde se trabaja con prensas excentricas y piezas metalicas con bordes filosos', dificultad: 100 }
    ],
    'PELIGRO': [
      { respuesta: 'CORTE', descripcion: 'Riesgo de lesion por contacto con bordes afilados de chapa sin guante anticorte', dificultad: 100 },
      { respuesta: 'CAIDA', descripcion: 'Riesgo de perdida de equilibrio en piso mojado o desniveles sin senalizacion', dificultad: 100 }
    ],
    'ACCION': [
      { respuesta: 'COMPLETAR LA AST', descripcion: 'Realizar el analisis de seguridad en el trabajo antes de iniciar cualquier tarea de riesgo', dificultad: 100 },
      { respuesta: 'COLOCAR CONOS', descripcion: 'Senalizar el area de riesgo con cones antes de iniciar una tarea o ante un derrame', dificultad: 100 }
    ]
  },
  'D': {
    'EPP': [
      { respuesta: 'DELANTAL DE CUERO', descripcion: 'Proteccion del torso contra salpicaduras de metal fundido en inyeccion de aluminio', dificultad: 200 },
      { respuesta: 'DIELECTRICO GUANTE', descripcion: 'Guante aislante obligatorio en toda intervencion con riesgo de contacto electrico', dificultad: 200 }
    ],
    'CONTROL': [
      { respuesta: 'DELIMITACION', descripcion: 'Acotamiento del area de riesgo con cinta o barrera para evitar el acceso no autorizado', dificultad: 100 },
      { respuesta: 'DETECCION DE FUGAS', descripcion: 'Inspeccion periodica de circuitos hidraulicos y neumaticos para identificar perdidas', dificultad: 200 }
    ],
    'AREA': [
      { respuesta: 'DEPOSITO DE RESIDUOS', descripcion: 'Zona destinada al acopio diferenciado de residuos peligrosos y no peligrosos', dificultad: 200 }
    ],
    'PELIGRO': [
      { respuesta: 'DERRAME', descripcion: 'Riesgo de vertido de liquidos inflamables o corrosivos en el piso o area de trabajo', dificultad: 100 },
      { respuesta: 'DESCARGA ELECTRICA', descripcion: 'Riesgo de contacto con corriente electrica en tableros o equipos sin aislacion', dificultad: 100 }
    ],
    'ACCION': [
      { respuesta: 'DETECTAR ANOMALIAS', descripcion: 'Identificar ruidos vibraciones u olores inusuales en el equipo antes de operar', dificultad: 100 },
      { respuesta: 'DEJAR LA LLAVE PUESTA', descripcion: 'Estacionar el autoelevador con la llave en el contacto para que la brigada pueda moverlo en evacuacion', dificultad: 200 }
    ]
  },
  'E': {
    'EPP': [
      { respuesta: 'ESCUDO FACIAL', descripcion: 'Proteccion completa del rostro contra proyecciones en esmerilado y corte', dificultad: 200 },
      { respuesta: 'ESPINILLERAS', descripcion: 'Proteccion de la parte inferior de la pierna en sectores con riesgo de impacto mecanico', dificultad: 300 }
    ],
    'CONTROL': [
      { respuesta: 'ENCLAVAMIENTO', descripcion: 'Sistema que impide operar el equipo cuando la guarda de proteccion esta abierta', dificultad: 200 },
      { respuesta: 'ETIQUETADO GHS', descripcion: 'Identificacion obligatoria de productos quimicos con nombre peligros y pictogramas', dificultad: 100 }
    ],
    'AREA': [
      { respuesta: 'ENSAMBLE FINAL', descripcion: 'Linea donde se realiza la prueba electrica y el control de calidad de los electrodomesticos', dificultad: 100 }
    ],
    'PELIGRO': [
      { respuesta: 'EXPLOSION', descripcion: 'Riesgo de liberacion violenta de energia por falla en sistema de presion o gas', dificultad: 200 },
      { respuesta: 'ERGONOMIA', descripcion: 'Riesgo de lesion musculoesqueletica por posturas forzadas movimientos repetitivos o cargas', dificultad: 100 }
    ],
    'ACCION': [
      { respuesta: 'EVACUAR EL AREA', descripcion: 'Salir por la ruta senalizada hacia el punto de encuentro ante cualquier alarma de emergencia', dificultad: 100 },
      { respuesta: 'ETIQUETAR EL ENVASE', descripcion: 'Rotular todo producto quimico con nombre peligros y HDS antes de usarlo en el puesto', dificultad: 100 }
    ]
  },
  'F': {
    'EPP': [
      { respuesta: 'FAJA LUMBAR', descripcion: 'Soporte para la zona lumbar en tareas de levantamiento manual de cargas repetitivas', dificultad: 200 }
    ],
    'CONTROL': [
      { respuesta: 'FUERA DE SERVICIO', descripcion: 'Retiro y rotulacion de un equipo defectuoso hasta su reparacion y habilitacion por mantenimiento', dificultad: 100 },
      { respuesta: 'FILTRO DE PARTICULAS', descripcion: 'Elemento de proteccion respiratoria para polvo y particulas en sectores de inyeccion', dificultad: 200 }
    ],
    'AREA': [
      { respuesta: 'FUNDICION', descripcion: 'Area de inyeccion de aluminio donde se trabaja con metal fundido a alta temperatura', dificultad: 200 }
    ],
    'PELIGRO': [
      { respuesta: 'FUEGO', descripcion: 'Riesgo de incendio por presencia de materiales inflamables o fuentes de ignicion sin control', dificultad: 100 },
      { respuesta: 'FATIGA', descripcion: 'Factor humano que reduce el tiempo de reaccion y aumenta el riesgo de accidente en maquinaria', dificultad: 100 }
    ],
    'ACCION': [
      { respuesta: 'FIRMAR LA AST', descripcion: 'Completar y firmar el analisis de seguridad en el trabajo antes de iniciar la tarea', dificultad: 100 },
      { respuesta: 'FRENADO DEL AUTOELEVADOR', descripcion: 'Verificar que el freno funciona correctamente en la inspeccion pre-operativa antes de operar', dificultad: 100 }
    ]
  },
  'G': {
    'EPP': [
      { respuesta: 'GUANTE ANTICORTE', descripcion: 'Protege las manos del contacto con bordes filosos de chapa en conformado y armado', dificultad: 100 },
      { respuesta: 'GUANTE DE NITRILO', descripcion: 'Proteccion quimica para manipulacion de solventes adhesivos y desmoldantes', dificultad: 100 }
    ],
    'CONTROL': [
      { respuesta: 'GUARDA DE PROTECCION', descripcion: 'Barrera fisica que impide el acceso a partes moviles de la maquina durante el ciclo', dificultad: 100 },
      { respuesta: 'GESTION DEL CAMBIO', descripcion: 'Evaluacion de riesgos antes de modificar un proceso equipo o instalacion de la planta', dificultad: 300 }
    ],
    'AREA': [
      { respuesta: 'GARITA DE SEGURIDAD', descripcion: 'Punto de control de acceso a la planta con registro de visitantes y vehiculos', dificultad: 200 }
    ],
    'PELIGRO': [
      { respuesta: 'GAS INFLAMABLE', descripcion: 'Riesgo de explosion o incendio por acumulacion de gas en area sin ventilacion adecuada', dificultad: 200 },
      { respuesta: 'GOLPE', descripcion: 'Riesgo de impacto contra estructuras equipos o materiales en zonas de circulacion', dificultad: 100 }
    ],
    'ACCION': [
      { respuesta: 'GUARDAR HERRAMIENTAS', descripcion: 'Devolver cada herramienta a su lugar despues de usarla para mantener el orden del puesto', dificultad: 100 },
      { respuesta: 'GESTIONAR EL RESIDUO', descripcion: 'Clasificar y depositar los residuos en el contenedor correcto segun su tipo y peligrosidad', dificultad: 100 }
    ]
  },
  'H': {
    'EPP': [
      { respuesta: 'HEARING PROTECTION', descripcion: 'Proteccion auditiva obligatoria en sectores con ruido superior a 85 dB como conformado de chapa', dificultad: 100 }
    ],
    'CONTROL': [
      { respuesta: 'HIGIENE INDUSTRIAL', descripcion: 'Monitoreo de agentes fisicos quimicos y biologicos del ambiente de trabajo para proteger la salud', dificultad: 200 },
      { respuesta: 'HDS DISPONIBLE', descripcion: 'Hoja de Datos de Seguridad del producto quimico accesible en el puesto antes de su uso', dificultad: 100 }
    ],
    'AREA': [
      { respuesta: 'HERRAMIENTERIA', descripcion: 'Sector de almacenamiento y entrega de herramientas con control de estado y reposicion', dificultad: 200 }
    ],
    'PELIGRO': [
      { respuesta: 'HIPOACUSIA', descripcion: 'Enfermedad profesional por exposicion continua a niveles de ruido superiores a 85 dB', dificultad: 200 },
      { respuesta: 'HUMEDAD EN PISOS', descripcion: 'Condicion insegura que aumenta el riesgo de caida al mismo nivel en pasillos y sectores', dificultad: 100 }
    ],
    'ACCION': [
      { respuesta: 'HABLAR CON EL SUPERVISOR', descripcion: 'Informar al supervisor sobre una condicion insegura o una situacion de riesgo en el puesto', dificultad: 100 },
      { respuesta: 'HACER LA PRE-OPERATIVA', descripcion: 'Realizar la inspeccion pre-operativa del autoelevador antes de operar en cada turno', dificultad: 100 }
    ]
  },
  'I': {
    'EPP': [
      { respuesta: 'INDUMENTARIA IGNIFUGA', descripcion: 'Ropa de proteccion contra calor radiante y llamas en sectores de soldadura y inyeccion', dificultad: 300 }
    ],
    'CONTROL': [
      { respuesta: 'INSPECCION PERIODICA', descripcion: 'Revision programada del estado de equipos EPP y sistemas de proteccion contra incendios', dificultad: 100 },
      { respuesta: 'INGENIERIA DE CONTROL', descripcion: 'Barrera tecnica que protege independientemente de la conducta del operario — guardas enclavamientos', dificultad: 200 }
    ],
    'AREA': [
      { respuesta: 'INYECCION DE PLASTICOS', descripcion: 'Sector donde se producen componentes plasticos con prensas cicladoras y moldes calientes', dificultad: 100 }
    ],
    'PELIGRO': [
      { respuesta: 'INCENDIO', descripcion: 'Emergencia por combustion no controlada que requiere activacion de alarma y evacuacion', dificultad: 100 },
      { respuesta: 'ILUMINACION DEFICIENTE', descripcion: 'Condicion ambiental que aumenta el riesgo de error y accidente en tareas de precision', dificultad: 100 }
    ],
    'ACCION': [
      { respuesta: 'IDENTIFICAR EL QUIMICO', descripcion: 'Leer la etiqueta GHS y la HDS antes de manipular cualquier producto quimico en el puesto', dificultad: 100 },
      { respuesta: 'INFORMAR EL NEAR MISS', descripcion: 'Reportar en la app Estoy Seguro cualquier casi accidente aunque no haya habido lesion', dificultad: 100 }
    ]
  },
  'J': {
    'EPP': [
      { respuesta: 'JEANS RESISTENTES', descripcion: 'Pantalon de trabajo con resistencia mecanica basica para proteccion en tareas de planta', dificultad: 100 }
    ],
    'CONTROL': [
      { respuesta: 'JERARQUIA DE CONTROLES', descripcion: 'Orden de prioridad para aplicar controles de riesgo de la eliminacion al EPP', dificultad: 200 },
      { respuesta: 'JORNADA LIMITADA', descripcion: 'Restriccion del tiempo de exposicion a agentes peligrosos como ruido vibracion o calor', dificultad: 200 }
    ],
    'AREA': [
      { respuesta: 'JEFATURA DE PLANTA', descripcion: 'Sector administrativo de gestion de operaciones con acceso a toda la planta', dificultad: 300 }
    ],
    'PELIGRO': [
      { respuesta: 'JORNADA EXTENSA', descripcion: 'Factor de riesgo psicosocial que genera fatiga acumulada y mayor probabilidad de accidente', dificultad: 200 },
      { respuesta: 'JAULA DE CARGA INESTABLE', descripcion: 'Riesgo de caida de carga por estiba deficiente o accesorios de izaje en mal estado', dificultad: 200 }
    ],
    'ACCION': [
      { respuesta: 'JUSTIFICAR LA PARADA', descripcion: 'Explicar al supervisor por que se detiene una tarea ante una condicion insegura detectada', dificultad: 200 },
      { respuesta: 'JUNTAR LOS RESIDUOS', descripcion: 'Recolectar y clasificar los residuos del puesto de trabajo al finalizar cada turno', dificultad: 100 }
    ]
  },
  'K': {
    'EPP': [
      { respuesta: 'KEVLAR GUANTE', descripcion: 'Guante de fibra de alta resistencia al corte para manipulacion de chapa y piezas filosas', dificultad: 200 }
    ],
    'CONTROL': [
      { respuesta: 'KIT DE DERRAMES', descripcion: 'Conjunto de materiales absorbentes para contener y neutralizar derrames de liquidos peligrosos', dificultad: 100 }
    ],
    'AREA': [
      { respuesta: 'KAIZEN DE SEGURIDAD', descripcion: 'Proceso de mejora continua aplicado a las condiciones de seguridad del puesto de trabajo', dificultad: 300 }
    ],
    'PELIGRO': [
      { respuesta: 'KPI DE ACCIDENTES ALTO', descripcion: 'Indicador de alta tasa de accidentabilidad que senala falta de control efectivo de riesgos', dificultad: 300 }
    ],
    'ACCION': [
      { respuesta: 'KIT DE PRIMEROS AUXILIOS VERIFICADO', descripcion: 'Revisar que el botiquin del sector tenga los elementos completos y vigentes al inicio del turno', dificultad: 200 }
    ]
  },
  'L': {
    'EPP': [
      { respuesta: 'LENTES DE SEGURIDAD', descripcion: 'Antiparras o gafas de proteccion ocular para proyecciones en ensamble y conformado', dificultad: 100 },
      { respuesta: 'LONA DE PROTECCION', descripcion: 'Cobertura para delimitar areas de trabajo en altura y proteger a personas debajo', dificultad: 200 }
    ],
    'CONTROL': [
      { respuesta: 'LOTO', descripcion: 'Lock Out Tag Out — procedimiento de bloqueo y etiquetado de energias equivalente al CATA', dificultad: 100 },
      { respuesta: 'LIMITE DE VELOCIDAD', descripcion: 'Restriccion de velocidad para autoelevadores en zonas compartidas con peatones', dificultad: 100 }
    ],
    'AREA': [
      { respuesta: 'LOGISTICA', descripcion: 'Sector de movimiento de materiales y producto terminado con autoelevadores y trencitos', dificultad: 100 }
    ],
    'PELIGRO': [
      { respuesta: 'LUMBALGIA', descripcion: 'Enfermedad profesional por levantamiento incorrecto de cargas o posturas forzadas repetidas', dificultad: 100 },
      { respuesta: 'LIQUIDO INFLAMABLE', descripcion: 'Sustancia que puede generar vapores combustibles y riesgo de incendio en caso de derrame', dificultad: 100 }
    ],
    'ACCION': [
      { respuesta: 'LIMPIAR EL PUESTO', descripcion: 'Mantener el orden y la limpieza del area de trabajo como condicion basica de seguridad', dificultad: 100 },
      { respuesta: 'LEER LA HDS', descripcion: 'Consultar la Hoja de Datos de Seguridad antes de manipular un producto quimico por primera vez', dificultad: 100 }
    ]
  },
  'M': {
    'EPP': [
      { respuesta: 'MASCARILLA RESPIRATORIA', descripcion: 'Proteccion de las vias respiratorias ante particulas vapores o gases en el ambiente de trabajo', dificultad: 100 },
      { respuesta: 'MAMELUCO IGNIFUGO', descripcion: 'Traje de una pieza con resistencia al calor para trabajos de soldadura y fundicion', dificultad: 200 }
    ],
    'CONTROL': [
      { respuesta: 'MANTENIMIENTO PREVENTIVO', descripcion: 'Revision y ajuste programado de equipos antes de que presenten fallas que generen accidentes', dificultad: 100 },
      { respuesta: 'MANTENIMIENTO AUTONOMO', descripcion: 'Tareas basicas de inspeccion limpieza y ajuste que realiza el operario en su propio equipo', dificultad: 100 }
    ],
    'AREA': [
      { respuesta: 'MATRICERIA', descripcion: 'Sector de fabricacion y reparacion de moldes con riesgo de aplastamiento y corte', dificultad: 100 }
    ],
    'PELIGRO': [
      { respuesta: 'MONOTONIA', descripcion: 'Factor psicosocial que reduce la atencion y aumenta el riesgo de error en tareas repetitivas', dificultad: 200 },
      { respuesta: 'METAL FUNDIDO', descripcion: 'Riesgo de quemadura por proyeccion de aluminio u otro metal en estado liquido', dificultad: 100 }
    ],
    'ACCION': [
      { respuesta: 'MANTENER ORDEN 5S', descripcion: 'Aplicar los cinco principios de orden y limpieza en el puesto al inicio y fin de cada turno', dificultad: 100 },
      { respuesta: 'MARCAR FUERA DE SERVICIO', descripcion: 'Etiquetar un equipo defectuoso como fuera de servicio para evitar su uso hasta la reparacion', dificultad: 100 }
    ]
  },
  'N': {
    'EPP': [
      { respuesta: 'NIVEL AUDITIVO CHECADO', descripcion: 'Verificacion periodica de la audicion del trabajador expuesto a ruido para detectar dano precoz', dificultad: 300 }
    ],
    'CONTROL': [
      { respuesta: 'NEAR MISS REPORTE', descripcion: 'Reporte de casi accidente en la app Estoy Seguro para investigacion y prevencion', dificultad: 100 },
      { respuesta: 'NORMATIVA GHS', descripcion: 'Sistema Globalmente Armonizado de clasificacion y etiquetado de productos quimicos', dificultad: 200 }
    ],
    'AREA': [
      { respuesta: 'NAVAL AREA DE PINTURA', descripcion: 'Sector de aplicacion de recubrimientos con riesgo de exposicion a solventes y vapores', dificultad: 300 }
    ],
    'PELIGRO': [
      { respuesta: 'NEAR MISS IGNORADO', descripcion: 'Riesgo de accidente real cuando un casi accidente no es reportado ni investigado', dificultad: 100 },
      { respuesta: 'NIVEL DE RUIDO ALTO', descripcion: 'Condicion ambiental que genera hipoacusia laboral por exposicion continua sin proteccion', dificultad: 100 }
    ],
    'ACCION': [
      { respuesta: 'NO OPERAR SIN GUARDA', descripcion: 'Detener el equipo y reportar si la guarda de proteccion esta removida o defectuosa', dificultad: 100 },
      { respuesta: 'NOTIFICAR CONDICION INSEGURA', descripcion: 'Informar en la app Estoy Seguro cualquier condicion del ambiente o equipo que represente un riesgo', dificultad: 100 }
    ]
  },
  'O': {
    'EPP': [
      { respuesta: 'OREJERAS', descripcion: 'Proteccion auditiva de copa que cubre completamente el oido externo en zonas de alta exposicion', dificultad: 100 }
    ],
    'CONTROL': [
      { respuesta: 'ORDEN Y LIMPIEZA', descripcion: 'Principio basico de seguridad que reduce caidas tropiezos y riesgos en el puesto de trabajo', dificultad: 100 },
      { respuesta: 'OPERACION CRITICA', descripcion: 'Tarea con alto potencial de accidente grave que requiere estandar AST y EPP especifico', dificultad: 100 }
    ],
    'AREA': [
      { respuesta: 'OFICINAS DE PLANTA', descripcion: 'Sector administrativo adyacente a la linea de produccion con acceso controlado', dificultad: 100 }
    ],
    'PELIGRO': [
      { respuesta: 'OBJETOS EN EL PISO', descripcion: 'Condicion insegura que genera riesgo de tropiezo o caida al mismo nivel', dificultad: 100 },
      { respuesta: 'OLOR QUIMICO EXTRAÑO', descripcion: 'Senal de posible fuga o vapores de solvente que requiere evacuar el area inmediatamente', dificultad: 100 }
    ],
    'ACCION': [
      { respuesta: 'ORDENAR EL PUESTO', descripcion: 'Aplicar 5S al inicio del turno como condicion previa al arranque de la produccion', dificultad: 100 },
      { respuesta: 'OBSERVAR AL COMPAÑERO', descripcion: 'Realizar una observacion de seguridad entre pares en privado y con respeto', dificultad: 100 }
    ]
  },
  'P': {
    'EPP': [
      { respuesta: 'PROTECCION AUDITIVA', descripcion: 'Insercion o copa que reduce la exposicion al ruido en zonas de prensas y conformado', dificultad: 100 },
      { respuesta: 'PANTALLA FACIAL', descripcion: 'Escudo que protege toda la cara de proyecciones en operaciones de esmerilado o soldadura', dificultad: 100 }
    ],
    'CONTROL': [
      { respuesta: 'PERMISO DE TRABAJO', descripcion: 'Autorizacion formal previa a tareas de alto riesgo como altura caliente o espacios confinados', dificultad: 100 },
      { respuesta: 'PROCEDIMIENTO ESCRITO', descripcion: 'Documento que define paso a paso como realizar una tarea de forma segura y correcta', dificultad: 100 }
    ],
    'AREA': [
      { respuesta: 'PRENSAS DE CHAPA', descripcion: 'Zona de conformado donde se trabaja con prensas excentricas de alto riesgo de atrapamiento', dificultad: 100 }
    ],
    'PELIGRO': [
      { respuesta: 'PROYECCION DE PARTICULAS', descripcion: 'Riesgo de impacto ocular por fragmentos que salen disparados durante corte o esmerilado', dificultad: 100 },
      { respuesta: 'POSTURA FORZADA', descripcion: 'Riesgo ergonomico por mantenimiento de posiciones inadecuadas en tareas repetitivas', dificultad: 100 }
    ],
    'ACCION': [
      { respuesta: 'PARAR ANTE EL RIESGO', descripcion: 'Detener la tarea al detectar una condicion insegura y avisar al supervisor antes de continuar', dificultad: 100 },
      { respuesta: 'PRE-OPERATIVA DEL EQUIPO', descripcion: 'Realizar la inspeccion de frenos luces bocina y horquillas antes de operar el autoelevador', dificultad: 100 }
    ]
  },
  'Q': {
    'EPP': [
      { respuesta: 'QUIMICO RESISTENTE TRAJE', descripcion: 'Traje de proteccion contra salpicaduras de acidos bases y solventes en manipulacion quimica', dificultad: 300 }
    ],
    'CONTROL': [
      { respuesta: 'QUIMICA COMPATIBLE ALMACENAMIENTO', descripcion: 'Verificar compatibilidad entre sustancias antes de almacenarlas juntas para evitar reacciones', dificultad: 200 }
    ],
    'AREA': [
      { respuesta: 'QUIMICA ZONA DE ALMACEN', descripcion: 'Sector destinado al almacenamiento seguro de productos quimicos con ventilacion y contencion', dificultad: 200 }
    ],
    'PELIGRO': [
      { respuesta: 'QUEMADURA QUIMICA', descripcion: 'Lesion por contacto con acidos bases o solventes corrosivos sin EPP adecuado', dificultad: 100 },
      { respuesta: 'QUEMADURA TERMICA', descripcion: 'Lesion por contacto con superficies calientes como moldes hornos o metal fundido', dificultad: 100 }
    ],
    'ACCION': [
      { respuesta: 'QUITAR OBSTRUCCIONES', descripcion: 'Liberar los pasillos salidas de emergencia y accesos a extintores de cualquier obstruccion', dificultad: 100 }
    ]
  },
  'R': {
    'EPP': [
      { respuesta: 'RODILLERA', descripcion: 'Proteccion de la rodilla en tareas que requieren arrodillarse sobre superficies duras o rugosas', dificultad: 200 },
      { respuesta: 'RESPIRADOR', descripcion: 'Proteccion de las vias aereas ante vapores organicos particulas o gases toxicos', dificultad: 100 }
    ],
    'CONTROL': [
      { respuesta: 'REPORTE DE INCIDENTE', descripcion: 'Registro en la app Estoy Seguro de cualquier accidente incidente o near miss ocurrido', dificultad: 100 },
      { respuesta: 'ROTACION DE PUESTOS', descripcion: 'Cambio programado de tarea para reducir la exposicion acumulada a un agente de riesgo', dificultad: 200 }
    ],
    'AREA': [
      { respuesta: 'REPARACION Y MANTENIMIENTO', descripcion: 'Sector donde se realizan intervenciones en equipos con riesgo electrico mecanico y de altura', dificultad: 100 }
    ],
    'PELIGRO': [
      { respuesta: 'RUIDO', descripcion: 'Contaminante fisico que causa hipoacusia irreversible por encima de 85 dB sin proteccion', dificultad: 100 },
      { respuesta: 'RADIACION ULTRAVIOLETA', descripcion: 'Exposicion a radiacion optica durante soldadura que puede causar lesion ocular grave', dificultad: 200 }
    ],
    'ACCION': [
      { respuesta: 'REPORTAR EN ESTOY SEGURO', descripcion: 'Usar la app para registrar condiciones inseguras incidentes y near miss del turno', dificultad: 100 },
      { respuesta: 'REVISAR EL EPP', descripcion: 'Inspeccionar el estado del EPP antes de usarlo y retirarlo si presenta deterioro', dificultad: 100 }
    ]
  },
  'S': {
    'EPP': [
      { respuesta: 'SOLDADURA MASCARA', descripcion: 'Careta de proteccion con filtro optico para trabajos de soldadura y corte con llama', dificultad: 100 },
      { respuesta: 'SEÑALIZACION PERSONAL', descripcion: 'Chaleco reflectante obligatorio en sectores con circulacion de vehiculos industriales', dificultad: 100 }
    ],
    'CONTROL': [
      { respuesta: 'SEÑALIZACION DE SEGURIDAD', descripcion: 'Carteles y marcas visuales que indican prohibiciones obligaciones y rutas de emergencia', dificultad: 100 },
      { respuesta: 'SIMULACRO DE EVACUACION', descripcion: 'Practica periodica del plan de emergencias para que el personal conoce las rutas y puntos de encuentro', dificultad: 100 }
    ],
    'AREA': [
      { respuesta: 'SOLDADURA AREA', descripcion: 'Zona de trabajos en caliente con riesgo de incendio proyecciones y radiacion', dificultad: 100 }
    ],
    'PELIGRO': [
      { respuesta: 'SOLVENTE INFLAMABLE', descripcion: 'Liquido con punto de inflamacion bajo que puede generar vapores combustibles en area cerrada', dificultad: 100 },
      { respuesta: 'SOBREESFUERZO', descripcion: 'Lesion musculoesqueletica por aplicacion de fuerza excesiva en levantamiento o empuje de cargas', dificultad: 100 }
    ],
    'ACCION': [
      { respuesta: 'SEÑALIZAR EL AREA', descripcion: 'Colocar senalizacion visible antes de iniciar trabajos que puedan afectar a otras personas', dificultad: 100 },
      { respuesta: 'SOLICITAR EPP NUEVO', descripcion: 'Pedir al supervisor EPP de reemplazo cuando el disponible esta deteriorado o vencido', dificultad: 100 }
    ]
  },
  'T': {
    'EPP': [
      { respuesta: 'TAPONES AUDITIVOS', descripcion: 'Insercion de espuma o silicona que reduce la exposicion al ruido en zonas de prensas', dificultad: 100 },
      { respuesta: 'TRAJE TYVEK', descripcion: 'Overol desechable de proteccion contra particulas fibras y salpicaduras quimicas menores', dificultad: 200 }
    ],
    'CONTROL': [
      { respuesta: 'TAREA ESTANDARIZADA', descripcion: 'Procedimiento definido y aprobado que indica como realizar una operacion de forma segura', dificultad: 100 },
      { respuesta: 'TURNO DE CONTROL', descripcion: 'Periodo en que el personal de EHS recorre los sectores verificando condiciones de seguridad', dificultad: 200 }
    ],
    'AREA': [
      { respuesta: 'TALLER DE MATRICERIA', descripcion: 'Sector de fabricacion y ajuste de moldes con maquinaria de alta precision y riesgo mecanico', dificultad: 100 }
    ],
    'PELIGRO': [
      { respuesta: 'TROPIEZO', descripcion: 'Riesgo de caida al mismo nivel por objetos en el piso cables o desniveles sin senalizar', dificultad: 100 },
      { respuesta: 'TENSION ELECTRICA', descripcion: 'Riesgo de descarga por contacto con conductores o equipos energizados sin aislacion', dificultad: 100 }
    ],
    'ACCION': [
      { respuesta: 'TAPAR CONTENEDORES', descripcion: 'Cerrar y etiquetar correctamente los envases de productos quimicos despues de cada uso', dificultad: 100 },
      { respuesta: 'TRABAJAR CON ARNÉS PUESTO', descripcion: 'Mantener el arnes conectado al punto de anclaje durante toda la tarea en altura sin excepciones', dificultad: 100 }
    ]
  },
  'U': {
    'EPP': [
      { respuesta: 'UNIFORME DE TRABAJO', descripcion: 'Indumentaria reglamentaria que protege al operario de proyecciones y contaminantes menores', dificultad: 100 }
    ],
    'CONTROL': [
      { respuesta: 'UMBRAL DE RUIDO MEDIDO', descripcion: 'Medicion periodica del nivel de presion sonora para verificar que no supera los limites seguros', dificultad: 200 }
    ],
    'AREA': [
      { respuesta: 'UDN PLANTA CORDOBA', descripcion: 'Unidad de negocio de MABE Cordoba donde se producen lavarropas secarropas y cocinas', dificultad: 100 }
    ],
    'PELIGRO': [
      { respuesta: 'UMBRAL DE EXPOSICION SUPERADO', descripcion: 'Condicion en que el trabajador recibe una dosis de agente fisico o quimico superior al limite seguro', dificultad: 300 }
    ],
    'ACCION': [
      { respuesta: 'USAR EPP CORRECTO', descripcion: 'Seleccionar y utilizar el EPP especifico para el riesgo de cada tarea segun el estandar del puesto', dificultad: 100 }
    ]
  },
  'V': {
    'EPP': [
      { respuesta: 'VISOR DE SEGURIDAD', descripcion: 'Proteccion facial transparente contra proyecciones e impactos en esmerilado y corte', dificultad: 100 }
    ],
    'CONTROL': [
      { respuesta: 'VENTILACION FORZADA', descripcion: 'Sistema de extraccion de aire que reduce la concentracion de vapores y particulas en el ambiente', dificultad: 100 },
      { respuesta: 'VERIFICACION DE ARNES', descripcion: 'Inspeccion del arnes antes de cada uso revisando costuras mosqueton y cintas en busca de danos', dificultad: 100 }
    ],
    'AREA': [
      { respuesta: 'VESTUARIO Y LOCKERS', descripcion: 'Zona de cambio de indumentaria donde el operario se prepara antes de ingresar a la planta', dificultad: 100 }
    ],
    'PELIGRO': [
      { respuesta: 'VIBRACION', descripcion: 'Agente fisico transmitido por herramientas y maquinas al cuerpo que puede causar lesiones cronicas', dificultad: 200 },
      { respuesta: 'VOLTAJE EN TABLERO', descripcion: 'Riesgo de descarga electrica al abrir un tablero sin aplicar el procedimiento CATA', dificultad: 100 }
    ],
    'ACCION': [
      { respuesta: 'VERIFICAR EL CANDADO CATA', descripcion: 'Comprobar que el candado esta correctamente colocado y el equipo des-energizado antes de intervenir', dificultad: 100 },
      { respuesta: 'VACIAR EL AREA', descripcion: 'Despejar de personas y equipos la zona de riesgo antes de iniciar una tarea peligrosa', dificultad: 100 }
    ]
  },
  'Z': {
    'EPP': [
      { respuesta: 'ZAPATOS DIELECTRICOS', descripcion: 'Calzado con suela aislante para trabajos con riesgo de contacto electrico en mantenimiento', dificultad: 200 }
    ],
    'CONTROL': [
      { respuesta: 'ZONA DE SEGURIDAD', descripcion: 'Area delimitada donde el personal puede refugiarse en caso de emergencia quimica o explosion', dificultad: 200 }
    ],
    'AREA': [
      { respuesta: 'ZONA DE CARGA Y DESCARGA', descripcion: 'Sector de acceso de camiones y manipulacion de pallets con riesgo de aplastamiento', dificultad: 100 }
    ],
    'PELIGRO': [
      { respuesta: 'ZONA SIN SEÑALIZACION', descripcion: 'Area de la planta sin indicaciones de peligro obligacion o ruta de emergencia visibles', dificultad: 100 }
    ],
    'ACCION': [
      { respuesta: 'ZONIFICAR EL AREA DE TRABAJO', descripcion: 'Delimitar con cinta o conos el perimetro de la tarea antes de iniciar trabajos de riesgo', dificultad: 100 }
    ]
  }
};

const ALPHABET = "ABCDEFGHILMNOPQRSTUVZ".split("");

export const StopPeligroGame = ({ onGameOver, onFinish }: { onGameOver: (score: number) => void, onFinish: (score: number) => void }) => {
  const [view, setView] = useState<'START' | 'WHEEL' | 'PLAY' | 'ROUND_RESULT' | 'FINAL_RESULT'>('START');
  const [totalRounds, setTotalRounds] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [letter, setLetter] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<RoundResult[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [validData, setValidData] = useState<Record<string, Record<string, ValidEntry[]>>>({});
  const [countdown, setCountdown] = useState(3);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayLetter, setDisplayLetter] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSpinning) {
      const interval = setInterval(() => {
        setDisplayLetter(ALPHABET[Math.floor(Math.random() * ALPHABET.length)]);
      }, 50);
      return () => clearInterval(interval);
    } else {
      setDisplayLetter(letter);
    }
  }, [isSpinning, letter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(SHEETS_URL);
        const csv = await response.text();
        
        // Robust CSV parsing
        const parseCSV = (text: string) => {
          const rows: string[][] = [];
          let currentRow: string[] = [];
          let currentCell = '';
          let inQuotes = false;
          for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) {
              currentRow.push(currentCell.trim());
              currentCell = '';
            } else if ((char === '\n' || char === '\r') && !inQuotes) {
              if (currentCell || currentRow.length > 0) {
                currentRow.push(currentCell.trim());
                rows.push(currentRow);
                currentRow = [];
                currentCell = '';
              }
              if (char === '\r' && text[i+1] === '\n') i++;
            } else currentCell += char;
          }
          if (currentCell || currentRow.length > 0) {
            currentRow.push(currentCell.trim());
            rows.push(currentRow);
          }
          return rows;
        };

        const rows = parseCSV(csv);
        if (rows.length < 2) throw new Error('Empty CSV');

        const headers = rows[0].map(h => h.toLowerCase());
        const getIdx = (name: string) => headers.findIndex(h => h.includes(name));
        
        const idx = {
          letra: getIdx('letra'),
          columna: getIdx('columna'),
          respuesta: getIdx('respuesta_ok'),
          descripcion: getIdx('descripcion'),
          dificultad: getIdx('dificultad')
        };

        const map: Record<string, Record<string, ValidEntry[]>> = {};
        rows.slice(1).forEach(row => {
          const letra = (row[idx.letra] || '').trim().toUpperCase();
          const catRaw = (row[idx.columna] || '').trim().toUpperCase();
          const respuesta = (row[idx.respuesta] || '').trim().toUpperCase();
          const descripcion = row[idx.descripcion] || '';
          const difRaw = (row[idx.dificultad] || '1').toLowerCase();
          
          // Map raw category name to our IDs
          let catId = '';
          if (catRaw.includes('EPP')) catId = 'EPP';
          else if (catRaw.includes('CONTROL')) catId = 'CONTROL';
          else if (catRaw.includes('ÁREA') || catRaw.includes('AREA') || catRaw.includes('MABE')) catId = 'AREA';
          else if (catRaw.includes('PELIGRO')) catId = 'PELIGRO';
          else if (catRaw.includes('ACCIÓN') || catRaw.includes('ACCION') || catRaw.includes('PREVENTIVA') || catRaw.includes('ACCION_PREVENTIVA')) catId = 'ACCION';
          
          if (!letra || !catId || !respuesta) return;

          if (!map[letra]) map[letra] = {};
          if (!map[letra][catId]) map[letra][catId] = [];
          
          const dificultad = difRaw.includes('dificil') ? 300 : difRaw.includes('medio') ? 200 : 100;
          
          map[letra][catId].push({ respuesta, descripcion, dificultad });
        });

        setValidData(Object.keys(map).length > 0 ? map : FALLBACK_DATA);
      } catch (e) {
        console.error('Error fetching StopPeligro data:', e);
        setValidData(FALLBACK_DATA);
      }
    };
    fetchData();
  }, []);

  const startGame = (rounds: number) => {
    setTotalRounds(rounds);
    setCurrentRound(1);
    setTotalScore(0);
    startRound();
  };

  const startRound = () => {
    setView('WHEEL');
    setIsSpinning(true);
    const availableLetters = Object.keys(validData).length > 0 ? Object.keys(validData) : ALPHABET;
    const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
    setLetter(randomLetter);

    setTimeout(() => {
      setIsSpinning(false);
      let count = 3;
      setCountdown(3);
      const interval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count === 0) {
          clearInterval(interval);
          setView('PLAY');
          setTimeLeft(60);
          setAnswers({});
        }
      }, 1000);
    }, 2000);
  };

  useEffect(() => {
    if (view === 'PLAY' && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    } else if (view === 'PLAY' && timeLeft === 0) {
      handleStop();
    }
  }, [view, timeLeft]);

  const handleStop = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    const roundResults: RoundResult[] = CATEGORIES.map(cat => {
      const val = (answers[cat.id] || '').trim().toUpperCase();
      const possibleEntries = validData[letter]?.[cat.id] || [];
      
      // Find if the answer is in the valid list
      const match = possibleEntries.find(e => e.respuesta === val);
      
      // Generous validation: if it starts with the letter and is at least 3 chars
      // But we give more points if it's in the official list
      let isValid = false;
      let points = 0;
      let descripcion = '';

      if (match) {
        isValid = true;
        points = match.dificultad;
        descripcion = match.descripcion;
      } else if (val.length >= 3 && val.startsWith(letter)) {
        isValid = true;
        points = 50; // Points for valid but not in official list
      }

      // Bonus for time
      if (isValid && timeLeft > 30) points += 50;
      
      const randomExample = possibleEntries[Math.floor(Math.random() * possibleEntries.length)];
      const example = randomExample ? randomExample.respuesta : `(Ej: ${letter}...)`;

      return {
        category: cat.label,
        value: val,
        isValid,
        points,
        example,
        descripcion
      };
    });

    const roundScore = roundResults.reduce((acc, curr) => acc + curr.points, 0);
    setResults(roundResults);
    setTotalScore(prev => prev + roundScore);
    setView('ROUND_RESULT');
  };

  const nextRound = () => {
    if (currentRound < totalRounds) {
      setCurrentRound(prev => prev + 1);
      startRound();
    } else {
      setView('FINAL_RESULT');
      onGameOver(totalScore);
    }
  };

  const renderStart = () => (
    <div className="p-8 max-w-2xl mx-auto text-center space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="w-24 h-24 bg-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-red-600/20 rotate-12">
          <StopCircle className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase">STOP AL PELIGRO</h1>
        <p className="text-emerald-500 font-mono text-sm tracking-[0.3em] uppercase">El Tutti Frutti de la Seguridad</p>
      </motion.div>

      <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl text-left space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className="w-5 h-5 text-emerald-500" />
          <h3 className="text-sm font-black text-white uppercase tracking-widest">¿Cómo jugar?</h3>
        </div>
        <p className="text-white/60 text-sm leading-relaxed">
          1. Se elegirá una <span className="text-white font-bold">letra aleatoria</span>.<br />
          2. Escribe palabras de seguridad que comiencen con esa letra en cada categoría.<br />
          3. Presiona <span className="text-red-500 font-bold uppercase">STOP!</span> lo más rápido posible.<br />
          4. ¡Gana puntos por respuestas correctas y bonos por tiempo!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
          {CATEGORIES.map(cat => (
            <div key={cat.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Seleccionar Rondas</p>
        <div className="flex justify-center gap-4">
          {[1, 3, 5].map(r => (
            <button
              key={r}
              onClick={() => startGame(r)}
              className={`w-16 h-16 rounded-2xl font-black text-xl transition-all ${
                totalRounds === r ? 'bg-emerald-500 text-slate-950 scale-110' : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <button
          onClick={() => startGame(totalRounds)}
          className="w-full py-6 bg-red-600 hover:bg-red-500 text-white font-black tracking-[0.3em] rounded-2xl transition-all active:scale-95 shadow-xl shadow-red-600/20 flex items-center justify-center gap-3"
        >
          <Play className="w-6 h-6 fill-current" />
          COMENZAR DESAFÍO
        </button>
      </div>
    </div>
  );

  const renderWheel = () => {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 p-8">
        <div className="relative w-64 h-64 mb-12">
          <motion.div
            animate={isSpinning ? { 
              rotate: [0, 360, 720, 1080],
              scale: [1, 1.1, 1]
            } : { rotate: 0 }}
            transition={isSpinning ? { duration: 2, ease: "easeInOut" } : {}}
            className="w-full h-full rounded-[2.5rem] border-8 border-white/10 bg-slate-900 flex items-center justify-center relative shadow-[0_0_50px_rgba(220,38,38,0.3)]"
          >
            <div className="absolute inset-4 border-2 border-white/5 rounded-[1.5rem]" />
            <motion.span 
              key={displayLetter}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-9xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              {displayLetter}
            </motion.span>
          </motion.div>
          
          {/* Decorative elements */}
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-red-600 rounded-2xl rotate-12 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-emerald-500 rounded-2xl -rotate-12 flex items-center justify-center shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isSpinning && (
            <motion.div
              key="countdown"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <p className="text-emerald-500 font-mono text-sm tracking-[0.4em] uppercase mb-4 animate-pulse">¡LETRA SELECCIONADA!</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-9xl font-black text-white">{countdown}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderPlay = () => {
    const timerColor = timeLeft > 30 ? 'text-emerald-500' : timeLeft > 10 ? 'text-amber-500' : 'text-red-500';
    const progress = (timeLeft / 60) * 100;
    const completedCount = Object.values(answers).filter(a => a.trim().length > 0).length;

    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 p-6 rounded-[2rem] border border-white/10">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-red-600/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-3xl bg-red-600 flex flex-col items-center justify-center shadow-2xl border-4 border-white/20">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">LETRA</span>
                <span className="text-4xl font-black text-white">{letter}</span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Ronda {currentRound}</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-1">
                  {CATEGORIES.map(cat => (
                    <div key={cat.id} className={`w-2 h-2 rounded-full ${answers[cat.id] ? 'bg-emerald-500' : 'bg-white/10'}`} />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  {completedCount} de {CATEGORIES.length} misiones
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:block text-right">
              <div className="flex items-center gap-2 mb-1 justify-end">
                <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-[8px] font-black">DP</div>
                <p className="text-[8px] text-white/40 italic">"¡Si brilla verde, es oficial!"</p>
              </div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Bono de Tiempo</p>
              <p className={`text-xl font-mono font-black ${timerColor}`}>+{timeLeft > 30 ? '50' : '0'} PTS</p>
            </div>
            <div className="relative w-20 h-20">
              <svg className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                <motion.circle
                  cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="6"
                  strokeDasharray="226.2"
                  animate={{ strokeDashoffset: 226.2 - (226.2 * progress) / 100 }}
                  className={timerColor}
                />
              </svg>
              <div className={`absolute inset-0 flex items-center justify-center font-mono font-black text-2xl ${timerColor}`}>
                {timeLeft}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORIES.map(cat => {
            const val = (answers[cat.id] || '').trim().toUpperCase();
            const isMatch = validData[letter]?.[cat.id]?.some(e => e.respuesta === val);

            return (
              <motion.div 
                key={cat.id}
                layout
                className={`relative group p-6 rounded-[2rem] border-2 transition-all duration-500 ${
                  isMatch 
                    ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.1)]' 
                    : val.length > 0 
                      ? 'bg-white/5 border-white/20' 
                      : 'bg-white/5 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`text-xs font-black tracking-[0.2em] uppercase ${isMatch ? 'text-emerald-500' : 'text-white/40'}`}>
                      {cat.label}
                    </h3>
                    <p className="text-[10px] text-white/20 font-medium">{cat.desc}</p>
                  </div>
                  {isMatch && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-emerald-500 text-slate-950 text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
                      ¡Técnico!
                    </motion.div>
                  )}
                </div>

                <input
                  type="text"
                  value={answers[cat.id] || ''}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [cat.id]: e.target.value }))}
                  placeholder={`Escribe aquí...`}
                  className="w-full bg-transparent border-none p-0 text-2xl font-black text-white placeholder:text-white/5 outline-none uppercase"
                  autoFocus={cat.id === 'EPP'}
                />

                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: val.length > 0 ? '100%' : '0%' }}
                    className={`h-full ${isMatch ? 'bg-emerald-500' : 'bg-white/20'}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStop}
            className={`w-full py-8 rounded-[2.5rem] font-black text-4xl tracking-[0.2em] transition-all flex flex-col items-center justify-center gap-2 shadow-2xl ${
              completedCount > 0 
                ? 'bg-red-600 text-white shadow-red-600/40' 
                : 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-6">
              <StopCircle className={`w-12 h-12 ${completedCount > 0 ? 'animate-pulse' : ''}`} />
              STOP!
            </div>
            <span className="text-[10px] font-normal tracking-widest opacity-50 uppercase">
              {completedCount === 0 ? 'Escribe al menos una respuesta' : 'Presiona para cerrar la ronda'}
            </span>
          </motion.button>
        </div>
      </div>
    );
  };

  const renderRoundResult = () => {
    const roundScore = results.reduce((a, b) => a + b.points, 0);
    
    // Don Pedro feedback based on score
    const getDonPedroFeedback = () => {
      if (roundScore >= 1000) return "¡Impresionante! Don Pedro está orgulloso. Tu conocimiento de seguridad es de nivel experto.";
      if (roundScore >= 500) return "Buen trabajo. Don Pedro dice que vas por buen camino, pero siempre hay algo nuevo que aprender.";
      return "Don Pedro te recomienda repasar los protocolos. ¡La seguridad es lo primero!";
    };

    return (
      <div className="p-8 max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            Resultados de Ronda
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Puntaje: {roundScore}</h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-start gap-4 text-left"
          >
            <div className="w-12 h-12 rounded-full bg-red-600 flex-shrink-0 flex items-center justify-center font-black text-white">DP</div>
            <div>
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Don Pedro dice:</p>
              <p className="text-sm text-white/80 italic">"{getDonPedroFeedback()}"</p>
            </div>
          </motion.div>
        </div>

        <div className="space-y-3">
          {results.map((res, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl border flex items-center justify-between gap-4 ${
                res.isValid ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              <div className="flex-1">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{res.category}</p>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-black uppercase ${res.isValid ? 'text-white' : 'text-white/20 line-through'}`}>
                    {res.value || '---'}
                  </span>
                  {res.isValid ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                </div>
                {res.isValid && res.descripcion && (
                  <p className="text-[10px] text-emerald-500/60 mt-2 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                    <span className="font-bold uppercase tracking-tighter mr-1">Término Oficial:</span> {res.descripcion}
                  </p>
                )}
                {res.isValid && !res.descripcion && (
                  <p className="text-[10px] text-white/40 mt-2 italic">
                    <span className="text-emerald-500/60 font-bold uppercase mr-1">¡Bien!</span> 
                    Don Pedro sugiere también: <span className="text-white font-bold">{res.example}</span>
                  </p>
                )}
                {!res.isValid && (
                  <p className="text-[10px] text-white/40 mt-2 italic">Ejemplo válido: {res.example}</p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`text-2xl font-mono font-black ${res.isValid ? 'text-emerald-500' : 'text-white/10'}`}>
                  +{res.points}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={nextRound}
          className="w-full py-6 bg-white text-slate-950 font-black tracking-[0.3em] rounded-2xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-3"
        >
          {currentRound < totalRounds ? 'SIGUIENTE RONDA' : 'VER RESULTADO FINAL'}
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    );
  };

  const renderFinalResult = () => (
    <div className="p-8 max-w-2xl mx-auto text-center space-y-12">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
        <Trophy className="w-24 h-24 text-emerald-500 mx-auto" />
        <h2 className="text-5xl font-black text-white uppercase tracking-tighter">DESAFÍO COMPLETADO</h2>
        <p className="text-white/40 font-mono text-sm tracking-[0.4em] uppercase">Puntaje Total Acumulado</p>
        <div className="text-8xl font-black text-emerald-500 font-mono">{totalScore}</div>
      </motion.div>

      <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-6">
        <h3 className="text-xl font-bold text-white uppercase tracking-widest">¡Excelente trabajo preventivo!</h3>
        <p className="text-white/60 text-sm leading-relaxed italic">
          "En Mabe Córdoba, la seguridad no es una opción, es nuestra forma de trabajar. Conocer el vocabulario es el primer paso para identificar peligros y actuar a tiempo."
        </p>
        <div className="pt-6">
          <button
            onClick={() => onFinish(totalScore)}
            className="w-full py-6 bg-emerald-500 text-slate-950 font-black tracking-[0.3em] rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20"
          >
            FINALIZAR REPORTE
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-red-500 selection:text-white">
      <AnimatePresence mode="wait">
        {view === 'START' && renderStart()}
        {view === 'WHEEL' && renderWheel()}
        {view === 'PLAY' && renderPlay()}
        {view === 'ROUND_RESULT' && renderRoundResult()}
        {view === 'FINAL_RESULT' && renderFinalResult()}
      </AnimatePresence>
    </div>
  );
};
