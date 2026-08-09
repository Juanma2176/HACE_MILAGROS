const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB conectada correctamente"))
  .catch((error) => console.error("Error al conectar MongoDB:", error.message));

app.use("/api/auth", authRoutes);
app.use("/api/productos", productRoutes);
app.use("/api/pedidos", orderRoutes);

app.get("/", (req, res) => {
  res.json({ mensaje: "Backend de Hace Milagros funcionando correctamente" });
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});