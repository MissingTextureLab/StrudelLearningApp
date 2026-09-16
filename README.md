# Strudel Learning App

Una app para aprender [live coding](https://strudel.cc) musical con [Strudel](https://strudel.cc) (el puerto en JavaScript de TidalCycles), pensada para quien parte de cero y quiere aprender en español.

**[▶ Probarla en vivo](https://missingtexturelab.github.io/StrudelLearningApp/)**

## Qué incluye

- **Lecciones** — una progresión guiada, de "qué es el live coding" hasta funciones de patrón, con ejemplos y ejercicios cargables con un clic.
- **Playground** — un editor con audio real (basado en `@strudel/codemirror` + Web Audio), con los mismos samples y soundfonts que usa strudel.cc.
- **Referencia** — cientos de funciones de la API de Strudel documentadas en español, con sintaxis, descripción y ejemplos ejecutables, organizadas por categoría.
- **Mis patrones** — guarda tus propios patrones en el navegador (`localStorage`, no hay backend ni cuenta).

## Desarrollo

```bash
npm install
npm run dev
```

Otros comandos: `npm run build` (compila a `dist/`), `npm run preview` (sirve ese build localmente), `npm run lint` (oxlint).

## Stack

React 19 + TypeScript + Vite + Tailwind CSS, sobre los paquetes `@strudel/*` (core, mini, tonal, webaudio, codemirror, midi, osc, hydra, soundfonts, transpiler).

## Despliegue

Cada push a `master` reconstruye y publica la app en GitHub Pages automáticamente (ver `.github/workflows/deploy.yml`). Al ser un sitio de proyecto (`usuario.github.io/StrudelLearningApp/`), `vite.config.ts` fija `base: '/StrudelLearningApp/'` en producción — si el repositorio cambia de nombre, ese valor hay que actualizarlo ahí.
