import Link from 'next/link';
import { Icono } from './Iconos';

// Cabecera blanca de lado a lado. En celular, a la derecha, el botón que abre la hoja del menú.
export function Cabecera({ menuAbierto, onAbrirMenu }: { menuAbierto: boolean; onAbrirMenu: () => void }) {
  return (
    <header className="ch-cabecera">
      <Link className="ch-marca" href="/">
        <span className="ch-logotipo">Clinical <span>hub</span><small>powered by Sustancia Pro</small></span>
      </Link>
      <button type="button" className="ch-boton-redondo ch-abrir-menu" id="abrir-menu" aria-label="Abrir el menú"
        aria-expanded={menuAbierto} aria-controls="menu-lateral" onClick={onAbrirMenu}>
        <Icono id="menu" />
      </button>
    </header>
  );
}
