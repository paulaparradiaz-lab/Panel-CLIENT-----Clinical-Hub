// Lector mínimo de markdown para los documentos legales: encabezados, párrafos,
// listas, tablas, citas y negrita. No cambia el texto.
export function markdown(md: string): string {
  const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const linea = (t: string) => esc(t)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
  // Se omiten las dos primeras líneas («Clinical Hub | Sustancia Pro» y la fecha), que ya van en el título
  const bloques = md.replace(/^\*\*Clinical Hub \| Sustancia Pro\*\*\s*\n+Última actualización:[^\n]*\n/, '').split(/\n{2,}/);
  return bloques.map(b => {
    b = b.trim();
    if (!b || b === '---') return '';
    if (b.startsWith('> ')) return '<blockquote>' + markdown(b.split('\n').map(l => l.replace(/^> ?/, '')).join('\n')) + '</blockquote>';
    if (/^#{2,3} /.test(b)) { const n = b.startsWith('###') ? 3 : 2; return `<h${n}>${linea(b.replace(/^#+ /, ''))}</h${n}>`; }
    if (b.startsWith('|')) {
      const filas = b.split('\n').filter(l => !/^\|[-| ]+\|$/.test(l)).map(l => l.slice(1, -1).split('|').map(c => linea(c.trim())));
      return '<table><thead><tr>' + filas[0].map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>' +
        filas.slice(1).map(f => '<tr>' + f.map(c => `<td>${c}</td>`).join('') + '</tr>').join('') + '</tbody></table>';
    }
    if (/^- /m.test(b) && b.split('\n').every(l => l.startsWith('- '))) return '<ul>' + b.split('\n').map(l => `<li>${linea(l.slice(2))}</li>`).join('') + '</ul>';
    if (b.split('\n').some(l => l.startsWith('- '))) {
      const [antes, ...items] = b.split('\n');
      return `<p>${linea(antes)}</p><ul>` + items.map(l => `<li>${linea(l.replace(/^- /, ''))}</li>`).join('') + '</ul>';
    }
    return '<p>' + b.split('\n').map(linea).join('<br>') + '</p>';
  }).join('');
}
