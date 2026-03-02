// Primero, incluye PapaParse vía CDN (no necesitas instalar nada, se carga online)
// Pero en producción, descarga si quieres offline. Por ahora, agrégalo en el HTML si lo prefieres, pero aquí lo cargamos dinámicamente.
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js';
document.head.appendChild(script);

// Espera a que PapaParse se cargue antes de ejecutar el código
script.onload = function() {
    // URL de tu Google Sheet publicado como CSV (reemplaza con la tuya)
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTsQNRW2m3ACR8Snlkack-Xkuqyh2vqIwDUmctQdpRxspVzRaJN_w80bYehsGY6fusuo7S5LNMMZBRv/pub?gid=0&single=true&output=csv'
    
    // Función para cargar y parsear el CSV
    function loadData() {
        // Usa fetch para obtener el CSV como texto
        fetch(csvUrl)
            .then(response => response.text())
            .then(data => {
                // Parsea el CSV con PapaParse (convierte a array de objetos)
                const parsedData = Papa.parse(data, { header: true }).data;
                
                // Limpia el cuerpo de la tabla
                const tableBody = document.getElementById('table-body');
                tableBody.innerHTML = '';
                
                // Por cada fila de datos, crea una fila en la tabla
                parsedData.forEach(row => {
                    // Crea una fila <tr>
                    const tr = document.createElement('tr');
                    
                    // Agrega celdas <td> para cada columna (asumiendo orden: Código, Producto, Ubicación, Cantidad)
                    const columns = ['Código', 'Producto', 'Ubicación', 'Cantidad']; // Ajusta si tus columnas tienen nombres diferentes
                    columns.forEach(col => {
                        const td = document.createElement('td');
                        td.textContent = row[col] || ''; // Si no hay dato, vacío
                        tr.appendChild(td);
                    });
                    
                    // Agrega la fila al cuerpo de la tabla
                    tableBody.appendChild(tr);
                });
            })
            .catch(error => console.error('Error cargando datos:', error)); // Manejo de errores
    }
    
    // Carga los datos al iniciar
    loadData();
    
    // Manejo de la barra de búsqueda
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase(); // Convierte a minúsculas para búsqueda insensible
        
        // Obtiene todas las filas de la tabla
        const rows = document.querySelectorAll('#table-body tr');
        
        rows.forEach(row => {
            // Obtiene texto de código (columna 1) y producto (columna 2)
            const code = row.children[0].textContent.toLowerCase();
            const product = row.children[1].textContent.toLowerCase();
            
            // Si coincide con código o producto, muestra y resalta; sino, oculta
            if (code.includes(searchTerm) || product.includes(searchTerm)) {
                row.style.display = ''; // Muestra la fila
                row.classList.add('highlight'); // Agrega clase rosa para highlight
            } else {
                row.style.display = 'none'; // Oculta la fila
                row.classList.remove('highlight'); // Quita highlight
            }
        });
    });
};