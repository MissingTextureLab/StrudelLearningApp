import type { Lesson } from '../types';

export const lessons: Lesson[] = [
  {
    id: 'getting-started',
    order: 0,
    title: '0. Qué es el live coding',
    concept: [
      'Strudel es un puerto en JavaScript de TidalCycles: un lenguaje de patrones para escribir música en vivo (live coding). No es un DAW ni un secuenciador visual — es código que se evalúa mientras suena.',
      'La unidad de tiempo fundamental es el ciclo (cycle). Todo lo que escribes dentro de una cadena de mini-notación (las comillas) se reparte dentro de un ciclo, sin importar cuántos eventos metas. Un ciclo dura, por defecto, 2 segundos — eso lo controla el tempo global (cps / cpm), no la cantidad de eventos.',
      'El flujo de trabajo es: escribes o modificas código, lo evalúas (Ctrl+Enter o Alt+Enter), y el patrón que estaba sonando se sustituye por el nuevo sin cortar el ciclo — esto es lo que hace que "vivas" dentro del código mientras suena.',
      'Todo en Strudel es una expresión JavaScript encadenable: una función como s("bd sd") devuelve un Patrón, y sobre ese patrón puedes seguir llamando métodos con .metodo() para transformarlo.',
    ],
    examples: [
      { label: 'Un patrón mínimo', code: 's("bd sd bd sd, hh*8")' },
    ],
    exercises: [],
  },
  {
    id: 'first-sounds',
    order: 1,
    title: '1. Primeros sonidos',
    concept: [
      '`sound("nombre")` (o su alias `s()`) reproduce un sample por su nombre. Hay sonidos de batería con abreviaturas: bd (bombo), sd (caja), rim (rimshot), hh (hi-hat cerrado), oh (hi-hat abierto), lt/mt/ht (toms), rd (ride), cr (crash).',
      'Dentro de la mini-notación (la cadena entre comillas), los sonidos separados por espacio se reparten equitativamente dentro de un ciclo — 4 sonidos = 4 corcheas, 8 sonidos = 8 semicorcheas, etc. No cambias el tempo añadiendo eventos, cambias la subdivisión.',
      'Símbolos clave que ya puedes usar: `~` o `-` para silencio, `*n` para repetir/acelerar un elemento n veces dentro de su hueco, `[ ]` para anidar una subsecuencia en el hueco de un solo evento (y `[[ ]]` para anidar más), y `,` para tocar varias secuencias en paralelo (capas simultáneas).',
      '`.bank("NombreDeCaja")` cambia el color tímbrico de bd/sd/hh/etc. sin cambiar el patrón — por ejemplo RolandTR909, RolandTR808, RolandTR707, AkaiLinn.',
      '`n("0 1 4 2").sound("jazz")` es la forma equivalente de seleccionar samples numerados dentro de un banco (aquí "jazz") en vez de escribir `jazz:0 jazz:1 jazz:4 jazz:2`.',
      '`setcpm(valor)` fija el tempo global en ciclos por minuto. 30 cpm equivale a 120 bpm en 4/4 (cada ciclo = un compás de 4 negras).',
    ],
    examples: [
      { label: 'Un solo sonido', code: 'sound("casio")' },
      { label: 'Batería básica', code: 'sound("bd hh sd oh")' },
      { label: 'Cambiar la caja (bank)', code: 'sound("bd hh sd oh").bank("RolandTR909")' },
      { label: 'Acelerar con *', code: 'sound("<bd bd hh bd rim bd hh bd>*8")' },
      { label: 'Subsecuencias anidadas', code: 'sound("bd [hh hh] sd [hh bd] bd - [hh sd] cp")' },
      { label: 'Capas en paralelo con ,', code: 'sound("hh hh hh, bd [bd,casio]")' },
      {
        label: 'Groove completo',
        code: 'setcpm(100/4)\nsound("[bd sd]*2, hh*8").bank("RolandTR505")',
      },
      { label: 'Selección numérica con n()', code: 'n("0 1 [4 2] 3*2").sound("jazz")' },
    ],
    exercises: [
      {
        prompt: 'Programa un patrón de 8 hi-hats por ciclo (hh*8) junto con un bombo (bd) en negras (bd*4), en capas paralelas.',
        starterCode: 'sound("")',
        hint: 'Usa la coma para separar capas: sound("bd*4, hh*8")',
      },
      {
        prompt: 'Coge sound("bd hh sd hh") y mete un silencio antes del último hi-hat usando ~, y prueba dos bancos distintos con .bank().',
        starterCode: 'sound("bd hh sd hh")',
        hint: 'sound("bd hh sd ~ hh").bank("RolandTR808")',
      },
      {
        prompt: 'Anida una subdivisión: sustituye el segundo bombo de "bd bd sd bd" por dos golpes rápidos usando corchetes.',
        starterCode: 'sound("bd bd sd bd")',
        hint: 'sound("bd [bd bd] sd bd")',
      },
    ],
  },
  {
    id: 'first-notes',
    order: 2,
    title: '2. Primeras notas',
    concept: [
      '`note()` toca alturas: puedes usar números MIDI (0-127) o notación anglosajona (letra + alteración opcional # o b + octava opcional). `note("c e g b")` y `note("48 52 55 59")` sí son equivalentes en el mismo registro por defecto.',
      '`.sound()` (o `.s()`) encadenado después de `note()` elige el instrumento/timbre. También puedes tocar varios instrumentos en paralelo con `,` dentro del propio string de sonido: `.sound("piano, gm_electric_guitar_muted")`.',
      'Símbolos nuevos frente a la lección anterior: `/n` (fuera de los corchetes) ralentiza un patrón repartiéndolo en n ciclos; `< >` toca un elemento distinto por ciclo (atajo de `[...]/longitud`); `!` repite un evento sin acelerar el patrón (a diferencia de `*`); `@` alarga la duración relativa de un evento (peso).',
      '`.scale("Tónica:modo")` reinterpreta los números de `n()` como grados de una escala, así que cualquier número "cae bien" musicalmente — ya no son notas cromáticas sueltas. Ejemplo: `n("0 2 4").scale("C:minor")`.',
      'Para tocar varios patrones a la vez sin anidar todo en un `stack()`, prefija cada línea con `$:` — cada línea con `$:` es una capa independiente que suena en paralelo.',
    ],
    examples: [
      { label: 'Notas con letras', code: 'note("c e g b").sound("piano")' },
      { label: 'Con octava explícita', code: 'note("c2 e3 g4 b5").sound("piano")' },
      { label: 'Ralentizar con /', code: 'note("[36 34 41 39]/4").sound("gm_acoustic_bass")' },
      { label: 'Un elemento por ciclo con <>', code: 'note("<36 34 41 39>").sound("gm_acoustic_bass")' },
      {
        label: 'Escalas: n() + scale()',
        code: 'setcpm(60)\nn("0 2 4 <[6,8] [7,9]>").scale("C:minor").sound("piano")',
      },
      { label: 'Elongar con @', code: 'note("c@3 eb").sound("gm_acoustic_bass")' },
      { label: 'Repetir sin acelerar con !', code: 'note("c!2 [eb,<g a bb a>]").sound("piano")' },
      {
        label: 'Varias capas con $:',
        code: '$: note("<[c2 c3]*4 [bb1 bb2]*4 [f2 f3]*4 [eb2 eb3]*4>").sound("gm_synth_bass_1").lpf(800)\n$: sound("bd*4, [~ <sd cp>]*2, [~ hh]*4").bank("RolandTR909")',
      },
    ],
    exercises: [
      {
        prompt: 'Toca el acorde de Do mayor (c, e, g) en paralelo con comas dentro de un solo corchete, con sonido "piano".',
        starterCode: 'note("").sound("piano")',
        hint: 'note("[c,e,g]").sound("piano")',
      },
      {
        prompt: 'Usa n() + .scale("D:minor") para tocar los grados 0, 2, 4 y 6 de la escala.',
        starterCode: 'n("0 2 4 6").scale("")',
        hint: 'n("0 2 4 6").scale("D:minor").sound("piano")',
      },
      {
        prompt: 'Combina un bajo (note + sound bass) y una batería en dos capas con $:, cada una en su propia línea.',
        hint: '$: note("<c2 eb2 f2 g2>").sound("gm_acoustic_bass")\n$: sound("bd*4, hh*8")',
      },
    ],
  },
  {
    id: 'first-effects',
    order: 3,
    title: '3. Primeros efectos',
    concept: [
      'Los efectos se encadenan igual que .sound() o .scale(): son métodos que reciben un patrón (o un valor fijo) y devuelven un patrón transformado.',
      '`.lpf(frecuencia)` es el filtro paso-bajo — valores bajos (~200Hz) apagan el sonido, altos (~5000Hz) lo dejan brillante. `.vowel("a e i o")` colorea el timbre imitando vocales.',
      '`.gain(cantidad)` controla el volumen relativo de cada golpe — es la base de la dinámica rítmica: sin variar el gain, todo suena plano.',
      'La envolvente ADSR da forma al volumen en el tiempo de cada nota: `.attack()` (tiempo de subida), `.decay()` (caída tras el pico), `.sustain()` (nivel mientras se mantiene), `.release()` (apagado final). Se puede escribir junto en formato corto: `.adsr("ataque:decay:sustain:release")`.',
      '`.delay()` añade eco — formato corto `"nivel:tiempo:feedback"`. `.room()` añade reverberación (espacio simulado). `.pan()` posiciona el sonido en el campo estéreo (0 = izquierda, 1 = derecha). `.speed()` cambia la velocidad de reproducción del sample (negativo = al revés).',
      'Las señales continuas (`sine`, `saw`, `square`, `tri`, `rand`, `perlin`) no son patrones discretos: son osciladores que puedes usar como LFO para modular cualquier parámetro con `.range(min, max)`, y controlar su velocidad con `.slow()`/`.fast()`. Por ejemplo: `.lpf(sine.range(200,2000).slow(4))` mueve el filtro suavemente en 4 ciclos.',
    ],
    examples: [
      { label: 'Filtro paso-bajo', code: 'note("c3 bb2 f3 eb3").sound("sawtooth").lpf(600)' },
      { label: 'Filtro de vocales', code: 'note("<[c3,g3,e4] [bb2,f3,d4]>").sound("sawtooth").vowel("<a e i o>")' },
      { label: 'Dinámica con gain', code: 'sound("hh*16").gain("[.25 1]*4")' },
      {
        label: 'ADSR explícito',
        code: 'note("c3 bb2 f3 eb3")\n  .sound("sawtooth").lpf(600)\n  .attack(.1).decay(.1).sustain(.25).release(.2)',
      },
      { label: 'ADSR en formato corto', code: 'note("c3 bb2 f3 eb3").sound("sawtooth").lpf(600).adsr(".1:.1:.5:.2")' },
      { label: 'Delay (eco)', code: 'sound("bd rim").bank("RolandTR707").delay(".5")' },
      { label: 'Reverb', code: 'n("<4 [3@3 4] [<2 0> ~@16] ~>").scale("D4:minor").sound("gm_accordion:2").room(2)' },
      { label: 'Panning por evento', code: 'sound("numbers:1 numbers:2 numbers:3 numbers:4").pan("0 0.3 .6 1")' },
      { label: 'Velocidad/reversa', code: 'sound("bd rim [~ bd] rim").speed("<1 2 -1 -2>").room(.2)' },
      { label: 'Modular con una señal (LFO)', code: 'sound("hh*16").lpf(saw.range(500, 2000))' },
    ],
    exercises: [
      {
        prompt: 'Aplica un filtro paso-bajo que alterne entre 300 y 4000 Hz cada dos golpes en un patrón de hi-hats.',
        starterCode: 'sound("hh*8")',
        hint: 'sound("hh*8").lpf("300 4000")',
      },
      {
        prompt: 'Dale forma a un synth con adsr corto: ataque lento (0.2), decay corto, sustain bajo, release largo.',
        starterCode: 'note("c e g").sound("sawtooth")',
        hint: 'note("c e g").sound("sawtooth").adsr("0.2:0.05:0.2:0.6")',
      },
      {
        prompt: 'Modula el gain de un patrón de hats con la señal sine para crear un crescendo/diminuendo continuo.',
        starterCode: 'sound("hh*16")',
        hint: 'sound("hh*16").gain(sine)',
      },
    ],
  },
  {
    id: 'pattern-effects',
    order: 4,
    title: '4. Funciones de patrón',
    concept: [
      'Estas funciones son más propias de Tidal/Strudel que del software musical tradicional: no procesan audio, transforman la estructura temporal del patrón.',
      '`.rev()` invierte el patrón dentro de cada ciclo. `.jux(fn)` divide el patrón en dos copias, una por canal estéreo, y aplica `fn` solo a la copia del canal derecho — típicamente `.jux(rev)`.',
      '`.slow("0.5,1,1.5")` puede tomar varios valores separados por coma para aplicar distintas velocidades a distintas capas del mismo patrón a la vez (equivale a apilar el patrón tres veces con distinto .slow()).',
      '`.add(n)` suma un valor (o patrón de valores) a las notas o grados de escala — muy útil para transportar armonía con capas: `n("0 2 4").add("<0 2>")`.',
      '`.ply(n)` repite cada evento del patrón n veces dentro de su propio hueco, sin reescribir la mini-notación. `.off(tiempo, fn)` crea una copia del patrón desplazada en el tiempo (por ejemplo 1/16 de ciclo) y le aplica una función — clásico para generar deláys "compuestos" o contrapuntos.',
    ],
    examples: [
      { label: 'Reverso', code: 'n("0 1 [4 3] 2 0 2 [~ 3] 4").sound("jazz").rev()' },
      { label: 'Jux (estéreo)', code: 'n("0 1 [4 3] 2 0 2 [~ 3] 4").sound("jazz").jux(rev)' },
      { label: 'Varias velocidades a la vez', code: 'note("c2, eb3 g3 [bb3 c4]").sound("piano").slow("0.5,1,1.5")' },
      {
        label: 'Transportar con add()',
        code: 'n("0 [2 4] <3 5> [~ <4 1>]".add("<0 [0,2,4]>")).scale("C5:minor").sound("gm_xylophone")',
      },
      { label: 'Multiplicar golpes con ply', code: 'sound("hh hh, bd rim [~ cp] rim").bank("RolandTR707").ply(2)' },
      {
        label: 'Eco estructural con off',
        code: 'n("0 [4 <3 2>] <2 3> [~ 1]".off(1/16, x=>x.add(4))).scale("<C5:minor Db5:mixolydian>/2").s("triangle").room(.5)',
      },
    ],
    exercises: [
      {
        prompt: 'Coge un patrón de batería y crea una versión estéreo con jux(rev) para que suene distinto en cada canal.',
        starterCode: 'sound("bd lt [~ ht] mt cp ~ bd hh")',
        hint: 'sound("bd lt [~ ht] mt cp ~ bd hh").jux(rev)',
      },
      {
        prompt: 'Duplica cada golpe de un patrón de hi-hats con ply(3).',
        starterCode: 'sound("hh*4")',
        hint: 'sound("hh*4").ply(3)',
      },
      {
        prompt: 'Crea un contrapunto: usa .off(1/8, x=>x.add(7)) sobre una melodía con escala para añadir una quinta desplazada en el tiempo.',
        starterCode: 'n("0 2 4 6").scale("C:major").sound("piano")',
        hint: 'n("0 2 4 6").scale("C:major").sound("piano").off(1/8, x=>x.add(7))',
      },
    ],
  },
  {
    id: 'recap',
    order: 5,
    title: '5. Recapitulación',
    concept: [
      'Mini-notación: secuencias por espacios, `:n` selecciona sample, `~`/`-` silencio, `[ ]` subsecuencia, `*` acelera, `/` ralentiza, `,` capas paralelas, `< >` alternancia (un elemento por ciclo), `@` elongación (peso), `!` repetición sin acelerar, `?` probabilidad/azar, `(beats,steps,rotación)` ritmos euclidianos.',
      'Sonido: `sound()`/`s()`, `.bank()`, `n()` para seleccionar sample por índice.',
      'Notas: `note()` para altura, `.scale()` para contexto tonal, `$:` para capas paralelas de patrones completos.',
      'Efectos de audio: `.lpf`/`.hpf` (filtros), `.vowel`, `.gain`, `.adsr`/`.attack`/`.decay`/`.sustain`/`.release`, `.delay`, `.room`, `.pan`, `.speed`, `.crush`, `.distort`.',
      'Funciones de patrón: `setcpm` (tempo), `.fast`/`.slow`, `.rev`, `.jux`, `.add`, `.ply`, `.off`.',
      'A partir de aquí, el Panel de Referencia tiene el detalle completo de cada función con más ejemplos — úsalo como diccionario mientras improvisas en el Playground.',
    ],
    examples: [
      {
        label: 'Patrón completo usando varias lecciones',
        code:
          '$: note("<[c2 c3]*4 [bb1 bb2]*4 [f2 f3]*4 [eb2 eb3]*4>").sound("gm_synth_bass_1").lpf(800)\n$: n("0 [2 4] <3 5> [~ <4 1>]").scale("C5:minor").sound("gm_xylophone").room(.4)\n$: sound("bd*4, [~ <sd cp>]*2, [~ hh]*4").bank("RolandTR909")',
      },
    ],
    exercises: [
      {
        prompt: 'Reto final: compón un patrón de 3 capas ($:) que combine batería, bajo con nota/escala y un efecto de patrón (rev, jux, off o add) en al menos una capa.',
      },
    ],
  },
];
