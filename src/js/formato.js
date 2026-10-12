export const CATEGORIAS = [
  { id: "libros", nombre: "Libros" },
  { id: "computadores", nombre: "Computadores" },
  { id: "accesorios", nombre: "Accesorios" },
  { id: "instrumentos", nombre: "Instrumentos" },
  { id: "deportes", nombre: "Artículos deportivos" },
  { id: "otros", nombre: "Otros productos" }
];

export function nombreCategoria(idCategoria) {
  const categoria = CATEGORIAS.find(
    (item) => item.id === idCategoria
  );

  if (categoria) {
    return categoria.nombre;
  }
  return "Otros";
}

export function acortarTexto(texto, largo) {
  if (texto.length > largo) {
    return texto.substring(0, largo) + "...";
  }
  return texto;
}

export function formatearPrecio(precio) {
  if (precio > 0) {
    return precio.toLocaleString("es-CL") + " CLP";
  }
  return "0 CLP";
}

export function formatearUsuario(usuario) {
  if (usuario === "") {
    return "Por usuario";
  }
  return "Por " + usuario;
}

export function nombreEstado(estado) {
  if (estado === "vendido") {
    return "Vendido";
  }
  return "Disponible";
}
