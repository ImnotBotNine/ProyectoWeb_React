import { useState } from "react";

import "../styles/login.css";

export default function Login({ onIniciarSesion }) {
  const [nick, setNick] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function manejarSubmit(event) {
    event.preventDefault();

    if (nick.trim() === "" || contrasena === "") {
      setError("Completa el nick y la contraseña.");
      return;
    }

    setEnviando(true);
    const mensajeError = await onIniciarSesion(nick.trim(), contrasena);
    setEnviando(false);

    if (mensajeError !== "") {
      setError(mensajeError);
      setContrasena("");
    }
  }

  return (
    <section className="login-contenido">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card login-card">
              <div className="card-body">
                <h3 className="text-center mb-4">Iniciar sesión</h3>

                <form onSubmit={manejarSubmit}>
                  <div className="mb-3">
                    <label htmlFor="loginNick" className="form-label">Nick</label>
                    <input
                      type="text"
                      className="form-control"
                      id="loginNick"
                      value={nick}
                      onChange={(event) => setNick(event.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={contrasena}
                      onChange={(event) => setContrasena(event.target.value)}
                    />
                  </div>

                  {error && <div className="alert alert-danger">{error}</div>}

                  <button type="submit" className="btn-ingresar w-100" disabled={enviando}>
                    {enviando ? "Ingresando..." : "Ingresar"}
                  </button>
                </form>

                <p className="login-ayuda">
                  Cuentas de prueba: <strong>usuario</strong> / usuario123 · <strong>admin</strong> / admin123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
