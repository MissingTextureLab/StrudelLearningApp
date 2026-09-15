import type { ReferenceCategory } from '../types';

export const referenceCategories: ReferenceCategory[] = [
  {
    id: 'sound',
    title: 'Sonido y muestras',
    summary:
      'Cómo elegir qué suena: samples por nombre, bancos de batería, muestras propias y las formas de onda básicas de síntesis.',
    entries: [
      {
        name: 's() / sound()',
        syntax: 's("nombre nombre:n ...")',
        description:
          'Reproduce un sample o sintetizador por nombre. El sufijo ":n" (ej. hh:2) selecciona una variación concreta dentro de ese nombre.',
        examples: [
          { label: 'Batería básica', code: 's("bd sd [~ bd] sd, hh*16")' },
          { label: 'Seleccionar variación con :n', code: 's("hh:0 hh:1 hh:2 hh:3")' },
        ],
      },
      {
        name: '.bank()',
        syntax: '.bank("NombreDeCaja")',
        description:
          'Antepone el nombre de una caja de ritmos a los samples de batería, cambiando su timbre sin tocar el patrón. Ejemplos de bancos: RolandTR808, RolandTR909, RolandTR707, AkaiLinn, RhythmAce, ViscoSpaceDrum.',
        examples: [
          { label: 'Caja 808', code: 's("bd sd, hh*16").bank("RolandTR808")' },
          { label: 'Alternar caja por ciclo', code: 's("bd sd, hh*16").bank("<RolandTR808 RolandTR909>")' },
        ],
      },
      {
        name: 'samples()',
        syntax: "samples('github:usuario/repo')",
        description:
          'Carga un banco de muestras externo antes de poder usarlas con s(). El banco por defecto de la app ya carga "github:tidalcycles/dirt-samples". También admite un objeto {nombre: \'ruta.wav\'} con una URL base, o una URL directa a un strudel.json.',
        examples: [
          { label: 'Atajo de GitHub', code: "samples('github:tidalcycles/dirt-samples')\ns(\"bd sd bd sd, hh*16\")" },
          {
            label: 'Muestras propias por URL',
            code: "samples({\n  bombo: 'bd/BT0AADA.wav',\n  platillo: 'hh27/000_hh27closedhh.wav',\n}, 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/')\ns(\"bombo platillo*4\")",
          },
        ],
      },
      {
        name: 'Formas de onda (synth)',
        syntax: 's("sawtooth" | "square" | "triangle" | "sine" | "supersaw")',
        description:
          'Además de samples grabados, s()/sound() acepta osciladores básicos como fuente sonora. Sawtooth (diente de sierra) tiene todos los armónicos y suena brillante/áspero; square solo armónicos impares, hueco; triangle es más suave; sine es el fundamental puro, sin armónicos. supersaw apila varias sierras desafinadas entre sí para un sonido más grueso.',
        examples: [
          { label: 'Comparar las 4 básicas', code: 'note("c2").sound("<sawtooth square triangle sine>")' },
          { label: 'Synth con filtro', code: 'note("c3 bb2 f3 eb3").sound("sawtooth").lpf(600)' },
        ],
      },
    ],
  },
  {
    id: 'notes',
    title: 'Notas y afinación',
    summary: 'Cómo especificar alturas, trabajar con escalas para que todo "encaje" armónicamente, y acordes.',
    entries: [
      {
        name: 'note()',
        syntax: 'note("c e g b" | "48 52 55 59")',
        description:
          'Toca alturas. Acepta letras (a-g, con # o b de alteración, y un número de octava opcional al final) o números MIDI directamente.',
        examples: [
          { label: 'Por letra', code: 'note("c e g b").sound("piano")' },
          { label: 'Con octava explícita', code: 'note("c2 e3 g4 b5").sound("piano")' },
          { label: 'Acorde con comas', code: 'note("[c,e,g]").sound("piano")' },
        ],
      },
      {
        name: 'n() + .scale()',
        syntax: 'n("0 1 2 ...").scale("Tónica:modo")',
        description:
          'n() interpreta los números como grados dentro de la escala activa (no como notas MIDI directas), y .scale() define esa escala. Así cualquier número cae dentro de la tonalidad. Modos comunes: major, minor, dorian, mixolydian, pentatonic.',
        examples: [
          { label: 'Escala menor', code: 'n("0 2 4 6").scale("C:minor").sound("piano")' },
          { label: 'Escala cambiante por ciclo', code: 'n("0 2 4 6").scale("<C:major D:mixolydian>/4").sound("piano")' },
        ],
      },
      {
        name: 'chord() / .voicing()',
        syntax: "chord(\"Cmaj7\").voicing()",
        description:
          'chord() genera acordes a partir de su nombre (cifrado americano); .voicing() los convierte en notas concretas repartidas en un registro razonable, listas para pasar a .sound() o combinarse en un stack().',
        examples: [
          {
            label: 'Progresión de acordes',
            code: "let chords = chord(\"<Bbm9 Fm9>/4\")\nchords.voicing().sound(\"gm_epiano1\")",
          },
        ],
      },
    ],
  },
  {
    id: 'mininotation',
    title: 'Mini-notación / ritmo',
    summary:
      'La sintaxis dentro de las comillas: cómo se reparte el tiempo, se anida, se repite y se aleatoriza. Es lo más específico de Strudel/Tidal frente a otro código.',
    entries: [
      {
        name: 'Secuencia (espacios)',
        syntax: '"a b c"',
        description: 'Los eventos separados por espacio se reparten a partes iguales dentro de un ciclo.',
        examples: [{ label: '4 vs 8 eventos', code: 'note("c d e f g a b").sound("piano")' }],
      },
      {
        name: '[ ] Subsecuencia',
        syntax: '"a [b c] d"',
        description: 'Anida una secuencia dentro del hueco de un solo evento. Se puede anidar sin límite: [[ ]].',
        examples: [{ label: 'Anidado simple', code: 'sound("bd [hh hh] sd [hh bd]")' }],
      },
      {
        name: '< > Alternancia',
        syntax: '"<a b c>"',
        description:
          'Toca un elemento distinto en cada ciclo (equivale a [a b c]/3: el patrón dura 3 ciclos en completarse una vez).',
        examples: [{ label: 'Un bombo distinto cada vuelta', code: 'sound("<bd:0 bd:1 bd:2>")' }],
      },
      {
        name: '* Multiplicación',
        syntax: '"a*n"',
        description: 'Repite/acelera un elemento o subsecuencia n veces dentro de su propio hueco temporal.',
        examples: [{ label: 'Hi-hats rápidos', code: 'sound("hh*8")' }],
      },
      {
        name: '/ División',
        syntax: '"[a b]/n"',
        description: 'Ralentiza una secuencia repartiéndola en n ciclos en vez de tocarla entera en uno.',
        examples: [{ label: 'Un evento cada 4 ciclos', code: 'note("[36 34 41 39]/4").sound("gm_acoustic_bass")' }],
      },
      {
        name: '~ / - Silencio',
        syntax: '"a ~ b -"',
        description: 'Representa un hueco sin sonido dentro de la secuencia.',
        examples: [{ label: 'Groove con huecos', code: 'sound("bd hh - rim - bd hh rim")' }],
      },
      {
        name: ', Capas en paralelo',
        syntax: '"a b, c d e"',
        description: 'Toca varias secuencias simultáneamente, cada una con su propia subdivisión del ciclo.',
        examples: [{ label: 'Tres capas de batería', code: 'sound("bd*4, [~ sd]*2, hh*8")' }],
      },
      {
        name: '@ Elongación',
        syntax: '"a@2 b"',
        description: 'Da a un evento un peso temporal relativo mayor (aquí, el doble de duración que un evento normal).',
        examples: [{ label: 'Nota larga + corta', code: 'note("c@3 eb").sound("gm_acoustic_bass")' }],
      },
      {
        name: '! Repetición',
        syntax: '"a!2 b"',
        description: 'Repite un evento el número de veces indicado, sin acelerar el resto del patrón (a diferencia de *).',
        examples: [{ label: 'Repetir sin acelerar', code: 'note("c!2 eb").sound("piano")' }],
      },
      {
        name: '? Azar',
        syntax: '"a*8?" / "a*8?0.1"',
        description:
          'Elimina cada evento con una probabilidad dada (50% por defecto, o el valor decimal indicado) — degradación aleatoria del patrón.',
        examples: [{ label: 'Hi-hats con huecos aleatorios', code: 'sound("hh*8?")' }],
      },
      {
        name: 'Ritmos euclidianos',
        syntax: '"bd(golpes,pasos,rotación)"',
        description:
          'Reparte un número de golpes de la forma más uniforme posible a lo largo de un número de pasos, usando el algoritmo euclidiano — la base matemática de muchos ritmos tradicionales del mundo. La rotación (opcional) desplaza el punto de partida.',
        examples: [
          { label: '3 golpes en 8 pasos', code: 's("bd(3,8)")' },
          { label: 'Con rotación', code: 's("bd(3,8,3)")' },
        ],
      },
    ],
  },
  {
    id: 'effects',
    title: 'Efectos de audio',
    summary: 'Métodos encadenables que transforman el timbre, la dinámica y el espacio del sonido.',
    entries: [
      {
        name: '.lpf() / .hpf()',
        syntax: '.lpf(frecuencia) / .hpf(frecuencia)',
        description:
          'Filtro paso-bajo (deja pasar graves, corta agudos) y paso-alto (al revés). Alias: cutoff/ctf para lpf. Frecuencia en Hz (0-20000).',
        examples: [
          { label: 'Barrido de paso-bajo', code: 's("bd sd, hh*8").lpf("<4000 2000 1000 500 200>")' },
        ],
      },
      {
        name: '.resonance() / .lpq()',
        syntax: '.lpq(cantidad)',
        description: 'Resonancia (q) del filtro paso-bajo: realza la zona justo en el punto de corte. Rango típico 0-30.',
        examples: [{ label: 'Filtro resonante', code: 's("bd sd, hh*8").lpf(2000).lpq("<0 10 20 30>")' }],
      },
      {
        name: '.gain()',
        syntax: '.gain(cantidad)',
        description: 'Volumen relativo de cada evento (multiplicador exponencial). Es la base de la dinámica rítmica.',
        examples: [{ label: 'Acentos alternos', code: 's("hh*8").gain(".4!2 1 .4!2 1 .4 1")' }],
      },
      {
        name: '.attack() .decay() .sustain() .release() / .adsr()',
        syntax: '.adsr("ataque:decay:sustain:release")',
        description:
          'Envolvente de volumen en el tiempo: attack = tiempo de subida al pico; decay = caída hasta el nivel de sustain; sustain = nivel mientras se mantiene la nota; release = apagado tras soltar. adsr() es la forma corta de los cuatro juntos.',
        examples: [
          { label: 'Por separado', code: 'note("c3 e3 f3 g3").attack(.01).decay(.1).sustain(.3).release(.2)' },
          { label: 'Formato corto', code: 'note("c3 e3 f3 g3").sound("sawtooth").adsr(".01:.1:.3:.2")' },
        ],
      },
      {
        name: '.delay()',
        syntax: '.delay(nivel) / .delay("nivel:tiempo:feedback")',
        description: 'Añade eco. En formato corto: nivel de mezcla, tiempo entre repeticiones y feedback (cuánto se retroalimenta cada repetición).',
        examples: [{ label: 'Eco simple', code: 's("bd bd").delay(".5")' }],
      },
      {
        name: '.room()',
        syntax: '.room(nivel) / .room("nivel:tamaño")',
        description: 'Reverberación — simula el espacio acústico. Nivel de 0 a 1; tamaño opcional controla el tamaño de la sala simulada.',
        examples: [{ label: 'Reverb amplia', code: 's("bd sd [~ bd] sd").room(.8)' }],
      },
      {
        name: '.pan()',
        syntax: '.pan(posición)',
        description: 'Posición estéreo del sonido, de 0 (izquierda) a 1 (derecha).',
        examples: [{ label: 'Barrido estéreo', code: 's("numbers:1 numbers:2 numbers:3 numbers:4").pan("0 .3 .6 1")' }],
      },
      {
        name: '.distort()',
        syntax: '.distort("cantidad:postgain")',
        description: 'Distorsión por waveshaping. Cuidado, puede sonar (y estar) muy alto.',
        examples: [{ label: 'Distorsión progresiva', code: 's("bd sd, hh*8").distort("<0 2 3 10:.5>")' }],
      },
      {
        name: '.crush()',
        syntax: '.crush(bits)',
        description: 'Bitcrusher: reduce la resolución del sample. 1 = drástico, 16 = casi imperceptible.',
        examples: [{ label: 'Crush progresivo', code: 's("<bd sd>,hh*3").crush("<16 8 4 2>")' }],
      },
    ],
  },
];
