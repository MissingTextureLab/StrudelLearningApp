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
        syntax: 'chord("Cmaj7").voicing()',
        description:
          'chord() genera acordes a partir de su nombre (cifrado americano); .voicing() los convierte en notas concretas con buena conducción de voces (saltos mínimos entre acordes consecutivos), inspirado en cómo un pianista enlaza acordes. .anchor() fija la nota de referencia y .mode() controla si la voz superior/inferior se ancla por encima o por debajo.',
        examples: [
          { label: 'Progresión con buena conducción de voces', code: 'chord("<Am C D F Am E>").voicing().room(.5)' },
          { label: 'Con instrumento', code: 'chord("<C Am F G>").voicing().s("gm_epiano1")' },
        ],
      },
      {
        name: '.transpose() / .scaleTranspose()',
        syntax: '.transpose(semitonos) / .scaleTranspose(pasos)',
        description:
          'transpose() desplaza todas las notas un número de semitonos fijo (cromático). scaleTranspose() desplaza dentro de la escala activa por grados en vez de semitonos — mantiene las notas siempre dentro de la tonalidad.',
        examples: [
          { label: 'Transposición diatónica', code: 'note("c e g").scale("C:major").scaleTranspose("<0 -1 -2 -3>")' },
        ],
      },
      {
        name: 'freq()',
        syntax: 'freq(hercios)',
        description:
          'Controla el tono directamente en Hz, sin pasar por notas ni escalas. note() por debajo es en realidad freq() + una conversión: MIDI 69 (A4) = 440Hz, y cada octava dobla la frecuencia. Útil para sonido más "físico" o microtonal.',
        examples: [{ label: 'Frecuencias directas', code: 'freq("200 300 400 500").s("sine")' }],
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
        name: '.bpf() / .bpq()',
        syntax: '.bpf(frecuencia) / .bpq(resonancia)',
        description: 'Filtro paso-banda (band-pass): deja pasar solo una franja de frecuencias alrededor del centro que indiques. bpq controla lo estrecha/resonante que es esa franja.',
        examples: [
          { label: 'Centro variable', code: 's("bd sd [~ bd] sd,hh*6").bpf("<1000 2000 4000 8000>")' },
          { label: 'Con resonancia', code: 's("bd sd [~ bd] sd").bpf(500).bpq("<0 1 2 3>")' },
        ],
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
        name: '.vib() / .vibmod()',
        syntax: '.vib(frecuencia) / .vibmod(profundidad)',
        description: 'Vibrato: modula la afinación con un oscilador. vib() fija la velocidad del vibrato en Hz; vibmod() su profundidad en semitonos (solo tiene efecto si vib() está activo). Formato corto: "frecuencia:profundidad".',
        examples: [
          { label: 'Vibrato progresivo', code: 'note("a e").vib("<.5 1 2 4 8 16>")' },
          { label: 'Con profundidad fija', code: 'note("a e").vib(4).vibmod("<.25 .5 1 2 12>")' },
        ],
      },
      {
        name: '.penv() .pattack() .pdecay() .prelease()',
        syntax: '.penv(semitonos)',
        description: 'Envolvente de afinación (pitch envelope): igual que la envolvente ADSR pero aplicada a la altura en vez de al volumen — la nota "desliza" desde/hacia penv() semitonos de distancia. attack/decay/release funcionan igual que en el volumen. pcurve() controla si la curva es lineal (0) o exponencial (1, mejor para bombos).',
        examples: [
          { label: 'Golpe con pitch descendente', code: 'note("c").penv("<12 7 1 0 -7 -12>")' },
          { label: 'Ataque de afinación progresivo', code: 'note("c eb g bb").pattack("0 .1 .25 .5").slow(2)' },
        ],
      },
      {
        name: '.tremolo() / .tremolosync()',
        syntax: '.tremolo(hz) / .tremolosync(ciclos)',
        description: 'Modula el volumen con un oscilador continuo (trémolo). tremolo() fija la velocidad en Hz; tremolosync() la sincroniza a un número de ciclos. .tremoloskew() deforma la onda de modulación.',
        examples: [{ label: 'Trémolo sincronizado', code: 'note("d d d# d".fast(4)).s("supersaw").tremolosync("4").tremoloskew("<1 .5 0>")' }],
      },
      {
        name: '.compressor()',
        syntax: '.compressor("umbral:ratio:knee:attack:release")',
        description: 'Compresor de dinámica — reduce el rango entre lo más flojo y lo más fuerte, típico para que una mezcla "empuje" más.',
        examples: [{ label: 'Compresión de batería', code: 's("bd sd [~ bd] sd,hh*8").compressor("-20:20:10:.002:.02")' }],
      },
      {
        name: '.orbit() / .duckorbit()',
        syntax: '.orbit(n) / .duckorbit(n).duckattack(t).duckdepth(d)',
        description: 'Un "orbit" es un contexto de efectos globales compartido: patrones con el mismo orbit comparten el mismo delay/room. duckorbit() crea un efecto de sidechain — el orbit indicado baja de volumen cada vez que suena esta capa (como un bombo "empujando" al bajo).',
        examples: [
          { label: 'Dos capas con reverbs independientes', code: 'stack(\n  s("hh*6").delay(.5).delaytime(.25).orbit(1),\n  s("~ sd ~ sd").delay(.5).delaytime(.125).orbit(2)\n)' },
          {
            label: 'Sidechain clásico (bombo empuja bajo)',
            code: '$: n(run(16)).scale("c:minor:pentatonic").s("sawtooth").delay(.7).orbit(2)\n$: s("bd:4!4").duckorbit(2).duckattack(0.2).duckdepth(1)',
          },
        ],
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
  {
    id: 'combinators',
    title: 'Combinadores de patrón',
    summary:
      'Funciones que combinan, repiten o transforman patrones enteros — la caja de herramientas estructural de Tidal/Strudel.',
    entries: [
      {
        name: '.fast() / .slow()',
        syntax: '.fast(factor) / .slow(factor)',
        description: 'Acelera o ralentiza un patrón entero por un factor, a diferencia de * y / que solo actúan dentro de la mini-notación.',
        examples: [{ label: 'Doble velocidad', code: 's("bd hh sd hh").fast(2)' }],
      },
      {
        name: '.rev()',
        syntax: '.rev()',
        description: 'Invierte el orden de los eventos dentro de cada ciclo.',
        examples: [{ label: 'Melodía al revés', code: 'note("c d e g").rev()' }],
      },
      {
        name: '.every()',
        syntax: '.every(n, fn)',
        description: 'Aplica una función cada n ciclos (el resto de ciclos el patrón suena sin modificar).',
        examples: [{ label: 'Invertir cada 3 ciclos', code: 'note("c d e g").every(3, rev)' }],
      },
      {
        name: '.jux()',
        syntax: '.jux(fn)',
        description: 'Divide el patrón en dos copias, una por canal estéreo, y aplica fn solo al canal derecho.',
        examples: [{ label: 'Estéreo con reverso a la derecha', code: 's("bd lt [~ ht] mt cp ~ bd hh").jux(rev)' }],
      },
      {
        name: 'stack()',
        syntax: 'stack(patrón1, patrón2, ...)',
        description: 'Toca varios patrones a la vez, todos con la misma duración de ciclo. Equivalente funcional a las capas con $:.',
        examples: [{ label: 'Tres capas simultáneas', code: 'stack("g3", "b3", ["e4", "d4"]).note()' }],
      },
      {
        name: 'cat() / seq()',
        syntax: 'cat(p1, p2, ...) / seq(p1, p2, ...)',
        description: 'cat() (alias slowcat) toca un patrón distinto por ciclo. seq() (alias fastcat) comprime todos los patrones dentro de un único ciclo.',
        examples: [
          { label: 'Uno por ciclo', code: 'cat("e5", "b4", ["d5", "c5"]).note()' },
          { label: 'Comprimidos en un ciclo', code: 'seq("e5", "b4", ["d5", "c5"]).note()' },
        ],
      },
      {
        name: '.off()',
        syntax: '.off(tiempo, fn)',
        description: 'Crea una copia del patrón desplazada en el tiempo (en fracción de ciclo) y le aplica una función — genera ecos estructurales o contrapuntos.',
        examples: [{ label: 'Eco con quinta añadida', code: 'note("c e g").off(1/8, x=>x.add(7))' }],
      },
      {
        name: '.struct()',
        syntax: '.struct("x ~ x ~")',
        description: 'Aplica una estructura rítmica externa (patrón booleano de x/~) a los valores del patrón.',
        examples: [{ label: 'Ritmo gateado', code: 'note("c,eb,g").struct("x ~ x ~ ~ x ~ x")' }],
      },
      {
        name: '.iter()',
        syntax: '.iter(n)',
        description: 'Divide el patrón en n subdivisiones y las va desplazando una posición en cada ciclo sucesivo.',
        examples: [{ label: 'Rotación progresiva', code: 'note("0 1 2 3".scale("A:minor")).iter(4)' }],
      },
      {
        name: '.ply()',
        syntax: '.ply(n)',
        description: 'Repite cada evento del patrón n veces dentro de su propio hueco temporal.',
        examples: [{ label: 'Cada golpe repetido 3 veces', code: 's("bd ~ sd cp").ply("<1 2 3>")' }],
      },
      {
        name: '.palindrome()',
        syntax: '.palindrome()',
        description: 'Aplica .rev() en ciclos alternos, creando un patrón que va y viene.',
        examples: [{ label: 'Ida y vuelta', code: 'note("c d e g").palindrome()' }],
      },
      {
        name: 'Alineación de patrones (.add.in/.out/.mix/.squeeze)',
        syntax: '.add.squeeze(patrón) / .add.mix(patrón) / ...',
        description:
          'Cuando combinas dos patrones de distinta longitud (con add, struct, etc.), Strudel necesita decidir cómo alinearlos. Por defecto ("in") reparte los eventos del patrón derecho dentro de cada evento del izquierdo. squeeze comprime un ciclo entero del patrón derecho dentro de cada evento del izquierdo — útil para que una secuencia corta "quepa" entera en cada paso de otra.',
        examples: [
          { label: 'Alineación por defecto (in)', code: 'note("0 1 2".add("10 20"))' },
          { label: 'squeeze: ciclo entero por paso', code: 'note("0 1 2".add.squeeze("10 20"))' },
        ],
      },
      {
        name: 'chunk()',
        syntax: '.chunk(n, fn)',
        description: 'Divide el patrón en n partes iguales y va aplicando fn a una parte distinta cada ciclo (recorriéndolas por turnos) — como un .every() pero que se desplaza por el patrón en vez de repetirse siempre igual.',
        examples: [{ label: 'Transportar un trozo distinto cada ciclo', code: '"0 1 2 3".chunk(4, x=>x.add(7)).scale("A:minor").note()' }],
      },
      {
        name: 'arrange()',
        syntax: 'arrange([ciclos, patrón], [ciclos, patrón], ...)',
        description: 'Encadena varios patrones a lo largo de varios ciclos cada uno — la forma más directa de dar estructura de "canción" (intro, estrofa, etc.) combinando bloques de duración distinta.',
        examples: [{ label: 'Dos secciones de distinta duración', code: 'arrange(\n  [4, "<c a f e>(3,8)"],\n  [2, "<g a>(5,8)"]\n).note()' }],
      },
      {
        name: 'pick() / pickF()',
        syntax: '.pick([patrón1, patrón2, ...]) / .pickF(patrón, [fn1, fn2, ...])',
        description: 'pick() selecciona, para cada evento, un patrón completo de una lista (o tabla con nombres) según un índice — como un n() pero para patrones enteros en vez de números. pickF() hace lo mismo pero elige qué función aplicar de una lista.',
        examples: [
          { label: 'Elegir subpatrón por índice', code: 'sound("<0 1 [2,0]>".pick(["bd sd", "cp cp", "hh hh"]))' },
          { label: 'Elegir transformación por índice', code: 's("bd [rim hh]").pickF("<0 1 2>", [rev, jux(rev), fast(2)])' },
        ],
      },
      {
        name: 'squeeze()',
        syntax: '.squeeze([patrón1, patrón2, ...])',
        description: 'Como pick(), pero el patrón elegido se comprime entero para caber en la duración del evento seleccionador, en vez de solo tocar un instante de él.',
        examples: [{ label: 'Frase completa comprimida por paso', code: 'note("<0@2 [1!2] 2>".squeeze(["g a", "f g f g", "g a c d"]))' }],
      },
      {
        name: 'xfade()',
        syntax: 'xfade(patrónA, cantidad, patrónB)',
        description: 'Crossfade entre dos patrones: 0 = solo A, 1 = solo B, .5 = mezcla a partes iguales.',
        examples: [{ label: 'Cruce de batería a hats', code: 'xfade(s("bd*2"), "<0 .25 .5 .75 1>", s("hh*8"))' }],
      },
    ],
  },
  {
    id: 'signals',
    title: 'Señales y modulación',
    summary:
      'Osciladores continuos (LFOs) que, a diferencia de los patrones discretos, tienen un valor en cada instante — ideales para modular parámetros suavemente.',
    entries: [
      {
        name: 'sine, saw, square, tri',
        syntax: 'sine | saw | square | tri',
        description: 'Ondas continuas con salida entre 0 y 1 (variantes con sufijo 2, como sine2, dan -1 a 1). Se muestrean con .segment(n) si se quieren valores discretos, o se usan directamente para modular.',
        examples: [
          { label: 'Melodía desde una onda', code: 'n(sine.segment(16).range(0,15)).scale("C:minor")' },
        ],
      },
      {
        name: 'rand / perlin',
        syntax: 'rand | perlin',
        description: 'rand da números aleatorios continuos entre 0 y 1 en cada instante; perlin da ruido Perlin (aleatorio pero suave, sin saltos bruscos) — mejor para modulación orgánica.',
        examples: [
          { label: 'Filtro con ruido aleatorio', code: 's("bd*4,hh*8").cutoff(rand.range(500,8000))' },
          { label: 'Filtro con Perlin (más suave)', code: 's("bd*4,hh*8").cutoff(perlin.range(500,8000))' },
        ],
      },
      {
        name: '.range()',
        syntax: '.range(min, max)',
        description: 'Reescala la salida de una señal (0 a 1) al rango indicado. Es como se convierte una onda en un LFO útil para un parámetro concreto.',
        examples: [{ label: 'Filtro modulado en 4 ciclos', code: 'note("<c2 eb2 g2>*4").sound("sawtooth").lpf(sine.range(200,2000).slow(4))' }],
      },
    ],
  },
  {
    id: 'randomness',
    title: 'Aleatoriedad y condicionales',
    summary: 'Funciones que introducen azar controlado o aplican transformaciones solo bajo ciertas condiciones.',
    entries: [
      {
        name: '.degradeBy() / .degrade()',
        syntax: '.degradeBy(0-1)',
        description: 'Elimina eventos aleatoriamente con la probabilidad dada (0 = nunca, 1 = siempre). .degrade() es el atajo para degradeBy(0.5).',
        examples: [{ label: 'Hi-hats con huecos', code: 's("hh*8").degradeBy(0.3)' }],
      },
      {
        name: '.sometimes() / .sometimesBy()',
        syntax: '.sometimesBy(0-1, fn)',
        description: 'Aplica una función a una fracción aleatoria de los eventos. sometimes() equivale a sometimesBy(0.5, fn). También existen often/rarely/almostAlways/almostNever como atajos con distinta probabilidad.',
        examples: [{ label: 'A veces más lento', code: 's("hh*8").sometimesBy(.4, x=>x.speed("0.5"))' }],
      },
      {
        name: '.someCyclesBy()',
        syntax: '.someCyclesBy(0-1, fn)',
        description: 'Como sometimesBy, pero decide ciclo a ciclo en vez de evento a evento.',
        examples: [{ label: 'Ciclo entero afectado a veces', code: 's("bd,hh*8").someCyclesBy(.3, x=>x.speed("0.5"))' }],
      },
      {
        name: 'choose() / wchoose()',
        syntax: 'choose(a, b, c) / wchoose([a,peso], ...)',
        description: 'Elige aleatoriamente entre varias opciones en cada evento. wchoose() pondera la probabilidad de cada opción.',
        examples: [{ label: 'Sonido aleatorio por golpe', code: 'note("c2 g2!2 d2 f1").s(choose("sine", "triangle", "bd:6"))' }],
      },
      {
        name: '.when()',
        syntax: '.when(patrón-booleano, fn)',
        description: 'Aplica una función solo cuando el patrón de condición está en estado verdadero (1).',
        examples: [{ label: 'Transponer en el segundo semiciclo', code: '"c3 eb3 g3".when("<0 1>/2", x=>x.sub("5")).note()' }],
      },
      {
        name: '.mask()',
        syntax: '.mask("1 0 1 1")',
        description: 'Silencia los eventos donde la máscara vale 0 o ~, dejando pasar el resto — como struct pero solo puede quitar, no añadir eventos.',
        examples: [{ label: 'Silenciar el segundo tiempo', code: 'note("c [eb,g] d [eb,g]").mask("<1 [0 1]>")' }],
      },
    ],
  },
  {
    id: 'transport',
    title: 'Reproducción y control global',
    summary: 'Cómo controlar el tempo global y detener todo lo que suena.',
    entries: [
      {
        name: 'setcpm() / setcps()',
        syntax: 'setcpm(ciclos por minuto) / setcps(ciclos por segundo)',
        description:
          'Fijan el tempo global. No hay compases en Strudel, solo ciclos — setcpm(bpm/pulsos-por-ciclo) es la forma habitual de traducir un tempo en BPM tradicional.',
        examples: [{ label: 'Tempo a 110bpm en compás de 4', code: 'setcpm(110/4)\ns("bd sd bd rim, hh*8")' }],
      },
      {
        name: 'hush()',
        syntax: 'hush()',
        description: 'Detiene y silencia todos los patrones activos. Equivale a pulsar Stop.',
        examples: [{ label: 'Parar todo', code: 'hush()' }],
      },
    ],
  },
  {
    id: 'visual',
    title: 'Feedback visual',
    summary:
      'Visualizadores nativos de Strudel — además del resaltado de la mini-notación (que ya está siempre activo mientras suena).',
    entries: [
      {
        name: '.pianoroll()',
        syntax: '.pianoroll({ opciones })',
        description:
          'Dibuja el patrón como un rollo de piano que se desplaza. Por defecto se superpone a toda la página mientras suena (así funciona también en strudel.cc) — usa Stop o quita .pianoroll() para ocultarlo. Opciones útiles: cycles (ciclos visibles a la vez), labels (mostrar nombres de nota), vertical.',
        examples: [{ label: 'Rollo de piano con etiquetas', code: 'note("c2 a2 eb2").euclid(5,8).s("sawtooth").pianoroll({ labels: 1 })' }],
      },
      {
        name: '._scope()',
        syntax: '._scope()',
        description:
          'Osciloscopio: dibuja la forma de onda real del audio. El prefijo _ hace que se dibuje en línea dentro del propio código en vez de superponerse a toda la página — útil para combinar varios visualizadores a la vez.',
        examples: [{ label: 'Forma de onda de un synth', code: 's("sawtooth")._scope()' }],
      },
      {
        name: '._spectrum()',
        syntax: '._spectrum()',
        description: 'Analizador de espectro: muestra el contenido en frecuencias del audio en tiempo real.',
        examples: [{ label: 'Espectro de una melodía', code: 'n("<0 4 2 1>*3").scale("d3:minor:pentatonic").s("sine")._spectrum()' }],
      },
    ],
  },
  {
    id: 'layering',
    title: 'Capas y acumulación',
    summary: 'Formas de superponer variaciones de un mismo patrón sobre sí mismo, en vez de reescribirlo entero.',
    entries: [
      {
        name: '.superimpose()',
        syntax: '.superimpose(fn)',
        description: 'Superpone el resultado de aplicar fn al patrón, por encima del patrón original (que sigue sonando sin modificar).',
        examples: [{ label: 'Capa transportada una quinta', code: 'note("c eb g").superimpose(x=>x.add(7))' }],
      },
      {
        name: '.layer()',
        syntax: '.layer(fn)',
        description: 'Como superimpose, pero sin mantener el patrón original — solo suena el resultado de fn.',
        examples: [{ label: 'Solo la capa transformada', code: 'note("c eb g").layer(x=>x.add("0,2"))' }],
      },
      {
        name: '.echo()',
        syntax: '.echo(repeticiones, tiempo, feedback)',
        description: 'Superpone el patrón varias veces desplazado en el tiempo, bajando el volumen (velocity) en cada repetición — un eco estructural, no de audio.',
        examples: [{ label: 'Triple eco', code: 's("bd sd").echo(3, 1/6, .8)' }],
      },
      {
        name: '.echoWith()',
        syntax: '.echoWith(repeticiones, tiempo, fn)',
        description: 'Como echo, pero en vez de bajar el volumen aplica una función distinta (con el índice de repetición) en cada copia.',
        examples: [{ label: 'Transporte progresivo', code: 'n("<0 [2 4]>").echoWith(4, 1/8, (p,i)=>p.add(i*2)).scale("C:minor")' }],
      },
    ],
  },
  {
    id: 'stepwise',
    title: 'Funciones stepwise (avanzado)',
    summary:
      'Funcionalidad experimental: en vez de razonar solo en ciclos, permite razonar en "pasos" (steps) — útil para polimetría y para estirar/encoger patrones sin tocar su contenido.',
    entries: [
      {
        name: '.pace()',
        syntax: '.pace(pasos-por-ciclo)',
        description: 'Ajusta la velocidad de reproducción para que quepan exactamente n pasos por ciclo — la base de las demás funciones stepwise.',
        examples: [{ label: '4 pasos por ciclo', code: 's("bd sd cp").pace(4)' }],
      },
      {
        name: 'stepcat()',
        syntax: 'stepcat([pasos, patrón], ...)',
        description: 'Concatena patrones proporcionalmente a su número de pasos (en vez de darles a todos el mismo espacio, como hace cat()).',
        examples: [{ label: 'Proporción 3 a 1', code: 'stepcat([3,"e3"],[1,"g3"]).note()' }],
      },
      {
        name: 'polymeter() / pm()',
        syntax: 'polymeter(patrón1, patrón2, ...)',
        description: 'Combina patrones con distinto número de pasos manteniendo el mismo pulso de paso — la esencia de la "polimetría": mismo tempo de paso, distinta longitud de frase.',
        examples: [{ label: 'Polimetría de 3 contra 2', code: 'polymeter("c eb g", "c2 g2").note()' }],
      },
      {
        name: '.expand() / .contract()',
        syntax: '.expand(factor) / .contract(factor)',
        description: 'Aumenta o reduce el número de pasos de un patrón por un factor, estirando o encogiendo su resolución rítmica.',
        examples: [{ label: 'Expansión variable', code: 's("tha dhi thom nam").bank("mridangam").expand("3 2 1 1 2 3").pace(8)' }],
      },
      {
        name: '.take() / .drop()',
        syntax: '.take(n) / .drop(n)',
        description: 'take() extrae los primeros (o últimos, con n negativo) n pasos. drop() los elimina.',
        examples: [{ label: 'Solo los 2 primeros pasos', code: '"bd cp ht mt".take("2").sound()' }],
      },
    ],
  },
  {
    id: 'external',
    title: 'MIDI, OSC e Hydra (control y visuales externos)',
    summary:
      'Cómo sacar el patrón de Strudel hacia fuera del navegador: MIDI (dispositivos/software vía Web MIDI), OSC (TouchDesigner, SuperCollider...) e Hydra (visuales de live coding integrados en el propio editor).',
    entries: [
      {
        name: '.midi()',
        syntax: '.midi("nombre-del-puerto")',
        description:
          'Envía el patrón como notas MIDI reales usando la Web MIDI API del navegador — funciona con puertos MIDI virtuales (IAC en Mac, loopMIDI en Windows) que luego puede leer TouchDesigner (MIDI In CHOP), Ableton, etc. Sin argumento usa el primer puerto disponible.',
        examples: [
          { label: 'Enviar notas por MIDI', code: 'note("c a f e").midi()' },
          { label: 'A un puerto concreto', code: 'note("c a f e").midi("loopMIDI Port")' },
        ],
      },
      {
        name: 'midin() — recibir MIDI',
        syntax: 'const cc = await midin("nombre-de-entrada")',
        description: 'Recibe mensajes de control (CC) de un dispositivo o software MIDI externo y los convierte en una señal utilizable con .range() — control en tiempo real desde fuera del navegador.',
        examples: [{ label: 'Filtro controlado por CC0', code: 'const cc = await midin()\nnote("c a f e").lpf(cc(0).range(200,4000))' }],
      },
      {
        name: '.osc()',
        syntax: '.osc()',
        description:
          'Envía cada evento del patrón como un mensaje OSC por UDP — pensado para TouchDesigner, SuperCollider/SuperDirt, o cualquier software que escuche OSC. Requiere un puente local (el navegador no puede mandar UDP directamente): ejecuta `npx @strudel/osc` en una terminal — abre un WebSocket en localhost:8080 y reenvía por OSC a 127.0.0.1:57120 por defecto. En TouchDesigner, pon un OSC In CHOP escuchando en el puerto 57120 (o el que configures en el puente) y ya te llegan los valores de cada evento (note, s, gain...) como canales.',
        examples: [{ label: 'Enviar patrón por OSC', code: 'note("c e g").osc()' }],
      },
      {
        name: 'initHydra() / H()',
        syntax: 'await initHydra()',
        description:
          'Activa Hydra (el live-coder de visuales) dentro del propio editor de Strudel — tras llamarlo, todas las funciones de Hydra (osc(), shape(), .out(), etc.) están disponibles en el mismo código, mezcladas con tu música. H(patrón) deja usar un patrón de Strudel como entrada numérica para Hydra, sincronizando visual y sonido automáticamente. detectAudio:true hace los visuales reactivos al audio.',
        examples: [
          { label: 'Visual básico', code: 'await initHydra()\nosc(10,0.9,300).color(0.9,0.7,0.8).out()' },
          {
            label: 'Patrón controlando forma y sonido a la vez',
            code: 'await initHydra()\nlet pat = "3 4 5 [6 7]*2"\nshape(H(pat)).out(o0)\nn(pat).scale("A:minor").s("piano").room(1)',
          },
        ],
      },
    ],
  },
];
