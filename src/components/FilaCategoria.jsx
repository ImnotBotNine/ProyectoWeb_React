import TarjetaDestacado from "./TarjetaDestacado";

const CANTIDAD_POR_FILA = 6;

export default function FilaCategoria({ titulo, productos, onVerMercado }) {
  // Si la categoría no tiene productos, no se muestra la fila
  if (productos.length === 0) {
    return null;
  }

  return (
    <section className="fila-categoria">
      <div className="fila-titulo">
        <h3>{titulo}</h3>
        <button
          type="button"
          className="enlace-mercado"
          onClick={onVerMercado}
        >
          Ver en el Mercado
        </button>
      </div>

      <div className="carrusel">
        {productos.slice(0, CANTIDAD_POR_FILA).map((producto) => (
          <TarjetaDestacado
            key={producto.id}
            nombre={producto.nombre}
            descripcion={producto.descripcion}
            precio={producto.precio}
            vendedor={producto.vendedor}
            imagen={producto.imagen}
          />
        ))}
      </div>
    </section>
  );
}
