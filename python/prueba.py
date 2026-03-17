personas = []

print("=== REGISTRO DE PERSONAS ===")
print("Ingrese los datos. Escriba 'fin' en el nombre para terminar.\n")

while True:
    
    nombre = input("Escriba el nombre: ")

    if nombre.lower() == "fin":
        break

    edad = int(input("Escriba la edad: "))
    nota = float(input("Ingrese la nota: "))

    persona = [nombre, edad, nota]

    personas.append(persona)

    print("Persona agregada correctamente\n")


print("\n=== LISTA DE PERSONAS INGRESADAS ===")

for p in personas:
    print("Nombre:", p[0], "| Edad:", p[1], "| Nota:", p[2])


print("\n=== LISTA ORDENADA POR NOTA (Mayor a menor) ===")

personas_ordenadas = sorted(personas, key=lambda x: x[2], reverse=True)

for p in personas_ordenadas:
    print("Nombre:", p[0], "| Edad:", p[1], "| Nota:", p[2])


suma = 0

for p in personas:
    suma += p[2]

if len(personas) > 0:
    promedio = suma / len(personas)
    print("\nPromedio general de notas:", round(promedio,2))
else:
    print("\nNo se ingresaron datos.")