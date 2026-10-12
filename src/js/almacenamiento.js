export function guardarDato(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// Devuelve lo guardado, o valorInicial si todavía no hay nada
export function leerDato(clave, valorInicial) {
  const guardado = localStorage.getItem(clave);

  if (guardado !== null) {
    return JSON.parse(guardado);
  }
  return valorInicial;
}
