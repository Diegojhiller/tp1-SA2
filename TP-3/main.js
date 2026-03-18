// --- INTEGRACION CON BACKEND ---

const API_URL = '/api/alumnos';

let personas = [];

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
btnGuardar.addEventListener('click', async () => {
    const nombre = inputNombre.value;
    const edad   = parseInt(inputEdad.value);
    const nota   = parseFloat(inputNota.value);

    if (nombre && !isNaN(edad) && !isNaN(nota)) {
        const nuevaPersona = { nombre, edad, nota };

        try {
            const respuesta = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaPersona)
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(data.error || 'No se pudo guardar el alumno.');
            }

            personas = data.alumnos;
            actualizarInterfaz();
            inputNombre.value = "";
            inputEdad.value = "";
            inputNota.value = "";
        } catch (error) {
            alert(error.message);
        }
    } else {
        alert("Por favor, completa todos los campos correctamente.");
    }
});

// Evento de clic para limpiar todos los datos guardados
btnLimpiar.addEventListener('click', async () => {
    try {
        const respuesta = await fetch(API_URL, {
            method: 'DELETE'
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(data.error || 'No se pudo limpiar la lista.');
        }

        personas = data.alumnos;
        actualizarInterfaz();
    } catch (error) {
        alert(error.message);
    }
});

const iniciar = async () => {
    try {
        const respuesta = await fetch(API_URL);
        const data = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(data.error || 'No se pudieron cargar los alumnos.');
        }

        personas = data.alumnos;
        actualizarInterfaz();
    } catch (error) {
        alert(error.message);
    }
};

iniciar();