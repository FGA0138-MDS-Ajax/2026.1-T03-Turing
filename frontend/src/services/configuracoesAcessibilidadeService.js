import {
  applyAccessibilityPreferences,
  loadStoredAccessibilityPreferences,
  persistAccessibilityPreferences,
  DEFAULT_ACCESSIBILITY_PREFERENCES,
} from '../utils/preferenciasAcessibilidade';

// Sem backend por enquanto: a persistencia e via localStorage. Mesmo assim
// tratamos erro de verdade, porque localStorage pode falhar (modo anonimo/
// privado do navegador, quota cheia, bloqueio do navegador, etc).

export async function loadAccessibilitySettings(userKey) {
  try {
    const local = loadStoredAccessibilityPreferences(userKey);
    applyAccessibilityPreferences(local);

    return {
      settings: local,
      source: 'local',
      error: null,
    };
  } catch (err) {
    // Mesmo se o localStorage falhar na leitura, a interface deve
    // continuar funcionando com os valores padrao.
    applyAccessibilityPreferences(DEFAULT_ACCESSIBILITY_PREFERENCES);

    return {
      settings: { ...DEFAULT_ACCESSIBILITY_PREFERENCES },
      source: 'default',
      error: 'Não foi possível carregar suas preferências salvas. Valores padrão foram aplicados.',
    };
  }
}

export async function saveAccessibilitySettings(settings, userKey) {
  try {
    const persisted = persistAccessibilityPreferences(settings, userKey);
    applyAccessibilityPreferences(persisted);

    return {
      settings: persisted,
      synced: true,
      error: null,
    };
  } catch (err) {
    // A preferencia ainda e aplicada visualmente nesta sessao mesmo que
    // a gravacao em disco falhe, mas avisamos que ela pode nao persistir
    // apos recarregar a pagina.
    applyAccessibilityPreferences(settings);

    return {
      settings,
      synced: false,
      error: 'Não foi possível salvar suas preferências. Elas serão perdidas ao recarregar a página.',
    };
  }
}