# web_pablo

Personal website. Ultra-minimal, retro developer aesthetic.

## Editar el contenido

El contenido de la web vive en archivos markdown dentro de `src/`.

Archivos actuales:

- `src/index.md`
- `src/projects.md`
- `src/research.md`
- `src/links.md`

Usa markdown estandar: `#` para titulos, `##` para secciones, `-` para listas, `---` para separadores, `[texto](url)` para links.

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
  { title: "Experience", url: "/experience/" },
  { title: "Research", url: "/research/" },
  { title: "Links", url: "/links/" },
];
```

## Anadir una pagina nueva

1. Crea un nuevo markdown dentro de `src/`.

Ejemplo:

```md
---
layout: page.njk
title: Blog
permalink: /blog/
description: Blog page
---

# Blog

Contenido de la pagina.
```

2. Anade su enlace en `src/_data/navigation.js`.

Ejemplo:

```js
{ title: "Blog", url: "/blog/" },
```

Si no anades la entrada en `navigation.js`, la pagina existira pero no aparecera en el menu superior.

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
