// posweb.js

const platos = [
  { id: 1, nombre: "Hamburguesa Clásica", precio: 18000, categoria: "entradas" },
  { id: 2, nombre: "Pizza Margarita", precio: 22000, categoria: "entradas" },
  { id: 3, nombre: "Ensalada César", precio: 15000, categoria: "entradas" },
  { id: 4, nombre: "Tarta de Queso", precio: 12000, categoria: "postres" },
  { id: 5, nombre: "Brownie con Helado", precio: 13000, categoria: "postres" },
  { id: 6, nombre: "Malteada Vainilla", precio: 10000, categoria: "bebidas" },
  { id: 7, nombre: "Jugo Natural", precio: 9000, categoria: "bebidas" },
];

const carrito = [];

function mostrarMenu(categoria) {
  const contenedor = document.getElementById("menu");
  contenedor.innerHTML = "";
  const filtrados = platos.filter(p => p.categoria === categoria);

  filtrados.forEach(plato => {
    const div = document.createElement("div");
    div.className = "plato";
    div.innerHTML = `
      <h3>${plato.nombre}</h3>
      <p>Precio: $${plato.precio.toLocaleString()}</p>
      <button onclick="agregarAlCarrito(${plato.id})">Agregar</button>
    `;
    contenedor.appendChild(div);
  });
}

function agregarAlCarrito(id) {
  const plato = platos.find(p => p.id === id);
  const existe = carrito.find(p => p.id === id);
  if (existe) {
    existe.cantidad += 1;
  } else {
    carrito.push({ ...plato, cantidad: 1 });
  }
  actualizarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  lista.innerHTML = "";

  carrito.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${p.nombre} x${p.cantidad} - $${(p.precio * p.cantidad).toLocaleString()} 
      <button onclick="modificarCantidad(${p.id}, 1)">+</button>
      <button onclick="modificarCantidad(${p.id}, -1)">-</button>
    `;
    lista.appendChild(li);
  });
}

function modificarCantidad(id, cambio) {
  const item = carrito.find(p => p.id === id);
  if (item) {
    item.cantidad += cambio;
    if (item.cantidad <= 0) {
      const index = carrito.findIndex(p => p.id === id);
      carrito.splice(index, 1);
    }
  }
  actualizarCarrito();
}

function realizarPedido() {
  const tipo = document.getElementById("tipo-pedido").value;
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  fetch("https://gestionmaxv1.onrender.com/orden-posweb", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pedido: carrito, tipo })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.mensaje);
    carrito.length = 0;
    actualizarCarrito();
  })
  .catch(() => alert("Error al enviar el pedido."));
}

// Cargar menú de entradas por defecto
mostrarMenu("entradas");
