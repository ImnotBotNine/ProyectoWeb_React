export default function MensajeVacio({ titulo, texto }) {
  return (
    <div className="mensaje-sin-productos">
      <h3>{titulo}</h3>
      <p>{texto}</p>
    </div>
  );
}
