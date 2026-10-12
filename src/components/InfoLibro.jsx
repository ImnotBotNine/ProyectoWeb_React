import { useState } from "react";

import { buscarLibro, urlPortada } from "../services/openLibrary";

function tituloInicial(nombre) {
  if (nombre.substring(0, 6) === "Libro ") {
    return nombre.substring(6);
  }
  return nombre;
}

function consultaNueva(idProducto, nombre) {
  return {
    idProducto: idProducto,
    titulo: tituloInicial(nombre),
    libros: [],
    cargando: false,
    error: "",
    buscado: false
  };
}

export default function InfoLibro({ idProducto, nombre }) {
  const [consulta, setConsulta] = useState(consultaNueva(idProducto, nombre));

  const actual =
    consulta.idProducto === idProducto ? consulta : consultaNueva(idProducto, nombre);

  async function buscar(event) {
    event.preventDefault();

    if (actual.titulo.trim() === "") {
      setConsulta({ ...actual, error: "Escribe un título para buscar.", libros: [] });
      return;
    }

    setConsulta({ ...actual, cargando: true, error: "", libros: [] });

    try {
      const datos = await buscarLibro(actual.titulo.trim());
      setConsulta({ ...actual, cargando: false, error: "", libros: datos.docs, buscado: true });
    } catch (error) {
      setConsulta({ ...actual, cargando: false, error: error.message, libros: [], buscado: true });
    }
  }

  return (
    <section className="info-libro">
      <h2>Información del libro</h2>
      <p className="info-libro-texto">
        Busca el título en Open Library para conocer el autor, el año y la portada.
      </p>

      <form className="info-libro-buscador" onSubmit={buscar}>
        <input
          type="text"
          className="form-control"
          aria-label="Título del libro"
          value={actual.titulo}
          onChange={(event) => setConsulta({ ...actual, titulo: event.target.value })}
        />
        <button type="submit" className="btn-buscar-libro" disabled={actual.cargando}>
          {actual.cargando ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {actual.error && <div className="alert alert-danger">{actual.error}</div>}

      {actual.buscado && !actual.error && actual.libros.length === 0 && (
        <p className="info-libro-texto">No se encontraron libros con ese título.</p>
      )}

      <div className="info-libro-lista">
        {actual.libros.map((libro) => (
          <article className="libro-resultado" key={libro.key}>
            {libro.cover_i ? (
              <img src={urlPortada(libro.cover_i)} alt={`Portada de ${libro.title}`} />
            ) : (
              <div className="libro-sin-portada">Sin portada</div>
            )}

            <div>
              <h3>{libro.title}</h3>
              <p>Autor: {libro.author_name ? libro.author_name[0] : "Sin dato"}</p>
              <p>Primera edición: {libro.first_publish_year ? libro.first_publish_year : "Sin dato"}</p>
            </div>
          </article>
        ))}
      </div>

      <p className="info-libro-fuente">
        Datos obtenidos de <a href="https://openlibrary.org">Open Library</a>.
      </p>
    </section>
  );
}
