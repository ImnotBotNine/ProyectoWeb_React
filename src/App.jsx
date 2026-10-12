import { useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Inicio from "./pages/Inicio";

export default function App() {
  const [pagina, setPagina] = useState("inicio");

  function navegar(idPagina) {
    setPagina(idPagina);
  }

  return (
    <>
      <Header paginaActual={pagina} onNavegar={navegar} />

      <main>
        {pagina === "inicio" && <Inicio />}
      </main>

      <Footer />
    </>
  );
}
