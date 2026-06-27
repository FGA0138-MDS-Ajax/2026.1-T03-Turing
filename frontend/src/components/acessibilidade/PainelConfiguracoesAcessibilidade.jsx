import { useEffect, useRef, useState } from 'react';
import './PainelConfiguracoesAcessibilidade.css';
import {
  DEFAULT_ACCESSIBILITY_PREFERENCES,
  COLOR_VISION_THEMES,
  applyAccessibilityPreferences,
} from '../../utils/preferenciasAcessibilidade';
import {
  loadAccessibilitySettings,
  saveAccessibilitySettings,
} from '../../services/configuracoesAcessibilidadeService';

const FONT_SIZE_OPTIONS = [
  { id: 'pequeno', label: 'Pequeno', size: '14px' },
  { id: 'medio', label: 'Médio', size: '16px' },
  { id: 'grande', label: 'Grande', size: '18px' },
  { id: 'muito-grande', label: 'Muito Grande', size: '20px' },
];

const COLOR_VISION_OPTIONS = [
  { id: 'nenhum', label: 'Nenhum', hint: 'Cores padrão do sistema' },
  { id: 'protanopia', label: 'Protanopia', hint: 'Dificuldade com vermelho' },
  { id: 'deuteranopia', label: 'Deuteranopia', hint: 'Dificuldade com verde' },
  { id: 'tritanopia', label: 'Tritanopia', hint: 'Dificuldade com azul' },
];

function Toggle({ checked, onChange, title, subtitle }) {
  return (
    <button
      type="button"
      className="ac-toggle-row"
      onClick={onChange}
      role="switch"
      aria-checked={checked}
    >
      <div>
        <p className="ac-toggle-title">{title}</p>
        <p className="ac-toggle-subtitle">{subtitle}</p>
      </div>
      <span className={`ac-switch ${checked ? 'ac-switch--on' : ''}`}>
        <span className="ac-switch-knob" />
      </span>
    </button>
  );
}

const COLOR_VISION_LABELS = {
  nenhum: { title: 'Padrão', description: 'Cores originais da interface, sem ajustes de daltonismo.' },
  protanopia: { title: 'Protanopia', description: 'Reduz o peso do vermelho e prioriza azul para diferenciar elementos.' },
  deuteranopia: { title: 'Deuteranopia', description: 'Reduz a dependência de verde e prioriza azul para diferenciar elementos.' },
  tritanopia: { title: 'Tritanopia', description: 'Evita usar azul como referência principal e prioriza tons de vermelho.' },
};

