import ImagenProducto from "./ImagenProducto";
import { acortarTexto, formatearPrecio, formatearUsuario } from "../js/formato";

const LARGO_NOMBRE = 50;
const LARGO_DESCRIPCION = 85;

export default function TarjetaDestacado({
  nombre,
  descripcion,
  precio,
  vendedor,
  imagen
}) {
  return (
    <article className="tarjeta">
      <ImagenProducto imagen={imagen} nombre={nombre} clase="tarjeta-imagen" />

      <div className="tarjeta-cuerpo">
        <h4 className="tarjeta-nombre">{acortarTexto(nombre, LARGO_NOMBRE)}</h4>
        <p className="tarjeta-texto">{acortarTexto(descripcion, LARGO_DESCRIPCION)}</p>

        <div className="tarjeta-pie">
          <span className="tarjeta-precio">{formatearPrecio(precio)}</span>
          <span className="tarjeta-usuario">{formatearUsuario(vendedor)}</span>
        </div>
      </div>
    </article>
  );
}
