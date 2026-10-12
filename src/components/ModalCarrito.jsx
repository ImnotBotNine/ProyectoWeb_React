import { formatearPrecio } from "../js/formato";

export default function ModalCarrito({ carrito, onCerrar, onQuitar, onVaciar }) {
  let total = 0;

  carrito.forEach((producto) => {
    total += producto.precio;
  });

  return (
    <div className="modal modal-abierto" aria-labelledby="tituloCarrito">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content modal-producto">
          <div className="modal-header">
            <h2 className="modal-title" id="tituloCarrito">Carrito de compra</h2>
            <button
              type="button"
              className="btn-close"
              aria-label="Cerrar"
              onClick={onCerrar}
            ></button>
          </div>

          <div className="modal-body">
            {carrito.length === 0 ? (
              <p className="text-center text-muted">El carrito está vacío.</p>
            ) : (
              <>
                {carrito.map((producto) => (
                  <div className="carrito-producto" key={producto.id}>
                    <div>
                      <div className="carrito-nombre">{producto.nombre}</div>
                      <small>{producto.vendedor}</small>
                    </div>
                    <div className="carrito-derecha">
                      <span className="carrito-precio">{formatearPrecio(producto.precio)}</span>
                      <button
                        type="button"
                        className="btn-quitar-carrito"
                        onClick={() => onQuitar(producto.id)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}

                <div className="carrito-total">
                  <span>Total</span>
                  <span>{formatearPrecio(total)}</span>
                </div>

                <button
                  type="button"
                  className="btn-ver-producto w-100 mt-3"
                  onClick={onVaciar}
                >
                  Vaciar carrito
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
