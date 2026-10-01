// La cabeza de cada vista: el título y, si Paula la dio, la bajada.
export function Pagina({ titulo, bajada, children }: { titulo: string; bajada?: string; children?: React.ReactNode }) {
  return (
    <>
      <div className="ch-pagina-cabeza">
        <h1 className="ch-titulo">{titulo}</h1>
        {bajada && <p className="ch-bajada">{bajada}</p>}
      </div>
      {children}
    </>
  );
}
