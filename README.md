# web_pablo

Personal website. Ultra-minimal, retro developer aesthetic.

## Editar el contenido

El contenido se divide en dos modelos, segun la forma de la pagina.

### Prosa -> Markdown

Paginas que son texto corrido. Se escriben en `.md` y Eleventy las convierte a
HTML (con footnotes y KaTeX donde aplique):

- `src/thoughts/*.md` - ensayos
- `src/notebook/*.md` - articulos tecnicos (ver CLAUDE.md para el PDF)
- `src/privacy.md`
- `src/how-i-made-the-web.md`

Usa markdown estandar: `#` para titulos, `##` para secciones, `-` para listas,
`---` para separadores, `[texto](url)` para links.

### Estructura -> datos + plantilla

Paginas que en realidad son una lista de fichas (un CV, publicaciones, links).
El contenido vive en `src/_data/*.js` y el marcado en la plantilla `.njk`:

| Pagina | Contenido que editas | Plantilla |
| --- | --- | --- |
| `/experience/` | `src/_data/experience.js` | `src/experience.njk` |
| `/research/` | `src/_data/research.js` | `src/research.njk` |
| `/links/` | `src/_data/links.js` | `src/links.njk` |
| `/` (home) | `src/index.njk` | - |

Para anadir un puesto o una publicacion, anade un objeto al array del archivo de
datos. No hay que tocar la plantilla ni el CSS: el orden, los separadores y la
tipografia salen de ahi.

Los campos de texto rico (`lead`, `body`, `bullets`) admiten HTML en linea
(`<strong>`, `<a>`) y se imprimen con `| safe`. El resto es texto plano y
Nunjucks lo escapa.

La home (`src/index.njk`) es HTML directo porque ya es una composicion con
secciones, tarjetas y numeracion: no queda markdown que aprovechar.

### Archivos generados

`/llms.txt` no se edita a mano: lo genera `src/llms.txt.njk` a partir de
`_data/research.js`, `_data/experience.js`, `_data/links.js` y las colecciones
de thoughts y notebook. Publicar un paper o un articulo lo actualiza solo.
El campo `summary` (research, experience) y `llmsNote` (links) existen para ese
archivo, que va en tercera persona a diferencia de las paginas.

### Por que la separacion

Cuando una pagina estructurada se escribia en markdown, el CSS tenia que
adivinar el significado por la posicion (`h3 + p` para la fecha de un puesto,
`h3 em` para el cargo). Eso era invisible desde el fuente, se rompia al insertar
un parrafo y se filtraba a las paginas de prosa. Ahora cada cosa tiene su clase.

## Como funciona el menu

El menu superior ya no se genera automaticamente desde los markdowns.

Ahora se mantiene de forma explicita en:

```txt
src/_data/navigation.js
```

Ejemplo actual:

```js
module.exports = [
  { title: "About", url: "/" },
  { title: "Thoughts", url: "/thoughts/" },
  { title: "Notebook", url: "/notebook/" },
  {
    title: "More",
    children: [
      { title: "Experience", url: "/experience/" },
      { title: "Research", url: "/research/" },
      { title: "Links", url: "/links/" },
    ],
  },
];
```

## Anadir una pagina nueva

1. Si es prosa, crea un markdown dentro de `src/`. Si es una pagina
   estructurada, crea `src/<nombre>.njk` y su `src/_data/<nombre>.js`.

Ejemplo de pagina de prosa:

```md
---
layout: page.njk
title: Blog
permalink: /blog/
description: Blog page
pageKey: blog
---

# Blog

Contenido de la pagina.
```

`pageKey` es opcional: define la clase del `<body>` (`page-blog`) por si esa
pagina necesita estilos propios. Sin el, el body sale como `page-doc`.

2. Anade su enlace en `src/_data/navigation.js`.

Ejemplo:

```js
{ title: "Blog", url: "/blog/" },
```

Si no anades la entrada en `navigation.js`, la pagina existira pero no aparecera en el menu superior.

## Anadir o actualizar una nota

Las notas viven en `src/thoughts/` (y los articulos tecnicos en
`src/notebook/`). Ademas de `date`, puedes anadir un campo opcional `updated` para mostrar la fecha de ultima edicion:

```md
---
title: My note
date: 2026-04-15
updated: 2026-04-17
description: Optional short summary.
---
```

## Desarrollo local

```bash
npm install       # solo la primera vez
npm run dev       # arranca el servidor en http://localhost:8080
```

Edita cualquier markdown de `src/` o `src/_data/navigation.js`, guarda, y el navegador se actualiza automaticamente.

## Publicar cambios

```bash
git add .
git commit -m "update content"
git push
```

GitHub Actions construye y despliega la web automaticamente.
