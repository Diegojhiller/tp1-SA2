const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("---------------------------------------")
console.log("SISTEMA DE GESTIÓN DE CALIFICACIONES ");
console.log("---------------------------------------")

let personas = [];

function ingresarPersona() {
    


  rl.question("Ingrese el nombre: ", function(nombre) {

    rl.question("Ingrese la edad: ", function(edad) {

      rl.question("Ingrese la nota: ", function(nota) {

        let persona = [nombre, parseInt(edad), parseFloat(nota)];
        personas.push(persona);

        rl.question("¿Desea ingresar otra persona? (si/no): ", function(respuesta) {

          if (respuesta.toLowerCase() === "si") {
            ingresarPersona();
          } else {

            console.log("\n--- Listado de personas ingresadas: ---");

            personas.forEach(p => {
              console.log(p[0] + " - " + p[1] + " - " + p[2]);
            });

            let ordenado = [...personas].sort((a, b) => b[2] - a[2]);

            console.log("\n--- Listado ordenado por nota (de mayor a menor: ---");

            ordenado.forEach(p => {
              console.log(p[0] + " - " + p[1] + " - " + p[2]);
            });

            let suma = 0;

            personas.forEach(p => {
              suma += p[2];
            });

            let promedio = suma / personas.length;

            console.log("\n--- Promedio de Notas: ---" + promedio.toFixed(2));

            rl.close();
          }

        });

      });

    });

  });

}

ingresarPersona();