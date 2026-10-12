import { useState } from "react";

const PAGINAS = [
  { id: "inicio", titulo: "Inicio" }
];

export default function Header({ paginaActual, onNavegar }) {
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
