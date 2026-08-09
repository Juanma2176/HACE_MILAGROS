const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    precio: {
      type: Number,
      required: true,
      min: 0,
    },
    imagen: {
      type: String,
      default: "",
    },
    categoria: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);