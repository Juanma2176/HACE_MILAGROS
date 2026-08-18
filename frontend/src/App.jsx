import { useEffect, useState } from "react";
import "./App.css";
import Admin from "./Admin";

import logo from "./assets/logo-hace-milagros.png";
import labios from "./assets/labios.png";
import ojos from "./assets/ojos.png";
import rostro from "./assets/rostro.png";
import accesorios from "./assets/accesorios.png";

const API_URL = "https://hace-milagros-ald8.onrender.com";

const imagenPorCategoria = {
  Labios: labios,
  Ojos: ojos,
  Rostro: rostro,
  Accesorios: accesorios,
};

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      setCargando(true);

      const respuesta = await fetch(`${API_URL}/api/productos`);
      const datos = await respuesta.json();

      setProductos(datos);
    } catch (error) {
      console.error(error);
      setMensaje("No fue posible cargar los productos. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  }

  function agregarAlCarrito(producto) {
    const productoExiste = carrito.find(
      (productoCarrito) => productoCarrito._id === producto._id
    );

    if (productoExiste) {
      setCarrito(
        carrito.map((productoCarrito) =>
          productoCarrito._id === producto._id
            ? {
                ...productoCarrito,
                cantidad: productoCarrito.cantidad + 1,
              }
            : productoCarrito
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }

    setMensaje(`${producto.nombre} fue agregado al carrito.`);
  }

  function disminuirCantidad(id) {
    setCarrito(
      carrito
        .map((producto) =>
          producto._id === id
            ? { ...producto, cantidad: producto.cantidad - 1 }
            : producto
        )
        .filter((producto) => producto.cantidad > 0)
    );
  }

  function aumentarCantidad(id) {
    setCarrito(
      carrito.map((producto) =>
        producto._id === id
          ? { ...producto, cantidad: producto.cantidad + 1 }
          : producto
      )
    );
  }

  function eliminarDelCarrito(id) {
    setCarrito(carrito.filter((producto) => producto._id !== id));
  }

  const totalProductos = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0
  );

  const totalCompra = carrito.reduce(
    (total, producto) => total + producto.precio * producto.cantidad,
    0
  );

  async function enviarPedido(evento) {
    evento.preventDefault();

    if (carrito.length === 0) {
      setMensaje("Agrega al menos un producto al carrito.");
      return;
    }

    if (!nombre || !telefono || !direccion) {
      setMensaje("Completa tu nombre, teléfono y dirección.");
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/api/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cliente: nombre,
          telefono,
          direccion,
          productos: carrito.map((producto) => ({
            producto: producto._id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: producto.cantidad,
          })),
          total: totalCompra,
        }),
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo enviar el pedido");
      }

      setMensaje("Pedido enviado correctamente. Te contactaremos pronto.");
      setCarrito([]);
      setNombre("");
      setTelefono("");
      setDireccion("");
      setMostrarCarrito(false);
    } catch (error) {
      console.error(error);
      setMensaje("No fue posible enviar el pedido. Intenta nuevamente.");
    }
  }

  if (window.location.pathname === "/admin") {
    return <Admin />;
  }

  return (
    <main className="app">
      <header className="encabezado">
        <img className="logo" src={logo} alt="Hace Milagros" />

        <button
          className="boton-carrito"
          onClick={() => setMostrarCarrito(!mostrarCarrito)}
        >
          Carrito <span>{totalProductos}</span>
        </button>
      </header>

      <section className="hero">
        <p className="etiqueta">MAQUILLAJE PARA TI</p>
        <h1>Resalta la magia que ya tienes</h1>
        <p>Productos elegidos para acompañarte todos los días.</p>
      </section>

      {mensaje && <p className="mensaje">{mensaje}</p>}

      {mostrarCarrito && (
        <section className="panel-carrito">
          <div className="titulo-carrito">
            <h2>Tu carrito</h2>

            <button onClick={() => setMostrarCarrito(false)}>Cerrar</button>
          </div>

          {carrito.length === 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            <>
              {carrito.map((producto) => (
                <article className="item-carrito" key={producto._id}>
                  <div>
                    <strong>{producto.nombre}</strong>
                    <p>
                      ${(producto.precio * producto.cantidad).toLocaleString("es-CO")}
                    </p>
                  </div>

                  <div className="controles-cantidad">
                    <button onClick={() => disminuirCantidad(producto._id)}>
                      −
                    </button>

                    <span>{producto.cantidad}</span>

                    <button onClick={() => aumentarCantidad(producto._id)}>
                      +
                    </button>

                    <button
                      className="boton-eliminar"
                      onClick={() => eliminarDelCarrito(producto._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}

              <h3>Total: ${totalCompra.toLocaleString("es-CO")}</h3>

              <form className="formulario-pedido" onSubmit={enviarPedido}>
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={nombre}
                  onChange={(evento) => setNombre(evento.target.value)}
                />

                <input
                  type="tel"
                  placeholder="Tu número de teléfono"
                  value={telefono}
                  onChange={(evento) => setTelefono(evento.target.value)}
                />

                <input
                  type="text"
                  placeholder="Dirección de entrega"
                  value={direccion}
                  onChange={(evento) => setDireccion(evento.target.value)}
                />

                <button type="submit">Enviar pedido</button>
              </form>
            </>
          )}
        </section>
      )}

      <section className="catalogo">
        <div className="titulo-catalogo">
          <div>
            <p className="etiqueta">NUESTROS FAVORITOS</p>
            <h2>Catálogo de maquillaje</h2>
          </div>

          <p>{productos.length} productos</p>
        </div>

        {cargando ? (
          <p>Cargando productos...</p>
        ) : (
          <div className="lista-productos">
            {productos.map((producto) => (
              <article className="tarjeta-producto" key={producto._id}>
                <img
                  className="imagen-producto"
                  src={
                    producto.imagen ||
                    imagenPorCategoria[producto.categoria] ||
                    rostro
                  }
                  alt={producto.nombre}
                />

                <p className="categoria">{producto.categoria}</p>

                <h3>{producto.nombre}</h3>

                <p className="descripcion">{producto.descripcion}</p>

                <div className="pie-producto">
                  <strong>${producto.precio.toLocaleString("es-CO")}</strong>

                  <button onClick={() => agregarAlCarrito(producto)}>
                    Agregar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;