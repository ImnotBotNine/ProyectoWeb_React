import { useState } from "react";

import EncabezadoPagina from "../components/EncabezadoPagina";
import CampoFormulario from "../components/CampoFormulario";
import ResumenPublicado from "../components/ResumenPublicado";

import "../styles/publicar.css";

const PRECIO_MAXIMO = 10000000;
const LARGO_MINIMO_DESCRIPCION = 20;
const PESO_MAXIMO_IMAGEN = 5000000;
const ANCHO_MAXIMO_IMAGEN = 800;
const SEGUNDOS_ESPERA = 30;

const REGLAS = [
  { campo: "nombre", nombre: "el nombre del producto", minimo: 5, maximo: 80 },
  { campo: "categoria", nombre: "una categoría", tipo: "seleccion" },
  { campo: "precio", nombre: "un precio", tipo: "precio" },
  { campo: "descripcion", nombre: "la descripción", minimo: LARGO_MINIMO_DESCRIPCION, maximo: 300 },
  { campo: "vendedor", nombre: "tu nombre", minimo: 3, maximo: 60 },
  { campo: "carrera", nombre: "tu carrera", minimo: 3, maximo: 60 },
  { campo: "contacto", nombre: "el lugar de entrega", minimo: 3, maximo: 60 }
];

const DATOS_VACIOS = {
  nombre: "",
  categoria: "",
  precio: "",
  descripcion: "",
  vendedor: "",
  carrera: "",
  contacto: ""
};

function validarTexto(regla, valor) {
  const texto = valor.trim();

  if (texto === "") {
    return "Debes completar " + regla.nombre + ".";
  }
  if (texto.length < regla.minimo) {
    return "Escribe al menos " + regla.minimo + " caracteres.";
  }
  if (texto.length > regla.maximo) {
    return "No puede superar los " + regla.maximo + " caracteres.";
  }
  return "";
}

function validarPrecio(regla, valor) {
  if (valor.trim() === "") {
    return "Debes indicar " + regla.nombre + ".";
  }

  const numero = Number(valor);

  if (numero <= 0) {
    return "El precio debe ser un número mayor que 0.";
  }
  if (numero > PRECIO_MAXIMO) {
    return "El precio no puede superar los 10.000.000.";
  }
  return "";
}

function validarCampo(campo, valor) {
  const regla = REGLAS.find((item) => item.campo === campo);

  if (regla.tipo === "seleccion") {
    return valor === "" ? "Elige " + regla.nombre + "." : "";
  }
  if (regla.tipo === "precio") {
    return validarPrecio(regla, valor);
  }
  return validarTexto(regla, valor);
}

