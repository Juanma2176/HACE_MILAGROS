const express = require("express");
const Product = require("../models/Product");
const protegerRuta = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.json(await Product.find().sort({ createdAt: -1 }));
  } catch {
    res.status(500).json({ mensaje: "No fue posible obtener los productos" });
  }
});

router.post("/", protegerRuta, async (req, res) => {
  try {
    res.status(201).json(await Product.create(req.body));
  } catch (error) {
    res.status(400).json({ mensaje: "No fue posible crear el producto", detalle: error.message });
  }
});

router.put("/:id", protegerRuta, async (req, res) => {
  try {
    const producto = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(producto);
  } catch {
    res.status(400).json({ mensaje: "No fue posible actualizar el producto" });
  }
});

router.delete("/:id", protegerRuta, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch {
    res.status(400).json({ mensaje: "No fue posible eliminar el producto" });
  }
});

module.exports = router;