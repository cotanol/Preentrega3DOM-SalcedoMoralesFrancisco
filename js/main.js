document.addEventListener("DOMContentLoaded", () => {
    // Almacenamos los productos del carrito en un array
    let productosEnCarrito = JSON.parse(localStorage.getItem("productosCarrito")) || [];

    // Detectar si estamos en la página de productos (dentro de la carpeta 'pages') o en la raíz
    const pathName = window.location.pathname;
    let rutaBase = '';

    // Si estamos en el index.html o en la raíz, utilizamos './img/'
    if (pathName.includes('index.html') || pathName === "/") {
        rutaBase = './img/';
    } else if (pathName.includes('/pages/')) {
        // Si estamos en la carpeta pages, utilizamos '../img/'
        rutaBase = '../img/';
    }

    // Mostrar el número de productos en el carrito al cargar la página
    actualizarNumeroCarrito();

    // Mostrar los productos en el carrito al cargar la página
    mostrarProductosEnCarrito();

    // Carrito
    const abrirCarrito = document.querySelector("#cart");
    const cerrarCarrito = document.querySelector("#cerrarCarrito");
    const carritoContainer = document.querySelector("#cartContainer");

    // Mostrar el carrito deslizándose desde la derecha
    abrirCarrito.addEventListener("click", () => {
        carritoContainer.style.right = "0";  // Mueve el carrito a la vista
    });

    // Ocultar el carrito deslizándolo de nuevo a la derecha
    cerrarCarrito.addEventListener("click", () => {
        carritoContainer.style.right = "-500px";  // Mueve el carrito fuera de la vista
    });

    // Escuchar clicks en los botones "Comprar" de los productos
    document.querySelectorAll(".boton").forEach(boton => {
        boton.addEventListener("click", (e) => {
            e.preventDefault(); // Evitar que recargue la página
            const idProducto = boton.getAttribute("data-id");
            const nombreProducto = boton.getAttribute("data-nombre");
            const precioProducto = boton.getAttribute("data-precio");
            let imgProducto = boton.getAttribute("data-img");

            // Ajustar la ruta de la imagen con la base adecuada
            imgProducto = rutaBase + imgProducto;

            // Agregar el producto al carrito
            agregarAlCarrito(idProducto, nombreProducto, precioProducto, imgProducto);
        });
    });

    // Función para agregar productos al carrito
    function agregarAlCarrito(id, nombre, precio, img) {
        // Verificar si el producto ya está en el carrito
        const productoExistente = productosEnCarrito.find(producto => producto.id === id);

        if (productoExistente) {
            // Si el producto ya existe en el carrito, aumentar la cantidad
            productoExistente.cantidad++;
        } else {
            // Si el producto no existe, agregarlo al carrito
            productosEnCarrito.push({
                id,
                nombre,
                precio: parseFloat(precio),
                img,
                cantidad: 1
            });
        }

        // Actualizar el carrito en localStorage
        localStorage.setItem("productosCarrito", JSON.stringify(productosEnCarrito));

        // Actualizar el número de productos en el icono del carrito
        actualizarNumeroCarrito();

        // Renderizar los productos en el carrito
        mostrarProductosEnCarrito();
    }

    // Función para mostrar la cantidad de productos en el carrito
    function actualizarNumeroCarrito() {
        const numeroProductos = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
        const carritoIcono = document.querySelector("#cart-count");
        if (carritoIcono) {
            carritoIcono.innerText = `(${numeroProductos})`;
        }
    }

    // Función para mostrar los productos en el carrito
    function mostrarProductosEnCarrito() {
        const contenedorCarrito = document.querySelector(".productos-carrito-conteiner");
        const carritoVacioMensaje = document.querySelector("#carritoVacio"); // Mensaje de carrito vacío
        const totalCarritoElemento = document.querySelector("#totalCarrito"); // Elemento para mostrar el total del carrito

        let totalCarrito = 0; // Variable para almacenar el total del carrito

        // Limpiar el contenedor del carrito antes de renderizar los productos
        if (contenedorCarrito) {
            contenedorCarrito.innerHTML = ''; // Limpiar carrito

            // Si no hay productos en el carrito, mostrar un mensaje
            if (productosEnCarrito.length === 0) {
                carritoVacioMensaje.style.display = 'block'; // Mostrar mensaje de carrito vacío
                totalCarritoElemento.innerText = '$0'; // Total en 0 si no hay productos
            } else {
                carritoVacioMensaje.style.display = 'none'; // Ocultar mensaje de carrito vacío
                // Si hay productos en el carrito, renderizarlos
                productosEnCarrito.forEach(producto => {
                    const divProducto = document.createElement("div");
                    divProducto.classList.add("carrito-producto");
                    divProducto.innerHTML = `
                        <img src="${producto.img}" alt="${producto.nombre}" style="width: 100px;">
                        <div class="carrito-producto-detalles">
                            <div class="fila-producto nombre-producto">
                                <h4>${producto.nombre}</h4>
                            </div>
                            <div class="fila-producto precio-cantidad">
                                <p>$${producto.precio}</p>
                                <p>x${producto.cantidad}</p>
                            </div>
                            <div class="fila-producto precio-total">
                                <p>Total: $${(producto.precio * producto.cantidad).toFixed(2)}</p>
                            </div>
                            <div class="fila-producto boton-eliminar">
                                <button class="eliminar-producto" data-id="${producto.id}">Eliminar</button>
                            </div>
                        </div>
                    `;

                    // Sumar el total de este producto al total del carrito
                    totalCarrito += producto.precio * producto.cantidad;

                    contenedorCarrito.appendChild(divProducto);
                });

                // Mostrar el total del carrito
                totalCarritoElemento.innerText = `$${totalCarrito.toFixed(2)}`;

                // Agregar eventos para eliminar productos
                document.querySelectorAll(".eliminar-producto").forEach(boton => {
                    boton.addEventListener("click", (e) => {
                        eliminarProductoDelCarrito(e.target.getAttribute("data-id"));
                    });
                });
            }
        }
    }

    // Función para eliminar productos del carrito
    function eliminarProductoDelCarrito(idProducto) {
        productosEnCarrito = productosEnCarrito.filter(producto => producto.id !== idProducto);

        // Actualizar el localStorage y el DOM
        localStorage.setItem("productosCarrito", JSON.stringify(productosEnCarrito));
        mostrarProductosEnCarrito();
        actualizarNumeroCarrito();
    }

    // Simulación de pago y vaciar carrito
    document.querySelector("#pagarCarrito").addEventListener("click", () => {
        if (productosEnCarrito.length > 0) {
            alert("Compra realizada con éxito.");
            productosEnCarrito = [];
            localStorage.removeItem("productosCarrito");
            mostrarProductosEnCarrito();
            actualizarNumeroCarrito();
        } else {
            alert("El carrito está vacío.");
        }
    });
});
