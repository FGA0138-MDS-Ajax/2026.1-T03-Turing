// Conversão simples de Markdown para HTML, cobrindo apenas a sintaxe que a
// toolbar de resposta do fórum produz: negrito, itálico, sublinhado, listas,
// link, bloco de código e código inline. Não cobre Markdown completo de propósito —
// é suficiente para o que o professor consegue gerar pelos botões da toolbar.
export function markdownParaHtml(texto) {
  if (!texto) return '';

  // Escapa HTML antes de aplicar as transformações, evitando injeção via texto livre
  let html = texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bloco de código ```...``` (antes do código inline, pra não conflitar)
  html = html.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code.trim()}</code></pre>`);

  // Código inline `...`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Negrito **texto**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Itálico *texto*
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Sublinhado __texto__
  html = html.replace(/__([^_]+)__/g, '<u>$1</u>');

  // Link [texto](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Listas: linhas começando com "- " viram <li>, agrupadas em <ul>
  html = html.replace(/(^|\n)((?:- .*(?:\n|$))+)/g, (_, before, bloco) => {
    const itens = bloco
      .trim()
      .split('\n')
      .map((linha) => `<li>${linha.replace(/^- /, '')}</li>`)
      .join('');
    return `${before}<ul>${itens}</ul>`;
  });

  // Listas numeradas: linhas começando com "1. " viram <li>, agrupadas em <ol>
  html = html.replace(/(^|\n)((?:\d+\. .*(?:\n|$))+)/g, (_, before, bloco) => {
    const itens = bloco
      .trim()
      .split('\n')
      .map((linha) => `<li>${linha.replace(/^\d+\.\s/, '')}</li>`)
      .join('');
    return `${before}<ol>${itens}</ol>`;
  });

  // Quebras de linha restantes
  html = html.replace(/\n/g, '<br/>');

  return html;
}