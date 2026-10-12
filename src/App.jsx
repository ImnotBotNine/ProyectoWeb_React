import { useEffect, useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Inicio from "./pages/Inicio";
import Mercado from "./pages/Mercado";
import Publicar from "./pages/Publicar";
import { guardarDato, leerDato } from "./js/almacenamiento";

const URL_API = "http://127.0.0.1:8000/productos";

// Claves de localStorage: estos datos no se pierden al recargar
const CLAVE_FAVORITOS = "infraganti-favoritos";
const CLAVE_PUBLICADOS = "infraganti-publicados";

export default function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [pagina, setPagina] = useState("inicio");
  const [busqueda, setBusqueda] = useState("");
  const [categoriaInicial, setCategoriaInicial] = useState("todas");
  const [favoritos, setFavoritos] = useState(leerDato(CLAVE_FAVORITOS, []));
  const [idsPublicados, setIdsPublicados] = useState(leerDato(CLAVE_PUBLICADOS, []));

  /* =========================================
     GUARDAR EN EL ESTADO Y EN LOCALSTORAGE
     ========================================= */
  function guardarFavoritos(nuevosFavoritos) {
    setFavoritos(nuevosFavoritos);
    guardarDato(CLAVE_FAVORITOS, nuevosFavoritos);
  }

  function guardarPublicados(nuevosIds) {
    setIdsPublicados(nuevosIds);
    guardarDato(CLAVE_PUBLICADOS, nuevosIds);
  }

  /* =========================================
     API
     ========================================= */
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

  async function publicarProducto(nuevoProducto) {
    try {
      const respuesta = await fetch(URL_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoProducto)
      });

      if (!respuesta.ok) {
        throw new Error("No fue posible publicar el producto.");
      }

      const productoCreado = await respuesta.json();

      setProductos([...productos, productoCreado]);
      guardarPublicados([...idsPublicados, productoCreado.id]);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function cambiarEstado(producto) {
    const nuevoEstado = producto.estado === "vendido" ? "disponible" : "vendido";

    try {
      setError("");

      const respuesta = await fetch(`${URL_API}/${producto.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...producto, estado: nuevoEstado })
      });

      if (!respuesta.ok) {
        throw new Error("No fue posible cambiar el estado.");
      }

      const productoActualizado = await respuesta.json();

      setProductos(productos.map((item) => {
        if (item.id === producto.id) {
          return productoActualizado;
        }
        return item;
      }));
    } catch (error) {
      setError(error.message);
    }
  }

  async function eliminarEnApi(id) {
    const respuesta = await fetch(`${URL_API}/${id}`, {
      method: "DELETE"
    });

    if (!respuesta.ok) {
      throw new Error("No fue posible eliminar la publicación.");
    }
  }

  async function eliminarProducto(id) {
    try {
      setError("");
      await eliminarEnApi(id);

      setProductos(productos.filter((producto) => producto.id !== id));
      guardarFavoritos(favoritos.filter((idFavorito) => idFavorito !== id));
      guardarPublicados(idsPublicados.filter((idPublicado) => idPublicado !== id));
    } catch (error) {
      setError(error.message);
    }
  }

  async function borrarPublicados() {
    try {
      setError("");

      for (const id of idsPublicados) {
        await eliminarEnApi(id);
      }

      setProductos(productos.filter((producto) => !idsPublicados.includes(producto.id)));
      guardarFavoritos(favoritos.filter((idFavorito) => !idsPublicados.includes(idFavorito)));
      guardarPublicados([]);
    } catch (error) {
      setError(error.message);
      cargarProductos();
    }
  }

  /* =========================================
     NAVEGACIÓN Y FAVORITOS
     ========================================= */
  function navegar(idPagina) {
    setCategoriaInicial("todas");
    setPagina(idPagina);
  }

  function verMercado(idCategoria) {
    setCategoriaInicial(idCategoria);
    setPagina("mercado");
  }

  function buscar(texto) {
    setBusqueda(texto);

    if (pagina !== "mercado") {
      setPagina("mercado");
    }
  }

  function alternarFavorito(id) {
    if (favoritos.includes(id)) {
      guardarFavoritos(favoritos.filter((idFavorito) => idFavorito !== id));
    } else {
      guardarFavoritos([...favoritos, id]);
    }
  }

  return (
    <>
      <Header
        paginaActual={pagina}
        onNavegar={navegar}
        busqueda={busqueda}
        onBuscar={buscar}
      />

      <main>
        {pagina === "inicio" && (
          <Inicio
            productos={productos}
            cargando={cargando}
            error={error}
            onRecargar={cargarProductos}
            onVerMercado={verMercado}
          />
        )}

        {pagina === "mercado" && (
          <Mercado
            productos={productos}
            cargando={cargando}
            error={error}
            onRecargar={cargarProductos}
            busqueda={busqueda}
            onBuscar={setBusqueda}
            categoriaInicial={categoriaInicial}
            favoritos={favoritos}
            onFavorito={alternarFavorito}
            onCambiarEstado={cambiarEstado}
            onEliminar={eliminarProducto}
          />
        )}

        {pagina === "publicar" && (
          <Publicar
            productos={productos}
            idsPublicados={idsPublicados}
            onPublicar={publicarProducto}
            onBorrarPublicados={borrarPublicados}
            onIrMercado={() => navegar("mercado")}
          />
        )}
      </main>

      <Footer />
    </>
  );
}
