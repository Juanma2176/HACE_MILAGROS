const jwt = require("jsonwebtoken");

function protegerRuta(req, res, next) {
  const autorizacion = req.headers.authorization;

  if (!autorizacion || !autorizacion.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Acceso no autorizado" });
  }

  try {
    req.usuario = jwt.verify(
      autorizacion.split(" ")[1],
      process.env.JWT_SECRET
    );
    next();
  } catch {
    return res.status(401).json({ mensaje: "Sesion no valida o vencida" });
  }
}

module.exports = protegerRuta;