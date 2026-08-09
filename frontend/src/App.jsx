import Admin from "./Admin";
import { useEffect, useState } from "react";
import "./App.css";
import logo from "./assets/logo-hace-milagros.png";
import labialImagen from "./assets/labial.png";
import sombrasImagen from "./assets/sombras.png";
import baseImagen from "./assets/base.png";
import mascaraImagen from "./assets/mascara.png";

const iconos = {
  Rostro: "R",
  Labios: "L",
  Ojos: "O",
};
const imagenes = {
  "Labial mate rosa": labialImagen,
  "Paleta de sombras nude": sombrasImagen,
  "Base líquida natural": baseImagen,
  "Máscara de pestañas": mascaraImagen,
};
function App() {
    if (window.location.pathname === "/admin") {
    return <Admin />;
  }
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarCompra, setMostrarCompra] = useState(false);
  const [mensajePedido, setMensajePedido] = useState("");
  const [cliente, setCliente] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/productos")
      .then((respuesta) => respuesta.json())
      .then((datos) => setProductos(datos))
      .catch(() => setProductos([]))
      .finally(() => setCargando(false));
  }, []);

  function agregarAlCarrito(producto) {
    setCarrito((actual) => {
      const existe = actual.find((item) => item._id === producto._id);

      if (existe) {
        return actual.map((item) =>
          item._id === producto._id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...actual, { ...producto, cantidad: 1 }];
    });
  }

  function cambiarCantidad(id, cambio) {
    setCarrito((actual) =>
      actual
        .map((item) =>
          item._id === id
            ? { ...item, cantidad: item.cantidad + cambio }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  }

  function quitarProducto(id) {
    setCarrito((actual) => actual.filter((item) => item._id !== id));
  }

  function cambiarCliente(evento) {
    setCliente({
      ...cliente,
      [evento.target.name]: evento.target.value,
    });
  }

  async function enviarPedido(evento) {
    evento.preventDefault();

    const pedido = {
      cliente,
      productos: carrito.map((item) => ({
        productoId: item._id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
      })),
      total: totalCompra,
    };

    try {
      const respuesta = await fetch("http://localhost:5000/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pedido),
      });

      if (!respuesta.ok) {
        throw new Error();
      }

      setCarrito([]);
      setMostrarCompra(false);
      setMensajePedido("Pedido enviado correctamente. Te contactaremos pronto.");
      setCliente({ nombre: "", telefono: "", direccion: "" });
    } catch {
      setMensajePedido("No fue posible enviar el pedido. Intenta de nuevo.");
    }
  }

  const cantidadTotal = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  const totalCompra = carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  const formatoPrecio = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

  return (
    <main>
      <header className="encabezado">
       <div>
  <img
    src={logo}
    alt="Hace Milagros - Belleza que transforma"
    style={{ width: "260px", maxWidth: "60vw" }}
  />
</div>

        <button className="carrito" onClick={() => setMostrarCarrito(true)}>
          Carrito <span>{cantidadTotal}</span>
        </button>
      </header>

      <section className="hero">
        <p>MAQUILLAJE PARA TI</p>
        <h2>Resalta la magia que ya tienes</h2>
        <span>Productos elegidos para acompanarte todos los dias.</span>
      </section>

      <section className="catalogo">
        <div className="titulo-seccion">
          <div>
            <p>NUESTROS FAVORITOS</p>
            <h2>Catalogo de maquillaje</h2>
          </div>
          <span>{productos.length} productos</span>
        </div>

        {mensajePedido && <p className="confirmacion">{mensajePedido}</p>}

        {cargando ? (
          <p className="mensaje">Cargando productos...</p>
        ) : (
          <div className="productos">
            {productos.map((producto) => (
              <article className="tarjeta" key={producto._id}>
                <div className="imagen-producto">
  {imagenes[producto.nombre] ? (
    <img
      src={imagenes[producto.nombre]}
      alt={producto.nombre}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "12px",
      }}
    />
  ) : (
    iconos[producto.categoria] || "M"
  )}
</div>

                <p className="categoria">{producto.categoria}</p>
                <h3>{producto.nombre}</h3>
                <p className="descripcion">{producto.descripcion}</p>

                <div className="pie-tarjeta">
                  <strong>{formatoPrecio.format(producto.precio)}</strong>
                  <button onClick={() => agregarAlCarrito(producto)}>
                    Agregar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {mostrarCarrito && (
        <div className="fondo-carrito">
          <aside className="panel-carrito">
            <div className="encabezado-carrito">
              <h2>Tu carrito</h2>
              <button onClick={() => setMostrarCarrito(false)}>X</button>
            </div>

            {carrito.length === 0 ? (
              <p className="mensaje">Tu carrito esta vacio.</p>
            ) : (
              <>
                <div className="lista-carrito">
                  {carrito.map((item) => (
                    <div className="item-carrito" key={item._id}>
                      <div>
                        <h3>{item.nombre}</h3>
                        <p>{formatoPrecio.format(item.precio)}</p>
                      </div>

                      <div className="controles-cantidad">
                        <button onClick={() => cambiarCantidad(item._id, -1)}>
                          -
                        </button>
                        <span>{item.cantidad}</span>
                        <button onClick={() => cambiarCantidad(item._id, 1)}>
                          +
                        </button>
                      </div>

                      <button
                        className="quitar"
                        onClick={() => quitarProducto(item._id)}
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>

                <div className="resumen-carrito">
                  <strong>Total: {formatoPrecio.format(totalCompra)}</strong>
                  <button
                    className="comprar"
                    onClick={() => {
                      setMostrarCarrito(false);
                      setMostrarCompra(true);
                    }}
                  >
                    Continuar compra
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {mostrarCompra && (
        <div className="fondo-carrito">
          <form className="panel-carrito formulario" onSubmit={enviarPedido}>
            <div className="encabezado-carrito">
              <h2>Finalizar pedido</h2>
              <button type="button" onClick={() => setMostrarCompra(false)}>
                X
              </button>
            </div>

            <label>
              Nombre completo
              <input
                name="nombre"
                value={cliente.nombre}
                onChange={cambiarCliente}
                required
              />
            </label>

            <label>
              Telefono
              <input
                name="telefono"
                value={cliente.telefono}
                onChange={cambiarCliente}
                required
              />
            </label>

            <label>
              Direccion de entrega
              <textarea
                name="direccion"
                value={cliente.direccion}
                onChange={cambiarCliente}
                required
              />
            </label>

            <p>Total: {formatoPrecio.format(totalCompra)}</p>

            <button className="comprar" type="submit">
              Enviar pedido
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

export default App;