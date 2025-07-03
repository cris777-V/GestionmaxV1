// posweb.js

let carrito = [];

function agregarAlCarrito(boton) {
  const producto = boton.parentElement;
  const nombre = producto.dataset.nombre;
  const precio = parseInt(producto.dataset.precio);

  const existente = carrito.find(item => item.nombre === nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }

  renderizarCarrito();
}

function renderizarCarrito() {
  const lista = document.getElementById('lista-carrito');
  lista.innerHTML = '';
  let total = 0;

  carrito.forEach((item, index) => {
    total += item.precio * item.cantidad;

    const li = document.createElement('li');
    li.innerHTML = `
      ${item.nombre} - $${item.precio} x ${item.cantidad}
      <button onclick="cambiarCantidad(${index}, 1)">+1</button>
      <button onclick="cambiarCantidad(${index}, -1)">-1</button>
    `;
    lista.appendChild(li);
  });

  document.getElementById('total').textContent = total;
}

function cambiarCantidad(index, delta) {
  carrito[index].cantidad += delta;
  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }
  renderizarCarrito();
}

async function enviarPedido() {
  if (carrito.length === 0) {
    alert('El carrito está vacío');
    return;
  }

  const tipo = document.getElementById('tipo-pedido').value;

  try {
    const res = await fetch('/orden-posweb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pedido: carrito, tipo })
    });

    const data = await res.json();
    alert(data.mensaje);
    if (res.status === 201) {
      carrito = [];
      renderizarCarrito();
    }
  } catch (err) {
    console.error(err);
    alert('Error al enviar el pedido');
  }
}
const menu = {
  entradas: [
    { nombre: "Arepitas con Hogao", precio: 5000 },
    { nombre: "Empanadas (3 unidades)", precio: 4000 },
  ],
  platos: [
    { nombre: "Bandeja Paisa", precio: 18000 },
    { nombre: "Pechuga Gratinada", precio: 16000 },
  ],
  postres: [
    { nombre: "Flan de Caramelo", precio: 6000 },
    { nombre: "Torta Tres Leches", precio: 7000 },
  ],
  bebidas: [
    { nombre: "Limonada Natural", precio: 4000 },
    { nombre: "Gaseosa", precio: 3500 },
  ]
};

function renderizarMenu() {
  for (let categoria in menu) {
    const contenedor = document.getElementById(`menu-${categoria}`);
    menu[categoria].forEach((producto) => {
      const div = document.createElement('div');
      div.classList.add('producto');
      div.dataset.nombre = producto.nombre;
      div.dataset.precio = producto.precio;

      div.innerHTML = `
        <p>${producto.nombre} - $${producto.precio}</p>
        <button onclick="agregarAlCarrito(this)">Agregar</button>
      `;
      contenedor.appendChild(div);
    });
  }
}

renderizarMenu();

