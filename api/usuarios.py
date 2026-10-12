import json

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="API Usuarios Infraganti")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginEntrada(BaseModel):
    nick: str = Field(min_length=3, max_length=30)
    contrasena: str = Field(min_length=3, max_length=60)


@app.get("/")
def inicio():
    return {"mensaje": "API de usuarios de Infraganti funciona"}


with open("usuarios.json", encoding="utf-8") as archivo:
    usuarios = json.load(archivo)


@app.post("/login")
def iniciar_sesion(datos: LoginEntrada):
    for usuario in usuarios:
        if usuario["nick"] == datos.nick and usuario["contrasena"] == datos.contrasena:
            return {"nick": usuario["nick"], "rol": usuario["rol"]}

    raise HTTPException(status_code=401, detail="Nick o contraseña incorrectos")
