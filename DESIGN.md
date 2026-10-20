---
name: Redline
description: Soluciones integrales en ingeniería y tecnología, presentadas como un evento energético registrado en un detector.
colors:
  vacuum: "#0a0e13"
  vacuum-2: "#0d131a"
  steel: "#1a2635"
  steel-2: "#223244"
  ring: "#3a5a7a"
  hair: "rgba(122, 152, 186, 0.2)"
  hair-strong: "rgba(122, 152, 186, 0.38)"
  solar: "#ffd23a"
  solar-ink: "#1a1400"
  signal: "#35d0ff"
  red: "#ff3b2f"
  text: "#e8edf2"
  steel-text: "#a7b3c2"
  muted: "#8796a8"
typography:
  display:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(2.6rem, 15.4cqi, 6rem)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(2.6rem, 1.6rem + 4vw, 5.25rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(1.9rem, 1.4rem + 1.6vw, 2.75rem)"
    fontWeight: 800
    lineHeight: 0.95
  lead:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.08rem, 1rem + 0.4vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Chivo Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.08em"
  data:
    fontFamily: "Chivo Mono, ui-monospace, monospace"
    fontSize: "1.15rem"
    fontWeight: 400
    fontFeature: "tnum"
rounded:
  none: "0px"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  section: "clamp(96px, 13vw, 184px)"
  max: "1320px"
  nav-h: "72px"
components:
  button-solar:
    backgroundColor: "{colors.solar}"
    textColor: "{colors.solar-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 1.5em"
    height: "54px"
  button-solar-hover:
    backgroundColor: "#ffe07a"
    textColor: "{colors.solar-ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 1em"
    height: "42px"
  button-ghost-hover:
    textColor: "{colors.solar}"
  input-field:
    backgroundColor: "{colors.vacuum}"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
    height: "50px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.steel-text}"
    rounded: "{rounded.none}"
    padding: "10px 14px"
  chip-selected:
    backgroundColor: "{colors.solar}"
    textColor: "{colors.solar-ink}"
  track-label:
    backgroundColor: "rgba(10, 14, 19, 0.82)"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    padding: "8px 12px 9px"
  panel:
    backgroundColor: "{colors.vacuum-2}"
    rounded: "{rounded.none}"
    padding: "clamp(24px, 4vw, 56px)"
---

# Design System: Redline

## Overview

**Creative North Star: "El display de eventos"**

Cada proyecto Redline se presenta como un evento registrado en un detector de partículas: el punto rojo del logo es el vértice de colisión, la energía solar es la traza dominante y las otras cuatro especialidades son trazas que la acompañan. La superficie es un vacío casi negro con anillos de detector en acero azul; el color no decora, codifica: amarillo es energía, cian es señal, rojo es el vértice y la energía depositada.

La densidad es la de un instrumento: titulares condensados enormes en mayúsculas frente a rótulos monoespaciados pequeños y tabulares, unidos a lo que describen por líneas guía de 1px. Todo es recto, de esquinas vivas y de trazo fino; la profundidad viene de capas tonales de acero y de los anillos dibujados, no de sombras. La fotografía existe (stock reemplazable) pero siempre instrumentada: con pines y cajas de lectura, o enmarcada con esquinas de registro y un pie monoespaciado.

El movimiento es de un solo disparo: el detector se ensambla radialmente desde el vértice con ease-out exponencial y no se repite salvo que el visitante pida "Nuevo evento". Los estados de servicio se expresan aislando una traza y atenuando el resto.

**Key Characteristics:**
- Vacío oscuro (`vacuum`) como único fondo; `vacuum-2` para paneles y bandas alternas.
- Tres colores de señal con significado fijo: amarillo energía, cian señal, rojo vértice.
- Big Shoulders 800 en mayúsculas para todo titular; Chivo Mono para cada cifra y rótulo.
- Esquinas a 0px; hairlines de 1px como estructura; esquinas de registro como acento.
- Rótulos en cajas de 1px fijadas con líneas guía a su objeto.
- Animación de ensamblaje única, ease-out exponencial, aislamiento por atenuación.

## Colors

Un vacío frío de acero azulado donde tres colores de señal funcionan como código, no como decoración.

### Primary
- **Amarillo Traza Solar** (`solar`): la acción y la energía. Botón principal, chips seleccionados, foco (`:focus-visible` 2px), selección de texto, cifras destacadas (kWp, ahorro, teléfono), la traza solar del detector, pines de la foto y esquinas de registro de paneles. Siempre lleva texto en **Tinta Solar** (`solar-ink`) encima.

### Secondary
- **Cian Señal** (`signal`): telecomunicaciones, seguridad y todo lo que "conecta". Trazas de señal, rayos del mapa polar, enlaces de texto (`link-line`), hover de Instagram y las esquinas de registro del marco fotográfico.

### Tertiary
- **Rojo Vértice** (`red`): el punto rojo de la marca. El vértice de colisión, el "RED" del logotipo, el punto final de cada titular, las barras de energía depositada, la traza viva del proceso y el estado de paso alcanzado. También borde de campo inválido.

### Neutral
- **Vacío** (`vacuum`): fondo de página, fondo de campos.
- **Vacío Profundo** (`vacuum-2`): paneles (estimador, formulario) y secciones alternas (proceso, cobertura).
- **Acero** (`steel`) y **Acero Claro** (`steel-2`): capas del detector, anillos de las gráficas SVG, pista del deslizador, sectores nocturnos del dial.
- **Anillo** (`ring`): trazo de los anillos del detector y hover de bordes. Solo trazo, nunca texto (2.7:1).
- **Hairline** (`hair`) y **Hairline Fuerte** (`hair-strong`): toda la estructura. `hair` separa filas; `hair-strong` abre listas, bordea campos, botones fantasma y cajas de lectura.
- **Texto** (`text`): titulares y texto de énfasis.
- **Texto Acero** (`steel-text`): cuerpo secundario, leads, descripciones.
- **Apagado** (`muted`): rótulos de lectura, pies, coordenadas (6.4:1 sobre vacío).

### Named Rules
**The Color Is Code Rule.** Amarillo = energía/acción, cian = señal/enlace, rojo = vértice/energía depositada. Un servicio hereda su color por variable (`--c`): solar y eléctrica en amarillo, telecom y seguridad en cian, civil en texto acero. No se introduce un cuarto color de señal.

**The Red Full Stop Rule.** El rojo en tipografía aparece solo como el punto final del titular (`<i>.</i>`) y en el "RED" del logotipo. Nunca como color de texto corrido ni de botón.

**The Ink-On-Solar Rule.** Sobre amarillo, el texto es siempre `solar-ink`, nunca blanco.

## Typography

**Display Font:** Big Shoulders (con Arial Narrow)
**Body Font:** Archivo (con system-ui)
**Label/Mono Font:** Chivo Mono (con ui-monospace)

**Character:** Un display industrial condensado y pesado, gritado en mayúsculas, contra un cuerpo grotesco sobrio y una mono técnica que hace de instrumento de medida.

### Hierarchy
- **Display** (800, `clamp(2.6rem, 15.4cqi, 6rem)` relativo al contenedor, 0.86): solo el titular del hero, en 2-3 líneas forzadas.
- **Headline** (800, `clamp(2.6rem, 1.6rem + 4vw, 5.25rem)`, 0.92, máx. 16ch, `text-wrap: balance`): titulares de sección. Variante XL de contacto hasta 6rem, 12ch.
- **Title** (800, `clamp(1.9rem, 1.4rem + 1.6vw, 2.75rem)`, 0.95): nombres de servicio, estimador, pasos, valores (estos últimos fijos entre 1.6 y 2.1rem).
- **Lead** (400, `clamp(1.08rem, 1rem + 0.4vw, 1.3rem)`, 1.55, máx. 54ch, `steel-text`): entrada bajo cada titular.
- **Body** (400, `clamp(1rem, 0.96rem + 0.2vw, 1.0625rem)`, 1.6, 36-60ch): párrafos, descripciones.
- **Label** (Chivo Mono, 0.6875-0.8125rem, 0.04-0.12em, mayúsculas): navegación (0.12em), botones (0.08em), rótulos de campo, lecturas de datos, pies.
- **Data** (Chivo Mono, 1.15rem, cifras tabulares): resultados del estimador; destacados a 1.35rem en `solar`.

### Named Rules
**The Every-Number-In-Mono Rule.** Toda cifra, unidad, coordenada o código (kWp, COP/kWh, ON-GRID, 7.07°N) va en Chivo Mono con `font-variant-numeric: tabular-nums`. La excepción son las cifras héroe (dial kWp, teléfono), que van en Big Shoulders 800 amarillo.

**The Uppercase Display Rule.** Big Shoulders va siempre en 800 y mayúsculas, interlineado entre 0.86 y 1. Archivo nunca se pone en mayúsculas salvo el subtítulo del logotipo.

## Layout

Contenedor `min(100% - 2 × gutter, 1320px)`; el hero se abre hasta 1680px y la navegación hasta 1560px. Las secciones respiran con `section` (96-184px) arriba y abajo. La composición es de dos columnas asimétricas (proporciones 0.8-0.95 / 1.05-1.2), alternando qué lado lleva texto; colapsan a una columna a 900px. El hero reparte 0.82 / 1.18 con el detector cuadrado a la derecha; en móvil el detector sube arriba a sangre completa, limitado a 42svh.

El ritmo vertical se construye con listas de filas separadas por hairlines (servicios, valores, lecturas, datos de contacto), no con tarjetas. Las listas abren con `hair-strong` y separan con `hair`. La banda fotográfica de energía solar corre a ancho completo entre dos hairlines. La navegación es fija a 72px, transparente al inicio y sólida (vacío al 92% con desenfoque 10px) al desplazarse; por debajo de 960px pasa a menú de pantalla completa con enlaces en display 2.4rem.

### Named Rules
**The Rows Not Cards Rule.** El contenido repetido se apila en filas con hairlines; las únicas cajas son paneles de herramienta (estimador, formulario) y rótulos de lectura.

## Elevation & Depth

Sistema plano. La profundidad se transmite por capas tonales (`vacuum` → `vacuum-2` → `steel` → `steel-2`), por los anillos del detector y por la perspectiva 3D del canvas, nunca por sombras de superficie. Las cajas que flotan sobre gráficos (rótulos de traza, pines, pasos) usan vacío translúcido (82-88%) para separarse del fondo. La única sombra del build es la del botón flotante de WhatsApp en escritorio.

### Shadow Vocabulary
- **Flotante** (`box-shadow: 0 10px 30px -8px rgba(0, 0, 0, 0.7)`): exclusivamente el botón fijo de WhatsApp, que se desplaza sobre todo el contenido.

### Named Rules
**The Flat Instrument Rule.** Paneles, tarjetas y botones no llevan sombra. Si algo necesita separarse, sube un paso de tono o gana un borde de 1px.

## Shapes

Esquinas vivas en todo (0px), incluidos campos, chips, deslizador y botones. Los círculos son geometría del mundo y se reservan para lo que en un detector es circular: el vértice rojo con su anillo, los anillos del detector, el dial, el mapa polar y el punto de estado. Los marcadores de impacto son cuadrados con un núcleo relleno (pines de foto, valores, pasos) y giran 45° cuando la traza los alcanza. Los paneles de herramienta llevan **esquinas de registro**: dos escuadras de 16-18px y 2px en esquinas opuestas, en amarillo (paneles) o cian (marco de foto). Las líneas guía son de 1px y anclan cada rótulo a su objeto.

## Components

### Buttons
Rectos, monoespaciados y en mayúsculas: un mando de equipo, no una píldora.
- **Shape:** esquinas vivas (0px), borde de 1px.
- **Solar (primario):** fondo `solar`, texto `solar-ink`, Chivo Mono 0.875rem 500, 0.08em, alto 54px, padding horizontal 1.5em, flecha de 18px a la derecha. Toda acción que termina en WhatsApp usa esta variante; puede ir a ancho completo dentro de paneles.
- **Hover / Focus:** fondo `#ffe07a`, la flecha avanza 4px; `:active` baja 1px; foco con contorno `solar` de 2px a 3px de distancia. Transiciones 0.25s con `ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Fantasma:** transparente, borde `hair-strong`, texto `text`, alto 42px; en hover borde y texto pasan a `solar`. Se usa para el teléfono en la navegación.
- **Link line:** enlace secundario en mono 0.8125rem mayúsculas, `signal`, subrayado de 1px con 0.55em de separación; hover a `text`.

### Chips
- **Style:** borde `hair-strong`, Archivo 0.9rem `steel-text`, padding 10px 14px, sin radio.
- **State:** hover con borde `ring` y texto `text`; seleccionado relleno `solar` con `solar-ink`. Son radios nativos ocultos (selección única).
- **Tags (variante de lectura):** mono 0.7rem mayúsculas amarillas con borde amarillo al 40%; también los códigos ON-GRID / OFF-GRID / HÍBRIDO.

### Cards / Containers
- **Corner Style:** 0px con esquinas de registro.
- **Background:** `vacuum-2`.
- **Shadow Strategy:** ninguna (ver Elevation & Depth).
- **Border:** 1px `hair`.
- **Internal Padding:** `clamp(24px, 4vw, 56px)` en el estimador, `clamp(24px, 4vw, 44px)` en el formulario.

### Inputs / Fields
- **Style:** fondo `vacuum`, borde 1px `hair-strong`, alto mínimo 50px, padding 12px 14px, Chivo Mono 0.95rem tabular (el textarea en Archivo). Rótulo encima en mono 0.75rem mayúsculas `steel-text`, unidades en `muted`.
- **Focus:** borde y contorno de 1px `solar`, fondo un paso más claro.
- **Hover:** borde `ring`.
- **Error:** borde `red`; mensaje debajo en rojo.
- **Range:** pista de 2px rellena de `solar` hasta el valor sobre `steel-2`; pulgar cuadrado de 18px, vacío con borde `solar` de 2px.

### Navigation
- **Style:** enlaces en Chivo Mono 0.75rem, 0.12em, mayúsculas, `steel-text`; hover a `text`. La sección activa se marca con una línea `solar` de 1px que crece desde la izquierda (0.35s ease-out).
- **Mobile:** botón WhatsApp cuadrado amarillo de 46px y botón de menú con borde `hair-strong`; el menú abierto ocupa la pantalla con enlaces en Big Shoulders 800 2.4rem separados por hairlines.

### Rótulo de traza (signature)
La caja de lectura del mundo: vacío al 82%, borde 1px del color de su traza (`--c`), nombre en Archivo 600 condensado (`font-stretch: 88%`) precedido de su símbolo de partícula en mono del mismo color (γ solar, e⁻ eléctrica, ν telecom, μ seguridad, Σ civil), y una línea de valor en mono `steel-text`. La traza solar es más grande y su valor va en amarillo. Se fija con línea guía al punto de salida de su traza; al hacer hover, su traza se aísla y las demás bajan al 35%. Los mismos símbolos marcan los servicios en la lista. Los pines de foto y las cajas de los pasos del proceso son la misma gramática.

### Readout (signature)
Listas de definición como lecturas de instrumento: término en mono 0.6875-0.7rem mayúsculas `muted`, valor en `text` (o mono tabular para datos), destacado en `solar`; filas separadas por hairlines, en una o dos columnas con divisor vertical.

### Detector y gráficas
El canvas del hero, los anillos de servicios, el trazo del proceso, el dial del estimador y el mapa polar comparten vocabulario: anillos `steel`/`steel-2` con trazos `ring`, vértice rojo con anillo `text` de 2-2.5px, trazos discontinuos (2/4, 2/5, 3/3) para referencias, barras rojas rayadas para energía depositada. El ensamblaje usa ease-out exponencial (`1 - 2^(-10t)`) una sola vez; con `prefers-reduced-motion` se presenta el estado final.

## Do's and Don'ts

### Do:
- **Do** asignar cada servicio a su color de traza vía `--c` (solar/eléctrica amarillo, telecom/seguridad cian, civil texto acero) y mantenerlo en rótulos, símbolos y estados.
- **Do** cerrar cada titular de sección con el punto rojo (`<i>.</i>` en `red`).
- **Do** poner toda cifra y unidad en Chivo Mono tabular, y marcar con asterisco las cifras de ejemplo.
- **Do** anclar rótulos a su objeto con una caja de 1px y una línea guía de 1px.
- **Do** instrumentar las fotos: pines con lectura o marco con esquinas de registro y pie monoespaciado.
- **Do** usar el botón solar para toda acción que termina en WhatsApp.
- **Do** usar `ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`) para transiciones de estado y el ease-out exponencial para el ensamblaje del detector.

### Don't:
- **Don't** redondear rectángulos: botones, campos, chips, paneles y rótulos van a 0px. Los círculos se reservan para vértice, anillos, dial, mapa y punto de estado.
- **Don't** añadir sombras a paneles, rótulos o botones; la única sombra es la del botón flotante de WhatsApp.
- **Don't** poner texto blanco sobre amarillo ni usar el rojo como color de botón o de texto corrido.
- **Don't** abrir una sección con una foto a pantalla completa bajo el titular ni componer el contenido repetido en cuadrícula de tarjetas; la web rechaza ese patrón corporativo solar.
- **Don't** usar `ring` (#3a5a7a) para texto; es solo trazo.
- **Don't** repetir el ensamblaje del detector en bucle; se dispara una vez o por "Nuevo evento".
