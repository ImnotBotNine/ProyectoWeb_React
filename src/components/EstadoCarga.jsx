export default function EstadoCarga({ cargando, error, onReintentar }) {
  return (
    <>
      {cargando && (
        <p className="text-center text-muted">Cargando productos...</p>
      )}

      {error && (
        <div className="alert alert-danger">
          <p>{error}</p>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={onReintentar}
            disabled={cargando}
          >
            Reintentar
          </button>
        </div>
      )}
    </>
  );
}
