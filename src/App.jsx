import { useEffect, useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Inicio from "./pages/Inicio";

const URL_API = "http://127.0.0.1:8000/productos";

export default function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [pagina, setPagina] = useState("inicio");

  async function cargarProductos() {
    try {
      setCargando(true);
      setError("");

      const respuesta = await fetch(URL_API);

      if (!respuesta.ok) {
        throw new Error("No fue posible cargar los productos.");
      }

      const datos = await respuesta.json();
      setProductos(datos);
    } catch (error) {
      console.log(error);
      setError("No fue posible cargar los productos. Revisa que la API esté encendida.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  function navegar(idPagina) {
    setPagina(idPagina);
  }

  return (
    <>
      <Header paginaActual={pagina} onNavegar={navegar} />

      <main>
        {pagina === "inicio" && (
          <Inicio
            productos={productos}
            cargando={cargando}
            error={error}
            onRecargar={cargarProductos}
          />
        )}
      </main>

      <Footer />
    </>
  );
}
