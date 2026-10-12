import EstadoCarga from "../components/EstadoCarga";
import MensajeVacio from "../components/MensajeVacio";
import ImagenProducto from "../components/ImagenProducto";
import TarjetaRecomendacion from "../components/TarjetaRecomendacion";
import InfoLibro from "../components/InfoLibro";
import { formatearPrecio, nombreCategoria, nombreEstado } from "../js/formato";

import "../styles/producto.css";

const CANTIDAD_RECOMENDACIONES = 7;

export default function Producto({
  productos,
  idProducto,
  cargando,
  error,
  onRecargar,
  sesionIniciada,
  onIrLogin,
  totalCarrito,
  onAbrirCarrito,
  onAgregarCarrito,
  onVerProducto,
  onVolver
}) {
  const producto = productos.find((item) => item.id === idProducto);

  if (!producto) {
    return (
      <section className="producto-pagina">
        <button type="button" className="btn-volver" onClick={onVolver}>
          ← Volver al Mercado
        </button>

        <EstadoCarga cargando={cargando} error={error} onReintentar={onRecargar} />

        {!cargando && !error && (
          <MensajeVacio
            titulo="No encontramos este producto"
            texto="Puede que la publicación haya sido eliminada."
          />
        )}
      </section>
    );
  }

  const vendido = producto.estado === "vendido";

  const recomendaciones = productos.filter(
    (item) => item.categoria === producto.categoria && item.id !== producto.id
  );

  return (
    <section className="producto-pagina">
      <button type="button" className="btn-volver" onClick={onVolver}>
        ← Volver al Mercado
      </button>

      <div className="row g-4">
        <div className="col-12 col-md-6 col-lg-4">
          <ImagenProducto
            imagen={producto.imagen}
            nombre={producto.nombre}
            clase="detalle-imagen"
          />
        </div>

        <div className="col-12 col-md-6 col-lg-8">
          <div className="detalle-encabezado">
            <div>
              <h1 className="detalle-nombre">{producto.nombre}</h1>
              <p className="detalle-vendedor">
                Por <strong>{producto.vendedor}</strong>
              </p>
            </div>

            {sesionIniciada && (
              <button
                type="button"
                className="btn-carrito-icono"
                onClick={onAbrirCarrito}
                aria-label="Ver carrito"
              >
                🛒
                <span className="carrito-contador">{totalCarrito}</span>
              </button>
            )}
          </div>

          <div className="detalle-tabla">
            <span className="detalle-etiqueta">Precio</span>
            <div>
              <div className="detalle-precio mb-3">{formatearPrecio(producto.precio)}</div>

              {vendido && (
                <p className="detalle-vendido">Este producto ya fue vendido.</p>
              )}

              {!vendido && !sesionIniciada && (
                <button type="button" className="btn-agregar-carrito" onClick={onIrLogin}>
                  Inicia sesión para comprar
                </button>
              )}

              {!vendido && sesionIniciada && (
                <button
                  type="button"
                  className="btn-agregar-carrito"
                  onClick={() => onAgregarCarrito(producto)}
                >
                  Agregar al carrito
                </button>
              )}
            </div>

            <span className="detalle-etiqueta">Categoría</span>
            <span className="detalle-valor">{nombreCategoria(producto.categoria)}</span>

            <span className="detalle-etiqueta">Estado</span>
            <span>
              <span className={`badge ${vendido ? "estado-vendido" : "estado-disponible"}`}>
                {nombreEstado(producto.estado)}
              </span>
            </span>

            <span className="detalle-etiqueta">Carrera</span>
            <span className="detalle-valor">{producto.carrera}</span>

            <span className="detalle-etiqueta">Lugar de entrega</span>
            <span className="detalle-valor">{producto.contacto}</span>

            <span className="detalle-etiqueta">Descripción</span>
            <span className="detalle-valor">{producto.descripcion}</span>
          </div>
        </div>
      </div>

      {producto.categoria === "libros" && (
        <InfoLibro idProducto={producto.id} nombre={producto.nombre} />
      )}

      <section className="recomendaciones">
        <h2>Recomendaciones</h2>

        {recomendaciones.length === 0 ? (
          <p className="recomendaciones-vacio">No hay otros productos en esta categoría.</p>
        ) : (
          <div className="recomendaciones-lista">
            {recomendaciones.slice(0, CANTIDAD_RECOMENDACIONES).map((item) => (
              <TarjetaRecomendacion
                key={item.id}
                nombre={item.nombre}
                precio={item.precio}
                imagen={item.imagen}
                onVer={() => onVerProducto(item.id)}
              />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
