import { useEffect, useState } from "react";

function Admin() {
  const [token, setToken] = useState(sessionStorage.getItem("adminToken"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    stock: "",
  });

  const encabezados = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  async function cargarDatos() {
    const respuestaProductos = await fetch("https://hace-milagros-ald8.onrender.com/api/productos");
    const respuestaPedidos = await fetch("https://hace-milagros-ald8.onrender.com/api/pedidos", {
      headers: encabezados,
    });

    setProductos(await respuestaProductos.json());

    if (respuestaPedidos.ok) {
      setPedidos(await respuestaPedidos.json());
    } else {
      setMensaje("Tu sesion vencio. Inicia sesion de nuevo.");
      sessionStorage.removeItem("adminToken");
      setToken(null);
    }
  }

  useEffect(() => {
    if (token) cargarDatos();
  }, [token]);

  async function iniciarSesion(evento) {
    evento.preventDefault();
    const respuesta = await fetch("https://hace-milagros-ald8.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      setMensaje(datos.mensaje || "No fue posible iniciar sesion.");
      return;
    }

    sessionStorage.setItem("adminToken", datos.token);
    setToken(datos.token);
    setPassword("");
    setMensaje("");
  }

  function cerrarSesion() {
    sessionStorage.removeItem("adminToken");
    setToken(null);
  }

  function cambiarProducto(evento) {
    setProducto({ ...producto, [evento.target.name]: evento.target.value });
  }

  async function crearProducto(evento) {
    evento.preventDefault();
    const respuesta = await fetch("https://hace-milagros-ald8.onrender.com/api/productos", {
      method: "POST",
      headers: encabezados,
      body: JSON.stringify({
        ...producto,
        precio: Number(producto.precio),
        stock: Number(producto.stock),
      }),
    });

    if (!respuesta.ok) {
      setMensaje("No fue posible crear el producto.");
      return;
    }

    setProducto({ nombre: "", descripcion: "", precio: "", categoria: "", stock: "" });
    setMensaje("Producto creado correctamente.");
    cargarDatos();
  }

  async function eliminarProducto(id) {
    if (!window.confirm("Deseas eliminar este producto?")) return;

    const respuesta = await fetch(`https://hace-milagros-ald8.onrender.com/api/productos/${id}`, {
      method: "DELETE",
      headers: encabezados,
    });

    if (respuesta.ok) {
      setMensaje("Producto eliminado correctamente.");
      cargarDatos();
    }
  }

  if (!token) {
    return (
      <main className="admin">
        <section className="catalogo">
          <h1>Administracion Hace Milagros</h1>
          <form className="formulario" onSubmit={iniciarSesion}>
            <label>
              Correo
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
              Contrasena
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <button className="comprar" type="submit">Iniciar sesion</button>
          </form>
          {mensaje && <p className="confirmacion">{mensaje}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="admin">
      <header className="encabezado">
        <div>
          <p className="marca">HACE MILAGROS</p>
          <h1>Panel de administracion</h1>
        </div>
        <div>
          <a href="/">Volver a la tienda</a>{" "}
          <button className="quitar" onClick={cerrarSesion}>Cerrar sesion</button>
        </div>
      </header>

      <section className="catalogo">
        <h2>Crear producto</h2>
        <form className="formulario" onSubmit={crearProducto}>
          <label>Nombre<input name="nombre" value={producto.nombre} onChange={cambiarProducto} required /></label>
          <label>Descripcion<textarea name="descripcion" value={producto.descripcion} onChange={cambiarProducto} required /></label>
          <label>Precio<input name="precio" type="number" value={producto.precio} onChange={cambiarProducto} required /></label>
          <label>Categoria<input name="categoria" value={producto.categoria} onChange={cambiarProducto} required /></label>
          <label>Stock<input name="stock" type="number" value={producto.stock} onChange={cambiarProducto} required /></label>
          <button className="comprar" type="submit">Guardar producto</button>
        </form>

        {mensaje && <p className="confirmacion">{mensaje}</p>}

        <h2>Productos actuales</h2>
        <div className="productos">
          {productos.map((item) => (
            <article className="tarjeta" key={item._id}>
              <p className="categoria">{item.categoria}</p>
              <h3>{item.nombre}</h3>
              <p>{item.descripcion}</p>
              <strong>${item.precio}</strong>
              <p>Stock: {item.stock}</p>
              <button className="quitar" onClick={() => eliminarProducto(item._id)}>Eliminar producto</button>
            </article>
          ))}
        </div>

        <h2>Pedidos recibidos</h2>
        {pedidos.length === 0 ? <p className="mensaje">Aun no hay pedidos.</p> : pedidos.map((pedido) => (
          <article className="tarjeta" key={pedido._id}>
            <h3>{pedido.cliente.nombre}</h3>
            <p>Telefono: {pedido.cliente.telefono}</p>
            <p>Direccion: {pedido.cliente.direccion}</p>
            <p>Estado: {pedido.estado}</p>
            <strong>Total: ${pedido.total}</strong>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Admin;
