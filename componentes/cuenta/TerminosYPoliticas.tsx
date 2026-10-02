'use client';

import Link from 'next/link';
import { DOCUMENTOS, fechaLarga, rutaDocumento } from '@/lib/datos';
import { useSesion } from '@/lib/sesion';
import { useVentanas } from '../Ventanas';

// Los documentos legales, con la fecha en que los aceptó.
export function TerminosYPoliticas() {
  const { firma } = useSesion();
  const { cerrar } = useVentanas();   // al abrir un documento (en su página), la ventana se cierra
  return (
    <div className="ch-bloque">
      <section className="ch-lista" aria-label="Documentos">
        <ul>
          {DOCUMENTOS.map(d => (
            <li key={d.id}>
              <Link className="ch-lista-fila" href={rutaDocumento(d.id)} onClick={cerrar}>
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
