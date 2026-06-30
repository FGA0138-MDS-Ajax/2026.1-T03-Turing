const STORAGE_KEY_PREFIX = 'gsAccessibilityPreferences';
const GUEST_KEY = 'guest';

// As preferencias de acessibilidade sao por usuario, nao globais da
// plataforma: cada conta logada tem sua propria chave no localStorage.
// 'guest' e usado antes do login (ex.: na propria tela de Login) ou se
// por algum motivo nao houver usuario identificavel.
function storageKeyFor(userKey) {
  const safeKey = userKey ? String(userKey).toLowerCase().trim() : GUEST_KEY;
  return `${STORAGE_KEY_PREFIX}:${safeKey}`;
}

export const DEFAULT_ACCESSIBILITY_PREFERENCES = {
  fontSize: 'medio',
  colorVisionMode: 'nenhum',
  highContrast: false,
  reduceMotion: false,
  screenReader: false,
};

// Escala aplicada ao <html>, que afeta tudo que usa rem/em no app
// (titulos, paragrafos, itens de menu, etc). Elementos que NAO devem
// escalar (logo, avatar, nome do usuario no header) foram convertidos
// para px fixo nos respectivos CSS (layout-shared.css e aluno.css),
// entao ficam isentos desta escala mesmo estando dentro do <html>.
const FONT_SCALE_BY_SIZE = {
  pequeno: 0.875,
  medio: 1,
  grande: 1.125,
  'muito-grande': 1.25,
};

// IMPORTANTE: isto NAO e uma simulacao de como uma pessoa daltonica veria
// as cores originais (isso seria um filtro tipo hue-rotate, util so para
// designers testarem, e que reduz contraste para quem realmente tem
// daltonismo). Isto e uma correcao/realce: trocamos a cor de destaque por
// uma que a pessoa com aquele tipo de daltonismo distingue melhor dos
// outros elementos da tela (ex.: azul para quem tem dificuldade com
// vermelho/verde). Paletas baseadas em referencias color-blind-safe
// (Okabe-Ito / ColorBrewer). Mantemos os MESMOS nomes de variavel que ja
// existem em layout-shared.css / dashboard-shared.css para nao quebrar
// nada que o resto do time fez.
export const COLOR_VISION_THEMES = {
nenhum:{
    accent:'#2F5D62',
    accentHover:'#224548',

    teacherBg:'#E8F3F4',
    teacherText:'#2F5D62',

    studentBg:'#FBF0E4',
    studentText:'#B0641C',

    successBg:'#EAF3DE',
    successText:'#3B6D11',

    warningBg:'#FAEEDA',
    warningText:'#854F0B',
},
  protanopia: {
    // Dificuldade em perceber vermelho -> prioriza azul.
    accent: '#0072B2',
    accentHover: '#005A8C',

    teacherBg:'#E8F3F4',
    teacherText:'#2F5D62',

    studentBg:'#FBF0E4',
    studentText:'#B0641C',

    successBg:'#EAF3DE',
    successText:'#3B6D11',

    warningBg:'#FAEEDA',
    warningText:'#854F0B',
  },
  deuteranopia: {
    // Dificuldade em perceber verde -> prioriza azul/ciano.
    accent: '#0072B2',
    accentHover: '#005A8C',

    teacherBg:'#E8F3F4',
    teacherText:'#2F5D62',

    studentBg:'#FBF0E4',
    studentText:'#abb01c',

    successBg:'#EAF3DE',
    successText:'#719516',

    warningBg:'#FAEEDA',
    warningText:'#73850b',
  },
  tritanopia: {
    // Dificuldade em perceber azul -> evita azul como referencia
    // principal, prioriza tons de vermelho/rosa.
    accent: '#B23A48',
    accentHover: '#8C2D38',

    teacherBg:'#E8F3F4',
    teacherText:'#622f4b',

    studentBg:'#FBF0E4',
    studentText:'#B0641C',

    successBg:'#EAF3DE',
    successText:'#3B6D11',

    warningBg:'#FAEEDA',
    warningText:'#854F0B',
  },
};

function normalize(raw) {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_ACCESSIBILITY_PREFERENCES };
  }

  const next = {
    ...DEFAULT_ACCESSIBILITY_PREFERENCES,
    ...raw,
  };

  if (!['pequeno', 'medio', 'grande', 'muito-grande'].includes(next.fontSize)) {
    next.fontSize = DEFAULT_ACCESSIBILITY_PREFERENCES.fontSize;
  }

  if (!['nenhum', 'protanopia', 'deuteranopia', 'tritanopia'].includes(next.colorVisionMode)) {
    next.colorVisionMode = DEFAULT_ACCESSIBILITY_PREFERENCES.colorVisionMode;
  }

  next.highContrast = Boolean(next.highContrast);
  next.reduceMotion = Boolean(next.reduceMotion);
  next.screenReader = Boolean(next.screenReader);

  return next;
}

