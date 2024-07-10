

    // Cambiar el color de fondo del body
    const colorCuerpo = document.body;
    colorCuerpo.style.backgroundColor = "#eee";

// 


document.addEventListener('DOMContentLoaded', function() {
    const cardsProd = document.getElementById('cards');
    const comprarButton = document.getElementById('comprarButton');
    const tbody = document.querySelector('.tbody');
    let carrito = [];

    // Función para cargar productos desde la API de Mercado Libre
    const solicitudML = async () => {
        try {
            const respuesta = await fetch('https://api.mercadolibre.com/sites/MLA/search?q=electrodomesticos');
            const datos = await respuesta.json();
            const data = datos.results;

        
            for (let i = 0; i < data.length; i += 4) {
                const row = document.createElement('div');
                row.classList.add('row', 'row-cols-1', 'row-cols-md-2', 'row-cols-lg-3', 'row-cols-xl-4', 'mb-4');

           
                for (let j = i; j < i + 4 && j < data.length; j++) {
                    const item = data[j];
                    const card = document.createElement('div');
                    card.classList.add('col', 'mb-4');
                    card.innerHTML = `
                        <div class="card shadow rounded h-100">
                            <h5 class="card-title pt-2 text-center text-primary">${item.title}</h5>
                            <img src="${item.thumbnail}" class="card-img-top" alt="${item.title}">
                            <div class="card-body">
                                <h5 class="card-title">${item.title}</h5>
                                <p class="card-text text-50 description">Descripción del producto.</p>
                                <h5 class="text-primary">Precio: <span class="precio">$${item.price}</span></h5>
                                <div class="d-grid gap-2">
                                    <button class="btn btn-primary button">Añadir a carrito</button>
                                </div>
                            </div>
                        </div>
                    `;
                    row.appendChild(card);

                    // Agregar event listener al botón "Añadir a carrito"
                    const addButton = card.querySelector('.button');
                    addButton.addEventListener('click', () => {
                        addToCarritoItem(item);
                    });
                }

                cardsProd.appendChild(row);
            }
        } catch (error) {
            console.error('Error al cargar productos desde la API de Mercado Libre:', error);
        }
    };

   
    solicitudML();

    // Función para agregar producto al carrito
    function addToCarritoItem(producto) {
        const newItem = {
            title: producto.title,
            precio: producto.price,
            img: producto.thumbnail,
            cantidad: 1
        };

        addItemCarrito(newItem);
    }

    // Función para agregar un item al carrito
    function addItemCarrito(newItem) {
        const existeEnCarrito = carrito.find(item => item.title === newItem.title);

        if (existeEnCarrito) {
            existeEnCarrito.cantidad++;
        } else {
            carrito.push(newItem);
        }

        renderCarrito();
    }

    // Función para renderizar el carrito
    function renderCarrito() {
        tbody.innerHTML = '';

        carrito.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td class="table__productos">
                    <img src="${item.img}" alt="${item.title}">
                    <h6>${item.title}</h6>
                </td>
                <td class="table__precio"><p>${item.precio}</p></td>
                <td class="table__cantidad">
                    <input type="number" min="1" value="${item.cantidad}" class="input__elemento">
                    <button class="delete btn btn-danger">x</button>
                </td>
            `;
            tbody.appendChild(tr);

            // Event listener para eliminar producto del carrito
            const deleteButton = tr.querySelector('.delete');
            deleteButton.addEventListener('click', () => {
                removeItemCarrito(item.title);
            });

            // Event listener para cambiar cantidad
            const inputElemento = tr.querySelector('.input__elemento');
            inputElemento.addEventListener('change', () => {
                item.cantidad = parseInt(inputElemento.value);
                renderCarrito();
            });
        });

        // Actualizar total del carrito
        carritoTotal();
    }

    // Función para calcular y mostrar el total del carrito
    function carritoTotal() {
        let total = 0;

        carrito.forEach(item => {
            total += item.precio * item.cantidad;
        });

        const itemCartTotal = document.querySelector('.itemCartTotal');
        itemCartTotal.textContent = `Total: $${total}`;
    }

    // Función para eliminar un item del carrito
    function removeItemCarrito(title) {
        carrito = carrito.filter(item => item.title !== title);
        renderCarrito();
    }

    // Función para realizar la compra
    comprarButton.addEventListener('click', () => {
        carrito = [];
        renderCarrito();
      

        // sweet alert
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Su compra fue realizada",
            text: "Gracias por su compra",
            showConfirmButton: false,
            timer: 1500
          });

    });
});



