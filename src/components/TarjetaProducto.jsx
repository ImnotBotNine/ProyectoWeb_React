import ImagenProducto from "./ImagenProducto";
import {
  formatearPrecio,
  formatearUsuario,
  nombreCategoria,
  nombreEstado
} from "../js/formato";

export default function TarjetaProducto({
  nombre,
  categoria,
  estado,
  precio,
  descripcion,
  vendedor,
  imagen,
  favorito,
  onFavorito,
  onCambiarEstado,
  onEliminar
}) {
  const vendido = estado === "vendido";

  return (
    <article className="col-12 col-sm-6 col-xl-4">
      <div className={`producto-card ${vendido ? "producto-vendido" : ""}`}>
        <ImagenProducto imagen={imagen} nombre={nombre} clase="producto-imagen" />

        <div className="producto-contenido">
          <div className="producto-encabezado">
            <span className="producto-categoria">{nombreCategoria(categoria)}</span>
            <span className={`badge ${vendido ? "estado-vendido" : "estado-disponible"}`}>
              {nombreEstado(estado)}
            </span>
          </div>

          <h3 className="producto-nombre">{nombre}</h3>
          <p className="producto-descripcion">{descripcion}</p>

          <div className="producto-pie">
            <span className="producto-precio">{formatearPrecio(precio)}</span>
            <span className="producto-usuario">{formatearUsuario(vendedor)}</span>
          </div>

          <div className="producto-acciones">
            <button type="button" className="btn-estado" onClick={onCambiarEstado}>
              {vendido ? "Marcar como disponible" : "Marcar como vendido"}
            </button>

            <button
              type="button"
              className={`btn-favorito ${favorito ? "activo" : ""}`}
              onClick={onFavorito}
              aria-label="Agregar a favoritos"
            >
              {favorito ? "♥" : "♡"}
            </button>

            <button
              type="button"
              className="btn-eliminar"
              onClick={onEliminar}
              aria-label="Eliminar publicación"
            >
              🗑
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