export function loadStoredAccessibilityPreferences(userKey) {
  try {
    const raw = localStorage.getItem(storageKeyFor(userKey));
    if (!raw) return { ...DEFAULT_ACCESSIBILITY_PREFERENCES };
    return normalize(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_ACCESSIBILITY_PREFERENCES };
  }
}

export function persistAccessibilityPreferences(preferences, userKey) {
  const normalized = normalize(preferences);
  localStorage.setItem(storageKeyFor(userKey), JSON.stringify(normalized));
  return normalized;
}

export function applyAccessibilityPreferences(preferences) {
  const normalized = normalize(preferences);
  const root = document.documentElement;

  // --- Tamanho da fonte: escala o <html>, que afeta tudo em rem/em.
  // Logo, avatar e nome do usuario no header usam px fixo nos CSS de
  // layout e por isso nao sao afetados por esta escala. ---
  const scale = FONT_SCALE_BY_SIZE[normalized.fontSize];
  root.style.fontSize = `${scale * 100}%`;
  root.style.setProperty('--gs-font-scale', String(scale));

  // --- Cor (daltonismo): aplica nas MESMAS variaveis que o tema global ja usa ---
  const colorTheme = COLOR_VISION_THEMES[normalized.colorVisionMode];

  const themeVars = {
    '--gs-accent': normalized.highContrast ? '#ffffff' : colorTheme.accent,
    '--gs-accent-hover': normalized.highContrast ? '#e5e7eb' : colorTheme.accentHover,
    '--forum-aluno-bg': colorTheme.studentBg,
    '--forum-aluno-text': colorTheme.studentText,

    '--forum-prof-bg': colorTheme.teacherBg,
    '--forum-prof-text': colorTheme.teacherText,

    '--forum-respondida-bg': colorTheme.successBg,
    '--forum-respondida-text': colorTheme.successText,

    '--forum-aguardando-bg': colorTheme.warningBg,
    '--forum-aguardando-text': colorTheme.warningText,
  };

  // --- Alto contraste: so sobrescreve fundo/texto/borda quando ativo ---
  if (normalized.highContrast) {
    Object.assign(themeVars, {
      '--gs-bg-page': '#000000',
      '--gs-surface': '#0f0f0f',
      '--gs-surface-2': '#111111',
      '--gs-sidebar-bg': '#050505',
      '--gs-topbar-bg': '#050505',
      '--gs-content-bg': '#050505',
      '--gs-border': '#ffffff',
      '--gs-text-primary': '#ffffff',
      '--gs-text-secondary': '#d1d5db',
      '--gs-text-muted': '#d1d5db',
      '--gs-card-shadow': 'none',
      '--gs-icon-color': '#ffffff',
      '--gs-icon-background': '#111111',


    });
  } else {
    // Restaura os valores padrao do tema global ao desligar alto contraste,
    // para nao deixar nenhuma variavel "presa" no estado anterior.
    Object.assign(themeVars, {
      '--gs-bg-page': '#F3F4F6',
      '--gs-surface': '#fdfbf7',
      '--gs-surface-2': '#f6f1ec',
      '--gs-sidebar-bg': '#fdfbf7',
      '--gs-topbar-bg': '#fdfbf7',
      '--gs-content-bg': '#f6f1ec',
      '--gs-border': '#e5eff0',
      '--gs-text-primary': '#101828',
      '--gs-text-secondary': '#6A7282',
      '--gs-text-muted': '#99A1AF',
      '--gs-card-shadow': '0 10px 28px rgba(15, 47, 85, 0.06)',
      '--gs-icon-color': 'var(--gs-accent)',
      '--gs-icon-background': '#DBEAFE',
    });
  }

  root.setAttribute('data-color-vision', normalized.colorVisionMode);
  root.setAttribute('data-high-contrast', String(normalized.highContrast));
  root.setAttribute('data-reduce-motion', String(normalized.reduceMotion));
  root.setAttribute('data-screen-reader', String(normalized.screenReader));

  Object.entries(themeVars).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
}

// userKey: identificador do usuario logado (ex.: email). Se omitido,
// tenta descobrir automaticamente a partir do token salvo no
// localStorage (util no main.jsx, antes do React/AuthContext montar);
// se ainda assim nao houver usuario, usa as preferencias de 'guest'
// (ex.: tela de Login, antes de qualquer login).
function getUserKeyFromStoredToken() {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload.email || null;
  } catch {
    return null;
  }
}

export function loadAndApplyAccessibilityPreferences(userKey) {
  const resolvedKey = userKey !== undefined ? userKey : getUserKeyFromStoredToken();
  const preferences = loadStoredAccessibilityPreferences(resolvedKey);
  applyAccessibilityPreferences(preferences);
  return preferences;
}