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

Cada uno tiene su traduccion en la misma ruta bajo `src/es/` (ver "Idiomas").

Usa markdown estandar: `#` para titulos, `##` para secciones, `-` para listas,
`---` para separadores, `[texto](url)` para links.

### Estructura -> datos + plantilla

Paginas que en realidad son una lista de fichas (un CV, publicaciones, links).
El contenido vive en `src/_data/*.js` (con los dos idiomas) y el marcado en una
plantilla compartida de `src/_includes/pages/`. Los archivos de pagina
(`src/experience.njk`, `src/es/experience.njk`) solo llevan el front matter:

| Pagina | Contenido que editas | Plantilla |
| --- | --- | --- |
| `/experience/` | `src/_data/experience.js` | `src/_includes/pages/experience.njk` |
| `/research/` | `src/_data/research.js` | `src/_includes/pages/research.njk` |
| `/links/` | `src/_data/links.js` | `src/_includes/pages/links.njk` |
| `/` (home) | `src/index.njk` y `src/es/index.njk` | - |

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

## Idiomas

La web esta en ingles (raiz) y en espanol (`/es/`), con las mismas rutas:
`/research/` y `/es/research/` son la misma pagina. Las URLs no se traducen.

- **Prosa y home**: un archivo por idioma. El espanol esta en `src/es/`, en la
  misma ruta que el ingles (`src/thoughts/x.md` -> `src/es/thoughts/x.md`).
  `src/es/es.json` pone `lang: "es"` a todo lo que hay debajo.
- **Datos**: cada texto que cambia con el idioma es un objeto
  `{ en: "...", es: "..." }` y se lee con el filtro `localize`. Lo que no cambia
  (nombres propios, URLs) es un string normal. Si falta una traduccion, el build
  falla.
- **Interfaz** (menu, pie, "Compartir", "Ultima edicion"...): `src/_data/i18n.js`.
  Los textos que escribe el JavaScript estan al principio de `src/js/site.js`.
- **llms.txt** sigue solo en ingles.

Al publicar un articulo nuevo, crea las dos versiones: el selector EN/ES de la
cabecera enlaza siempre a la misma ruta en el otro idioma.

## Como funciona el menu

El menu superior ya no se genera automaticamente desde los markdowns.

Ahora se mantiene de forma explicita en:

```txt
src/_data/navigation.js
```

Cada entrada tiene el titulo en los dos idiomas y la URL en ingles; la cabecera
anade `/es` sola en las paginas en espanol:

```js
module.exports = [
  { title: { en: "About", es: "Sobre mí" }, url: "/" },
  { title: { en: "Experience", es: "Experiencia" }, url: "/experience/" },
  {
    title: { en: "Notes", es: "Escritos" },
    children: [
      { title: { en: "Thoughts", es: "Reflexiones" }, url: "/thoughts/" },
      { title: { en: "Tech Notes", es: "Notas técnicas" }, url: "/notebook/" },
    ],
  },
];
```

## Anadir una pagina nueva

1. Si es prosa, crea un markdown dentro de `src/` y su traduccion en `src/es/`
   (con `permalink: /es/<nombre>/`). Si es una pagina estructurada, crea su
   `src/_data/<nombre>.js`, la plantilla en `src/_includes/pages/` y los dos
   archivos de pagina, `src/<nombre>.njk` y `src/es/<nombre>.njk`.

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
{ title: { en: "Blog", es: "Blog" }, url: "/blog/" },
```

Si no anades la entrada en `navigation.js`, la pagina existira pero no aparecera en el menu superior.

## Anadir o actualizar una nota

Las notas viven en `src/thoughts/` (y los articulos tecnicos en
`src/notebook/`), con su traduccion en `src/es/thoughts/` y `src/es/notebook/`
bajo el mismo nombre de archivo. Ademas de `date`, puedes anadir un campo opcional `updated` para mostrar la fecha de ultima edicion:

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
