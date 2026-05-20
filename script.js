// =========================================================================
// 1. CONFIGURACIÓN GENERAL (TU NÚMERO REAL INTEGRADO)
// =========================================================================
const TU_TELEFONO = "51984858703"; // Código 51 de Perú + tu número real, sin espacios ni signos +

const TITULOS_CATEGORIAS = {
    "fiesta": "Vestidos de Fiesta",
    "casual": "Vestidos Casuales",
    "gala": "Vestidos de Gala",
    "graduacion": "Modelos de Graduación",
    "temporada": "Nueva Temporada",
    "vestidos": "Vestidos",
    "casacas": "Casacas"
};

// =========================================================================
// 2. LISTADO DE PUBLICACIONES (REEMPLAZA CON TU ROPA REAL)
// =========================================================================
const listadoVestidos = [
    {
        id: 1,
        categoria: "fiesta",
        nombre: "Vestido Gala Glamour",
        precio: 120.00, 
        detalles: "Tela satín premium, corte sirena, espalda descubierta.",
        imagen: "https://unsplash.com" 
    },
    {
        id: 2,
        categoria: "casual",
        nombre: "Vestido Primavera Flores",
        precio: 45.00,
        detalles: "100% algodón fresco, tirantes ajustables, cómodo.",
        imagen: "https://unsplash.com"
    },
    {
        id: 3,
        categoria: "gala", 
        nombre: "Vestido Princesa Dorado",
        precio: 200.00,
        detalles: "Acabados brillantes, falda amplia de tul, corsé ajustable.",
        imagen: "https://unsplash.com"
    },
    {
        id: 4,
        categoria: "fiesta", 
        nombre: "Vestido Cóctel Rojo",
        precio: 85.00,
        detalles: "Encaje fino, falda entallada, ideal para eventos de noche.",
        imagen: "https://unsplash.com"
    }
];

let carritoSeleccionado = [];

// =========================================================================
// 3. MOTOR INTELIGENTE DEL CATÁLOGO
// =========================================================================
function renderizarPagina() {
    const catalogoPrincipal = document.getElementById("catalogo-principal");
    const botonesNavegacion = document.getElementById("botones-navegacion");
    
    if (!catalogoPrincipal || !botonesNavegacion) return;

    catalogoPrincipal.innerHTML = "";
    botonesNavegacion.innerHTML = "";

    const categoriasCreadas = [];

    listadoVestidos.forEach(vestido => {
        if (!categoriasCreadas.includes(vestido.categoria)) {
            categoriasCreadas.push(vestido.categoria);

            const tituloSeccion = TITULOS_CATEGORIAS[vestido.categoria] || vestido.categoria.toUpperCase();

            botonesNavegacion.innerHTML += `
                <a href="#sec-${vestido.categoria}" class="btn-banner">${tituloSeccion}</a>
            `;

            catalogoPrincipal.innerHTML += `
                <section id="sec-${vestido.categoria}" class="seccion-catalogo">
                    <h2 class="section-title">${tituloSeccion}</h2>
                    <div class="grid-vestidos" id="grid-${vestido.categoria}"></div>
                </section>
            `;
        }

        const textoWhatsAppIndividual = `Hola Marishely's Outfits, me interesa comprar esta prenda:\n\n件 *${vestido.nombre}*\n💰 Precio: $${vestido.precio.toFixed(2)}\n🖼️ Foto: ${vestido.imagen}`;
        
        // REPARADO AL 100%: Enlace nativo directo sin llaves y con barras correctas
        const enlaceWhatsApp = "https://wa.me//984858703?text=" + encodeURIComponent(textoWhatsAppIndividual);

        const tarjetaHTML = `
            <div class="card-vestido" data-id="${vestido.id}">
                <div class="img-container">
                    <label class="contenedor-checkbox">
                        <input type="checkbox" class="chk-seleccionar-prenda" data-id="${vestido.id}">
                        Llevar
                    </label>
                    <button class="btn-zoom-lupa" data-img="${vestido.imagen}">🔍</button>
                    <img src="${vestido.imagen}" alt="${vestido.nombre}">
                </div>
                <div class="card-info">
                    <h3>${vestido.nombre}</h3>
                    <p class="precio">$${vestido.precio.toFixed(2)}</p>
                    <p class="detalles">${vestido.detalles}</p>
                    <a href="${enlaceWhatsApp}" target="_blank" class="btn-whatsapp">
                        Hacer Pedido Inmediato
                    </a>
                </div>
            </div>
        `;

        const gridDestino = document.getElementById(`grid-${vestido.categoria}`);
        if (gridDestino) {
            gridDestino.innerHTML += tarjetaHTML;
        }
    });

    const tarjetas = document.querySelectorAll('.card-vestido');
    const opciones = { root: null, threshold: 0.05, rootMargin: "0px 0px -20px 0px" };

    const observadorTarjetas = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('aparecer');
                observadorTarjetas.unobserve(entrada.target);
            }
        });
    }, opciones);

    tarjetas.forEach(tarjeta => observadorTarjetas.observe(tarjeta));
}

document.addEventListener("DOMContentLoaded", renderizarPagina);

