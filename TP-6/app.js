// 1. Arreglos para guardar nuestros datos (tal como pide la consigna)
let epocas = []; // Acá guardaremos: 1, 2, 3... hasta 100
let perdidas = []; // Acá guardaremos el valor de "loss" de cada época

// Variable para guardar nuestro gráfico y nuestro modelo (el estudiante)
let grafico;
let modelo;

// 2. Función para inicializar el gráfico vacío
function inicializarGrafico() {
    // Buscamos el <canvas> en nuestro HTML
    const ctx = document.getElementById('graficoPerdida').getContext('2d');
    
    // Le pedimos a Chart.js que dibuje un gráfico
    grafico = new Chart(ctx, {
        type: 'line', // Tipo de gráfico: Línea
        data: {
            labels: epocas, // Eje X: El arreglo de épocas
            datasets: [{
                label: 'Pérdida (Loss)',
                data: perdidas, // Eje Y: El arreglo de valores de pérdida
                borderColor: '#4bc0c0', // Color de la línea (celestito)
                tension: 0.1 // Para que la línea sea apenas curvada
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Época' } },
                y: { title: { display: true, text: 'Valor de Pérdida' } }
            }
        }
    });
}

// 3. Función para crear y entrenar el modelo
async function entrenarModelo() {
    document.getElementById('estado').innerText = "Estado: Entrenando modelo... mira el gráfico!";
    
    // Vaciamos los arreglos por si el usuario presiona el botón más de una vez
    epocas.length = 0;
    perdidas.length = 0;
    
    // A. Datos de ejemplo para que el modelo aprenda (ej: una recta y=2x-1)
    const xs = tf.tensor2d([-1.0, 0.0, 1.0, 2.0, 3.0, 4.0], [6, 1]);
    const ys = tf.tensor2d([-3.0, -1.0, 1.0, 3.0, 5.0, 7.0], [6, 1]);

    // B. Creamos un modelo simple (una sola neurona)
    modelo = tf.sequential();
    modelo.add(tf.layers.dense({units: 1, inputShape: [1]}));
    
    // C. Compilamos el modelo (le decimos cómo calcular su "pérdida")
    modelo.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

    // D. ¡A ENTRENAR! Acá usamos el onEpochEnd que pide la consigna
    await modelo.fit(xs, ys, {
        epochs: 100, // Va a repasar el libro 100 veces
        callbacks: {
            // Esta función se ejecuta sola CADA VEZ que termina una época
            onEpochEnd: async (epoca, logs) => {
                // 1. Guardamos la época actual (le sumamos 1 porque empieza a contar de 0)
                epocas.push(epoca + 1);
                
                // 2. Capturamos y guardamos el valor de loss
                perdidas.push(logs.loss);
                
                // 3. Le decimos al gráfico: "¡Ey, hay datos nuevos, actualizate!"
                grafico.update();
            }
        }
    });

    document.getElementById('estado').innerText = "Estado: Modelo entrenado correctamente ✅";
    
    // Como ya terminó de estudiar, habilitamos el botón del "examen" (Predecir)
    document.getElementById('btn-predecir').disabled = false;
}

// 4. Función para el "Examen" (Predicción)
function realizarPrediccion() {
    // Tomamos el texto que escribió el usuario en la caja (ej: "10, 20, 25")
    const textoInput = document.getElementById('input-x').value;
    
    // Lo convertimos en una lista de números (ej: [10, 20, 25])
    const valoresX = textoInput.split(',').map(n => parseFloat(n.trim()));
    
    // Preparamos la zona donde mostraremos los resultados
    const listaResultados = document.getElementById('lista-resultados');
    listaResultados.innerHTML = ""; // Limpiamos la zona
    
    // Le tomamos la prueba número por número
    valoresX.forEach(valorX => {
        // Convertimos el número a "idioma modelo" (Tensor)
        const tensorX = tf.tensor2d([valorX], [1, 1]);
        
        // ¡El modelo hace la predicción en base a lo que aprendió!
        const tensorY = modelo.predict(tensorX);
        
        // Obtenemos el resultado devuelta a número normal
        const resultadoY = tensorY.dataSync()[0];
        
        // Creamos un ítem en la lista y lo mostramos
        const li = document.createElement('li');
        li.innerText = `Para x = ${valorX}: y = ${resultadoY.toFixed(2)}`;
        listaResultados.appendChild(li);
    });
}

// 5. Cuando la página termine de cargar, hacemos esto:
window.onload = function() {
    inicializarGrafico(); // Preparamos el "lienzo" vacío
    
    // Le decimos al botón que cuando le hagan clic, ejecute entrenarModelo
    document.getElementById('btn-entrenar').addEventListener('click', entrenarModelo);
    
    // Y conectamos el botón nuevo de predecir
    document.getElementById('btn-predecir').addEventListener('click', realizarPrediccion);
}
