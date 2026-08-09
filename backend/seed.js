const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

const productos = [
  {
    nombre: "Base líquida natural",
    descripcion: "Base de cobertura media con acabado natural.",
    precio: 45000,
    categoria: "Rostro",
    stock: 20,
  },
  {
    nombre: "Labial mate rosa",
    descripcion: "Labial de larga duración en tono rosa.",
    precio: 28000,
    categoria: "Labios",
    stock: 35,
  },
  {
    nombre: "Paleta de sombras nude",
    descripcion: "Paleta con tonos neutros para maquillaje diario.",
    precio: 65000,
    categoria: "Ojos",
    stock: 15,
  },
  {
    nombre: "Máscara de pestañas",
    descripcion: "Máscara negra para alargar y dar volumen.",
    precio: 32000,
    categoria: "Ojos",
    stock: 25,
  },
];

async function cargarProductos() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Product.insertMany(productos);

    console.log("Productos creados correctamente");
  } catch (error) {
    console.error("Error al crear productos:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

cargarProductos();