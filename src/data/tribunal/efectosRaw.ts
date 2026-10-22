// Efectos de cada opcion sobre las balanzas y los vicios del Tribunal.
//
// Una linea por opcion: `idDilema.indiceOpcion ganancias | vicios`.
// El indice es la posicion en que la opcion esta ESCRITA en src/data/dilemmas
// (antes de barajar). Las ganancias son <Balanza><n> con n entre -4 y 4; los
// vicios, <Vicio><n> con n de 1 a 3. Ver parser.ts.
//
// El vicio sigue al sacrificio, no a la corriente: pagar con Justicia (-2 o mas)
// alimenta Corrupcion; con Corazon, Indiferencia (Crueldad desde -3); con
// Libertad o Razon, Soberbia; con Bien comun, Indiferencia; y dejar sufrir por
// principio (Felicidad -3 o mas) tambien es Indiferencia. La intensidad es el
// costo menos uno. Las etiquetas escritas a mano se conservan y se suman.
export const EFECTOS_RAW = `
1.0 Fel3 Raz1 Jus-2 | Sob2 Corr1
1.1 Jus3 Bien2 Fel-2 Lib-1 |
1.2 Lib2 Bien-3 Cor-1 | Ind3
1.3 Bien2 Raz2 Cor1 Fel-1 |
2.0 Fel3 Lib1 Jus-3 | Corr2 Ind2
2.1 Jus3 Bien1 Fel-2 Lib-1 |
2.2 Raz1 Cor-2 Bien-1 | Ind3
2.3 Bien3 Jus2 Fel-1 Lib-1 |
3.0 Raz3 Jus2 Fel-3 Bien-2 | Ind1
3.1 Fel3 Bien2 Raz-3 Lib-2 | Sob2 Corr2
3.2 Raz1 Cor-2 Jus-1 | Ind3
3.3 Raz2 Cor2 Bien1 Fel-1 |
4.0 Fel3 Bien1 Lib-3 Cor-1 | Sob2
4.1 Cor2 Jus1 Fel-3 Lib-1 | Ind1
4.2 Lib3 Jus1 Bien-1 Cor-1 | Ind1
4.3 Raz1 Cor-2 Fel-1 | Ind2
5.0 Fel3 Bien2 Jus-4 Lib-2 | Sob1 Corr3 Cru2
5.1 Jus3 Lib3 Fel-3 | Ind1
5.2 Fel1 Jus-3 Lib-2 Raz-1 | Sob1 Corr3 Cru1
5.3 Jus2 Raz2 Lib1 Fel-1 |
6.0 Fel3 Lib1 Bien-2 Raz-1 | Ind2
6.1 Jus2 Bien2 Fel-2 |
6.2 Lib2 Raz1 Cor-1 Bien-1 Fel-1 | Ind2
6.3 Bien2 Cor1 Raz1 Fel-1 |
7.0 Fel3 Lib-4 Jus-2 | Sob3 Corr1 Cru1
7.1 Lib3 Jus3 Fel-2 |
7.2 Raz1 Lib-2 Cor-2 | Sob1 Ind2
7.3 Lib2 Raz1 Fel-3 | Ind1
8.0 Fel3 Lib2 Raz-2 Bien-2 | Sob1 Corr1 Ind1
8.1 Bien3 Jus2 Fel-3 Lib-2 | Sob1 Ind1
8.2 Raz1 Bien-2 Jus-1 | Ind3
8.3 Raz2 Jus2 Fel1 Lib-1 |
9.0 Fel3 Bien2 Lib-4 Jus-1 | Sob3 Corr1
9.1 Lib3 Jus2 Fel-3 Bien-1 | Ind1
9.2 Raz1 Lib-2 Jus-2 | Sob1 Corr1 Ind3
9.3 Bien2 Lib1 Raz1 Fel-2 |
10.0 Fel3 Raz2 Cor-3 Jus-2 | Corr1 Cru2 Ind1
10.1 Jus3 Fel-2 Raz-1 |
10.2 Raz1 Cor-2 Jus-1 | Ind3
10.3 Cor3 Raz-2 Fel-1 | Sob1
11.0 Fel3 Bien2 Lib-2 | Sob1
11.1 Raz3 Jus1 Cor-2 | Ind1
11.2 Raz2 Lib2 Bien-2 Cor-2 | Ind2
11.3 Bien2 Cor2 Lib1 Raz-1 Fel-1 |
12.0 Fel3 Lib2 Jus-2 Raz-1 | Corr1
12.1 Jus2 Cor1 Fel-2 Lib-1 |
12.2 Raz1 Bien-2 Cor-2 | Ind2
12.3 Bien3 Cor1 Lib1 Raz-1 Fel-1 |
13.0 Lib3 Bien2 Raz-3 Jus-1 | Sob2
13.1 Raz3 Jus1 Lib-3 Bien-1 | Sob2
13.2 Raz1 Bien-2 Lib-1 | Ind3
13.3 Bien3 Raz1 Jus1 Lib-1 Fel-1 |
14.0 Fel3 Raz1 Jus-4 Cor-2 | Sob2 Corr3 Cru3 Ind1
14.1 Jus3 Cor2 Fel-3 | Ind1
14.2 Raz1 Cor-2 Jus-1 | Ind3
14.3 Raz2 Cor1 Fel-1 Lib-1 | Ind1
15.0 Fel3 Lib2 Jus-3 Bien-1 | Sob2 Corr2
15.1 Jus3 Bien1 Raz1 Lib-3 Fel-1 | Sob2
15.2 Raz1 Jus-2 Bien-1 | Corr1 Ind2
15.3 Jus3 Cor1 Bien1 Lib-2 Fel-1 | Sob1
16.0 Fel2 Cor2 Raz1 Jus-3 | Corr2
16.1 Jus3 Cor-3 Fel-1 | Cru2
16.2 Raz1 Cor-3 Jus-1 | Cru2 Ind3
16.3 Jus2 Cor2 Bien1 Fel-1 |
17.0 Lib3 Fel3 Bien-2 Raz-1 | Ind1
17.1 Bien2 Raz2 Jus1 Lib-3 Fel-2 | Sob2
17.2 Raz1 Bien-2 Cor-1 | Ind3
17.3 Bien2 Cor1 Raz1 Lib-2 Fel-2 | Sob1
18.0 Lib3 Jus1 Cor-2 Bien-2 | Ind1
18.1 Cor3 Fel1 Lib-3 | Sob2
18.2 Raz1 Cor-3 Bien-1 | Cru2 Ind3
18.3 Cor2 Bien2 Lib-2 | Sob1
19.0 Fel3 Bien2 Lib-4 Jus-2 | Sob3 Corr1 Cru2
19.1 Lib3 Jus3 Fel-2 Bien-1 |
19.2 Raz1 Lib-2 Cor-1 | Sob1 Ind3
19.3 Lib3 Cor1 Fel-2 Bien-1 |
20.0 Bien2 Fel2 Raz1 Lib-4 Jus-3 | Sob3 Corr2 Cru2
20.1 Jus3 Lib3 Bien-3 Fel-1 | Ind2
20.2 Raz1 Bien-3 Cor-1 | Ind3
20.3 Bien3 Raz1 Lib1 Fel-2 |
21.0 Fel3 Bien1 Raz-3 Lib-2 | Sob2 Corr1
21.1 Raz3 Lib2 Fel-3 Bien-1 | Ind1
21.2 Raz1 Cor-2 Jus-1 | Ind3
21.3 Raz2 Cor2 Bien1 Fel-1 |
22.0 Jus3 Raz1 Lib-3 | Sob2
22.1 Lib3 Cor1 Jus-2 Bien-1 | Corr1
22.2 Raz2 Lib-2 Jus-1 | Sob1 Corr1 Ind2
22.3 Lib2 Bien2 Raz1 Jus-1 |
23.0 Fel3 Lib1 Jus-3 Bien-1 | Corr2
23.1 Jus3 Bien3 Fel-3 Lib-1 | Ind1
23.2 Raz2 Lib1 Jus-2 Bien-1 | Corr1 Ind3
23.3 Raz2 Fel1 Bien1 Jus-2 | Corr1
24.0 Bien2 Fel1 Cor1 Lib-3 | Sob2
24.1 Lib3 Fel2 Bien-2 Raz-1 | Ind1
24.2 Raz1 Bien-1 Cor-1 | Ind3
24.3 Raz2 Lib2 Bien1 Fel-1 |
25.0 Fel2 Raz2 Cor-3 Jus-1 | Cru2 Ind1
25.1 Cor2 Jus2 Fel-2 Raz-1 |
25.2 Raz2 Lib1 Cor-3 Jus-1 | Cru2 Ind3
25.3 Raz3 Cor1 Fel-2 |
26.0 Jus3 Bien1 Fel-2 Lib-1 |
26.1 Lib2 Raz1 Jus-3 Cor-1 | Corr2 Ind2
26.2 Fel2 Raz2 Jus-1 Cor-1 |
26.3 Cor3 Bien2 Raz-1 Fel-1 |
27.0 Bien3 Fel2 Raz-3 Lib-1 | Sob2
27.1 Raz3 Lib2 Bien-3 Fel-3 | Sob1 Ind2
27.2 Bien3 Jus2 Raz1 Lib-2 | Sob1
27.3 Raz2 Bien1 Lib1 Fel-2 | Ind1
28.0 Lib3 Fel1 Bien-2 Raz-1 Jus-1 | Ind1
28.1 Bien2 Jus1 Lib-3 Fel-1 | Sob2
28.2 Raz1 Cor-2 Bien-1 | Ind2
28.3 Jus2 Raz1 Cor1 Lib-2 | Sob1
29.0 Fel3 Cor2 Raz-3 Lib-1 | Sob3 Cru1
29.1 Raz2 Jus1 Cor-2 Fel-2 | Ind1
29.2 Raz1 Cor-3 Fel-1 | Cru2 Ind3
29.3 Lib2 Jus1 Cor1 Fel-3 | Ind1
30.0 Fel3 Bien1 Lib-2 Jus-1 | Sob1
30.1 Jus3 Raz2 Fel-2 Cor-1 |
30.2 Lib3 Bien-2 Jus-1 | Ind1
30.3 Bien2 Cor2 Lib1 Fel-2 Raz-1 |
31.0 Cor2 Lib1 Raz1 Jus-3 Bien-1 | Corr2
31.1 Bien2 Fel2 Cor-2 Raz-1 | Cru1 Ind1
31.2 Raz1 Jus-2 Bien-1 | Corr1 Ind2
31.3 Raz2 Cor2 Jus1 Fel-1 |
32.0 Lib2 Jus2 Bien-2 Fel-1 | Sob1 Ind1
32.1 Bien2 Raz2 Lib-2 Jus-1 | Sob1
32.2 Raz2 Bien-2 Jus-2 | Corr1 Ind3
32.3 Bien2 Raz1 Lib1 Jus-2 | Corr1
33.0 Raz3 Jus2 Fel-3 Bien-1 | Ind1
33.1 Fel3 Bien1 Raz-3 Lib-2 | Sob2 Corr2
33.2 Raz2 Bien2 Cor1 Fel-1 |
33.3 Raz1 Bien-3 Cor-1 | Ind3
34.0 Fel2 Bien2 Jus1 Lib-2 Raz-1 | Sob1
34.1 Jus3 Cor1 Lib-2 Fel-1 | Sob1
34.2 Raz2 Lib2 Jus-3 Bien-1 | Corr2 Ind1
34.3 Bien2 Jus1 Raz1 Lib-2 | Sob1
35.0 Fel3 Lib1 Bien-2 Raz-1 | Ind1
35.1 Jus3 Bien2 Fel-3 | Ind1
35.2 Cor2 Bien2 Lib-3 Fel-1 | Sob2
35.3 Raz2 Bien1 Jus1 Fel-2 |
36.0 Fel2 Raz2 Jus-2 | Corr1
36.1 Jus3 Raz1 Bien-2 Fel-2 | Ind1
36.2 Raz2 Lib1 Bien-2 Jus-2 | Corr1 Ind3
36.3 Bien2 Jus1 Fel-2 Raz-1 |
37.0 Fel3 Cor2 Lib-3 Raz-1 | Sob2
37.1 Lib3 Raz1 Fel-3 Cor-1 | Ind1
37.2 Raz1 Lib-1 Cor-2 | Ind2
37.3 Raz2 Lib1 Bien1 Fel-3 Cor-1 | Sob1 Ind1
38.0 Jus2 Fel2 Raz1 Lib-2 | Sob1
38.1 Jus3 Bien2 Lib-2 Fel-1 | Sob1
38.2 Raz1 Jus-2 Bien-1 | Corr1 Ind2
38.3 Raz3 Bien1 Jus-1 Fel-1 |
39.0 Fel3 Bien3 Lib-3 | Sob2
39.1 Cor3 Jus2 Bien1 Lib-2 Raz-1 | Sob1
39.2 Lib3 Jus1 Bien-3 Cor-2 | Ind2
39.3 Lib2 Bien1 Cor1 Fel-2 Jus-1 |
40.0 Fel3 Bien3 Jus1 Raz-2 Lib-1 | Sob1
40.1 Lib2 Jus2 Bien-3 Fel-2 | Sob1 Ind2
40.2 Raz1 Bien-2 Cor-1 | Ind3
40.3 Raz3 Jus1 Cor-2 Bien-1 | Ind1
41.0 Fel3 Bien3 Jus-4 Lib-3 Cor-2 | Sob2 Corr3 Cru3 Ind1
41.1 Jus3 Lib3 Cor1 Fel-3 Bien-2 | Ind1
41.2 Raz1 Cor-3 Jus-2 | Corr1 Cru2 Ind3
41.3 Jus2 Cor2 Lib1 Fel-3 | Ind1
42.0 Lib2 Bien2 Fel1 Cor-1 | Ind1
42.1 Jus2 Cor1 Lib-3 Bien-2 | Sob2 Ind1
42.2 Bien2 Cor1 Lib1 Raz-2 Jus-1 | Sob1
42.3 Lib3 Bien1 Jus1 Cor-2 | Ind1
43.0 Fel3 Bien2 Cor1 Lib-3 | Sob2
43.1 Lib3 Cor-3 Fel-2 Bien-1 | Cru2 Ind2
43.2 Raz1 Cor-2 Bien-1 | Ind3
43.3 Bien2 Lib2 Raz1 Fel-1 |
44.0 Fel3 Raz2 Lib-4 Jus-1 | Sob3 Corr1
44.1 Lib3 Jus1 Fel-3 Raz-1 | Ind1
44.2 Raz1 Lib-1 Cor-1 | Ind2
44.3 Raz2 Lib2 Fel1 Jus-1 |
45.0 Bien3 Cor2 Jus1 Lib-3 Fel-2 | Sob2
45.1 Fel2 Raz2 Cor1 Jus-2 | Corr1
45.2 Raz2 Cor1 Bien-2 Fel-1 | Ind1
45.3 Bien2 Lib2 Raz-1 Jus-1 |
46.0 Fel3 Cor2 Jus1 Bien-3 | Ind2
46.1 Cor3 Jus3 Bien-2 Raz-1 | Ind1
46.2 Bien2 Lib2 Cor-3 Jus-1 | Cru2 Ind2
46.3 Raz1 Cor-2 Bien-1 | Ind3
47.0 Fel3 Raz1 Jus1 Cor-3 | Sob1 Cru2
47.1 Jus3 Cor1 Fel-3 Bien-1 | Ind1
47.2 Cor2 Raz1 Fel-3 Jus-2 | Corr1 Ind2
47.3 Raz3 Jus1 Bien1 Fel-2 |
48.0 Fel2 Bien2 Jus1 Lib-2 | Sob1
48.1 Jus3 Cor1 Lib-2 Bien-1 | Sob1
48.2 Lib3 Jus1 Bien-2 Cor-1 | Ind1
48.3 Bien3 Raz1 Lib1 Fel-1 |
49.0 Bien2 Raz2 Fel1 Lib-2 | Sob1
49.1 Jus3 Cor1 Fel-2 Lib-1 |
49.2 Fel3 Lib1 Jus-3 Bien-2 | Corr2 Ind3
49.3 Lib2 Bien1 Jus-2 Raz-1 | Corr1 Ind1
50.0 Fel3 Bien2 Lib-4 Jus-1 | Sob3 Ind1
50.1 Lib3 Jus2 Fel-3 Bien-1 | Ind1
50.2 Raz2 Lib1 Jus1 Bien-2 Cor-1 | Ind1
50.3 Bien2 Lib2 Raz-1 Jus-1 |
51.0 Fel3 Bien2 Lib-3 | Sob2
51.1 Lib2 Raz1 Bien-2 Cor-1 Fel-1 | Ind1
51.2 Lib3 Jus1 Fel-2 Bien-1 | Ind1
51.3 Raz3 Bien1 Jus1 Lib-1 Fel-1 |
52.0 Fel3 Bien3 Lib-2 Jus-2 | Sob1 Corr1
52.1 Jus2 Lib2 Cor1 Fel-3 Bien-1 | Ind1
52.2 Raz3 Fel1 Cor-3 Jus-1 | Cru2 Ind2
52.3 Cor2 Bien2 Raz1 Lib-2 Jus-1 | Sob1
53.0 Fel3 Bien2 Raz2 Jus-3 Cor-2 | Sob1 Corr2 Cru2 Ind1
53.1 Jus3 Cor1 Fel-3 Bien-2 | Ind1
53.2 Raz1 Jus-2 Cor-2 | Corr1 Ind3
53.3 Raz2 Bien2 Jus1 Cor-2 | Cru1 Ind1
54.0 Fel2 Bien2 Raz1 Lib-4 | Sob3
54.1 Lib3 Cor1 Raz-2 Bien-2 | Sob1 Ind1
54.2 Raz1 Cor-2 Lib-1 | Ind2
54.3 Raz2 Cor2 Lib1 Bien-1 Fel-1 |
55.0 Raz3 Fel2 Bien1 Lib-4 Jus-2 | Sob3 Corr1
55.1 Lib3 Jus2 Bien1 Raz-2 Fel-2 | Sob1
55.2 Raz1 Bien-2 Jus-1 | Corr1 Ind2
55.3 Raz2 Bien2 Lib1 Jus-1 | Sob1
56.0 Cor2 Fel3 Lib-2 Bien-1 | Sob1
56.1 Lib3 Bien1 Cor-3 Fel-1 | Cru2 Ind1
56.2 Cor3 Jus1 Lib-2 Raz-1 | Sob1
56.3 Raz2 Bien2 Cor1 Fel-1 |
57.0 Fel3 Lib2 Raz-2 Bien-2 | Sob1 Ind1
57.1 Raz2 Bien1 Cor1 Lib-3 Fel-2 | Sob2
57.2 Raz1 Bien-2 Cor-1 | Ind3
57.3 Bien2 Cor1 Raz1 Lib-2 | Sob1
58.0 Jus3 Cor2 Bien-2 Fel-2 | Ind1
58.1 Bien2 Fel2 Jus-3 Cor-1 | Corr2 Ind2
58.2 Bien3 Jus1 Lib1 Fel-1 Raz-1 |
58.3 Raz2 Cor1 Jus-2 Fel-1 | Corr1 Ind1
59.0 Fel3 Bien1 Raz1 Cor-3 Jus-2 | Corr1 Cru2 Ind1
59.1 Jus3 Cor2 Fel-3 Raz-1 | Ind1
59.2 Cor1 Raz1 Lib1 Fel-2 Bien-1 | Ind1
59.3 Bien2 Jus1 Raz1 Cor1 Fel-2 |
60.0 Fel3 Raz2 Jus-2 Cor-1 | Sob1 Corr1
60.1 Jus3 Raz1 Fel-2 |
60.2 Lib3 Bien-2 Cor-1 | Ind1
60.3 Cor2 Bien2 Jus1 Raz-1 Fel-1 |
60.4 Raz2 Lib1 Cor-2 Fel-1 | Ind1
60.5 Raz2 Fel1 Bien1 Jus-1 Cor-1 |
60.6 Bien3 Jus1 Lib-2 | Sob1
60.7 Cor3 Jus1 Raz-1 Lib-1 |
60.8 Cor3 Fel1 Raz-1 Bien-1 Lib-1 |
60.9 Raz1 Cor-2 Bien-2 | Ind3
61.0 Fel2 Cor1 Jus-3 Raz-1 | Corr2 Ind1
61.1 Jus3 Raz1 Cor-3 Fel-1 | Cru2
61.2 Lib1 Jus-2 Raz-1 | Corr1 Ind3
61.3 Cor3 Jus1 Raz1 Fel-2 |
62.0 Cor3 Fel2 Jus-4 Bien-2 Raz-1 | Sob1 Corr3 Cru1 Ind1
62.1 Jus3 Bien1 Raz1 Cor-4 Fel-3 | Cru3 Ind1
62.2 Raz1 Jus-2 Cor-2 | Corr1 Ind3
62.3 Jus2 Bien2 Raz1 Cor-3 Fel-2 | Cru2
63.0 Jus2 Raz2 Lib1 Cor-3 Fel-1 | Cru2
63.1 Cor1 Raz1 Lib1 Jus-2 | Corr1
63.2 Cor2 Jus2 Raz-1 Lib-1 |
63.3 Jus1 Raz1 Cor-2 Bien-1 | Ind2
64.0 Jus3 Raz1 Cor-3 Fel-2 | Cru2
64.1 Cor2 Fel1 Jus-3 Raz-1 | Corr2
64.2 Jus2 Raz2 Cor1 Fel-3 | Ind1
64.3 Bien2 Jus2 Lib-1 Cor-1 |
65.0 Cor2 Fel2 Lib-4 | Sob3
65.1 Lib3 Jus1 Cor-3 Fel-2 | Cru2 Ind2
65.2 Cor3 Bien1 Raz-1 Fel-1 |
65.3 Raz2 Bien1 Cor1 Lib-1 Jus-1 |
66.0 Fel1 Jus-3 Cor-2 | Corr2 Ind3
66.1 Cor3 Lib1 Jus1 Fel-1 Bien-1 |
66.2 Jus2 Raz1 Cor1 Fel-2 |
66.3 Jus3 Bien1 Raz1 Cor-2 Fel-1 | Ind1
67.0 Cor2 Fel1 Jus-4 Raz-1 | Corr3 Cru1
67.1 Raz1 Lib1 Jus-1 Cor-1 | Ind1
67.2 Cor1 Raz2 Jus1 Fel-2 |
67.3 Jus3 Raz1 Cor-3 Fel-1 | Cru2
68.0 Fel1 Jus-3 Raz-1 | Corr2 Ind2
68.1 Cor2 Jus2 Raz-1 Bien-1 | Sob1
68.2 Jus3 Bien1 Raz1 Fel-2 Cor-1 |
68.3 Raz1 Bien1 Lib1 Jus-1 | Corr1
69.0 Fel2 Bien2 Raz-3 Jus-2 | Sob2 Corr2
69.1 Raz3 Jus2 Fel-3 | Ind1
69.2 Raz2 Jus1 Bien1 Cor-1 Fel-1 |
69.3 Fel1 Raz-3 Jus-1 | Sob2 Ind3
70.0 Bien3 Jus2 Raz1 Fel-3 | Ind1
70.1 Jus3 Bien1 Fel-3 Cor-1 | Ind1
70.2 Fel3 Cor1 Jus-3 Bien-1 | Corr2 Ind2
70.3 Fel1 Cor1 Bien1 Raz1 Jus-1 |
71.0 Raz3 Lib1 Cor-2 Fel-1 | Ind1
71.1 Lib2 Cor1 Raz-2 Fel-1 | Sob1
71.2 Raz1 Lib1 Cor2 Fel-1 |
71.3 Raz2 Lib1 Cor-1 Fel-1 |
72.0 Bien3 Fel2 Jus-3 Lib-2 | Sob1 Corr2
72.1 Jus3 Lib1 Bien-3 Fel-1 | Ind2
72.2 Bien1 Cor1 Raz1 Jus-2 | Corr1 Ind1
72.3 Raz2 Lib1 Bien-1 Jus-1 | Ind1
73.0 Lib2 Cor1 Raz1 Fel-2 |
73.1 Raz1 Lib1 Cor-3 | Cru2 Ind2
73.2 Cor2 Lib1 Jus-1 Fel-1 |
73.3 Cor2 Bien1 Lib-2 Raz-1 | Sob1 Ind1
74.0 Raz3 Jus2 Fel-2 Cor-1 |
74.1 Cor3 Fel1 Raz-2 Jus-1 | Sob1 Corr1
74.2 Raz3 Jus2 Cor-3 | Cru2
74.3 Lib3 Cor1 Raz1 Jus-1 |
75.0 Jus2 Cor2 Raz1 Fel-2 |
75.1 Raz1 Lib1 Jus-2 Cor-1 | Corr1 Ind1
75.2 Raz2 Jus1 Cor-1 | Corr1
75.3 Lib2 Jus-2 Cor-2 | Corr1 Ind3
76.0 Fel3 Cor2 Raz-2 Bien-1 | Sob1
76.1 Raz3 Bien1 Cor-3 Fel-2 | Cru2 Ind1
76.2 Bien3 Raz1 Fel-1 Cor-1 |
76.3 Lib2 Bien2 Jus1 Raz-1 Fel-1 |
77.0 Jus2 Raz1 Cor-3 Lib-1 | Cru2
77.1 Lib2 Cor1 Bien1 Jus-3 Raz-1 | Corr2 Ind2
77.2 Cor3 Bien1 Jus-1 Raz-1 |
77.3 Raz3 Jus1 Cor-2 Fel-1 | Ind1
78.0 Cor3 Bien1 Jus-3 Raz-1 | Corr2
78.1 Raz1 Fel1 Cor-3 Jus-1 | Sob1 Cru2
78.2 Cor2 Bien2 Raz1 Lib-2 Jus-1 | Sob1
78.3 Jus3 Raz1 Cor-3 Fel-1 | Cru2
79.0 Bien2 Jus1 Lib-3 Fel-1 | Sob2
79.1 Lib2 Raz1 Jus-2 | Corr1
79.2 Cor2 Jus2 Lib-2 Fel-1 | Sob1
79.3 Lib3 Fel1 Bien-2 Cor-1 | Ind1
80.0 Lib3 Jus1 Bien-2 | Ind1
80.1 Bien2 Fel1 Lib-2 | Sob1
80.2 Lib2 Cor2 Bien-1 Raz-1 |
80.3 Jus2 Raz1 Lib1 Cor-1 Fel-1 |
81.0 Fel3 Cor1 Bien-2 Raz-1 | Ind1
81.1 Bien2 Cor1 Raz1 Lib-2 Fel-1 | Sob1
81.2 Lib3 Cor-2 Bien-1 | Ind1
81.3 Cor2 Raz2 Lib1 Fel-1 |
82.0 Fel3 Bien2 Lib-3 Jus-1 | Sob2 Ind1
82.1 Lib3 Jus2 Fel-2 Bien-2 | Ind1
82.2 Bien3 Raz1 Lib1 Fel-2 |
82.3 Lib2 Raz1 Fel-2 Bien-1 | Ind1
83.0 Fel2 Jus2 Raz1 Lib-2 | Sob1
83.1 Fel3 Lib2 Jus-3 Bien-1 | Sob2 Corr2
83.2 Raz1 Jus1 Fel-3 Lib-1 | Ind1
83.3 Cor2 Lib1 Bien1 Raz-1 Fel-1 |
84.0 Jus3 Bien1 Raz1 Fel-3 Cor-1 | Ind1
84.1 Raz2 Fel1 Jus-2 | Corr2
84.2 Fel3 Bien1 Jus-3 Cor-2 | Corr2 Ind1
84.3 Cor3 Lib1 Jus1 Raz-1 Fel-2 |
85.0 Fel3 Raz1 Cor-3 Lib-1 | Cru2 Ind2
85.1 Cor3 Bien1 Fel-2 Raz-1 |
85.2 Lib3 Cor1 Bien-1 Fel-1 |
85.3 Raz1 Lib1 Cor-2 Bien-1 | Ind2
`;
