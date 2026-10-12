import ImagenProducto from "./ImagenProducto";
import { acortarTexto, formatearPrecio } from "../js/formato";

const LARGO_NOMBRE = 40;

export default function TarjetaRecomendacion({ nombre, precio, imagen, onVer }) {
  return (
    <a href="#" className="tarjeta-recomendacion" onClick={onVer}>
      <ImagenProducto imagen={imagen} nombre={nombre} clase="recomendacion-imagen" />
      <span className="recomendacion-nombre">{acortarTexto(nombre, LARGO_NOMBRE)}</span>
      <span className="recomendacion-precio">{formatearPrecio(precio)}</span>
    </a>
  );
}
