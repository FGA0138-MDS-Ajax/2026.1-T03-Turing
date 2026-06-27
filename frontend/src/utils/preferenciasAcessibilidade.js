const STORAGE_KEY = 'gsAccessibilityPreferences';

export const DEFAULT_ACCESSIBILITY_PREFERENCES = {
  fontSize: 'medio',
  colorVisionMode: 'nenhum',
  highContrast: false,
  reduceMotion: false,
  screenReader: false,
};

// Escala aplicada apenas ao conteudo (via --gs-font-scale), nunca ao
// <html> inteiro. Isso evita que logo/icones/sidebar (que usam rem)
// cresçam ou diminuam junto com o texto do conteudo.
const FONT_SCALE_BY_SIZE = {
  pequeno: '0.875',
  medio: '1',
  grande: '1.125',
  'muito-grande': '1.25',
};

// Paletas color-blind-safe (baseadas em referencias tipo ColorBrewer /
// Okabe-Ito) usadas para substituir a cor de destaque (--gs-accent) em
// toda a plataforma, nao so dentro do painel. Mantemos os MESMOS nomes
// de variavel que ja existem em layout-shared.css / dashboard-shared.css
// para nao quebrar nada que o resto do time fez.
export const COLOR_VISION_THEMES = {
  nenhum: {
    accent: '#2F5D62',
    accentHover: '#224548',
  },
  protanopia: {
    // Dificuldade em perceber vermelho -> prioriza azul.
    accent: '#0072B2',
    accentHover: '#005A8C',
  },
  deuteranopia: {
    // Dificuldade em perceber verde -> prioriza azul/ciano.
    accent: '#0072B2',
    accentHover: '#005A8C',
  },
  tritanopia: {
    // Dificuldade em perceber azul -> evita azul como referencia
    // principal, prioriza tons de vermelho/rosa.
    accent: '#B23A48',
    accentHover: '#8C2D38',
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

export function loadStoredAccessibilityPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_ACCESSIBILITY_PREFERENCES };
    return normalize(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_ACCESSIBILITY_PREFERENCES };
  }
}

export function persistAccessibilityPreferences(preferences) {
  const normalized = normalize(preferences);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function applyAccessibilityPreferences(preferences) {
  const normalized = normalize(preferences);
  const root = document.documentElement;

  // --- Tamanho da fonte: so escala o conteudo, nunca a raiz do documento ---
  root.style.setProperty('--gs-font-scale', FONT_SCALE_BY_SIZE[normalized.fontSize]);

  // --- Cor (daltonismo): aplica nas MESMAS variaveis que o tema global ja usa ---
  const colorTheme = COLOR_VISION_THEMES[normalized.colorVisionMode];

  const themeVars = {
    '--gs-accent': normalized.highContrast ? '#ffffff' : colorTheme.accent,
    '--gs-accent-hover': normalized.highContrast ? '#e5e7eb' : colorTheme.accentHover,
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

export function loadAndApplyAccessibilityPreferences() {
  const preferences = loadStoredAccessibilityPreferences();
  applyAccessibilityPreferences(preferences);
  return preferences;
}