export default function Publicar({
  productos,
  idsPublicados,
  esAdmin,
  ultimaPublicacion,
  onPublicar,
  onBorrarPublicados,
  onIrMercado
}) {
  const [datos, setDatos] = useState(DATOS_VACIOS);
  const [errores, setErrores] = useState({});
  const [imagen, setImagen] = useState("");
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  function cambiarCampo(campo, valor) {
    const nuevosDatos = { ...datos };
    nuevosDatos[campo] = valor;
    setDatos(nuevosDatos);
  }

  function cambiarError(campo, texto) {
    const nuevosErrores = { ...errores };
    nuevosErrores[campo] = texto;
    setErrores(nuevosErrores);
  }

  function validarFormulario() {
    const nuevosErrores = {};
    let todoBien = true;

    for (const regla of REGLAS) {
      nuevosErrores[regla.campo] = validarCampo(regla.campo, datos[regla.campo]);

      if (nuevosErrores[regla.campo] !== "") {
        todoBien = false;
      }
    }

    nuevosErrores.imagen = errores.imagen;
    setErrores(nuevosErrores);
    return todoBien;
  }

  function vaciarCampos() {
    setDatos(DATOS_VACIOS);
    setErrores({});
    quitarImagen();
  }

  function limpiarTodo() {
    vaciarCampos();
    setMensaje({ tipo: "", texto: "" });
  }

  function quitarImagen() {
    setImagen("");
    document.getElementById("imagen").value = "";
  }

  function achicarImagen(imagenOriginal) {
    const elemento = new Image();

    elemento.onload = function () {
      let ancho = elemento.width;
      let alto = elemento.height;

      if (ancho > ANCHO_MAXIMO_IMAGEN) {
        alto = Math.round(alto * ANCHO_MAXIMO_IMAGEN / ancho);
        ancho = ANCHO_MAXIMO_IMAGEN;
      }

      const lienzo = document.createElement("canvas");
      lienzo.width = ancho;
      lienzo.height = alto;

      const pincel = lienzo.getContext("2d");
      pincel.drawImage(elemento, 0, 0, ancho, alto);

      setImagen(lienzo.toDataURL("image/jpeg", 0.7));
    };

    elemento.src = imagenOriginal;
  }

  function elegirImagen(event) {
    if (event.target.files.length === 0) {
      setImagen("");
      cambiarError("imagen", "");
      return;
    }

    const archivo = event.target.files[0];

    if (archivo.type.substring(0, 6) !== "image/") {
      quitarImagen();
      cambiarError("imagen", "El archivo debe ser una imagen.");
      return;
    }

    if (archivo.size > PESO_MAXIMO_IMAGEN) {
      quitarImagen();
      cambiarError("imagen", "La imagen no puede pesar más de 5 MB.");
      return;
    }

    const lector = new FileReader();
    lector.onload = function () {
      achicarImagen(lector.result);
    };
    lector.readAsDataURL(archivo);

    cambiarError("imagen", "");
  }

  async function publicarProducto(event) {
    event.preventDefault();

    if (!validarFormulario()) {
      setMensaje({ tipo: "error", texto: "Revisa los campos marcados en rojo." });
      return;
    }

    if (!esAdmin) {
      const segundosPasados = (Date.now() - ultimaPublicacion) / 1000;

      if (segundosPasados < SEGUNDOS_ESPERA) {
        const faltan = Math.round(SEGUNDOS_ESPERA - segundosPasados);
        setMensaje({ tipo: "error", texto: "Espera " + faltan + " segundos antes de volver a publicar." });
        return;
      }
    }

    const nuevoProducto = {
      nombre: datos.nombre.trim(),
      categoria: datos.categoria,
      estado: "disponible",
      precio: Number(datos.precio),
      descripcion: datos.descripcion.trim(),
      vendedor: datos.vendedor.trim(),
      carrera: datos.carrera.trim(),
      contacto: datos.contacto.trim(),
      imagen: imagen
    };

    const publicado = await onPublicar(nuevoProducto);

    if (!publicado) {
      setMensaje({ tipo: "error", texto: "No fue posible publicar. Revisa que la API esté encendida." });
      return;
    }

    setMensaje({ tipo: "exito", texto: "" });
    vaciarCampos();
  }

  function borrarPublicaciones() {
    if (!confirm("¿Deseas eliminar todas tus publicaciones?")) {
      return;
    }
    onBorrarPublicados();
  }

  const largoDescripcion = datos.descripcion.trim().length;
  const textoContador =
    largoDescripcion > 0 && largoDescripcion < LARGO_MINIMO_DESCRIPCION
      ? `${largoDescripcion} caracteres (mínimo ${LARGO_MINIMO_DESCRIPCION})`
      : `${largoDescripcion} caracteres`;

  const publicados = productos.filter(
    (producto) => idsPublicados.includes(producto.id)
  );

  return (
    <>
      <EncabezadoPagina
        titulo="Publicar un producto"
        texto="Completa los datos y tu publicación aparecerá en el Mercado."
      />

      <section className="publicar-contenido">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="panel-formulario">
                <form onSubmit={publicarProducto} noValidate>
                  <CampoFormulario
                    id="nombre"
                    etiqueta="Nombre del producto *"
                    placeholder="Ej: Libro Cálculo I Universitario"
                    valor={datos.nombre}
                    error={errores.nombre}
                    onCambiar={(valor) => cambiarCampo("nombre", valor)}
                    onSalir={() => cambiarError("nombre", validarCampo("nombre", datos.nombre))}
                  />

                  <CampoFormulario
                    id="categoria"
                    etiqueta="Categoría *"
                    tipo="select"
                    valor={datos.categoria}
                    error={errores.categoria}
                    onCambiar={(valor) => cambiarCampo("categoria", valor)}
                    onSalir={() => cambiarError("categoria", validarCampo("categoria", datos.categoria))}
                  />

                  <CampoFormulario
                    id="precio"
                    etiqueta="Precio en pesos *"
                    tipo="number"
                    placeholder="Ej: 22000"
                    valor={datos.precio}
                    error={errores.precio}
                    onCambiar={(valor) => cambiarCampo("precio", valor)}
                    onSalir={() => cambiarError("precio", validarCampo("precio", datos.precio))}
                  />

                  <CampoFormulario
                    id="descripcion"
                    etiqueta="Descripción *"
                    tipo="textarea"
                    placeholder="Cuenta en qué estado está y qué incluye"
                    ayuda={textoContador}
                    valor={datos.descripcion}
                    error={errores.descripcion}
                    onCambiar={(valor) => cambiarCampo("descripcion", valor)}
                    onSalir={() => cambiarError("descripcion", validarCampo("descripcion", datos.descripcion))}
                  />

                  <div className="row">
                    <div className="col-12 col-md-6">
                      <CampoFormulario
                        id="vendedor"
                        etiqueta="Tu nombre *"
                        placeholder="Ej: Camila Pérez"
                        valor={datos.vendedor}
                        error={errores.vendedor}
                        onCambiar={(valor) => cambiarCampo("vendedor", valor)}
                        onSalir={() => cambiarError("vendedor", validarCampo("vendedor", datos.vendedor))}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <CampoFormulario
                        id="carrera"
                        etiqueta="Tu carrera *"
                        placeholder="Ej: Informática"
                        valor={datos.carrera}
                        error={errores.carrera}
                        onCambiar={(valor) => cambiarCampo("carrera", valor)}
                        onSalir={() => cambiarError("carrera", validarCampo("carrera", datos.carrera))}
                      />
                    </div>
                  </div>

                  <CampoFormulario
                    id="contacto"
                    etiqueta="Lugar de entrega *"
                    placeholder="Ej: Campus Santiago"
                    valor={datos.contacto}
                    error={errores.contacto}
                    onCambiar={(valor) => cambiarCampo("contacto", valor)}
                    onSalir={() => cambiarError("contacto", validarCampo("contacto", datos.contacto))}
                  />

                  <div className="mb-4">
                    <label htmlFor="imagen" className="form-label">Imagen del producto</label>
                    <input
                      type="file"
                      id="imagen"
                      className={`form-control ${errores.imagen ? "is-invalid" : ""}`}
                      accept="image/png, image/jpeg, image/webp"
                      onChange={elegirImagen}
                    />
                    <div className="ayuda-campo">
                      Opcional. JPG, PNG o WEBP, hasta 5 MB. La foto se achica automáticamente.
                    </div>
                    <div className="invalid-feedback">{errores.imagen}</div>

                    {imagen !== "" && (
                      <div className="vista-previa">
                        <img src={imagen} alt="Vista previa del producto" />
                        <button type="button" className="btn-quitar-imagen" onClick={quitarImagen}>
                          Quitar imagen
                        </button>
                      </div>
                    )}
                  </div>

                  {mensaje.tipo === "exito" && (
                    <div className="alert alert-success">
                      Tu producto quedó publicado. <button type="button" className="btn-enlace" onClick={onIrMercado}>
                        Verlo en el Mercado
                      </button>
                    </div>
                  )}

                  {mensaje.tipo === "error" && (
                    <div className="alert alert-danger">{mensaje.texto}</div>
                  )}

                  <div className="formulario-acciones">
                    <button type="submit" className="btn-publicar">Publicar producto</button>
                    <button type="button" className="btn-limpiar-form" onClick={limpiarTodo}>
                      Limpiar
                    </button>
                  </div>
                </form>
              </div>

              {publicados.length > 0 && (
                <section className="panel-publicados">
                  <div className="publicados-header">
                    <h2>Tus publicaciones</h2>
                    {esAdmin && (
                      <button
                        type="button"
                        className="btn-borrar-publicaciones"
                        onClick={borrarPublicaciones}
                      >
                        Borrar todas
                      </button>
                    )}
                  </div>

                  {publicados.map((producto) => (
                    <ResumenPublicado
                      key={producto.id}
                      nombre={producto.nombre}
                      categoria={producto.categoria}
                      descripcion={producto.descripcion}
                      precio={producto.precio}
                      vendedor={producto.vendedor}
                    />
                  ))}
                </section>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