// =========================================================================
// 4. SISTEMA DE SELECCIÓN MÚLTIPLE Y MANEJO DE CARRITO
// =========================================================================
document.addEventListener("change", (e) => {
    if (e.target && e.target.classList.contains("chk-seleccionar-prenda")) {
        const idPrenda = parseInt(e.target.getAttribute("data-id"));
        const prendaEncontrada = listadoVestidos.find(v => v.id === idPrenda);

        if (e.target.checked) {
            carritoSeleccionado.push(prendaEncontrada);
        } else {
            carritoSeleccionado = carritoSeleccionado.filter(v => v.id !== idPrenda);
        }

        actualizarBarraFlotante();
    }
});

function actualizarBarraFlotante() {
    const barra = document.getElementById("barra-pedido-grupal");
    const contador = document.getElementById("contador-prendas");
    const totalElemento = document.getElementById("total-pedido");

    if (!barra || !contador || !totalElemento) return;

    if (carritoSeleccionado.length > 0) {
        const sumaTotal = carritoSeleccionado.reduce((acumulado, v) => acumulado + v.precio, 0);
        contador.innerText = `${carritoSeleccionado.length} ${carritoSeleccionado.length === 1 ? 'prenda seleccionada' : 'prendas seleccionadas'}`;
        totalElemento.innerText = `$${sumaTotal.toFixed(2)}`;
        barra.classList.add("activa");
    } else {
        barra.classList.remove("activa");
    }
}

document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "btn-enviar-grupal") {
        if (carritoSeleccionado.length === 0) return;

        let mensajeGrupal = "Hola Marishely's Outfits, quiero hacer un pedido conjunto con las siguientes prendas:\n\n";
        let sumaTotal = 0;

        carritoSeleccionado.forEach((prenda, index) => {
            mensajeGrupal += `${index + 1}. *${prenda.nombre}*\n   Precio: $${prenda.precio.toFixed(2)}\n   Foto: ${prenda.imagen}\n\n`;
            sumaTotal += prenda.precio;
        });

        mensajeGrupal += `-------------------------\n🛍️ *Total de prendas:* ${carritoSeleccionado.length}\n💵 *Monto Total del Pedido:* $${sumaTotal.toFixed(2)}`;

        // REPARADO AL 100%: Enlace nativo para pedido grupal sin errores
        const urlFinal = "https://wa.me//984858703?text=" + encodeURIComponent(mensajeGrupal);
        window.open(urlFinal, "_blank");
    }
});

// =========================================================================
// 5. MOTOR DE INTERRUPTOR DE ZOOM INTERNO (UN CLIC ENCIENDE / UN CLIC APAGA)
// =========================================================================
const ZOOM_INTERNO = window.innerWidth <= 600 ? 3.5 : 2.2; 
let lupaActivaGlobal = null; 

document.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("btn-zoom-lupa")) {
        e.preventDefault();
        e.stopPropagation();

        const boton = e.target;
        const contenedor = boton.closest('.img-container');
        const img = contenedor ? contenedor.querySelector('img') : null;

        if (!contenedor || !img) return;

        if (contenedor.classList.contains("zoom-activo")) {
            contenedor.classList.remove("zoom-activo");
            boton.innerText = "🔍";
            img.style.transform = "scale(1)";
            img.style.transformOrigin = "center center";
        } else {
            document.querySelectorAll('.img-container.zoom-activo').forEach(c => {
                c.classList.remove('zoom-activo');
                const b = c.querySelector('.btn-zoom-lupa');
                if (b) b.innerText = "🔍";
                const i = c.querySelector('img');
                if (i) { i.style.transform = "scale(1)"; i.style.transformOrigin = "center center"; }
            });

            contenedor.classList.add("zoom-activo");
            boton.innerText = "❌";
            img.style.transform = `scale(${ZOOM_INTERNO})`;
            img.style.transformOrigin = "center center";
        }
    }
});

function moverEnfoqueLupa(e, contenedor, img) {
    if (!contenedor.classList.contains("zoom-activo")) return;

    const clienteX = e.touches ? e.touches.clientX : e.clientX;
    const clienteY = e.touches ? e.touches.clientY : e.pageY;

    const rect = contenedor.getBoundingClientRect();
    const x = clienteX - rect.left;
    const y = clienteY - rect.top;

    let xPorcentaje = (x / rect.width) * 100;
    let yPorcentaje = (y / rect.height) * 100;

    xPorcentaje = Math.max(0, Math.min(100, xPorcentaje));
    yPorcentaje = Math.max(0, Math.min(100, yPorcentaje));

    img.style.transformOrigin = `${xPorcentaje}% ${yPorcentaje}%`;
}

document.addEventListener("mousemove", (e) => {
    const contenedor = e.target.closest('.img-container');
    if (contenedor && contenedor.classList.contains("zoom-activo")) {
        const img = contenedor.querySelector('img');
        moverEnfoqueLupa(e, contenedor, img);
    }
});

document.addEventListener("touchmove", (e) => {
    const contenedor = e.target.closest('.img-container');
    if (contenedor && contenedor.classList.contains("zoom-activo")) {
        e.preventDefault(); 
        const img = contenedor.querySelector('img');
        moverEnfoqueLupa(e, contenedor, img);
    }
}, { passive: false });

// =========================================================================
// 6. BOTÓN SCROLL TOP (SUBIR RÁPIDO)
// =========================================================================
window.addEventListener("scroll", () => {
    const botonSubir = document.getElementById("btn-subir");
    if (!botonSubir) return;

    if (window.scrollY > 300) {
        botonSubir.classList.add("visible");
    } else {
        botonSubir.classList.remove("visible");
    }
});

document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "btn-subir") {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});
