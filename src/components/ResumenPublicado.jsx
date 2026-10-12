import { formatearPrecio, formatearUsuario, nombreCategoria } from "../js/formato";

export default function ResumenPublicado({ nombre, categoria, descripcion, precio, vendedor }) {
  return (
    <article className="publicado">
      <span className="publicado-categoria">{nombreCategoria(categoria)}</span>
      <h3 className="publicado-nombre">{nombre}</h3>
      <p className="publicado-texto">{descripcion}</p>

      <div className="publicado-pie">
        <span className="publicado-precio">{formatearPrecio(precio)}</span>
        <span className="publicado-usuario">{formatearUsuario(vendedor)}</span>
      </div>
    </article>
  );
}
