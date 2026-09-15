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
      {
        name: 'aliasBank()',
        syntax: "aliasBank('Alias', 'BancoOriginal')",
        description:
          'Registra un alias para un banco de sonidos existente, para poder referirte a él con otro nombre en .bank().',
        examples: [],
      },
      {
        name: '.begin() / .end()',
        syntax: '.begin(0-1) / .end(0-1)',
        description:
          'Recortan el sample por su inicio o su final: begin(.25) salta el primer cuarto del sample; end(.5) corta a partir de la mitad. Se combinan para tocar solo un fragmento concreto.',
        examples: [
          { label: 'Empezar en distintos puntos del sample', code: 'samples({ rave: \'rave/AREUREADY.wav\' }, \'github:tidalcycles/dirt-samples\')\ns("rave").begin("<0 .25 .5 .75>").fast(2)' },
        ],
      },
      {
        name: '.chop()',
        syntax: '.chop(n)',
        description:
          'Corta cada sample en n fragmentos iguales, convirtiendo un patrón de samples en un patrón de fragmentos de esos samples — la base de la "síntesis granular". Se combina bien con .rev() o .loopAt() para reordenar o estirar los fragmentos.',
        examples: [{ label: 'Granular con reverso', code: 's("break").chop(4).rev().loopAt(2)' }],
      },
      {
        name: '.coarse()',
        syntax: '.coarse(n)',
        description:
          'Reduce la resolución temporal del audio quedándose solo con 1 de cada n muestras (submuestreo) — un efecto lo-fi distinto al bitcrusher de .crush(), que reduce la resolución de amplitud en vez de la de tiempo.',
        examples: [{ label: 'Degradación progresiva', code: 's("bd sd, hh*8").coarse("<1 4 8 16>")' }],
      },
      {
        name: '.byteBeatExpression() / .byteBeatStartTime()',
        syntax: 's("bytebeat").byteBeatExpression("expresión")',
        description:
          'Bytebeat es una técnica de síntesis que genera audio a partir de fórmulas matemáticas a nivel de bit sobre un contador de tiempo (t). byteBeatExpression() (alias bbexpr/bb) define esa fórmula; byteBeatStartTime() (alias bbst) fija el valor inicial de t, en muestras.',
        examples: [{ label: 'Expresión bytebeat propia', code: 's("bytebeat").bbexpr(\'t*(t>>15^t>>66)\')' }],
      },
      {
        name: '.density() (ruido crackle)',
        syntax: '.density(cantidad)',
        description: 'Controla la densidad del ruido "crackle" (chisporroteo tipo vinilo) generado por s("crackle") — no confundir con el alias antiguo "density" de .fast().',
        examples: [{ label: 'Crackle con densidad variable', code: 's("crackle*4").density("<0.01 0.04 0.2 0.5>".slow(4))' }],
      },
      {
        name: '.detune()',
        syntax: '.detune(cantidad)',
        description: 'Desafina entre sí las voces apiladas de osciladores que soportan varias voces (como supersaw), ensanchando el sonido.',
        examples: [{ label: 'Supersaw más o menos desafinado', code: 'note("d f a a# a d3").fast(2).s("supersaw").detune("<.1 .2 .5 24.1>")' }],
      },
      {
        name: '.fit()',
        syntax: '.fit()',
        description: 'Ajusta el sample para que dure exactamente lo que dura su evento — ideal para loops rítmicos como breaks de batería. Parecido a .loopAt().',
        examples: [{ label: 'Ajustar un sample a la duración del evento', code: 's("break/2").fit()' }],
      },
      {
        name: 'getDur()',
        syntax: "await getDur('nombreDeSample')",
        description: 'Devuelve (de forma asíncrona, requiere await) la duración en segundos de un sample — útil para ajustar el tempo del patrón exactamente a la duración de un loop.',
        examples: [{ label: 'Ajustar cps a la duración de un sample', code: "let k = await getDur('break')\ns(\"break\").cps(1/k)" }],
      },
      {
        name: '.fmi() / .fm() .fmh() .fmwave()',
        syntax: '.fm(indice).fmh(ratio)',
        description:
          'Controles de síntesis FM (modulación en frecuencia): .fmi()/.fm() es la profundidad (índice) de modulación, .fmh() la relación armónica entre el oscilador modulador y el portador, y .fmwave() la forma de onda del modulador.',
        examples: [{ label: 'FM con ratio armónico', code: 'n("0 1 2 3".fast(4)).scale("d:minor").s("sine").fmwave("<sine square sawtooth crackle>").fm(4).fmh(2.01)' }],
      },
      {
        name: '.fmattack() .fmdecay() .fmsustain() .fmrelease() / .fmenv()',
        syntax: '.fmattack(t).fmdecay(t).fmsustain(nivel).fmrelease(t)',
        description:
          'Envolvente ADSR aplicada a la profundidad de la modulación FM, para que el brillo del timbre cambie con el tiempo en vez de quedarse fijo. .fmenv() elige la forma de la rampa ("lin" o "exp").',
        examples: [{ label: 'Timbre FM que se apaga', code: 'note("c e g b g e").fm(4).fmdecay(.2).fmsustain(0).fmenv("<exp lin>")' }],
      },
      {
        name: '.loop() / .loopAt() / .loopAtCps()',
        syntax: '.loop(1) / .loopAt(ciclos)',
        description: 'loop() hace que el sample se repita en bucle (sin sincronizar su tempo con el del ciclo). loopAt() en cambio ajusta la velocidad del sample para que quepa en exactamente el número de ciclos indicado — ideal para breaks de batería. loopAtCps() es una variante obsoleta de loopAt() ligada a un valor de cps concreto.',
        examples: [{ label: 'Ajustar un break a 2 ciclos', code: "samples({ rhodes: 'https://cdn.freesound.org/previews/132/132051_316502-lq.mp3' })\ns(\"rhodes\").loopAt(2)" }],
      },
      {
        name: '.loopBegin() / .loopEnd()',
        syntax: '.loopBegin(0-1).loopEnd(0-1)',
        description: 'Con .loop(1) activo, fijan el punto de inicio y fin de la sección que se repite dentro del sample (entre .begin() y .end()).',
        examples: [{ label: 'Bucle interno del sample', code: 's("space").loop(1).loopBegin("<0 .125 .25>")' }],
      },
      {
        name: '.noise()',
        syntax: '.noise(cantidad)',
        description: 'Mezcla ruido rosa junto al sonido actual. Strudel también incluye el ruido como fuente directa con s("white"), s("pink") o s("brown") (blanco, rosa y marrón/browniano, cada uno con un color tonal distinto).',
        examples: [{ label: 'Comparar los tres colores de ruido', code: 'sound("<white pink brown>/2")' }],
      },
      {
        name: '.partials()',
        syntax: '.partials([magnitudes])',
        description: 'Escala la magnitud de cada armónico de uno de los sintetizadores básicos (sine, tri, saw...), permitiendo diseñar un timbre propio a partir de su contenido armónico — el primer valor de la lista es el armónico fundamental.',
        examples: [{ label: 'Timbre con armónicos elegidos a mano', code: 's("user").seg(16).n(irand(8)).scale("A:major").partials([1, 0, 1, 0, 0, 1])' }],
      },
      {
        name: '.speed()',
        syntax: '.speed(cantidad)',
        description: 'Cambia la velocidad de reproducción del sample — una forma "barata" de cambiar el tono (a diferencia de .stretch(), que cambia el tono sin tocar la velocidad). Los valores negativos reproducen el sample al revés.',
        examples: [{ label: 'Distintas velocidades, incluida marcha atrás', code: 's("bd*6").speed("1 2 4 1 -2 -4")' }],
      },
      {
        name: 'soundAlias()',
        syntax: "soundAlias('alias', 'sonidoOriginal')",
        description: 'Registra un alias para un sonido/sample concreto, para poder referirte a él con otro nombre en s().',
        examples: [],
      },
      {
        name: '.splice()',
        syntax: '.splice(n, "índices")',
        description: 'Como .slice(), pero además ajusta la velocidad de reproducción de cada trozo para que encaje exactamente en la duración de su paso — así un break entero suena a tempo aunque se reordene.',
        examples: [{ label: 'Break reordenado y ajustado al tempo', code: 's("breaks165").splice(8, "0 1 [2 3 0]@2 3 0@2 7")' }],
      },
      {
        name: '.spread()',
        syntax: '.spread(0-1)',
        description: 'Fija la dispersión estéreo entre las voces apiladas de osciladores como supersaw — 0 las deja todas centradas, 1 las reparte al máximo entre izquierda y derecha.',
        examples: [{ label: 'Supersaw ancho', code: 'note("d f a a# a d3").fast(2).s("supersaw").spread("<0 .3 1>")' }],
      },
      {
        name: '.stretch()',
        syntax: '.stretch(factor)',
        description: 'Cambia el tono del sample sin cambiar su velocidad de reproducción (a diferencia de .speed()). Valores positivos suben el tono (1, 3, 7... equivalen a subir octavas); negativos lo bajan.',
        examples: [{ label: 'Transposición sin cambiar velocidad', code: 's("gm_flute").stretch("<2 1 0 -2>")' }],
      },
      {
        name: '.striate()',
        syntax: '.striate(n)',
        description: 'Corta cada sample en n partes, pero en vez de tocarlas todas seguidas (como .chop()), en cada repetición del patrón avanza progresivamente por esas partes.',
        examples: [{ label: 'Avance progresivo por los trozos', code: 's("numbers:0 numbers:1 numbers:2").striate(6).slow(3)' }],
      },
      {
        name: 'tables()',
        syntax: "tables('github:usuario/repo')",
        description: 'Carga una colección de wavetables (tablas de onda) para usar con s(), igual que samples() carga samples normales.',
        examples: [],
      },
      {
        name: '.unison()',
        syntax: '.unison(n)',
        description: 'Fija el número de voces apiladas para osciladores que lo soportan (como supersaw) — combinado con .detune() y .spread() da el clásico sonido "unísono" grueso.',
        examples: [{ label: 'Más voces, más grosor', code: 'note("d f a a# a d3").fast(2).s("supersaw").unison("<1 2 7>")' }],
      },
      {
        name: '.wt() (posición en la wavetable)',
        syntax: '.s("nombre").bank("wt_digital").wt(0-1)',
        description: 'Con un sonido de tipo wavetable (banco wt_*, cargado con tables()), wt() elige la posición dentro de la tabla de onda — el equivalente, para wavetables, de elegir la forma de onda de un synth clásico.',
        examples: [{ label: 'Barrido de posición', code: 's("squelch").bank("wt_digital").seg(8).note("F1").wt("0 0.25 0.5 0.75 1")' }],
      },
      {
        name: '.wtattack() .wtdecay() .wtdc()',
        syntax: '.wtattack(t).wtdecay(t).wtdc(0-1)',
        description: 'Parte de la envolvente y el LFO que modulan la posición dentro de la wavetable: wtattack/wtdecay son tiempos de la envolvente (junto a wtsustain/wtrelease/wtenv), y wtdc es el desplazamiento (DC offset) del LFO que la modula (junto a wtrate/wtdepth/wtshape/wtskew/wtsync).',
        examples: [],
      },
      {
        name: '.phases()',
        syntax: '.phases([fases])',
        description: 'Rota la fase de cada armónico de un sintetizador básico por la lista indicada (valores entre 0 y 1) — combinado con .partials(), permite cancelación de fase y timbres más complejos.',
        examples: [{ label: 'Cancelación de fase', code: 's("saw").seg(8).n(irand(12)).scale("G#1:minor").partials([1,1,1]).superimpose(x => x.phases([0.5,0.5,0.5]))' }],
      },
      {
        name: '.pw() .pwrate() .pwsweep()',
        syntax: '.s("pulse").pw(0-1)',
        description: 'Controlan el ancho de pulso del oscilador "pulse": pw() fija el ancho, y pwrate()/pwsweep() controlan la velocidad y el rango de barrido de un LFO que lo modula automáticamente (PWM).',
        examples: [{ label: 'Pulse con PWM', code: 'n(run(8)).scale("D:pentatonic").s("pulse").pw("0.5").pwrate("<5 .1 25>").pwsweep("<0.3 .8>")' }],
      },
      {
        name: 'randL()',
        syntax: 'randL(n)',
        description: 'Genera una lista de n números aleatorios (a diferencia de rand, que es una señal continua) — pensada para usarse con .partials() u otros parámetros que esperan una lista fija.',
        examples: [{ label: 'Armónicos aleatorios', code: 's("saw").seg(16).n(irand(12)).scale("F1:minor").partials(randL(8))' }],
      },
      {
        name: '.scrub()',
        syntax: '.scrub("posición:velocidad")',
        description: 'Permite "rebobinar" un sample manualmente, como una cinta: el primer valor es la posición dentro del audio (0 a 1) y el segundo, opcional, la velocidad de reproducción en ese punto.',
        examples: [{ label: 'Scrub sobre un sample', code: "samples('github:switchangel/pad')\ns(\"swpad:0\").scrub(\"{0.1!2 .25@3 0.7!2 <0.8:1.5>}%8\")" }],
      },
      {
        name: '.slice()',
        syntax: '.slice(n, "índices")',
        description: 'Corta un sample en n trozos (o en los puntos exactos indicados como lista de 0 a 1) y los dispara según un patrón de índices — como .chop(), pero dando control explícito de qué trozo suena cuándo.',
        examples: [{ label: 'Reordenar un break por índices', code: 's("breaks165").slice(8, "0 1 <2 2*2> 3 [4 0] 5 6 7".every(3, rev)).slow(0.75)' }],
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
      {
        name: 'addVoicings()',
        syntax: "addVoicings('nombre', diccionario, [notaMín, notaMáx])",
        description:
          'Registra un diccionario propio de voicings (bajo un nombre) para usarlo luego con .voicing(\'nombre\'), igual que los diccionarios que ya vienen incluidos en Strudel.',
        examples: [
          {
            label: 'Diccionario de voicings propio',
            code: "addVoicings('cookie', {\n  7: ['3M 7m 9M 12P 15P', '7m 10M 13M 16M 19P'],\n  m7: ['8P 11P 14m 17m 19P', '5P 8P 11P 14m 17m'],\n}, ['C3', 'C6'])\n\n\"<C7 Dm7>\".chord().voicing('cookie').note()",
          },
        ],
      },
      {
        name: '.anchor()',
        syntax: '.anchor("nota")',
        description:
          'Fija la nota de referencia a la que se ajustan .voicing() o .scale() al buscar la posición más cercana. Por defecto es c5.',
        examples: [{ label: 'Ancla distinta cada ciclo', code: 'anchor("<c4 g4 c5 g5>").chord("C").voicing()' }],
      },
      {
        name: '.arp() / .arpWith()',
        syntax: '.arp("patrón de índices")',
        description:
          'Arpegia un acorde (notas apiladas con comas dentro de un mismo evento): selecciona qué nota(s) del acorde suenan según un patrón de índices. .arpWith() permite elegir con una función arbitraria en vez de una lista de índices.',
        examples: [
          { label: 'Arpegio sobre acordes cambiantes', code: 'note("<[c,eb,g]!2 [c,f,ab] [d,f,ab]>").arp("0 [0,2] 1 [0,2]")' },
        ],
      },
      {
        name: '.dictionary() / .dict()',
        syntax: '.dictionary("nombre")',
        description: 'Elige qué diccionario de voicings usa .voicing() — por defecto el incluido en Strudel, o uno registrado antes con addVoicings().',
        examples: [
          {
            label: 'Usar un diccionario propio',
            code: "addVoicings('house', {\n  '': ['7 12 16', '0 7 16', '4 7 12'],\n  m: ['0 3 7'],\n})\nchord(\"<Am C D F>\").dict('house').anchor(66).voicing().room(.5)",
          },
        ],
      },
      {
        name: 'i()',
        syntax: 'i("grados")',
        description:
          'Selecciona un grado dentro de una escala xenharmónica (afinaciones no estándar), para usar junto con xen() o tune(). Es el equivalente de n() pero para escalas EDO/xen en vez de las escalas occidentales habituales.',
        examples: [{ label: 'Grados de una escala EDO', code: 'i("0 1 2 3 4 5 6 7").xen("<5edo 10edo 15edo>")' }],
      },
      {
        name: '.ftranspose()',
        syntax: '.ftranspose(pasos)',
        description:
          'Transpone en frecuencia (no en semitonos) por un número de pasos de una afinación EDO (por defecto 12, o la que se haya fijado con xen()) — pensado para trabajar con freq() o escalas microtonales.',
        examples: [],
      },
      {
        name: 'edoScale()',
        syntax: 'edoScale("Tónica:LLsLLLs:pasoGrande:pasoPequeño")',
        description:
          'Convierte números en notas de una escala EDO (división equitativa de la octava) definida a mano: una secuencia de pasos "grandes" (L) y "pequeños" (s), y el tamaño de cada uno. Herramienta avanzada de afinación microtonal.',
        examples: [{ label: 'Escala mayor como EDO de 12 pasos', code: 'n("0 2 4 6 4 2").edoScale("C:LLsLLLs:2:1")' }],
      },
      {
        name: '.mode()',
        syntax: '.mode("below" | "above" | "duck" | "root")',
        description: 'Controla cómo se alinea el voicing respecto al ancla (.anchor()): "below" mantiene la nota superior en o por debajo del ancla, "above" la nota inferior en o por encima, "duck" como below pero excluyendo el ancla, y "root" ancla por la fundamental del acorde.',
        examples: [{ label: 'Comparar los modos', code: 'mode("<below above duck root>").chord("C").voicing()' }],
      },
      {
        name: '.octaves()',
        syntax: '.octaves(cantidad)',
        description: 'Cuántas octavas de separación puede usar .voicing() entre las notas del acorde (por defecto 1).',
        examples: [{ label: 'Voicings más abiertos', code: 'chord("<Am C D F Am E Am E>").octaves("<2 4>").voicing()' }],
      },
      {
        name: '.offset()',
        syntax: '.offset(cantidad)',
        description: 'Desplaza el voicing respecto a su posición anclada, para variar el acorde elegido en cada repetición sin cambiar el ancla.',
        examples: [{ label: 'Voicing distinto cada vez', code: 'chord("<Am C D F Am E Am E>").offset("<0 1 2 3 4 5>")' }],
      },
      {
        name: '.rootNotes()',
        syntax: '.rootNotes(octava)',
        description: 'A partir de un patrón de acordes, extrae solo su nota fundamental (raíz) en la octava indicada — útil para generar una línea de bajo que siga la progresión de acordes.',
        examples: [{ label: 'Bajo siguiendo la progresión', code: '"<C^7 A7 Dm7 G7>".rootNotes(2).note()' }],
      },
      {
        name: '.tune()',
        syntax: '.tune("nombreDeEscala" | [frecuencias])',
        description: 'Con un patrón de grados numéricos en el control i() (en vez de note()/n()), tune() los convierte en una razón de frecuencia según una escala xenharmónica con nombre, o según una lista de frecuencias propia — parecido a xen(), pero trabajando con nombres de escala del catálogo de afinaciones en vez de un número de EDO.',
        examples: [{ label: 'Escala xenharmónica con nombre', code: 'i("0 1 2 3 4 5").tune("hexany15").mul("220").freq()' }],
      },
      {
        name: '.withBase()',
        syntax: '.withBase(nuevaBase)',
        description: 'Cambia la frecuencia base (por defecto 220Hz) de un patrón de frecuencias afinado con xen() u otras herramientas microtonales, sin tener que recalcular las razones.',
        examples: [],
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
          'Reparte un número de golpes de la forma más uniforme posible a lo largo de un número de pasos, usando el algoritmo euclidiano — la base matemática de muchos ritmos tradicionales del mundo. La rotación (opcional) desplaza el punto de partida. También existe como función encadenable: .euclid(pulsos, pasos) y .euclidRot(pulsos, pasos, rotación).',
        examples: [
          { label: '3 golpes en 8 pasos', code: 's("bd(3,8)")' },
          { label: 'Con rotación', code: 's("bd(3,8,3)")' },
        ],
      },
      {
        name: '.euclidish() .euclidLegato() .euclidLegatoRot() .euclidRot()',
        syntax: '.euclidish(p,s,mezcla) / .euclidLegato(p,s) / .euclidRot(p,s,rotación)',
        description:
          'Variantes de euclid(): euclidish() mezcla gradualmente entre el ritmo euclidiano (0) y un patrón "parejo" con todos los pasos iguales (1); euclidLegato() sostiene cada pulso hasta el siguiente, sin huecos; euclidRot() (y euclidLegatoRot()) añaden además un desplazamiento rotacional del patrón resultante.',
        examples: [
          { label: 'Groove entre euclidiano y parejo', code: 'sound("hh").euclidish(7,12,sine.slow(8)).pan(sine.slow(8))' },
          { label: 'Euclidiano sin huecos', code: 'note("c3").euclidLegato(3,8)' },
          { label: 'Ritmo de samba rotado', code: 'note("c3").euclidRot(3,16,14)' },
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
        description: 'Resonancia (q) del filtro paso-bajo: realza la zona justo en el punto de corte. Rango típico 0-30. El filtro paso-alto tiene su propio equivalente: .hpq() (alias hresonance).',
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
      {
        name: '.bpattack() .bpdecay() .bpsustain() .bprelease()',
        syntax: '.bpattack(t).bpdecay(t).bpsustain(nivel).bprelease(t)',
        description:
          'Envolvente ADSR aplicada a la frecuencia central del filtro paso-banda (.bpf()), igual que .lpattack()/.hpattack() para los filtros paso-bajo/paso-alto: la frecuencia de corte se mueve con su propia envolvente en vez de quedarse fija.',
        examples: [{ label: 'Barrido descendente del centro', code: 'note("c e g").s("sawtooth").bpf(1200).bpenv(-24).bpattack(.01).bpdecay(.2).bpsustain(0)' }],
      },
      {
        name: '.bprate() .bpdepth() .bpshape() .bpskew() .bpsync() .bpdc() .bpdepthfrequency()',
        syntax: '.bprate(hz) / .bpsync(ciclos)',
        description:
          'LFO que modula la frecuencia central del filtro paso-banda: bprate fija su velocidad en Hz, bpsync la sincroniza a un número de ciclos, bpdepth/bpdepthfrequency la profundidad (relativa o en Hz), bpshape/bpskew la forma de la onda, y bpdc su desplazamiento (DC offset).',
        examples: [{ label: 'Barrido del centro con LFO', code: 'note("<c c c# c c c4>*16").s("sawtooth").bpf(600).bpdepthfrequency("<200 500 100 0>")' }],
      },
      {
        name: '.distorttype()',
        syntax: '.distorttype("asym" | "chebyshev" | "cubic" | ...)',
        description:
          'Elige el algoritmo de waveshaping usado por .distort(). Cada tipo tiene un carácter distinto: asym es distorsión de diodo asimétrica, chebyshev usa polinomios de Chebyshev, cubic es una curva cúbica simple, diode emula un diodo, fold es wavefolding, hard es recorte duro (hard-clipping), soft es recorte suave (soft-clipping), y también existen scurve y sinefold.',
        examples: [{ label: 'Comparar tipos de distorsión', code: 's("bd sd, hh*8").distort(4).distorttype("<asym chebyshev cubic>")' }],
      },
      {
        name: '.chorus()',
        syntax: '.chorus(cantidad)',
        description: 'Mezcla de un efecto de chorus (varias copias ligeramente desafinadas y desplazadas en el tiempo) para engrosar el sonido.',
        examples: [{ label: 'Chorus en un synth', code: 'note("d d a# a").s("sawtooth").chorus(.5)' }],
      },
      {
        name: '.clip() / .legato()',
        syntax: '.clip(factor)',
        description:
          'Multiplica la duración de cada nota por el factor indicado, y recorta el sample si se pasa de esa duración. Con factores menores que 1 se acortan las notas (staccato); mayores que 1 se alargan (legato).',
        examples: [{ label: 'De staccato a legato', code: 'note("c a f e").s("piano").clip("<.5 1 2>")' }],
      },
      {
        name: '.cut()',
        syntax: '.cut(grupo)',
        description:
          'Como en las cajas de ritmos clásicas: al asignar el mismo número de "cutgroup" a varios sonidos, uno corta al anterior en cuanto empieza — típico para simular un hi-hat abierto interrumpido por uno cerrado.',
        examples: [{ label: 'Hi-hats que se cortan entre sí', code: 's("[oh hh]*4").cut(1)' }],
      },
      {
        name: 'FX()',
        syntax: '.FX(efecto1, efecto2, ...)',
        description:
          'Encadena varios efectos como una cadena (chain) explícita, en vez de ir llamando a cada método por separado — el orden dentro de FX() es el orden en que se procesan. Se puede llamar varias veces seguidas (.FX(a).FX(b)) o de una vez (.FX(a, b)).',
        examples: [{ label: 'Cadena de efectos', code: 's("bd sd, hh*4").FX(\n  phaser(0.5).gain(2),\n  bpf(800),\n  distort(1.3),\n  room(0.2),\n)' }],
      },
      {
        name: '.drive()',
        syntax: '.drive(cantidad)',
        description: 'Overdrive del filtro, disponible en los tipos de filtro que lo soportan (por ejemplo el filtro "ladder").',
        examples: [{ label: 'Filtro con overdrive', code: 'note("{f g g c d a a#}%16").s("supersaw").lpf(150).ftype(\'ladder\').drive("<.5 4>")' }],
      },
      {
        name: '.djf()',
        syntax: '.djf(0-1)',
        description: 'Filtro de un solo mando al estilo de un mezclador de DJ: por debajo de 0.5 actúa como paso-bajo, por encima de 0.5 como paso-alto.',
        examples: [{ label: 'Barrido de DJ filter', code: 'n(irand(16).seg(8)).scale("d:phrygian").s("supersaw").djf("<.5 .3 .2 .75>")' }],
      },
      {
        name: '.ftype()',
        syntax: '.ftype("12db" | "ladder" | "24db")',
        description: 'Elige el algoritmo del filtro paso-bajo/paso-alto. El filtro "ladder" (escalera) es más agresivo/colorido que el estándar de 12dB o 24dB por octava.',
        examples: [{ label: 'Comparar tipos de filtro', code: 'note("c f g g a c d4").fast(2).sound(\'sawtooth\').lpf(200).lpenv(3).ftype("<ladder 12db 24db>")' }],
      },
      {
        name: '.fanchor()',
        syntax: '.fanchor(0-1)',
        description: 'Controla el centro de la envolvente del filtro: 0 = unipolar positiva, .5 = bipolar (por defecto), 1 = unipolar negativa. Cambia si la envolvente empuja la frecuencia de corte solo hacia arriba, hacia ambos lados, o solo hacia abajo.',
        examples: [],
      },
      {
        name: '.hpattack() .hpdecay() .hpsustain() .hprelease()',
        syntax: '.hpattack(t).hpdecay(t).hpsustain(nivel).hprelease(t)',
        description: 'Envolvente ADSR aplicada a la frecuencia de corte del filtro paso-alto (.hpf()) — igual que la envolvente equivalente para paso-bajo y paso-banda.',
        examples: [],
      },
      {
        name: '.hprate() .hpdepth() .hpshape() .hpskew() .hpsync() .hpdc() .hpdepthfrequency()',
        syntax: '.hprate(hz)',
        description: 'LFO que modula la frecuencia de corte del filtro paso-alto: mismos parámetros que su equivalente en el paso-bajo/paso-banda (velocidad, sincronía a ciclos, profundidad, forma e inclinación de la onda).',
        examples: [{ label: 'Barrido del corte con LFO', code: 'note("<c c c# c c c4>*16").s("sawtooth").hpf(600).hpdepthfrequency("<200 500 100 0>")' }],
      },
      {
        name: '.duckattack() .duckonset() .duckdepth()',
        syntax: '.duckattack(t).duckonset(t).duckdepth(0-1)',
        description:
          'Forma de la envolvente del "ducking" (sidechain) creado por .duckorbit(): duckonset es el tiempo hasta llegar al volumen más bajo, duckattack el tiempo para volver al volumen normal, y duckdepth cuánto se reduce el volumen (0 a 1). Se pueden variar por orbit con ":" en la mini-notación.',
        examples: [{ label: 'Sidechain con forma ajustada', code: '$: n(run(16)).scale("c:minor:pentatonic").s("sawtooth").delay(.7).orbit(2)\n$: s("bd:4!4").duckorbit(2).duckonset(0.01).duckattack(0.2).duckdepth(1)' }],
      },
      {
        name: '.delaytime() / .delayfeedback() / .delaysync()',
        syntax: '.delaytime(seg) / .delayfeedback(0-1) / .delaysync(ciclos)',
        description:
          'Formas de fijar por separado los parámetros de .delay() en vez de usar el formato corto "nivel:tiempo:feedback": delaytime en segundos, delayfeedback la realimentación (¡cuidado con valores ≥1, se retroalimenta sin control!), delaysync fija el tiempo en ciclos en vez de segundos.',
        examples: [{ label: 'Delay con feedback creciente', code: 's("bd").delay(.25).delayfeedback("<.25 .5 .75 1>")' }],
      },
      {
        name: '.distortvol()',
        syntax: '.distortvol(cantidad)',
        description: 'Ganancia de salida (postgain) de la distorsión por waveshaping — para compensar el volumen extra que añade .distort().',
        examples: [{ label: 'Distorsión con volumen controlado', code: 's("bd*4").bank("tr909").distort(2).distortvol(0.8)' }],
      },
      {
        name: '.phaser() .phasercenter() .phaserdepth() .phasersweep()',
        syntax: '.phaser(velocidad)',
        description: 'Efecto de phaser (parecido a los pedales de guitarra clásicos): phaser() fija la velocidad de modulación, phasercenter() la frecuencia central (1000Hz por defecto), phaserdepth() la intensidad del efecto, y phasersweep() el rango de barrido de su LFO.',
        examples: [{ label: 'Phaser sobre un arpegio', code: 'n(run(8)).scale("D:pentatonic").s("sawtooth").release(0.5).phaser("<1 2 4 8>")' }],
      },
      {
        name: '.postgain()',
        syntax: '.postgain(cantidad)',
        description: 'Ganancia aplicada después de todos los efectos, al final de la cadena — útil para compensar el volumen cuando efectos como .compressor() lo reducen.',
        examples: [{ label: 'Compensar volumen tras comprimir', code: 's("bd sd [~ bd] sd,hh*8").compressor("-20:20:10:.002:.02").postgain(1.5)' }],
      },
      {
        name: '.roomdim() .roomfade() .roomlp() .roomsize()',
        syntax: '.roomsize(0-10)',
        description: 'Parámetros detallados de la reverberación de .room(): roomsize (alias sz/size) es el tamaño de la sala, roomlp la frecuencia inicial de un filtro paso-bajo dentro de la reverb, roomdim la frecuencia a la que esa cola de reverb cae -60dB, y roomfade el tiempo de desvanecimiento en segundos.',
        examples: [{ label: 'Sala grande con cola apagada', code: 's("bd sd [~ bd] sd").room(0.5).rlp(5000).rdim(400)' }],
      },
      {
        name: '.lpattack() .lpdecay() .lpsustain() .lprelease() / .lpenv()',
        syntax: '.lpattack(t).lpdecay(t).lpsustain(nivel).lprelease(t).lpenv(semitonos)',
        description: 'Envolvente ADSR aplicada a la frecuencia de corte del filtro paso-bajo (.lpf()) — igual que sus equivalentes en el paso-alto y paso-banda. .lpenv() fija la profundidad (en semitonos) de esa envolvente.',
        examples: [{ label: 'Filtro con envolvente propia', code: "note(\"c2 e2 f2 g2\").sound('sawtooth').lpf(300).lpattack(.5).lpenv(\"<4 2 1 0 -1 -2 -4>/4\")" }],
      },
      {
        name: '.lprate() .lpdepth() .lpshape() .lpskew() .lpsync() .lpdc() .lpdepthfrequency()',
        syntax: '.lprate(hz)',
        description: 'LFO que modula la frecuencia de corte del filtro paso-bajo: mismos parámetros que su equivalente en el paso-alto/paso-banda (velocidad, sincronía a ciclos, profundidad, forma e inclinación de la onda).',
        examples: [{ label: 'Barrido del corte con LFO', code: 'note("<c c c# c c c4>*16").s("sawtooth").lpf(600).lprate("<4 8 2 1>")' }],
      },
      {
        name: '.panchor()',
        syntax: '.panchor(0-1)',
        description: 'Fija el ancla de la envolvente de afinación (.penv()): con anchor 0 el rango va de la nota hasta nota+penv; con anchor 1 va de nota-penv hasta la nota. Sin fijarlo, usa el valor de sustain de la envolvente.',
        examples: [{ label: 'Ancla variable', code: 'note("c c4").penv(12).panchor("<0 .5 1 .5>")' }],
      },
      {
        name: '.iresponse() / .irbegin() / .irspeed()',
        syntax: '.iresponse("sample")',
        description: 'Usan un sample propio como respuesta al impulso (impulse response) de la reverberación de .room(), en vez del algoritmo generado por defecto — para conseguir el carácter acústico de un espacio real grabado. irbegin/irspeed recortan y cambian la velocidad de ese sample.',
        examples: [{ label: 'Reverb con IR propia', code: 's("bd sd [~ bd] sd").room(.8).ir("<shaker_large:0 shaker_large:2>")' }],
      },
      {
        name: '.transient()',
        syntax: '.transient(ataque, sustain)',
        description: 'Realzador de transitorios (transient shaper): controla por separado el énfasis en el golpe inicial de cada sonido (ataque) y en su cuerpo (sustain), cada uno entre -1 (atenuar) y 1 (acentuar).',
        examples: [{ label: 'De apagado a percusivo', code: 's("bd").transient("<-1 -0.5 0 0.5 1>")' }],
      },
      {
        name: '.vowel()',
        syntax: '.vowel("a" | "e" | "i" | "o" | "u")',
        description: 'Filtro de formantes que hace que el sonido se parezca a una vocal cantada/hablada.',
        examples: [{ label: 'Vocales cambiantes', code: 'note("[c2 <eb2 <g2 g1>>]*2").s(\'sawtooth\').vowel("<a e i <o u>>")' }],
      },
      {
        name: '.warp() / .warpmode()',
        syntax: '.warp(0-1).warpmode("tipo")',
        description: 'Con un sonido wavetable, warp() altera la forma de onda leída (más allá de solo elegir su posición con .wt()), y warpmode() elige el algoritmo de esa alteración — hay muchos disponibles, entre ellos asym, fold, spin, chaos, wormhole o brownian.',
        examples: [{ label: 'Warp con modo cambiante', code: 's("morgana").bank("wt_digital").seg(8).note("F1").warp("0 0.25 0.5 0.75 1").warpmode("<asym bendp spin logistic sync wormhole brownian>*2")' }],
      },
      {
        name: '.warpattack() .warpdecay() .warpsustain() .warprelease() / .warpenv()',
        syntax: '.warpattack(t).warpdecay(t).warpsustain(nivel).warprelease(t)',
        description: 'Envolvente ADSR aplicada a la cantidad de warp de la wavetable — igual patrón que las demás envolventes de Strudel, pero aplicada a .warp() en vez de al volumen o al filtro.',
        examples: [],
      },
      {
        name: '.warprate() .warpdepth() .warpshape() .warpskew() .warpsync() .warpdc()',
        syntax: '.warprate(hz)',
        description: 'LFO que modula la cantidad de warp de la wavetable: mismos parámetros que los LFO de filtro (velocidad, sincronía a ciclos, profundidad, forma e inclinación de la onda).',
        examples: [],
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
      {
        name: '.add()',
        syntax: '.add(cantidad)',
        description:
          'Suma un número (o patrón de números) a cada valor de un patrón numérico. Con note()/n() la suma es en semitonos o grados; por debajo, Strudel convierte las notas a números MIDI antes de sumar.',
        examples: [
          { label: 'Transposición distinta cada ciclo', code: 'n("0 2 4".add("<0 3 4 0>")).scale("C:major")' },
        ],
      },
      {
        name: '.apply()',
        syntax: '.apply(fn)',
        description: 'Aplica una función guardada al patrón completo — como .layer() pero con una sola función en vez de una lista.',
        examples: [{ label: 'Aplicar una transposición diatónica guardada', code: '"<c3 eb3 g3>".scale(\'C minor\').apply(scaleTranspose("0,2,4")).note()' }],
      },
      {
        name: 'all()',
        syntax: 'all(fn)',
        description:
          'Aplica una función a todos los patrones activos a la vez, agrupándolos primero en un único stack. Solo detecta patrones declarados con una etiqueta ($:) — un patrón suelto sin $: no se ve afectado. Para aplicar la función a cada patrón por separado en vez de al conjunto, existe each().',
        examples: [{ label: 'Acelerar todas las capas a la vez', code: '$: sound("bd - cp sd")\n$: sound("hh*8")\nall(fast("<2 3>"))' }],
      },
      {
        name: '.compress()',
        syntax: '.compress(inicio, fin)',
        description: 'Comprime cada ciclo del patrón dentro del intervalo de tiempo indicado (entre 0 y 1), dejando el resto del ciclo en silencio.',
        examples: [{ label: 'Un patrón comprimido a la segunda mitad', code: 'cat(\n  s("bd sd").compress(.25,.75),\n  s("~ bd sd ~")\n)' }],
      },
      {
        name: '.brak()',
        syntax: '.brak()',
        description: 'En ciclos alternos, toca el patrón una vez, al doble de velocidad y desplazado un cuarto de ciclo — un efecto clásico de breakbeat.',
        examples: [{ label: 'Breakbeat sobre una batería', code: 's("bd sd [~ bd] sd").brak()' }],
      },
      {
        name: '.bite()',
        syntax: '.bite(n, "índices")',
        description: 'Divide el patrón en n partes iguales y las reproduce según una secuencia de índices — como .slice() pero para patrones enteros en vez de para un sample de audio.',
        examples: [{ label: 'Reordenar una escala por índices', code: 'note("0 1 2 3 4 5 6 7".scale(\'c:mixolydian\'))\n.bite(4, "3 2 1 0")' }],
      },
      {
        name: '.chunkBack() / .chunkInto() / .chunkBackInto()',
        syntax: '.chunkInto(n, fn)',
        description:
          'Variantes de .chunk(): chunkInto aplica fn a un sub-ciclo en bucle de esa parte en vez de a la parte simple; chunkBack recorre las partes en orden inverso; chunkBackInto combina ambos comportamientos.',
        examples: [{ label: 'Doble velocidad en un fragmento distinto cada ciclo, en bucle', code: 'sound("bd sd ht lt bd - cp lt").chunkInto(4, hurry(2)).bank("tr909")' }],
      },
      {
        name: '.as()',
        syntax: '.as("control1:control2:...")',
        description: 'Reparte los valores separados por ":" dentro de la mini-notación entre varios controles nombrados a la vez, en un solo paso.',
        examples: [{ label: 'Nota y clip en un solo patrón', code: '"c:.5 a:1 f:.25 e:.8".as("note:clip")' }],
      },
      {
        name: 'beat()',
        syntax: '.beat("posiciones", pasos)',
        description: 'Genera una estructura rítmica a partir de las posiciones (por número de paso) dentro de un total de pasos por ciclo — otra forma de construir ritmos además de la mini-notación o euclid().',
        examples: [{ label: 'Bombo en los pasos 0, 7 y 10 de 16', code: 's("bd").beat("0,7,10", 16)' }],
      },
      {
        name: '.fastChunk()',
        syntax: '.fastChunk(n, fn)',
        description: 'Como .chunk(), pero sin repetir los ciclos del patrón fuente para cada tanda de partes — el patrón avanza con normalidad mientras la parte transformada rota.',
        examples: [],
      },
      {
        name: '.fastGap()',
        syntax: '.fastGap(factor)',
        description: 'Acelera el patrón como .fast(), pero en vez de repetirlo varias veces dentro del ciclo, lo comprime una sola vez dejando un hueco de silencio en el resto del ciclo.',
        examples: [{ label: 'Comprimido en la primera mitad', code: 's("bd sd").fastGap(2)' }],
      },
      {
        name: '.focus()',
        syntax: '.focus(inicio, fin)',
        description: 'Parecido a .compress(), pero sin dejar huecos de silencio — y el intervalo de "foco" puede ser mayor que un ciclo entero.',
        examples: [{ label: 'Enfocar un cuarto de ciclo', code: 's("bd hh sd hh").focus(1/4, 3/4)' }],
      },
      {
        name: 'each()',
        syntax: 'each(fn)',
        description: 'Aplica una función a cada patrón activo por separado (a diferencia de all(), que los agrupa primero en un único stack). También requiere que los patrones estén etiquetados con $:.',
        examples: [],
      },
      {
        name: '.hurry()',
        syntax: '.hurry(factor)',
        description: 'Combina .fast() y .speed(): acelera el patrón Y la reproducción del propio sample a la vez, en vez de solo repetirlo más rápido.',
        examples: [{ label: 'Aceleración combinada', code: 's("bd sd:2").hurry("<1 2 4 3>")' }],
      },
      {
        name: '.inhabit() / .inhabitmod()',
        syntax: '.inhabit({ nombre: patrón, ... })',
        description: 'Como .pick(), pero cada ciclo del patrón elegido se comprime entero dentro del hueco del evento selector (igual que hace .squeeze() con listas). inhabitmod() es la variante que envuelve el índice en vez de quedarse en el máximo cuando se pasa del tamaño de la lista.',
        examples: [{ label: 'Elegir subpatrones completos por nombre', code: 'let a = s("bd(3,8)")\nlet b = s("cp sd")\n"<a b [a,b]>".inhabit({ a, b })' }],
      },
      {
        name: '.inside() / .outside()',
        syntax: '.inside(n, fn) / .outside(n, fn)',
        description: 'Aplican una función "dentro" o "fuera" de una escala de n ciclos: inside(n, fn) equivale a .slow(n).fn().fast(n) — útil para aplicar transformaciones (como rev) sobre grupos de varios ciclos en vez de uno solo. outside(n, fn) es la operación inversa.',
        examples: [{ label: 'Invertir en grupos de 4 ciclos', code: '"0 1 2 3 4 3 2 1".inside(4, rev).scale(\'C major\').note()' }],
      },
      {
        name: '.into()',
        syntax: '.into("estructura", fn)',
        description: 'Divide el patrón en trozos según una estructura booleana: donde es verdadero, ese sub-ciclo se pone en bucle y (opcionalmente) se le aplica una función; donde es falso, se reproduce el original sin cambios.',
        examples: [{ label: 'Acelerar solo la primera mitad', code: 'sound("bd sd ht lt").into("1 0", hurry(2))' }],
      },
      {
        name: '.keep()',
        syntax: 'a.keep(b)',
        description: 'Combina dos patrones de controles: se queda con lo que ya está definido en a, y rellena con b solo lo que falte en a. Es la operación inversa de set().',
        examples: [{ label: 'Rellenar el instrumento que falta', code: 'note("c a f e").keep(note("e f a c").s("piano"))' }],
      },
      {
        name: '.lastOf()',
        syntax: '.lastOf(n, fn)',
        description: 'Como .every(), pero cuenta los ciclos desde el último hacia atrás: aplica fn en el último de cada n ciclos en vez del primero.',
        examples: [{ label: 'Invertir cada 4º ciclo (contando desde el final)', code: 'note("c3 d3 e3 g3").lastOf(4, x=>x.rev())' }],
      },
      {
        name: '.linger()',
        syntax: '.linger(fracción)',
        description: 'Selecciona la fracción indicada del patrón (desde el principio) y la repite para rellenar el resto del ciclo.',
        examples: [{ label: 'Quedarse solo con un cuarto, repetido', code: 's("lt ht mt cp, [hh oh]*2").linger("<1 .5 .25 .125>")' }],
      },
      {
        name: 'morph()',
        syntax: 'morph(ritmoA, ritmoB, cantidad)',
        description: 'Mezcla gradualmente entre dos ritmos binarios (listas de 1 y 0 con el mismo número de "1"), según una cantidad entre 0 (ritmo A) y 1 (ritmo B).',
        examples: [{ label: 'Morphing lento entre dos grooves', code: 'sound("hh").struct(morph("1:0:1:0:1:0:1:0", "1:1:0:1:0:1:0", sine.slow(8)))' }],
      },
      {
        name: '.pickmod() / .pickOut() / .pickReset() / .pickRestart()',
        syntax: '.pickReset([patrón1, patrón2, ...])',
        description:
          'Variantes de .pick(): las que empiezan por "pickmod" envuelven el índice en vez de quedarse en el máximo si se pasa del tamaño de la lista; pickOut() usa outerJoin en vez de innerJoin para la alineación; pickReset() reinicia el patrón elegido al ciclo actual cada vez que se selecciona, y pickRestart() lo reinicia siempre desde el cycle 0.',
        examples: [
          {
            label: 'Cada patrón vuelve a empezar al ser elegido',
            code: '"<a@2 b@2 c@2 d@2>".pickRestart({\n  a: n("0 1 2 0"),\n  b: n("2 3 4 ~"),\n  c: n("[4 5] [4 3] 2 0"),\n  d: n("0 -3 0 ~"),\n}).scale("C:major").s("piano")',
          },
        ],
      },
      {
        name: '.press() / .pressBy()',
        syntax: '.press() / .pressBy(fracción)',
        description: 'Sincopa el ritmo desplazando cada evento hacia la mitad de su propio hueco temporal. press() equivale a pressBy(0.5); pressBy() permite elegir la fracción del desplazamiento.',
        examples: [{ label: 'Batería sincopada cada 4 ciclos', code: 'stack(s("hh*4"), s("bd mt sd ht").every(4, press)).slow(2)' }],
      },
      {
        name: '.repeatCycles()',
        syntax: '.repeatCycles(n)',
        description: 'Repite cada ciclo del patrón n veces seguidas, en vez de avanzar al siguiente ciclo cada vez.',
        examples: [{ label: 'Cada frase se repite dos veces', code: 'note(irand(12).add(34)).segment(4).repeatCycles(2).s("gm_acoustic_guitar_nylon")' }],
      },
      {
        name: '.reset() / .restart()',
        syntax: '.reset("estructura") / .restart("estructura")',
        description: 'En cada evento verdadero de la estructura indicada, reset() vuelve el patrón al inicio del ciclo actual, y restart() lo vuelve al ciclo 0 — como pulsar Play de nuevo, pero solo en ese instante.',
        examples: [{ label: 'Reiniciar según un patrón euclidiano', code: 's("[<bd lt> sd]*2, hh*8").reset("<x@3 x(5,8)>")' }],
      },
      {
        name: '.revv()',
        syntax: '.revv()',
        description: 'Invierte el orden de los ciclos del patrón completo, a diferencia de .rev(), que invierte el orden de los eventos dentro de cada ciclo por separado.',
        examples: [{ label: 'Comparar con rev()', code: 'note("<[c d] [e g]>").revv()' }],
      },
      {
        name: '.ribbon()',
        syntax: '.ribbon(offset, ciclos)',
        description: 'Toma un fragmento del patrón (empezando en el ciclo offset, con la duración indicada) y lo pone en bucle indefinidamente — como recortar un trozo de una cinta infinita y repetirlo.',
        examples: [{ label: 'Bucle de un fragmento aleatorio', code: 'n(irand(8).segment(4)).scale("c:pentatonic").ribbon(1337, 2)' }],
      },
      {
        name: '.scramble() / .shuffle()',
        syntax: '.scramble(n) / .shuffle(n)',
        description: 'Dividen el patrón en n partes y las reproducen en orden aleatorio. shuffle() toca cada parte exactamente una vez por ciclo; scramble() elige con repetición, así que una parte puede sonar varias veces (o ninguna) en el mismo ciclo.',
        examples: [{ label: 'Melodía barajada', code: 'note("c d e f").sound("piano").shuffle(4)' }],
      },
      {
        name: 'seqPLoop()',
        syntax: 'seqPLoop([inicio, fin, patrón], ...)',
        description: 'Como arrange(), organiza varios patrones a lo largo de varios ciclos, pero en vez de dar una duración se da un ciclo de inicio y de fin para cada uno — permitiendo que se solapen entre sí.',
        examples: [{ label: 'Dos patrones solapados', code: 'seqPLoop(\n  [0, 2, "bd(3,8)"],\n  [1, 3, "cp(3,8)"]\n).sound()' }],
      },
      {
        name: '.set()',
        syntax: 'a.set(b)',
        description: 'Combina dos patrones de controles: lo que está definido en b tiene prioridad, y se rellena con a lo que falte en b. Es la operación inversa de .keep().',
        examples: [{ label: 'El sonido del segundo patrón gana', code: 'note("c a f e").s("sine").set(s("triangle"))' }],
      },
      {
        name: 'silence',
        syntax: 'silence',
        description: 'No suena nada — el valor equivalente a "~" en mini-notación, pero como patrón de JavaScript. Útil como marcador de posición o para silenciar una capa entera.',
        examples: [],
      },
      {
        name: 'slowcatPrime()',
        syntax: 'slowcatPrime(p1, p2, ...)',
        description: 'Como cat()/slowcat() (un patrón distinto por ciclo), pero sin "saltarse" ciclos cuando se combina con otras transformaciones de tiempo — un comportamiento más estricto pensado para casos donde cat() da resultados inesperados.',
        examples: [],
      },
      {
        name: '.sub()',
        syntax: '.sub(cantidad)',
        description: 'Como .add(), pero resta en vez de sumar.',
        examples: [{ label: 'Transposición descendente', code: 'n("0 2 4".sub("<0 1 2 3>")).scale("C4:minor")' }],
      },
      {
        name: '.swing() / .swingBy()',
        syntax: '.swing(subdivisión) / .swingBy(cantidad, subdivisión)',
        description: 'Dividen cada ciclo en n partes y retrasan los eventos de la segunda mitad de cada parte, creando un groove "shuffle"/swing. swing() es swingBy(1/3, n): con 0 no pasa nada, con 0.5 el retraso es de media nota, y con 1 vuelve a no notarse.',
        examples: [{ label: 'Hi-hats con swing', code: 's("hh*8").swing(4)' }],
      },
      {
        name: '.within()',
        syntax: '.within(inicio, fin, fn)',
        description: 'Aplica una función solo a la parte del ciclo comprendida entre inicio y fin (ambos entre 0 y 1), dejando el resto del patrón sin tocar.',
        examples: [{ label: 'Invertir solo la segunda mitad', code: 'note("c d e f g a b c5").within(0.5, 1, rev)' }],
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
      {
        name: 'berlin',
        syntax: 'berlin',
        description:
          'Ruido continuo "berlin" (como el ruido Perlin, pero basado en ondas de sierra en vez de curvas suaves) — pensado como broma por sus creadores, pero resultó ser un generador orgánico útil. Rango 0 a 1.',
        examples: [{ label: 'Arpegios ascendentes con ruido berlin', code: 'n("0!16".add(berlin.fast(4).mul(14))).scale("d:minor")' }],
      },
      {
        name: 'cosine / cosine2',
        syntax: 'cosine | cosine2',
        description: 'Onda coseno continua — como sine pero desfasada 90°. cosine da salida entre 0 y 1; cosine2 entre -1 y 1.',
        examples: [{ label: 'Seno y coseno combinados', code: 'n(stack(sine,cosine).segment(16).range(0,15)).scale("C:minor")' }],
      },
      {
        name: '.fromBipolar() / .toBipolar()',
        syntax: '.fromBipolar() / .toBipolar()',
        description: 'Convierten entre señal bipolar (-1 a 1, como sine2) y unipolar (0 a 1): fromBipolar() pasa de bipolar a unipolar, toBipolar() hace la conversión contraria.',
        examples: [],
      },
      {
        name: 'time',
        syntax: 'time',
        description: 'Señal continua que da el tiempo actual en ciclos — el reloj interno de Strudel expuesto como patrón, para construir tus propias señales a partir de él.',
        examples: [],
      },
      {
        name: 'isaw / isquare / itri (+ variantes "2")',
        syntax: 'isaw | isquare | itri | isaw2 | isquare2 | itri2',
        description: 'Versiones invertidas de saw, square y tri: la forma de onda va al revés en el tiempo (empieza alto y termina bajo en vez de al contrario). Igual que sus originales, las variantes sin sufijo dan salida 0 a 1, y las que terminan en "2" dan -1 a 1.',
        examples: [{ label: 'Melodía con sierra invertida', code: 'n(itri.segment(8).range(0,7)).scale("C:minor")' }],
      },
      {
        name: '.range2() / .rangex()',
        syntax: '.range2(min, max) / .rangex(min, max)',
        description: 'Variantes de .range(): range2() reescala una señal bipolar (-1 a 1, como sine2) en vez de unipolar; rangex() reescala siguiendo una curva exponencial en vez de lineal, útil para frecuencias (donde una escala lineal no "suena" uniforme).',
        examples: [{ label: 'Filtro con curva exponencial', code: 's("[bd sd]*2,hh*8").cutoff(sine.rangex(500,4000))' }],
      },
      {
        name: '.segment() / .seg()',
        syntax: '.segment(n)',
        description: 'Muestrea una señal continua (como sine o rand) a un ritmo de n veces por ciclo, convirtiéndola en un patrón discreto de n eventos — el paso imprescindible para poder usar una señal continua como si fueran notas o valores separados.',
        examples: [{ label: 'De onda continua a notas discretas', code: 'note(saw.range(40,52).segment(24))' }],
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
      {
        name: '.choose2()',
        syntax: '.choose2(a, b, ...)',
        description: 'Como choose(), pero el patrón sobre el que se llama debe estar en el rango -1..1 en vez de 0..1 — útil con señales bipolares como sine2.',
        examples: [{ label: 'Elegir con una señal bipolar', code: 'sine2.choose2("bd", "hh", "sd").s().fast(8)' }],
      },
      {
        name: 'chooseCycles() / randcat()',
        syntax: 'chooseCycles(p1, p2, ...)',
        description:
          'Elige uno de los patrones al azar en cada ciclo completo (a diferencia de choose(), que elige evento a evento). Equivale a usar "|" entre alternativas dentro de la mini-notación.',
        examples: [
          { label: 'Una caja distinta cada ciclo', code: 'chooseCycles("bd", "hh", "sd").s().fast(8)' },
          { label: 'Notación equivalente con |', code: 's("bd | hh | sd").fast(8)' },
        ],
      },
      {
        name: '.chooseWith() / .chooseInWith()',
        syntax: '.chooseWith(patrón, [opciones])',
        description:
          'Elige de una lista de valores usando un patrón de números (0..1) que tú controlas, en vez de aleatoriedad — por ejemplo una señal como sine. chooseInWith toma además la estructura rítmica del valor elegido en vez de la del patrón selector.',
        examples: [{ label: 'Elegir sonido según una onda', code: 'note("c2 g2!2 d2 f1").s(chooseWith(sine.fast(2), ["sawtooth", "triangle", "bd:6"]))' }],
      },
      {
        name: 'brand() / brandBy()',
        syntax: 'brand | brandBy(probabilidad)',
        description: 'Señal continua binaria (0 o 1) generada al azar. brandBy() permite fijar la probabilidad de que salga 1 (por defecto 50%).',
        examples: [{ label: 'Panorama aleatorio entre izquierda y derecha', code: 's("hh*10").pan(brand)' }],
      },
      {
        name: 'irand()',
        syntax: 'irand(n)',
        description: 'Señal continua de enteros aleatorios entre 0 y n-1 — como rand() pero con valores enteros en vez de decimales.',
        examples: [{ label: 'Notas de escala elegidas al azar', code: 'n(irand(8)).struct("x x*2 x x*3").scale("C:minor")' }],
      },
      {
        name: 'seed()',
        syntax: '.seed(n)',
        description: 'Cambia la semilla de los generadores aleatorios. Por defecto la aleatoriedad depende del tiempo, así que dos patrones en el mismo instante sacan los mismos valores; con una semilla distinta por capa se puede hacer que, por ejemplo, dos .degrade() quiten eventos distintos.',
        examples: [{ label: 'Dos degrade() independientes', code: '$: s("hh*4").degrade();\n$: s("bd*4").degrade().seed(1);' }],
      },
      {
        name: '.undegrade() / .undegradeBy()',
        syntax: '.undegrade() / .undegradeBy(0-1)',
        description: 'Lo inverso de .degrade()/.degradeBy(): deja pasar exactamente los eventos que degrade() habría quitado, y quita los que degrade() habría dejado — útil para dividir un patrón en dos capas complementarias.',
        examples: [{ label: 'Dos capas complementarias', code: 's("hh*10").layer(\n  x => x.degrade().pan(0),\n  x => x.undegrade().pan(1)\n)' }],
      },
      {
        name: 'wchoose() / wchooseCycles()',
        syntax: 'wchoose([valor,peso], ...)',
        description: 'Como choose()/chooseCycles(), pero ponderando la probabilidad de cada opción con un peso — cuanto mayor el peso relativo, más probable que salga esa opción.',
        examples: [{ label: 'Sonido ponderado', code: 'note("c2 g2!2 d2 f1").s(wchoose(["sine",10], ["triangle",1], ["bd:6",1]))' }],
      },
      {
        name: 'useRNG()',
        syntax: "useRNG('legacy' | 'precise')",
        description: 'Elige el algoritmo generador de números aleatorios que usa Strudel por debajo. "legacy" es el histórico (por defecto); "precise" es más preciso estadísticamente pero puede cambiar sutilmente cómo suenan patrones ya escritos.',
        examples: [],
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
      {
        name: '.cpm()',
        syntax: '.cpm(ciclos por minuto)',
        description: 'Fija el tempo de un patrón concreto en ciclos por minuto, igual que setcpm() pero solo para esa capa en vez de globalmente.',
        examples: [{ label: 'Una capa a 90 ciclos por minuto', code: 's("<bd sd>,hh*2").cpm(90) // = 90 bpm' }],
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
      {
        name: '.color() / .colour()',
        syntax: '.color("nombre o #hex")',
        description: 'Fija el color con el que se resalta ese evento en visualizadores como .pianoroll() o el resaltado de la mini-notación.',
        examples: [],
      },
      {
        name: '.label()',
        syntax: '.label("texto")',
        description: 'Fija el texto que se muestra para ese evento en .pianoroll().',
        examples: [],
      },
      {
        name: '.log() / .logValues()',
        syntax: '.log()',
        description: 'Escriben en la consola (visible en el panel lateral) el evento completo (.log()) o solo sus valores (.logValues()) cada vez que suena — útil para depurar qué está pasando dentro de un patrón.',
        examples: [{ label: 'Ver los valores en consola', code: 's("bd sd").gain("0.25 0.5 1").n("2 1 0").logValues()' }],
      },
      {
        name: '.markcss()',
        syntax: ".markcss('propiedad:valor')",
        description: 'Aplica CSS propio al resaltado de un evento en el editor (usa comillas simples dentro).',
        examples: [{ label: 'Subrayar las notas resaltadas', code: "note(\"c a f e\").markcss('text-decoration:underline')" }],
      },
      {
        name: '._pitchwheel()',
        syntax: '._pitchwheel()',
        description: 'Dibuja un círculo de afinación (pitch circle) que visualiza las frecuencias dentro de una octava — útil para ver de un vistazo qué notas de la escala/afinación se están usando.',
        examples: [{ label: 'Círculo cromático', code: 'n("0 .. 12").scale("C:chromatic").s("sawtooth").lpf(500)._pitchwheel()' }],
      },
      {
        name: 'slider()',
        syntax: 'slider(inicial, min, max, paso)',
        description: 'Muestra un control deslizante (slider) en el editor con el que se puede manipular un valor a mano, en tiempo real, en vez de tener que editar el código.',
        examples: [],
      },
      {
        name: '._spiral()',
        syntax: '._spiral({ opciones })',
        description: 'Visualiza el patrón como una espiral que gira con el tiempo, en vez de desplazarse en línea recta como .pianoroll().',
        examples: [{ label: 'Espiral con cabezal fijo', code: "note(\"c2 a2 eb2\").euclid(5,8).s('sawtooth').lpenv(4).lpf(300)._spiral({ steady: .96 })" }],
      },
      {
        name: '.wordfall()',
        syntax: '.wordfall({ opciones })',
        description: 'Como .pianoroll(), pero en vertical y con las etiquetas de texto de cada evento en vez de barras de color — admite las mismas opciones que pianoroll.',
        examples: [],
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
      {
        name: '.plyForEach() / .plyWith()',
        syntax: '.plyForEach(n, (patrón, i) => ...) / .plyWith(n, patrón => ...)',
        description: 'Como .ply(), repiten cada evento n veces, pero aplicando una función a cada repetición — plyForEach() recibe también el índice de la repetición (como .echoWith()); plyWith() solo recibe el patrón.',
        examples: [{ label: 'Cada repetición transportada más', code: '"<0 [2 4]>".plyForEach(4, (p,n) => p.add(n*2)).scale("C:minor").note()' }],
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
      {
        name: '.extend()',
        syntax: '.extend(factor)',
        description: 'Similar a .fast() en que aumenta la densidad, pero también aumenta el número de pasos en la misma proporción — a diferencia de fast(), que comprime el contenido dentro del mismo número de pasos.',
        examples: [{ label: 'Comparar con stepcat', code: 'stepcat(\n  sound("bd bd - cp").extend(2),\n  sound("bd - sd -")\n).pace(8)' }],
      },
      {
        name: '.drop()',
        syntax: '.drop(n)',
        description: 'Elimina n pasos del patrón: un número positivo los quita del principio, uno negativo del final.',
        examples: [{ label: 'Quitar el primer paso', code: '"tha dhi thom nam".drop("1").sound().bank("mridangam")' }],
      },
      {
        name: '.grow()',
        syntax: '.grow(n)',
        description: 'Hace crecer el patrón progresivamente, paso a paso, hasta llegar al patrón completo — un número negativo lo hace crecer desde el final en vez del principio.',
        examples: [{ label: 'Crecimiento progresivo', code: '"tha dhi thom nam".grow("1").sound().bank("mridangam")' }],
      },
      {
        name: '.replicate()',
        syntax: '.replicate(factor)',
        description: 'Muy parecido a .extend(): aumenta la densidad como .fast(), pero también el número de pasos en la misma proporción.',
        examples: [{ label: 'Comparar con stepcat', code: 'stepcat(\n  sound("bd bd - cp").replicate(2),\n  sound("bd - sd -")\n).pace(8)' }],
      },
      {
        name: '.shrink()',
        syntax: '.shrink(n)',
        description: 'Lo contrario de .grow(): encoge el patrón progresivamente, paso a paso, hasta quedarse sin nada — un número negativo lo encoge desde el final en vez del principio.',
        examples: [{ label: 'Encogimiento progresivo', code: '"tha dhi thom nam".shrink("1").sound().bank("mridangam")' }],
      },
      {
        name: '.stepalt()',
        syntax: '.stepalt([lista], patrón, ...)',
        description: 'Como .stepcat(), pero cuando un argumento es una lista, el patrón resultante va alternando entre los elementos de esa lista en sucesivas repeticiones, en vez de concatenarlos todos de una vez.',
        examples: [{ label: 'Alternancia entre elementos de una lista', code: 'stepalt(["bd cp", "mt"], "bd").sound()\n// lo mismo que "bd cp bd mt bd".sound()' }],
      },
      {
        name: '.tour()',
        syntax: '.tour(p1, p2, ...)',
        description: 'Inserta el patrón original en una lista de patrones: la primera vez se coloca al final, y en repeticiones sucesivas se va moviendo hacia atrás en la lista — todo dentro de un único ciclo repartido en pasos, por lo que conviene fijar el número de pasos con .pace().',
        examples: [{ label: 'Recorrido por variaciones', code: '"[c g]".tour("e f", "e f g", "g f e c").note().sound("folkharp").pace(8)' }],
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
      {
        name: '.ccn() / .ccv() / .control()',
        syntax: '.ccn(numero).ccv(valor)',
        description:
          'Envían mensajes MIDI CC (control change) por separado: ccn fija el número de controlador (0-127) y ccv su valor (0-127). .control() hace lo mismo pasando ambos números a la vez.',
        examples: [],
      },
      {
        name: 'defaultmidimap()',
        syntax: 'defaultmidimap({ control: numeroCC })',
        description:
          'Configura a qué número de controlador MIDI CC se traduce cada control de Strudel (por ejemplo lpf) cuando se usa .midi(), sin tener que definir un "midimap" distinto cada vez.',
        examples: [{ label: 'Mapear lpf al CC 74 por defecto', code: 'defaultmidimap({ lpf: 74 })\n$: note("c a f e").midi();\n$: lpf(sine.slow(4).segment(16)).midi();' }],
      },
      {
        name: 'csoundm()',
        syntax: '.csoundm()',
        description:
          'Envía cada evento a Csound (un lenguaje de síntesis externo) traducido a sus "pfields" con semántica MIDI: instrumento, tiempo, duración, nota y velocidad MIDI, más los controles de Strudel como texto adicional.',
        examples: [],
      },
      {
        name: '.channel() / .channels()',
        syntax: '.channel(n) / .channels("a:b")',
        description:
          '.channel() elige a qué canal se envía el patrón; .channels() (alias ch) permite fijar directamente los canales de salida de la interfaz de audio — por ejemplo, enviar una capa al canal 3-4 de una tarjeta multicanal.',
        examples: [{ label: 'Enviar a canales 3 y 4', code: 'note("e a d b g").channels("3:4")' }],
      },
      {
        name: '.midichan() / .midiport()',
        syntax: '.midichan(canal).midiport(puerto)',
        description: 'Fijan, respectivamente, el canal MIDI (0-15) y el índice de puerto de salida usados por .midi().',
        examples: [{ label: 'Canal 1 explícito', code: 'note("c4").midichan(1).midi()' }],
      },
      {
        name: '.midibend() / .miditouch()',
        syntax: '.midibend(-1 a 1) / .miditouch(0 a 1)',
        description: 'Envían mensajes MIDI de pitch bend (midibend) o de aftertouch/presión (miditouch) junto con las notas.',
        examples: [{ label: 'Pitch bend con un LFO', code: 'note("c4").midibend(sine.slow(4).range(-0.4,0.4)).midi()' }],
      },
      {
        name: 'midicmd()',
        syntax: 'midicmd("comando")',
        description: 'Envía un comando MIDI de transporte crudo, como el reloj MIDI o start/stop — útil para sincronizar Strudel con hardware o software externo.',
        examples: [{ label: 'Reloj MIDI y start/stop', code: 'midicmd("clock*48,<start stop>/2").midi()' }],
      },
      {
        name: 'midikeys()',
        syntax: "await midikeys('nombre-del-dispositivo')",
        description: 'Abre un puerto MIDI de entrada para recibir notas de un teclado MIDI externo, devolviendo una función que se puede usar como fuente de patrón.',
        examples: [{ label: 'Tocar un synth con un teclado MIDI', code: "const kb = await midikeys('Arturia KeyStep 32')\nkb().s(\"tri\").lpf(80).room(2)" }],
      },
      {
        name: 'midimaps()',
        syntax: "midimaps({ nombre: { control: numeroCC } })",
        description: 'Registra uno o varios mapas de controlador MIDI con nombre (a diferencia de defaultmidimap(), que fija solo el mapa por defecto), para elegir entre ellos con .midimap("nombre").',
        examples: [{ label: 'Mapa propio para lpf', code: "midimaps({ mymap: { lpf: 74 } })\n$: note(\"c a f e\").lpf(sine.slow(4)).midimap('mymap').midi()" }],
      },
      {
        name: '.nrpnn() / .nrpv()',
        syntax: '.nrpnn(numero).nrpv(valor)',
        description: 'Envían mensajes MIDI NRPN (parámetro no registrado): nrpnn fija el número de parámetro y nrpv su valor — un mecanismo MIDI más amplio que los CC normales, usado por algunos sintetizadores.',
        examples: [{ label: 'NRPN combinado', code: 'note("c4").nrpnn("1:8").nrpv("123").midichan(1).midi()' }],
      },
      {
        name: '.oschost() / .oscport()',
        syntax: ".oschost('host').oscport(puerto)",
        description: 'Fijan el host y el puerto de destino para .osc() (por defecto localhost:57120) — requieren el puente `npx @strudel/osc` en marcha.',
        examples: [{ label: 'Destino OSC explícito', code: "note(\"c4\").oschost('127.0.0.1').oscport(57120).osc()" }],
      },
      {
        name: 'dough() / initDough()',
        syntax: 'await initDough()',
        description: 'Usa "dough" como motor de audio alternativo en vez del motor por defecto (superdough). initDough() lo inicializa por adelantado si se quiere esperar (con await) a que esté listo antes de que empiece el patrón.',
        examples: [],
      },
      {
        name: 'K()',
        syntax: '.K(expresiónKabelsalat)',
        description: 'Integra Kabelsalat (otro lenguaje de live coding, para síntesis modular tipo patch-cable) dentro de un patrón de Strudel, como fuente de sonido o como efecto — herramienta avanzada para quien ya conoce Kabelsalat.',
        examples: [],
      },
      {
        name: '.progNum()',
        syntax: '.progNum(programa)',
        description: 'Envía un mensaje MIDI de cambio de programa (program change), para elegir un instrumento/patch en un sintetizador o módulo externo.',
        examples: [{ label: 'Cambiar de programa MIDI', code: 'note("c4").progNum(10).midichan(1).midi()' }],
      },
      {
        name: '.sysex() / .sysexdata() / .sysexid()',
        syntax: '.sysex(id, datos)',
        description: 'Envían mensajes MIDI System Exclusive (sysex), específicos de cada fabricante de hardware — sysex() los manda de una vez con id y datos; sysexid()/sysexdata() permiten fijar cada parte por separado.',
        examples: [{ label: 'Mensaje sysex', code: 'note("c4").sysex(["0x77", "0x01:0x02:0x03:0x04"]).midichan(1).midi()' }],
      },
    ],
  },
  {
    id: 'sensors',
    title: 'Sensores del dispositivo',
    summary:
      'Señales continuas (0 a 1) leídas de los sensores del dispositivo (móvil o portátil) a través del navegador — orientación, aceleración, etc. Requieren permiso del navegador y solo funcionan en dispositivos que tengan esos sensores.',
    entries: [
      {
        name: 'absoluteOrientationAlpha / Beta / Gamma',
        syntax: 'absoluteOrientationAlpha | absoluteOrientationBeta | absoluteOrientationGamma',
        description:
          'Orientación absoluta del dispositivo (respecto al norte magnético) en sus tres ejes, como señal continua entre 0 y 1. Alpha = rotación (compás), Beta = inclinación adelante/atrás, Gamma = inclinación izquierda/derecha. Alias cortos: absOriA/absOriZ, absOriB/absOriX, absOriG/absOriY.',
        examples: [{ label: 'Melodía controlada por el compás del dispositivo', code: 'n(absoluteOrientationAlpha.segment(4).range(0,7)).scale("C:minor")' }],
      },
      {
        name: 'accelerationX / Y / Z',
        syntax: 'accelerationX | accelerationY | accelerationZ',
        description: 'Valor del acelerómetro del dispositivo en cada eje, como señal continua entre 0 y 1. Alias cortos: accX, accY, accZ.',
        examples: [{ label: 'Melodía controlada por el movimiento', code: 'n(accelerationX.segment(4).range(0,7)).scale("C:minor")' }],
      },
      {
        name: 'gravityX / Y / Z',
        syntax: 'gravityX | gravityY | gravityZ',
        description: 'Componente de la gravedad detectada por el dispositivo en cada eje, como señal continua entre 0 y 1. Alias cortos: gravX, gravY, gravZ.',
        examples: [{ label: 'Melodía controlada por la inclinación', code: 'n(gravityX.segment(4).range(0,7)).scale("C:minor")' }],
      },
      {
        name: 'orientationAlpha / Beta / Gamma',
        syntax: 'orientationAlpha | orientationBeta | orientationGamma',
        description: 'Orientación del dispositivo (sin referencia al norte magnético, a diferencia de absoluteOrientation) en sus tres ejes, como señal continua entre 0 y 1. Alias cortos: oriA/oriZ, oriB/oriX, oriG/oriY.',
        examples: [{ label: 'Melodía controlada por la inclinación', code: 'n(orientationAlpha.segment(4).range(0,7)).scale("C:minor")' }],
      },
      {
        name: 'mousex / mousey',
        syntax: 'mousex | mousey',
        description: 'Posición del ratón en pantalla, como señal continua entre 0 y 1 en cada eje.',
        examples: [{ label: 'Melodía controlada por el ratón', code: 'n(mousex.segment(4).range(0,7)).scale("C:minor")' }],
      },
      {
        name: 'keyDown()',
        syntax: 'keyDown("Tecla" | "TeclaA:TeclaB")',
        description: 'Señal booleana que vale verdadero mientras se mantiene pulsada una tecla (o varias combinadas con ":") del teclado del ordenador.',
        examples: [{ label: 'Elegir patrón según la tecla', code: 'keyDown("Control:j").pick([s("bd(5,8)"), s("cp(3,8)")])' }],
      },
      {
        name: 'rotationAlpha / Beta / Gamma',
        syntax: 'rotationAlpha | rotationBeta | rotationGamma',
        description: 'Velocidad de rotación del dispositivo en cada eje, como señal continua entre 0 y 1. Alias cortos: rotA/rotZ, rotB/rotX, rotG/rotY.',
        examples: [{ label: 'Melodía controlada por la rotación', code: 'n(rotationAlpha.segment(4).range(0,7)).scale("C:minor")' }],
      },
      {
        name: '.whenKey()',
        syntax: '.whenKey("Tecla", fn)',
        description: 'Como .when(), pero la condición es que una tecla (o combinación con ":") esté pulsada, en vez de un patrón booleano.',
        examples: [{ label: 'Distintas teclas, distintos efectos', code: 's("bd(5,8)").whenKey("Control:j", x => x.segment(16).color("red")).whenKey("Control:i", x => x.fast(2).color("blue"))' }],
      },
    ],
  },
  {
    id: 'numgen',
    title: 'Generadores de patrones numéricos',
    summary:
      'Funciones que crean patrones de números a partir de una fórmula o de la representación en binario/otra base de un número — útiles para generar ritmos o secuencias de forma programática en vez de escribirlas a mano.',
    entries: [
      {
        name: 'base()',
        syntax: 'base(numero, base, dígitos)',
        description: 'Convierte un número (o patrón de números) a otra base numérica, con un número fijo de dígitos, y expande cada dígito como un evento independiente.',
        examples: [{ label: 'Convertir a base 10 con 3 dígitos', code: '$: note(base("7175 543", 10, 3)).scale("c:major").s("saw")' }],
      },
      {
        name: 'binary() / binaryL() / binaryN() / binaryNL()',
        syntax: 'binary(numero) | binaryN(numero, bits)',
        description:
          'Convierte un número a su representación binaria y la usa como patrón booleano (1/0) — ideal para struct(). binaryN() fija el número de bits (por defecto 16). Las variantes con "L" devuelven una lista en vez de un patrón secuencial.',
        examples: [{ label: 'Ritmo a partir de un número', code: '"hh".s().struct(binary(5))\n// equivale a: "hh".s().struct("1 0 1")' }],
      },
      {
        name: '.ceil()',
        syntax: '.ceil()',
        description: 'Redondea cada valor numérico del patrón hacia arriba (al entero superior).',
        examples: [{ label: 'Redondeo hacia arriba', code: 'note("42 42.1 42.5 43".ceil())' }],
      },
      {
        name: '.div()',
        syntax: '.div(cantidad)',
        description: 'Divide cada valor numérico del patrón entre la cantidad indicada.',
        examples: [],
      },
      {
        name: '.floor()',
        syntax: '.floor()',
        description: 'Redondea cada valor numérico del patrón hacia abajo (al entero inferior).',
        examples: [{ label: 'Redondeo hacia abajo', code: 'note("42 42.1 42.5 43".floor())' }],
      },
      {
        name: 'gap()',
        syntax: 'gap(pasos)',
        description: 'No suena nada, pero ocupa el número de pasos indicado — un silencio con "peso" explícito, útil al construir patrones con stepcat()/pace(). Equivale a "~@n" en mini-notación.',
        examples: [{ label: 'Silencio de 3 pasos', code: 'gap(3) // "~@3"' }],
      },
      {
        name: '.invert() / .inv()',
        syntax: '.invert()',
        description: 'Intercambia los 1 y los 0 de un patrón booleano/binario.',
        examples: [{ label: 'Invertir un struct cada 4 ciclos', code: 's("bd").struct("1 0 0 1 0 0 1 0".lastOf(4, invert))' }],
      },
      {
        name: '.mul()',
        syntax: '.mul(factor)',
        description: 'Multiplica cada valor numérico del patrón por el factor indicado.',
        examples: [{ label: 'Convertir a frecuencia', code: '"<1 1.5 [1.66, <2 2.33>]>*4".mul(150).freq()' }],
      },
      {
        name: 'ratio()',
        syntax: 'ratio("a:b, c:d, ...")',
        description: 'Permite escribir divisiones de números con ":" dentro de la mini-notación, devolviendo un patrón de números normales — útil para expresar razones/ratios (por ejemplo armónicos musicales) de forma legible.',
        examples: [{ label: 'Frecuencias como razones', code: 'ratio("1, 5:4, 3:2").mul(110).freq().s("piano")' }],
      },
      {
        name: '.round()',
        syntax: '.round()',
        description: 'Redondea cada valor numérico del patrón al entero más cercano.',
        examples: [{ label: 'Redondeo al más cercano', code: 'n("0.5 1.5 2.5".round()).scale("C:major")' }],
      },
      {
        name: 'run()',
        syntax: 'run(n)',
        description: 'Genera un patrón discreto con los números de 0 a n-1, uno por paso — un atajo para escribir secuencias ascendentes sin teclearlas a mano.',
        examples: [{ label: 'Equivalente a escribir los números a mano', code: 'n(run(4)).scale("C4:pentatonic")\n// n("0 1 2 3").scale("C4:pentatonic")' }],
      },
    ],
  },
  {
    id: 'advanced',
    title: 'Funciones avanzadas e internas',
    summary:
      'Utilidades de bajo nivel para quien quiere ir más allá de lo habitual: modulación entre pistas mediante buses, limpiar variables propias, o medir la duración de eventos en ciclos.',
    entries: [
      {
        name: 'clearScope()',
        syntax: 'clearScope()',
        description: 'Borra todas las variables y funciones que hayas definido tú mismo en el código (por ejemplo con let o function) — útil para "reiniciar" ese estado sin recargar la página.',
        examples: [],
      },
      {
        name: '.bmod()',
        syntax: '.bmod({ bus: n, control: "parametro" })',
        description:
          'Modula un parámetro con la señal enviada por otra capa a través de un "bus" (declarado con .bus(n) en la capa emisora) — permite que una pista module el filtro, el volumen, etc. de otra en tiempo real.',
        examples: [],
      },
      {
        name: 'cyclesPer',
        syntax: 'cyclesPer',
        description:
          'Señal que, combinada con la estructura de otro patrón (con .struct() o similar), da la duración de cada evento medida en ciclos por evento — el recíproco de per()/perCycle(). Útil para que la duración de una nota influya en otro parámetro, como su tono.',
        examples: [{ label: 'Notas cortas más agudas', code: 'sound("saw saw [saw saw] saw").note(cyclesPer.range(50, 100))' }],
      },
      {
        name: 'env()',
        syntax: '.env({ attack, decay, sustain, release, depth, control })',
        description:
          'Configura una envolvente genérica sobre cualquier control (por defecto, el último que se haya llamado antes de .env()), con más parámetros que .adsr(): profundidad, curvas de ataque/decay/release independientes, y un id para poder referenciarla y actualizarla más tarde (por ejemplo dentro de un .sometimes()).',
        examples: [{ label: 'Envolvente sobre el filtro', code: 's("saw").note("F1").lpf(500).env({ a: 1 })' }],
      },
      {
        name: '.filter() / .filterValues() / .filterWhen()',
        syntax: '.filter(hap => condición)',
        description:
          'Filtran eventos del patrón según una función arbitraria de JavaScript: .filter() recibe el evento (Hap) completo, .filterValues() solo su valor, y .filterWhen() solo su tiempo de inicio. Permiten lógica que la mini-notación no puede expresar.',
        examples: [{ label: 'Quedarse solo con los hi-hats', code: 's("hh!7 oh").filter(hap => hap.value.s === \'hh\')' }],
      },
      {
        name: 'drawLine()',
        syntax: 'drawLine(patrón, caracteres)',
        description:
          'Herramienta de depuración: dibuja el patrón como una cadena de texto en la consola, un carácter por franja de tiempo ("|" separa ciclos, "-" mantiene el valor anterior, "." es silencio). Solo funciona bien con valores de un único carácter.',
        examples: [{ label: 'Ver la estructura en la consola', code: 'const line = drawLine("0 [1 2 3]", 10) // |0--123|0--123\nconsole.log(line)\nsilence' }],
      },
      {
        name: 'lfo()',
        syntax: '.lfo({ control, rate, depth, shape, ... })',
        description: 'Configura un LFO genérico sobre cualquier control (por defecto, el último llamado antes de .lfo()) — como .env() pero para modulación cíclica continua en vez de una envolvente de un solo disparo. Admite un id para poder actualizarlo después, por ejemplo dentro de .sometimes().',
        examples: [{ label: 'LFO sobre el filtro', code: 's("saw").note("F1").lpf(500).lfo()' }],
      },
      {
        name: 'parray()',
        syntax: 'parray([patrón1, patrón2, ...])',
        description: 'Convierte una lista de patrones en un único patrón cuyos valores son, en cada instante, la lista de sus valores — una herramienta de bajo nivel para combinar patrones como datos.',
        examples: [],
      },
      {
        name: 'per() / perCycle()',
        syntax: 'per',
        description: 'Señal que, combinada con la estructura de otro patrón, da el número de eventos por ciclo (la inversa de cyclesPer). Útil para que la duración de una nota influya en otro parámetro, como la cantidad de distorsión.',
        examples: [{ label: 'Eventos más cortos, más distorsión', code: 'n("0 0*2 0 0*2 0 [0 0 0]@2").sound("bd").distort(per.div(2))' }],
      },
      {
        name: 'onTriggerTime()',
        syntax: '.onTriggerTime(hap => {...})',
        description: 'Ejecuta una función de JavaScript justo cuando suena cada evento — útil para depurar o para disparar efectos externos. Usa un timeout del navegador, así que no es preciso a nivel de muestra de audio.',
        examples: [{ label: 'Registrar cada evento en la consola', code: 's("bd!8").onTriggerTime((hap) => {console.log(hap)})' }],
      },
      {
        name: 'perx',
        syntax: 'perx',
        description: 'Como per()/cyclesPer, mide la duración de los eventos según la estructura de otro patrón, pero en una curva exponencial en vez de lineal: cada vez que la duración se reduce a la mitad, el valor sube en 1.',
        examples: [],
      },
      {
        name: 'register()',
        syntax: "register('nombre', (arg, pat) => pat.transformación)",
        description: 'Define un método nuevo para patrones, que queda disponible como .nombre() sobre cualquier patrón (y también como función independiente) — la forma de extender Strudel con tus propias funciones reutilizables.',
        examples: [{ label: 'Un filtro que reacciona a la velocity', code: "const vlpf = register('vlpf', (freq, pat) => pat.fmap((v) => ({...v, cutoff: freq * (v.velocity ?? 1) })))\ns(\"saw\").seg(8).velocity(rand).vlpf(800)" }],
      },
      {
        name: 'setDefaultJoin()',
        syntax: "setDefaultJoin('in' | 'out' | 'mix' | 'squeeze' | ...)",
        description: 'Cambia globalmente el método de alineación por defecto al combinar dos patrones (ver el apartado sobre .add.in/.out/.mix/.squeeze) — normalmente es "in", pero se puede cambiar a "out" o "mix" para que la estructura del patrón derecho (o de ambos) mande en vez de la del izquierdo.',
        examples: [{ label: 'Cambiar el método por defecto', code: "setDefaultJoin('mix')\ns(\"saw\").vel(\"1 0.5\").note(\"F A C E\").delay(\"0 0.2 0.3\")" }],
      },
      {
        name: 'setGainCurve()',
        syntax: 'setGainCurve(x => ...)',
        description: 'Sustituye la curva con la que .gain() convierte sus valores en volumen real — por defecto es exponencial; se puede cambiar por una cuadrática, lineal, etc.',
        examples: [{ label: 'Curva de ganancia cuadrática', code: 'setGainCurve((x) => x * x)\ns("bd*4").gain(0.5)' }],
      },
      {
        name: 'setMaxPolyphony()',
        syntax: 'setMaxPolyphony(n)',
        description: 'Limita cuántas notas pueden sonar a la vez (128 por defecto). Al superar el límite, las notas más antiguas que siguen sonando por su release se van cortando primero.',
        examples: [{ label: 'Limitar a 4 voces', code: 'setMaxPolyphony(4)\nn(irand(24).seg(8)).scale("C#3:minor").room(1).release(4).gain(0.5)' }],
      },
      {
        name: '.tag()',
        syntax: ".tag('etiqueta')",
        description: 'Etiqueta cada evento con un identificador propio, consultable después con hap.hasTag(\'etiqueta\') dentro de .filter() u otras funciones — útil para marcar y luego seleccionar solo ciertos eventos generados dinámicamente.',
        examples: [{ label: 'Marcar y filtrar eventos alterados', code: 's("saw!16").note("F1").when(rand.gte(0.5), x => x.transpose("12").tag(\'altered\')).when("<0 1>", x => x.filter((hap) => hap.hasTag(\'altered\')))' }],
      },
      {
        name: '.withValue() / .fmap()',
        syntax: '.withValue(v => nuevoValor)',
        description: 'Aplica una función de JavaScript directamente al valor de cada evento del patrón, devolviendo un patrón nuevo — la forma más genérica de transformar los datos de un patrón cuando ningún método existente hace exactamente lo que necesitas.',
        examples: [{ label: 'Sumar 10 a cada valor', code: '"0 1 2".withValue(v => v + 10).log()' }],
      },
    ],
  },
];
