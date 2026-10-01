import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Pagina } from '@/componentes/Pagina';
import { DOCUMENTOS } from '@/lib/datos';
import { markdown } from '@/lib/markdown';

// Cada documento legal se lee completo desde docs/legal/, tal cual (sin cambiar una coma).
type Props = { params: Promise<{ id: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => DOCUMENTOS.map(d => ({ id: d.id }));
const documento = (id: string) => DOCUMENTOS.find(d => d.id === id)!;

export async function generateMetadata({ params }: Props) {
  return { title: documento((await params).id).nombre };
}

export default async function Page({ params }: Props) {
  const d = documento((await params).id);
  const md = await readFile(path.join(process.cwd(), 'docs', 'legal', d.archivo), 'utf8');
  return (
    <Pagina titulo={d.nombre} bajada={'Última actualización: ' + d.fecha}>
      <article className="ch-legal" dangerouslySetInnerHTML={{ __html: markdown(md) }} />
    </Pagina>
  );
}
