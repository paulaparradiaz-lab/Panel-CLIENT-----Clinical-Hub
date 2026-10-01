'use client';

import Link from 'next/link';
import { DOCUMENTOS, fechaLarga, rutaDocumento } from '@/lib/datos';
import { useSesion } from '@/lib/sesion';

// Los documentos legales, con la fecha en que los aceptó.
export function TerminosYPoliticas() {
  const { firma } = useSesion();
  return (
    <div className="ch-bloque">
      <h2 className="ch-titulo-seccion" id="bloque-documentos">Documentos</h2>
      <section className="ch-lista" aria-labelledby="bloque-documentos">
        <ul>
          {DOCUMENTOS.map(d => (
            <li key={d.id}>
              <Link className="ch-lista-fila" href={rutaDocumento(d.id)}>
                <span className="ch-lista-titulo">{d.nombre}</span>
                <span className="ch-lista-meta">Actualizado el {d.fecha}{firma ? ' · Aceptado el ' + fechaLarga(firma.fecha) : ''}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
