import { CATEGORIAS } from "../js/formato";

export default function CampoFormulario({
  id,
  etiqueta,
  tipo,
  valor,
  error,
  placeholder,
  ayuda,
  onCambiar,
  onSalir
}) {
  const claseError = error ? "is-invalid" : "";

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{etiqueta}</label>

      {tipo === "select" && (
        <select
          id={id}
          className={`form-select ${claseError}`}
          value={valor}
          onChange={(event) => onCambiar(event.target.value)}
          onBlur={onSalir}
        >
          <option value="">Elige una categoría</option>
          {CATEGORIAS.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
          ))}
        </select>
      )}

      {tipo === "textarea" && (
        <textarea
          id={id}
          className={`form-control ${claseError}`}
          rows="4"
          placeholder={placeholder}
          value={valor}
          onChange={(event) => onCambiar(event.target.value)}
          onBlur={onSalir}
        ></textarea>
      )}

      {tipo !== "select" && tipo !== "textarea" && (
        <input
          type={tipo}
          id={id}
          className={`form-control ${claseError}`}
          placeholder={placeholder}
          value={valor}
          onChange={(event) => onCambiar(event.target.value)}
          onBlur={onSalir}
        />
      )}

      {ayuda && <div className="ayuda-campo">{ayuda}</div>}

      <div className="invalid-feedback">{error}</div>
    </div>
  );
}
