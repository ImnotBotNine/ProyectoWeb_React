export default function EncabezadoPagina({ titulo, texto }) {
  return (
    <section className="encabezado-pagina">
      <div className="container-fluid">
        <h1>{titulo}</h1>
        <p>{texto}</p>
      </div>
    </section>
  );
}
