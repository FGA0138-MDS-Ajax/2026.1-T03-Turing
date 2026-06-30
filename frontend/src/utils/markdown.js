// Conversão simples de Markdown para HTML, cobrindo apenas a sintaxe que a
// toolbar de resposta do fórum produz: negrito, itálico, sublinhado, listas e link.
export function markdownParaHtml(texto) {
  if (!texto) return '';

  let html = texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  html = html.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  html = html.replace(/__([^_\n]+)__/g, '<u>$1</u>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  const linhas = html.split('\n');
  const resultado = [];
  let dentroUl = false;
  let dentroOl = false;

  for (const linha of linhas) {
    const trimmed = linha.trim();
    const ehItemUl = /^- (.+)/.test(trimmed);
    const ehItemOl = /^\d+\. (.+)/.test(trimmed);

    if (ehItemUl) {
      if (!dentroUl) {
        if (dentroOl) { resultado.push('</ol>'); dentroOl = false; }
        resultado.push('<ul>');
        dentroUl = true;
      }
      resultado.push(`<li>${trimmed.replace(/^- /, '')}</li>`);
    } else if (ehItemOl) {
      if (!dentroOl) {
        if (dentroUl) { resultado.push('</ul>'); dentroUl = false; }
        resultado.push('<ol>');
        dentroOl = true;
      }
      resultado.push(`<li>${trimmed.replace(/^\d+\.\s/, '')}</li>`);
    } else if (trimmed === '') {
      if (!dentroUl && !dentroOl) {
        resultado.push('<br/>');
      }
    } else {
      if (dentroUl) { resultado.push('</ul>'); dentroUl = false; }
      if (dentroOl) { resultado.push('</ol>'); dentroOl = false; }
      resultado.push(`<p style="margin:0;color:#444;">${trimmed}</p>`);
    }
  }

  if (dentroUl) resultado.push('</ul>');
  if (dentroOl) resultado.push('</ol>');

  return resultado.join('');
}