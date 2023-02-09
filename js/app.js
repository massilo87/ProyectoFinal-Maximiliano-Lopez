///Query Selectors

const contenedorProductos = document.querySelector("#contenedorProductos");
const carritoProductosSeleccionados = document.querySelector("#carritoProductosSeleccionados");
const btnVaciar = document.querySelector("#accionesVaciar");
const carritoAccionesTotal = document.querySelector("#total");
const botonFinalizar = document.querySelector("#accionesComprar");

///Finalizar Compra

const finalizaCompra = () => {
    let totalCalculado = actualizarTotal();

    if (carrito.length === 0) {
        Swal.fire(
            "El carro está vacío",
            "Recorre la tienda y elige tus próximas impresiones",
            "error"
        );
    } else {
        Swal.fire(
            "Compra realizada correctamente",
            "El importe total de tu compra es de $" + totalCalculado,
            "success"
        );
    }
    vaciarCarrito();
};

///Eventos

btnVaciar.addEventListener("click", alertaDeVaciado);
botonFinalizar.addEventListener("click", finalizaCompra);

///Array de productos en tienda

let impresiones = [];

///Carrito de prooductos

let carrito = [];

///Carga de coontenido

window.addEventListener('DOMContentLoaded', () => {
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    actualizarListaCarrito();

});

///Peticion de datos

fetch("./js/impresion.json")
    .then(response => response.json())
    .then(data => {
        impresiones = data;
        cargarProductos(impresiones);
    })


///Cargar productos en index.html

const cargarProductos = () => {

    impresiones.forEach(impresion => {

        const div = document.createElement('div');
        div.classList.add("itemProducto");
        div.innerHTML = `
        <img src="${impresion.img}" alt="${impresion.nombre}">
        <h5 class="productoNombre">${impresion.nombre}</h5>
        <p class="productoPrecio">$${impresion.precio}</p>
        <button class="agregar" id="${impresion.id}">Agregar</button>
        `;

        contenedorProductos.append(div);

    });

    const botonImpresion = document.querySelectorAll(".agregar");
    botonImpresion.forEach((button) => {
        button.addEventListener("click", agregarAlCarrito);
    });

}

///Agregar productos al carrito

function agregarAlCarrito(e) {

    Toastify({
        text: "Agregado al carrito",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #f87102 57.66%, #fff23d 100%)",
            borderRadius: "1rem",
        },
        onClick: function () { }
    }).showToast();

    const idButton = e.currentTarget.id;

    const productoAgregado = impresiones.find((impresion) => impresion.id == idButton);

    if (carrito.some(impresion => impresion.id == idButton)) {
        const index = carrito.findIndex(producto => producto.id == idButton);
        carrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        carrito.push(productoAgregado);
    }

    actualizarListaCarrito();
    localStorage.setItem("carrito", JSON.stringify(carrito));

}

///Actualizar contenido de carrito

const actualizarListaCarrito = () => {
    carritoProductosSeleccionados.innerHTML = '';
    carrito.forEach(impresion => {


        let div = document.createElement('div');
        div.classList.add("carritoProductoElegido");
        div.innerHTML = `
        <img src="${impresion.img}" alt="${impresion.nombre}">
        <div class="carritoProductoNombre">
            <small>Nombre</small>
            <p><strong>${impresion.nombre}</strong></p>
        </div>

        <div class="carritoProductoCantidad">
            <small>Cantidad</small>
            <p><strong>${impresion.cantidad}</strong></p>
        </div>

        <div class="carritoProductoPrecio">
            <small>Precio unitario</small>
            <p><strong>$${impresion.precio}</strong></p>
        </div>

        <div class="carritoProductosSubtotal">
            <small>Subtotal</small>
            <p><strong>$${impresion.precio * impresion.cantidad}</strong></p>
        </div>
        <button class="carritoProductoEliminar" id="${impresion.id}"><i class="bi bi-trash3-fill"></i></button>
        `;

        carritoProductosSeleccionados.append(div);

        const removerImpresion = document.querySelectorAll(".carritoProductoEliminar");
        removerImpresion.forEach((button) => {
            button.addEventListener("click", eliminarImpresion);
        });

        actualizarTotal();

    });

};

///Eliminar producto individual del carrito

const eliminarImpresion = (e) => {

    Toastify({
        text: "Eliminado del carrito",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #f87102, #fff23d)",
            borderRadius: "1rem",
        },
        onClick: function () { }
    }).showToast();

    const impresionElegida = e.target.closest(".carritoProductoEliminar").getAttribute("id");
    carrito = carrito.filter((impresion) => impresion.id != impresionElegida);
    const carritoJson = JSON.stringify(carrito);
    localStorage.setItem("carrito", carritoJson);
    actualizarListaCarrito();
    actualizarTotal()
};



///Vaciar carrito

function vaciarCarrito() {
    carrito.length = 0;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarListaCarrito();
    actualizarTotal();

}


function alertaDeVaciado() {
    if (carrito.length != 0) {
        Swal.fire({
            title: '¿Estas seguro de vaciar el carrito?',
            text: 'Se borraran todos los productos seleccionados!',
            icon: 'warning',
            showCancelButton: true,
            //confirmButtonColor: '#f87102',
            //cancelButtonColor: '#fff23d',
            cancelButtonText: 'No',
            confirmButtonText: 'Si'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Eliminado',
                    text: 'Su carrito esta vacio!',
                    icon: 'success',
                    //confirmButtonColor: '#fff23d',
                    confirmButtonText: 'Aceptar'
                })
                vaciarCarrito();
            }
        })
    }
}


///Actualizar total

function actualizarTotal() {
    const totalCalculado = carrito.reduce((acumulador, impresion) => acumulador + (impresion.precio * impresion.cantidad), 0);
    total.innerHTML = `$${totalCalculado}`

    return (totalCalculado)

}