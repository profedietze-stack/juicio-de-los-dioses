# Auditoría del Ateneo de Filósofos — 24 de octubre de 2026

Jugado en el navegador (1024×768 y 375×812, sonido silenciado) y medido sobre los datos
(`src/data/ateneoComments.ts`, `philosophers.ts`).

## Lo que se arregló en esta tanda

| Hallazgo | Evidencia | Estado |
|---|---|---|
| **El modal del Ateneo se movía con el scroll.** Con el dilema leído hasta abajo, el modal quedaba con `top: -268 px`: cortado arriba y sin fondo oscuro sobre la pantalla. Afectaba también a Confirmar, Opciones y Detalle de partida. | Medido con `getBoundingClientRect`; la causa es el `transform` que deja `fadeUp … both` en la pantalla y rompe `position: fixed`. | Los 4 modales se montan en `<body>`. Test rojo con el código viejo, verde ahora. |
| **Juez Estricto: el reloj seguía corriendo con el Ateneo abierto.** Con 20 s de límite y ~1 min de lectura para 6 filósofos, leer el Ateneo hacía perder el dilema (elección al azar + castigo de Indiferencia). | Test: 40 s con el modal abierto → saltaba al feedback. | El reloj espera mientras el modal está abierto. Test rojo → verde. |
| **La pantalla de selección prometía «cuanto más consultes, mejor tu índice».** Incentivo a clicar, y ya falso. | Texto en `AteneoSelectScreen`. | Reescrito: «leerlo no te dice qué elegir, pero te muestra cómo lo vería alguien que piensa distinto». |
| **El Ateneo era un botón gris chico** (`🏛 Ateneo`) debajo de la descripción. | 1185 px del borde superior en 1024×768: fuera de pantalla. | Aviso por dilema con retrato y nombre: «Kant tiene un comentario sobre este dilema». Rota entre los elegidos. Pasa a «Ya leíste al Ateneo» después de leer. Pulso suave 2 veces; sin animación con `prefers-reduced-motion`. |

## Datos del banco

- 850 comentarios (85 dilemas × 10 filósofos), cobertura completa.
- Largo: 31 palabras de promedio (19–47). Seis filósofos = ~190 palabras ≈ 1 min de lectura.
- 46 de 850 usan voseo («podés», «tenés»); el resto no marca. El juego mezcla voseo y tuteo en otros textos.
- ~40 de 850 nombran una corriente por su nombre. En «Filosofía oculta» eso revela la etiqueta que el modo esconde.
- 51 comentarios empiezan igual con «La libertad…»: repetición perceptible leyendo varios seguidos.
- Solo 2 de 850 terminan en pregunta: son afirmaciones, no invitan a pensar.

## Observaciones de diseño (sin arreglar)

1. **Cada filósofo es una corriente.** 10 y 10, uno a uno. Es limpio, pero Arendt representa «Feminismo ético» y Korn «Pragmatismo»; ambas equivalencias son discutibles y un docente de filosofía las va a notar.
2. **El comentario no se conecta con las opciones.** Kant dice lo suyo, pero el alumno tiene que traducirlo a mano a una de 4 opciones. Y después de elegir, el Ateneo desaparece: no hay «coincidiste con Mill, discrepaste con Kant».
3. **Se elige el Ateneo a ciegas, una vez.** Solo con la bio, antes del primer dilema, sin poder cambiarlo. Con 3 filósofos de 10, el alumno lee 3 voces siempre.
4. **No hay memoria.** El final no dice con quién coincidió el alumno a lo largo de la partida.
5. **Es texto solo.** 150–190 palabras en un modal que, con 6 filósofos, ya necesita scroll interno (810 px de contenido en 674 de panel).
6. **En móvil** la barra inferior (Menú / Opciones) tapa el aviso cuando el dilema está en el límite de la pantalla; hay que seguir bajando.
7. **El Tribunal ocupa la primera pantalla** (345 px de balanzas + 320 px de imagen antes del título en 1024×768). El dilema empieza a 796 px y el alumno tiene que bajar para leerlo.
