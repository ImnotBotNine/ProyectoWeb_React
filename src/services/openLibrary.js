const URL_BUSQUEDA = "https://openlibrary.org/search.json";
const URL_PORTADAS = "https://covers.openlibrary.org/b/id/";
const CANTIDAD_RESULTADOS = 3;

export async function buscarLibro(titulo) {
  const response = await fetch(
    `${URL_BUSQUEDA}?title=${encodeURIComponent(titulo)}&limit=${CANTIDAD_RESULTADOS}`
  );

  if (!response.ok) {
    throw new Error("No fue posible consultar Open Library.");
  }

  return await response.json();
}

// Portada mediana a partir del número cover_i de la respuesta
export function urlPortada(idPortada) {
  return `${URL_PORTADAS}${idPortada}-M.jpg`;
}
