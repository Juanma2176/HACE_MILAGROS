const express = require("express");
const Order = require("../models/Order");
const protegerRuta = require("../middleware/auth");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const pedido = await Order.create(req.body);
    res.status(201).json({ mensaje: "Pedido creado correctamente", pedido });
  } catch (error) {
    res.status(400).json({ mensaje: "No fue posible crear el pedido", detalle: error.message });
  }
});

router.get("/", protegerRuta, async (req, res) => {
  try {
    res.json(await Order.find().sort({ createdAt: -1 }));
  } catch {
    res.status(500).json({ mensaje: "No fue posible obtener los pedidos" });
  }
});

module.exports = router;