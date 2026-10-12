import Hero from "../components/Hero";
import EstadoCarga from "../components/EstadoCarga";
import FilaCategoria from "../components/FilaCategoria";

import "../styles/inicio.css";

const FILAS = [
  { id: "nuevos", titulo: "Nuevos" },
  { id: "libros", titulo: "Popular en libros" },
  { id: "computadores", titulo: "Popular en computadores" },
  { id: "accesorios", titulo: "Popular en accesorios" },
  { id: "instrumentos", titulo: "Popular en instrumentos" },
  { id: "deportes", titulo: "Popular en artículos deportivos" },
  { id: "otros", titulo: "Otros productos" }
];

export default function Inicio({ productos, cargando, error, onRecargar, onVerMercado }) {
  function productosDeFila(idFila) {
    if (idFila === "nuevos") {
      // Los últimos publicados primero (el id más alto es el más nuevo)
      return [...productos].sort((a, b) => b.id - a.id);
    }

    return productos.filter(
      (producto) => producto.categoria === idFila
    );
  }

  return (
    <>
      <Hero />

      <section className="destacados">
        <h2 className="destacados-titulo">Destacados en Infraganti</h2>

        <EstadoCarga cargando={cargando} error={error} onReintentar={onRecargar} />

        {FILAS.map((fila) => (
          <FilaCategoria
            key={fila.id}
            titulo={fila.titulo}
            productos={productosDeFila(fila.id)}
            onVerMercado={() => onVerMercado(fila.id === "nuevos" ? "todas" : fila.id)}
          />
        ))}
      </section>
    </>
  );
}
