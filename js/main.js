document.addEventListener("DOMContentLoaded", () => {
    let productosEnCarrito = JSON.parse(localStorage.getItem("productosCarrito")) || [];

    actualizarNumeroCarrito();
    mostrarProductosEnCarrito();

    const abrirCarrito = document.querySelector("#cart");
    const cerrarCarrito = document.querySelector("#cerrarCarrito");
    const carritoContainer = document.querySelector("#cartContainer");

    abrirCarrito.addEventListener("click", () => {
        carritoContainer.style.right = "0";
    });

    cerrarCarrito.addEventListener("click", () => {
        carritoContainer.style.right = "-500px";
    });

    document.querySelectorAll(".boton").forEach(boton => {
        boton.addEventListener("click", (e) => {
            e.preventDefault();
            const idProducto = boton.getAttribute("data-id");
            const nombreProducto = boton.getAttribute("data-nombre");
            const precioProducto = boton.getAttribute("data-precio");
            const imgProducto = boton.getAttribute("data-img").split('/').pop(); // Guardamos solo el nombre de la imagen

            agregarAlCarrito(idProducto, nombreProducto, precioProducto, imgProducto);
        });
    });

    function agregarAlCarrito(id, nombre, precio, img) {
        const productoExistente = productosEnCarrito.find(producto => producto.id === id);

        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            productosEnCarrito.push({
                id,
                nombre,
                precio: parseFloat(precio),
                img,
                cantidad: 1
            });
        }

        localStorage.setItem("productosCarrito", JSON.stringify(productosEnCarrito));
        actualizarNumeroCarrito();
        mostrarProductosEnCarrito();
    }

    function actualizarNumeroCarrito() {
        const numeroProductos = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
        const carritoIcono = document.querySelector("#cart-count");
        if (carritoIcono) {
            carritoIcono.innerText = `(${numeroProductos})`;
        }
    }

    function mostrarProductosEnCarrito() {
        const contenedorCarrito = document.querySelector(".productos-carrito-conteiner");
        const carritoVacioMensaje = document.querySelector("#carritoVacio");
        const totalCarritoElemento = document.querySelector("#totalCarrito");
        let totalCarrito = 0;

        contenedorCarrito.innerHTML = '';

        if (productosEnCarrito.length === 0) {
            carritoVacioMensaje.style.display = 'block';
            totalCarritoElemento.innerText = '$0';
        } else {
            carritoVacioMensaje.style.display = 'none';
            productosEnCarrito.forEach(producto => {
                const rutaImagenCompleta = `${obtenerRutaBase()}${producto.img}`;
                
                const divProducto = document.createElement("div");
                divProducto.classList.add("carrito-producto");
                divProducto.innerHTML = `
                    <img src="${rutaImagenCompleta}" alt="${producto.nombre}" style="width: 100px;">
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

                totalCarrito += producto.precio * producto.cantidad;
                contenedorCarrito.appendChild(divProducto);
            });

            totalCarritoElemento.innerText = `$${totalCarrito.toFixed(2)}`;

            document.querySelectorAll(".eliminar-producto").forEach(boton => {
                boton.addEventListener("click", (e) => {
                    eliminarProductoDelCarrito(e.target.getAttribute("data-id"));
                });
            });
        }
    }

    function eliminarProductoDelCarrito(idProducto) {
        productosEnCarrito = productosEnCarrito.filter(producto => producto.id !== idProducto);
        localStorage.setItem("productosCarrito", JSON.stringify(productosEnCarrito));
        mostrarProductosEnCarrito();
        actualizarNumeroCarrito();
    }

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

    function obtenerRutaBase() {
        if (window.location.pathname.includes('index.html') || window.location.pathname === "/") {
            return './img/';
        } else if (window.location.pathname.includes('/pages/')) {
            return '../img/';
        }
        return '';
    }
});
