const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    cliente: {
      nombre: {
        type: String,
        required: true,
      },
      telefono: {
        type: String,
        required: true,
      },
      direccion: {
        type: String,
        required: true,
      },
    },
    productos: [
      {
        productoId: String,
        nombre: String,
        precio: Number,
        cantidad: Number,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    estado: {
      type: String,
      default: "Pendiente",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);