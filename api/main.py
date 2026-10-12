import json

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="API Infraganti")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ProductoEntrada(BaseModel):
    nombre: str = Field(min_length=5, max_length=80)
    categoria: str = Field(min_length=3, max_length=30)
    estado: str = "disponible"
    precio: int
    descripcion: str = Field(min_length=20, max_length=300)
    vendedor: str = Field(min_length=3, max_length=60)
    carrera: str = Field(min_length=3, max_length=60)
    contacto: str = Field(min_length=3, max_length=60)
    imagen: str = ""


@app.get("/")
def inicio():
    return {"mensaje": "API de Infraganti funciona"}


with open("data.json", encoding="utf-8") as archivo:
    productos = json.load(archivo)


@app.get("/productos")
def listar_productos():
    return productos


@app.get("/productos/{producto_id}")
def obtener_producto(producto_id: int):
    for producto in productos:
        if producto["id"] == producto_id:
            return producto

    raise HTTPException(status_code=404, detail="Producto no encontrado")


@app.post("/productos", status_code=201)
def crear_producto(datos: ProductoEntrada):
    nuevo_producto = {
        "id": len(productos) + 1,
        "nombre": datos.nombre,
        "categoria": datos.categoria,
        "estado": datos.estado,
        "precio": datos.precio,
        "descripcion": datos.descripcion,
        "vendedor": datos.vendedor,
        "carrera": datos.carrera,
        "contacto": datos.contacto,
        "imagen": datos.imagen
    }
    productos.append(nuevo_producto)
    return nuevo_producto


@app.put("/productos/{producto_id}")
def actualizar_producto(producto_id: int, datos: ProductoEntrada):
    for producto in productos:
        if producto["id"] == producto_id:
            producto["nombre"] = datos.nombre
            producto["categoria"] = datos.categoria
            producto["estado"] = datos.estado
            producto["precio"] = datos.precio
            producto["descripcion"] = datos.descripcion
            producto["vendedor"] = datos.vendedor
            producto["carrera"] = datos.carrera
            producto["contacto"] = datos.contacto
            producto["imagen"] = datos.imagen
            return producto

    raise HTTPException(status_code=404, detail="Producto no encontrado")


@app.delete("/productos/{producto_id}")
def eliminar_producto(producto_id: int):
    for producto in productos:
        if producto["id"] == producto_id:
            productos.remove(producto)
            return {"mensaje": "Producto eliminado"}

    raise HTTPException(status_code=404, detail="Producto no encontrado")