// =========================================================================
// 1. CONFIGURACIÓN Y LISTA DE CATEGORÍAS
// =========================================================================
const CATEGORIAS = ["vestidos", "tops", "pantalones", "jeans"];
let listadoVestidos = [];

// =========================================================================
// 2. MOTOR DE CARGA DINÁMICA (JSON)
// =========================================================================
async function iniciarCatalogo() {
    const main = document.getElementById("catalogo-principal");
    main.innerHTML = ""; // Limpiar antes de cargar

    for (const cat of CATEGORIAS) {
        try {
            // Asegúrate que la carpeta se llame 'datos' tal como en tu VS Code
            const res = await fetch(`./datos/${cat}.json`);
            if (!res.ok) throw new Error(`No encontrado: ${cat}`);
            
            const data = await res.json();
            const conCategoria = data.map(item => ({ ...item, categoria: cat }));
            listadoVestidos.push(...conCategoria);
        } catch (err) { 
            console.warn(`Error en ${cat}:`, err); 
        }
    }
    renderizarPagina();
}

// =========================================================================
// 3. RENDERIZADO CON TÍTULOS Y ESTRUCTURA DE MODELO
// =========================================================================
function renderizarPagina() {
    const main = document.getElementById("catalogo-principal");
    const nav = document.getElementById("botones-navegacion");
    
    nav.innerHTML = "";
    
    CATEGORIAS.forEach(cat => {
        // Título limpio (ej: "vestidos" -> "VESTIDOS")
        const tituloLimpio = cat.toUpperCase().replace("-", " ");
        
        nav.innerHTML += `<a href="#sec-${cat}" class="btn-banner">${tituloLimpio}</a>`;
        
        main.innerHTML += `
            <section id="sec-${cat}">
                <h2>${tituloLimpio}</h2>
                <div class="grid-vestidos" id="grid-${cat}"></div>
            </section>`;
        
        const grid = document.getElementById(`grid-${cat}`);
        listadoVestidos.filter(v => v.categoria === cat).forEach(v => {
            grid.innerHTML += `
                <div class="card-vestido">
                    <div class="img-container">
                        <label class="contenedor-checkbox">
                            <input type="checkbox"> Llevar
                        </label>
                        <button class="btn-zoom-lupa">🔍</button>
                        <img src="${v.imagen}" alt="${v.nombre}">
                    </div>
                    <h3>${v.nombre}</h3>
                    <p class="precio">S/${v.precio.toFixed(2)}</p>
                </div>`;
        });
    });
}

// =========================================================================
// 4. SOLUCIÓN DEFINITIVA DE SCROLL (Solo bloquea si hay zoom activo)
// =========================================================================
document.addEventListener("touchmove", (e) => {
    const contenedor = e.target.closest('.img-container');
    if (contenedor && contenedor.classList.contains("zoom-activo")) {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener("DOMContentLoaded", iniciarCatalogo);