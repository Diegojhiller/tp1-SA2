const xs = [-6, -5, -4, -3, -2, -1, 0, 1, 2];
const ys = xs.map((x) => 2 * x + 6);
const $ = (id) => document.getElementById(id);
const ui = {
  dot: $('statusDot'), text: $('statusText'), bar: $('progressFill'), epoch: $('epochValue'), loss: $('lossValue'), ready: $('readyValue'),
  samples: $('samplesList'), form: $('predictForm'), input: $('xInput'), button: $('predictButton'), result: $('resultValue'), hint: $('resultHint'),
};

ui.samples.innerHTML = xs.map((x, i) => `<div class="sample"><strong>X = ${x}</strong><span>Y = ${ys[i]}</span></div>`).join('');

let model;
const setState = (text, progress = 0, epoch = '0 / 400', loss = '--') => {
  ui.text.textContent = text;
  ui.bar.style.width = `${progress * 100}%`;
  ui.epoch.textContent = epoch;
  ui.loss.textContent = loss;
};

const ready = () => {
  ui.dot.style.background = 'var(--accent)';
  ui.dot.style.boxShadow = '0 0 0 6px rgba(74, 222, 128, 0.15)';
  ui.ready.textContent = 'Listo para usar';
  ui.result.textContent = 'El modelo ya está listo para predecir';
  ui.hint.textContent = 'Ingresa un valor de X y presiona Predecir.';
  ui.input.disabled = false;
  ui.button.disabled = false;
};

(async () => {
  setState('Preparando datos...');
  const x = tf.tensor2d(xs, [9, 1]);
  const y = tf.tensor2d(ys, [9, 1]);

  model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));
  model.compile({ optimizer: tf.train.adam(0.08), loss: 'meanSquaredError' });

  await model.fit(x, y, {
    epochs: 400,
    shuffle: true,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        setState('Entrenando modelo...', (epoch + 1) / 400, `${epoch + 1} / 400`, logs.loss.toFixed(5));
        await tf.nextFrame();
      },
    },
  });

  x.dispose();
  y.dispose();
  setState('Entrenamiento finalizado', 1, '400 / 400', ui.loss.textContent);
  ready();
})().catch((error) => {
  console.error(error);
  ui.ready.textContent = 'No disponible';
  ui.result.textContent = 'No se pudo entrenar el modelo';
  ui.hint.textContent = 'Revisa la consola del navegador para ver el detalle.';
});

ui.form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!model || ui.input.disabled) return;

  const value = Number(ui.input.value.trim());
  if (Number.isNaN(value)) {
    ui.result.textContent = 'El valor debe ser numérico';
    ui.hint.textContent = 'Escribe un número real para continuar.';
    return;
  }

  const prediction = model.predict(tf.tensor2d([value], [1, 1])).dataSync()[0];
  ui.result.textContent = `Y ≈ ${prediction.toFixed(2)}`;
  ui.hint.textContent = `Para X = ${value}, el valor esperado de Y es ${2 * value + 6}.`;
});