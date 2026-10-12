import { CATEGORIAS } from "../js/formato";

export default function PanelFiltros({
  categoria,
  onCategoria,
  estado,
  onEstado,
  precioMinimo,
  onPrecioMinimo,
  precioMaximo,
  onPrecioMaximo,
  orden,
  onOrden,
  onLimpiar
}) {
  return (
    <div className="panel-filtros">
      <div className="filtros-header">
        <h2>Filtros</h2>
        <button type="button" className="btn-limpiar" onClick={onLimpiar}>
          Limpiar
        </button>
      </div>

      <div className="filtro-grupo">
        <label htmlFor="filtroCategoria">Categoría</label>
        <select
          id="filtroCategoria"
          className="form-select"
          value={categoria}
          onChange={(event) => onCategoria(event.target.value)}
        >
          <option value="todas">Todas las categorías</option>
          {CATEGORIAS.map((item) => (
            <option key={item.id} value={item.id}>{item.nombre}</option>
          ))}
        </select>
      </div>

      <div className="filtro-grupo">
        <label htmlFor="filtroEstado">Estado</label>
        <select
          id="filtroEstado"
          className="form-select"
          value={estado}
          onChange={(event) => onEstado(event.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="disponible">Disponibles</option>
          <option value="vendido">Vendidos</option>
        </select>
      </div>

      <div className="filtro-grupo">
        <label htmlFor="precioMinimo">Precio mínimo</label>
        <input
          type="number"
          id="precioMinimo"
          className="form-control"
          min="0"
          placeholder="Ej: 10000"
          value={precioMinimo}
          onChange={(event) => onPrecioMinimo(event.target.value)}
        />
      </div>

      <div className="filtro-grupo">
        <label htmlFor="precioMaximo">Precio máximo</label>
        <input
          type="number"
          id="precioMaximo"
          className="form-control"
          min="0"
          placeholder="Ej: 500000"
          value={precioMaximo}
          onChange={(event) => onPrecioMaximo(event.target.value)}
        />
      </div>

      <div className="filtro-grupo">
        <label htmlFor="ordenProductos">Ordenar por</label>
        <select
          id="ordenProductos"
          className="form-select"
          value={orden}
          onChange={(event) => onOrden(event.target.value)}
        >
          <option value="relevancia">Relevancia</option>
          <option value="menor">Precio: menor a mayor</option>
          <option value="mayor">Precio: mayor a menor</option>
          <option value="nombre">Nombre A-Z</option>
        </select>
      </div>
    </div>
  );
}