export function AccessibilitySettingsPanel({
  title = 'Configurações de Acessibilidade',
  subtitle = 'Personalize a plataforma para melhor atender às suas necessidades.',
}) {
  const [settings, setSettings] = useState(DEFAULT_ACCESSIBILITY_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState('');

  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function fetchSettings() {
      setLoading(true);
      setError('');
      const result = await loadAccessibilitySettings();
      if (!mounted) return;

      setSettings(result.settings);
      if (result.error) {
        setError(result.error);
      }
      setLoading(false);
    }

    fetchSettings();

    return () => {
      mounted = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const colorPreview = {
    ...COLOR_VISION_LABELS[settings.colorVisionMode],
    accent: COLOR_VISION_THEMES[settings.colorVisionMode].accent,
  };

  const scheduleSave = (nextSettings) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    setSaving(true);
    setSaveMessage('');
    setError('');

    saveTimeoutRef.current = setTimeout(async () => {
      const result = await saveAccessibilitySettings(nextSettings);
      setSaving(false);

      if (result.synced) {
        setSaveMessage('Configurações salvas com sucesso.');
      } else if (result.error) {
        setError(result.error);
      }
    }, 400);
  };

  const updateSettings = (patch) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    applyAccessibilityPreferences(next);
    scheduleSave(next);
  };

  if (loading) {
    return (
      <div className="ac-page">
        <h1 className="ac-title">{title}</h1>
        <p className="ac-subtitle">{subtitle}</p>
        <div className="ac-section ac-skeleton" aria-hidden="true">
          <div className="ac-skeleton-line ac-skeleton-line--title" />
          <div className="ac-skeleton-line" />
          <div className="ac-skeleton-grid">
            <div className="ac-skeleton-box" />
            <div className="ac-skeleton-box" />
            <div className="ac-skeleton-box" />
            <div className="ac-skeleton-box" />
          </div>
        </div>
        <p className="ac-loading-text" role="status" aria-live="polite">
          Carregando suas preferências de acessibilidade...
        </p>
      </div>
    );
  }

  return (
    <div
      className={[
        'ac-page',
        settings.highContrast ? 'ac-page--high-contrast' : '',
        settings.reduceMotion ? 'ac-page--reduce-motion' : '',
        settings.screenReader ? 'ac-page--screen-reader' : '',
      ].filter(Boolean).join(' ')}
    >
      <h1 className="ac-title">{title}</h1>
      <p className="ac-subtitle">{subtitle}</p>

      <section className="ac-section ac-status-board">
        <p className="ac-section-title">Estado Atual</p>
        <div className="ac-status-grid">
          <span className={`ac-status-chip ${settings.highContrast ? 'is-active' : ''}`}>Alto contraste {settings.highContrast ? 'ativo' : 'desligado'}</span>
          <span className={`ac-status-chip ${settings.reduceMotion ? 'is-active' : ''}`}>Animações {settings.reduceMotion ? 'reduzidas' : 'normais'}</span>
          <span className={`ac-status-chip ${settings.screenReader ? 'is-active' : ''}`}>Leitor de tela {settings.screenReader ? 'ativo' : 'desligado'}</span>
        </div>
      </section>

      <section className="ac-section ac-section-info">
        <p className="ac-section-title">Sobre Acessibilidade</p>
        <p className="ac-section-text">
          Estas configurações ajudam a tornar a plataforma mais acessível para todos. As alterações
          se aplicam durante toda a sua sessão.
        </p>
      </section>

      {settings.screenReader && (
        <section className="ac-section ac-section-access-note">
          <p className="ac-section-title">Modo de Leitura Ativo</p>
          <p className="ac-section-text">
            A interface agora dá mais destaque aos contornos, contraste e áreas clicáveis para facilitar a navegação.
          </p>
        </section>
      )}

      <section className="ac-section">
        <p className="ac-section-title">Tamanho da Fonte</p>
        <p className="ac-section-text">Ajuste o tamanho do texto para maior legibilidade.</p>

        <div className="ac-font-grid">
          {FONT_SIZE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`ac-font-option ${settings.fontSize === option.id ? 'ac-font-option--active' : ''}`}
              onClick={() => updateSettings({ fontSize: option.id })}
            >
              <span className="ac-font-letter">T</span>
              <span className="ac-font-label">{option.label}</span>
              <span className="ac-font-size">{option.size}</span>
            </button>
          ))}
        </div>

        <p className="ac-preview-text">
          Prévia: Este é um exemplo de texto com o tamanho atual da fonte. Você pode ler confortavelmente?
        </p>
      </section>

      <section className="ac-section">
        <p className="ac-section-title">Modo para Daltonismo</p>
        <p className="ac-section-text">Ajuste as cores da interface para diferentes tipos de daltonismo.</p>

        <div className="ac-radio-list">
          {COLOR_VISION_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`ac-radio-option ${settings.colorVisionMode === option.id ? 'ac-radio-option--active' : ''}`}
              onClick={() => updateSettings({ colorVisionMode: option.id })}
            >
              <div>
                <p className="ac-radio-title">{option.label}</p>
                <p className="ac-radio-subtitle">{option.hint}</p>
              </div>
              <span className="ac-radio-dot" />
            </button>
          ))}
        </div>

        <div className="ac-color-preview-card">
          <div className="ac-color-preview-header">
            <div>
              <p className="ac-color-preview-name">{colorPreview.title}</p>
              <p className="ac-color-preview-description">{colorPreview.description}</p>
            </div>
            <span className="ac-color-preview-badge">Ativo</span>
          </div>

          <p className="ac-color-preview-label">Cor de destaque aplicada em toda a plataforma:</p>
          <div className="ac-color-preview-sample">
            <div className="ac-color-preview-sample-content">
              <span className="ac-color-chip" style={{ background: colorPreview.accent }} />
              <button type="button" className="ac-color-preview-pill" style={{ background: colorPreview.accent, color: '#fff', border: 'none' }}>
                Botão de exemplo
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="ac-section">
        <p className="ac-section-title">Outras Configurações</p>

        <Toggle
          checked={settings.highContrast}
          onChange={() => updateSettings({ highContrast: !settings.highContrast })}
          title="Alto Contraste"
          subtitle="Aumenta o contraste entre texto e fundo"
        />

        <Toggle
          checked={settings.reduceMotion}
          onChange={() => updateSettings({ reduceMotion: !settings.reduceMotion })}
          title="Reduzir Animações"
          subtitle="Minimiza efeitos de movimento na interface"
        />

        <Toggle
          checked={settings.screenReader}
          onChange={() => updateSettings({ screenReader: !settings.screenReader })}
          title="Leitor de Tela"
          subtitle="Otimiza a experiência para leitores de tela"
        />
      </section>

      <div className="ac-feedback-row" aria-live="polite">
        {saving && <span className="ac-feedback ac-feedback--saving">Salvando configurações...</span>}
        {!saving && saveMessage && <span className="ac-feedback ac-feedback--ok">{saveMessage}</span>}
        {error && <span className="ac-feedback ac-feedback--error">{error}</span>}
      </div>
    </div>
  );
}