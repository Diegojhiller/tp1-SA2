// --- FUNCIONES DE PERSISTENCIA (MÓDULO INTERNO) ---

// Esta función guarda el array convirtiéndolo en Texto (JSON)
const guardarEnLocal = (alumnos) => {
    localStorage.setItem('mis_alumnos', JSON.stringify(alumnos));
};

// Esta función recupera el texto y lo convierte de nuevo en Array
const cargarDeLocal = () => {
    const datos = localStorage.getItem('mis_alumnos');
    return datos ? JSON.parse(datos) : [];
};

// --- LÓGICA DEL PROGRAMA ---

// Iniciamos nuestra lista con lo que ya existe en el navegador
let personas = cargarDeLocal();

// Referencias a los elementos del HTML
const inputNombre = document.getElementById('nombre');
const inputEdad   = document.getElementById('edad');
const inputNota   = document.getElementById('nota');
const btnGuardar  = document.getElementById('btnGuardar');
const btnLimpiar  = document.getElementById('btnLimpiar');
const contenedorLista = document.getElementById('listaAlumnos');
const spanPromedio = document.getElementById('promedio');

// Función para renderizar (dibujar) la lista en pantalla
const actualizarInterfaz = () => {
    contenedorLista.innerHTML = ""; // Limpiamos la lista visual
    let suma = 0;

    personas.forEach((p) => {
        const li = document.createElement('li');
        li.textContent = `Nombre: ${p.nombre} | Edad: ${p.edad} | Nota: ${p.nota}`;
        contenedorLista.appendChild(li);
        suma += p.nota;
    });

    // Calcular y mostrar promedio
    if (personas.length > 0) {
        const promedio = suma / personas.length;
        spanPromedio.textContent = promedio.toFixed(2);
    } else {
        spanPromedio.textContent = "0";
    }
};

// Evento de clic para guardar
btnGuardar.addEventListener('click', () => {
    const nombre = inputNombre.value;
    const edad   = parseInt(inputEdad.value);
    const nota   = parseFloat(inputNota.value);

    if (nombre && !isNaN(edad) && !isNaN(nota)) {
        // 1. Creamos el objeto
        const nuevaPersona = { nombre, edad, nota };

        // 2. Agregamos al array
        personas.push(nuevaPersona);

        // 3. PERSISTENCIA: Guardamos en el navegador
        guardarEnLocal(personas);

        // 4. Actualizamos la vista y limpiamos campos
        actualizarInterfaz();
        inputNombre.value = "";
        inputEdad.value = "";
        inputNota.value = "";
    } else {
        alert("Por favor, completa todos los campos correctamente.");
    }
});

// Evento de clic para limpiar todos los datos guardados
btnLimpiar.addEventListener('click', () => {
    personas = [];
    localStorage.removeItem('mis_alumnos');
    actualizarInterfaz();
});

// Al cargar la página por primera vez, dibujamos los datos persistidos
actualizarInterfaz();