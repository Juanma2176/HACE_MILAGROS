const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ mensaje: "Correo o contrasena incorrectos" });
  }

  const token = jwt.sign(
    { email: process.env.ADMIN_EMAIL },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token });
});

module.exports = router;