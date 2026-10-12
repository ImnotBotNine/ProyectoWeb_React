export default function ImagenProducto({ imagen, nombre, clase }) {
  return (
    <div className={clase}>
      {imagen ? (
        <img src={imagen} alt={`Imagen de ${nombre}`} />
      ) : (
        <span className="imagen-no-disponible">Imagen no disponible</span>
      )}
    </div>
  );
}
