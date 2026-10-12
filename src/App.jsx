import { useEffect, useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ModalCarrito from "./components/ModalCarrito";
import Inicio from "./pages/Inicio";
import Mercado from "./pages/Mercado";
import Publicar from "./pages/Publicar";
import Producto from "./pages/Producto";
import Login from "./pages/Login";
import { guardarDato, leerDato } from "./js/almacenamiento";

const URL_API = "http://127.0.0.1:8000/productos";
const URL_USUARIOS = "http://127.0.0.1:8001";

const CLAVE_CARRITO = "infraganti-carrito";
const CLAVE_FAVORITOS = "infraganti-favoritos";
const CLAVE_PUBLICADOS = "infraganti-publicados";
const CLAVE_USUARIO = "infraganti-usuario";
const CLAVE_ULTIMA_PUBLICACION = "infraganti-ultima-publicacion";

export default function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [pagina, setPagina] = useState("inicio");
  const [busqueda, setBusqueda] = useState("");
  const [categoriaInicial, setCategoriaInicial] = useState("todas");
  const [idProducto, setIdProducto] = useState(null);
  const [carrito, setCarrito] = useState(leerDato(CLAVE_CARRITO, []));
  const [favoritos, setFavoritos] = useState(leerDato(CLAVE_FAVORITOS, []));
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [idsPublicados, setIdsPublicados] = useState(leerDato(CLAVE_PUBLICADOS, []));

  const [usuario, setUsuario] = useState(leerDato(CLAVE_USUARIO, null));

  const [ultimaPublicacion, setUltimaPublicacion] = useState(leerDato(CLAVE_ULTIMA_PUBLICACION, 0));

  const sesionIniciada = usuario !== null;
  const esAdmin = sesionIniciada && usuario.rol === "admin";

  function guardarCarrito(nuevoCarrito) {
    setCarrito(nuevoCarrito);
    guardarDato(CLAVE_CARRITO, nuevoCarrito);
  }

  function guardarFavoritos(nuevosFavoritos) {
    setFavoritos(nuevosFavoritos);
    guardarDato(CLAVE_FAVORITOS, nuevosFavoritos);
  }

  function guardarPublicados(nuevosIds) {
    setIdsPublicados(nuevosIds);
    guardarDato(CLAVE_PUBLICADOS, nuevosIds);
  }

  function guardarUsuario(nuevoUsuario) {
    setUsuario(nuevoUsuario);
    guardarDato(CLAVE_USUARIO, nuevoUsuario);
  }

  function guardarUltimaPublicacion(momento) {
    setUltimaPublicacion(momento);
    guardarDato(CLAVE_ULTIMA_PUBLICACION, momento);
  }

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
      guardarUltimaPublicacion(Date.now());
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

      if (nuevoEstado === "vendido") {
        guardarCarrito(carrito.filter((item) => item.id !== producto.id));
      }
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
      guardarCarrito(carrito.filter((producto) => producto.id !== id));
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
      guardarCarrito(carrito.filter((producto) => !idsPublicados.includes(producto.id)));
      guardarFavoritos(favoritos.filter((idFavorito) => !idsPublicados.includes(idFavorito)));
      guardarPublicados([]);
    } catch (error) {
      setError(error.message);
      cargarProductos();
    }
  }

  async function iniciarSesion(nick, contrasena) {
    try {
      const respuesta = await fetch(`${URL_USUARIOS}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nick: nick, contrasena: contrasena })
      });

      if (!respuesta.ok) {
        return "Nick o contraseña incorrectos.";
      }

      const datos = await respuesta.json();

      guardarUsuario(datos);
      navegar("inicio");
      return "";
    } catch (error) {
      console.log(error);
      return "No fue posible conectar con la API. Revisa que esté encendida.";
    }
  }

  function cerrarSesion() {
    guardarUsuario(null);
    guardarCarrito([]);
    guardarFavoritos([]);
    setCarritoAbierto(false);
    guardarPublicados([]);
    navegar("inicio");
  }

  function navegar(idPagina) {
    setCategoriaInicial("todas");
    setPagina(idPagina);
  }

  function verMercado(idCategoria) {
    setCategoriaInicial(idCategoria);
    setPagina("mercado");
  }

  function verProducto(id) {
    setIdProducto(id);
    setPagina("producto");
  }

  function buscar(texto) {
    setBusqueda(texto);

    if (pagina !== "mercado") {
      setPagina("mercado");
    }
  }

  function agregarCarrito(producto) {
    const yaExiste = carrito.some((item) => item.id === producto.id);

    if (producto.estado === "vendido" || yaExiste) {
      return;
    }

    guardarCarrito([...carrito, producto]);
  }

  function alternarFavorito(id) {
    if (favoritos.includes(id)) {
      guardarFavoritos(favoritos.filter((idFavorito) => idFavorito !== id));
    } else {
      guardarFavoritos([...favoritos, id]);
    }
  }

  function quitarCarrito(id) {
    guardarCarrito(carrito.filter((item) => item.id !== id));
  }

  return (
    <>
      <Header
        paginaActual={pagina}
        onNavegar={navegar}
        busqueda={busqueda}
        onBuscar={buscar}
        totalCarrito={carrito.length}
        onAbrirCarrito={() => setCarritoAbierto(true)}
        usuario={usuario}
        onCerrarSesion={cerrarSesion}
      />

      <main>
        {pagina === "inicio" && (
          <Inicio
            productos={productos}
            cargando={cargando}
            error={error}
            onRecargar={cargarProductos}
            onVerMercado={verMercado}
            onVerProducto={verProducto}
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
            sesionIniciada={sesionIniciada}
            esAdmin={esAdmin}
            favoritos={favoritos}
            onFavorito={alternarFavorito}
            onCambiarEstado={cambiarEstado}
            onEliminar={eliminarProducto}
            onVerProducto={verProducto}
          />
        )}

        {pagina === "producto" && (
          <Producto
            productos={productos}
            idProducto={idProducto}
            cargando={cargando}
            error={error}
            onRecargar={cargarProductos}
            sesionIniciada={sesionIniciada}
            onIrLogin={() => navegar("login")}
            totalCarrito={carrito.length}
            onAbrirCarrito={() => setCarritoAbierto(true)}
            onAgregarCarrito={agregarCarrito}
            onVerProducto={verProducto}
            onVolver={() => navegar("mercado")}
          />
        )}

        {pagina === "publicar" && sesionIniciada && (
          <Publicar
            productos={productos}
            idsPublicados={idsPublicados}
            esAdmin={esAdmin}
            ultimaPublicacion={ultimaPublicacion}
            onPublicar={publicarProducto}
            onBorrarPublicados={borrarPublicados}
            onIrMercado={() => navegar("mercado")}
          />
        )}

        {(pagina === "login" || (pagina === "publicar" && !sesionIniciada)) && (
          <Login onIniciarSesion={iniciarSesion} />
        )}
      </main>

      <Footer />

      {carritoAbierto && (
        <ModalCarrito
          carrito={carrito}
          onCerrar={() => setCarritoAbierto(false)}
          onQuitar={quitarCarrito}
          onVaciar={() => guardarCarrito([])}
        />
      )}
    </>
  );
}
