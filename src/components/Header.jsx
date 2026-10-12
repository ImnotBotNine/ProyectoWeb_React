import { useState } from "react";

const PAGINAS = [
  { id: "inicio", titulo: "Inicio" },
  { id: "mercado", titulo: "Mercado" }
];

export default function Header({
  paginaActual,
  onNavegar,
  busqueda,
  onBuscar
}) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  function navegar(idPagina) {
    setMenuAbierto(false);
    onNavegar(idPagina);
  }

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark header-custom">
        <div className="container-fluid">
          {/* Enlaces con href="#", como el menú de ProyectoDWeb: vuelven al inicio de la página */}
          <a href="#" className="navbar-brand brand-section" onClick={() => navegar("inicio")}>
            <img
              src="/assets/images/icon.png"
              alt="Logo de Infraganti"
              className="brand-logo"
            />
            <span className="brand-text">Infraganti</span>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            aria-label="Abrir menú"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${menuAbierto ? "menu-abierto" : ""}`}
            id="menuPrincipal"
          >
            <div className="search-section">
                <div className="search-container">
                  <span className="search-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="#0e1724">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                  </span>
                  <input
                    type="search"
                    className="search-input"
                    placeholder="Buscar en el Mercado"
                    aria-label="Buscar productos"
                    value={busqueda}
                    onChange={(event) => onBuscar(event.target.value)}
                  />
                </div>
              </div>

            <ul className="navbar-nav ms-auto">
              {PAGINAS.map((pagina) => (
                <li className="nav-item" key={pagina.id}>
                  <a
                    href="#"
                    className={`nav-link ${paginaActual === pagina.id ? "active" : ""}`}
                    onClick={() => navegar(pagina.id)}
                  >
                    {pagina.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
