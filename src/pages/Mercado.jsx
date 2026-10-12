import { useState } from "react";

import EncabezadoPagina from "../components/EncabezadoPagina";
import EstadoCarga from "../components/EstadoCarga";
import PanelFiltros from "../components/PanelFiltros";
import MensajeVacio from "../components/MensajeVacio";
import TarjetaProducto from "../components/TarjetaProducto";
import { nombreCategoria } from "../js/formato";

import "../styles/mercado.css";

export default function Mercado({
  productos,
  cargando,
  error,
  onRecargar,
  busqueda,
  onBuscar,
  categoriaInicial,
  favoritos,
  onFavorito,
  onCambiarEstado,
  onEliminar
}) {
  const [categoria, setCategoria] = useState(categoriaInicial);
  const [estado, setEstado] = useState("todos");
  const [precioMinimo, setPrecioMinimo] = useState("");
  const [precioMaximo, setPrecioMaximo] = useState("");
  const [orden, setOrden] = useState("relevancia");

  /* =========================================
     FILTROS Y ORDEN
     ========================================= */

  function coincideTexto(producto) {
    const texto = busqueda.trim().toLowerCase();

    return (
      producto.nombre.toLowerCase().includes(texto) ||
      producto.descripcion.toLowerCase().includes(texto) ||
      nombreCategoria(producto.categoria).toLowerCase().includes(texto)
    );
  }

  function filtrarProductos() {
    const minimo = Number(precioMinimo) || 0;
    const maximo = Number(precioMaximo) || Infinity;

    const resultado = productos.filter((producto) => {
      const coincideCategoria = categoria === "todas" || producto.categoria === categoria;
      const coincideEstado = estado === "todos" || producto.estado === estado;
      const coincidePrecio = producto.precio >= minimo && producto.precio <= maximo;

      return coincideTexto(producto) && coincideCategoria && coincideEstado && coincidePrecio;
    });

    if (orden === "menor") {
      resultado.sort((a, b) => a.precio - b.precio);
    } else if (orden === "mayor") {
      resultado.sort((a, b) => b.precio - a.precio);
    } else if (orden === "nombre") {
      resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    return resultado;
  }

  function limpiarFiltros() {
    onBuscar("");
    setCategoria("todas");
    setEstado("todos");
    setPrecioMinimo("");
    setPrecioMaximo("");
    setOrden("relevancia");
  }

  /* =========================================
     ACCIONES SOBRE UN PRODUCTO
     ========================================= */

  function eliminarProducto(id) {
    if (!confirm("¿Deseas eliminar esta publicación?")) {
      return;
    }

    onEliminar(id);
  }

  const productosMostrados = filtrarProductos();

  return (
    <>
      <EncabezadoPagina
        titulo="Mercado"
        texto="Encuentra productos publicados por otros estudiantes de la comunidad universitaria."
      />

      <section className="mercado-contenido">
        <div className="container-fluid">
          <div className="row g-4">
            <aside className="col-12 col-lg-3">
              <PanelFiltros
                categoria={categoria}
                onCategoria={setCategoria}
                estado={estado}
                onEstado={setEstado}
                precioMinimo={precioMinimo}
                onPrecioMinimo={setPrecioMinimo}
                precioMaximo={precioMaximo}
                onPrecioMaximo={setPrecioMaximo}
                orden={orden}
                onOrden={setOrden}
                onLimpiar={limpiarFiltros}
              />
            </aside>

            <section className="col-12 col-lg-9" aria-labelledby="tituloProductos">
              <div className="productos-header">
                <div>
                  <h2 id="tituloProductos">Productos publicados</h2>
                  <p>
                    {productosMostrados.length === 0
                      ? "No se encontraron productos"
                      : `Mostrando ${productosMostrados.length} producto${productosMostrados.length !== 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>

              <EstadoCarga cargando={cargando} error={error} onReintentar={onRecargar} />

              {!cargando && productosMostrados.length === 0 && (
                <MensajeVacio
                  titulo="No encontramos productos"
                  texto="Intenta cambiar la búsqueda o los filtros."
                />
              )}

              <div className="row g-4">
                {productosMostrados.map((producto) => (
                  <TarjetaProducto
                    key={producto.id}
                    nombre={producto.nombre}
                    categoria={producto.categoria}
                    estado={producto.estado}
                    precio={producto.precio}
                    descripcion={producto.descripcion}
                    vendedor={producto.vendedor}
                    imagen={producto.imagen}
                    favorito={favoritos.includes(producto.id)}
                    onFavorito={() => onFavorito(producto.id)}
                    onCambiarEstado={() => onCambiarEstado(producto)}
                    onEliminar={() => eliminarProducto(producto.id)}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
