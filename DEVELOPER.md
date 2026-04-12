# DEVELOPER GUIDE

Guía de mantenimiento de `web_pablo`.

Este archivo explica cómo está organizada la web, qué piezas afectan al SEO, qué hay que tocar cuando cambias contenido o estructura, y cómo validar que todo ha quedado bien antes de publicar.

## Stack y funcionamiento general

- La web está hecha con `Eleventy` (`@11ty/eleventy`).
- El código fuente vive en `src/`.
- El HTML generado sale en `_site/`.
- No edites `_site/` a mano: se regenera en cada build.
- El despliegue lo hace GitHub Pages mediante `.github/workflows/deploy.yml`.

## Estructura del proyecto

### Archivos de configuración

- `.eleventy.js`
  - Configura Eleventy.
  - Copia `src/css`, `src/assets`, `src/robots.txt` y `src/CNAME` al output.
  - Define filtros como `relativeUrl`, `absoluteUrl` y `json`.
- `package.json`
  - `npm run dev`: arranca el servidor local.
  - `npm run build`: genera `_site/`.
  - `prebuild`: borra `_site/` antes de reconstruir.
- `.github/workflows/deploy.yml`
  - Hace `npm ci`, `npm run build` y publica `_site` en GitHub Pages.

### Contenido principal

- `src/index.md`
  - Home.
  - La home se muestra como “About” en navegación, pero su SEO está centrado en `Pablo Magariños`.
- `src/projects.md`
  - Ojo: el archivo se llama `projects.md`, pero la URL pública es `/experience/`.
  - Si buscas la página Experience, está aquí.
- `src/contact.md`
  - Página de contacto.

### Plantillas

- `src/_includes/base.njk`
  - Plantilla principal.
  - Construye el `<head>` completo: `title`, descripción, canonical, Open Graph, Twitter Cards, favicon, `robots` y JSON-LD.
- `src/_includes/page.njk`
  - Envuelve el contenido de las páginas dentro de `<article class="content">`.

### Datos globales

- `src/_data/navigation.js`
  - Define el menú superior de forma manual.
  - Si una página no se añade aquí, existe igualmente, pero no aparece en la navegación.
- `src/_data/site.js`
  - Fuente global de verdad para SEO y branding.
  - Contiene dominio, nombre del sitio, autor, título por defecto, descripción por defecto, favicon, imagen social y perfiles públicos.

### Assets

- `src/css/style.css`
  - Estilos globales.
- `src/assets/images/favicon.svg`
- `src/assets/images/favicon.png`
  - Iconos del sitio.
- `src/assets/images/og-default.svg`
- `src/assets/images/og-default.png`
  - Imagen social por defecto para Open Graph y Twitter.

### Archivos SEO directos

- `src/robots.txt`
  - Permite indexación y apunta al sitemap.
- `src/sitemap.xml.njk`
  - Genera el sitemap automáticamente.
- `src/CNAME`
  - Fija el dominio personalizado en GitHub Pages.

## Cómo se construye el SEO

El SEO se organiza en tres capas.

### 1. Datos globales del sitio

Se definen en `src/_data/site.js`.

Campos importantes actuales:

- `url`: URL canónica del sitio.
- `name`: nombre SEO principal.
- `brand`: nombre visible en la cabecera.
- `defaultTitle`: título por defecto de la home.
- `defaultDescription`: descripción global.
- `socialImage`: imagen por defecto para compartir.
- `favicon` y `faviconPng`: iconos del sitio.
- `sameAs`: perfiles públicos para JSON-LD.

Si cambias de dominio, nombre profesional, redes sociales o branding SEO, este es el primer archivo que debes revisar.

### 2. Metadatos por página

Se definen en el front matter de cada `.md`.

Campos disponibles:

- `layout`
- `title`
- `metaTitle`
- `description`
- `socialImage`
- `robots`
- `permalink`
- `navTitle`
- `navOrder`

Reglas actuales:

- La home usa `metaTitle` explícito: `Pablo Magariños | AI Researcher`.
- Las páginas internas, si no definen `metaTitle`, usan la convención:
  - `{{ title }} | Pablo Magariños`
- Si no defines `description`, cae a `site.defaultDescription`.
- Si no defines `socialImage`, usa `site.socialImage`.
- Si no defines `robots`, usa `index, follow`.

### 3. Render del `<head>`

Todo sale desde `src/_includes/base.njk`.

Ese archivo genera:

- `<title>`
- `<meta name="description">`
- `<meta name="author">`
- `<meta name="robots">`
- `<link rel="canonical">`
- favicon
- Open Graph:
  - `og:site_name`
  - `og:title`
  - `og:description`
  - `og:url`
  - `og:image`
- Twitter Cards:
  - `twitter:card`
  - `twitter:title`
  - `twitter:description`
  - `twitter:image`
- JSON-LD tipo `Person`

## Qué tocar según el cambio que hagas

### Si cambias solo texto de una página

Edita el archivo `.md` correspondiente:

- `src/index.md`
- `src/projects.md`
- `src/contact.md`

Revisa también:

- El `title`
- La `description`
- El primer párrafo, sobre todo en la home

El primer bloque de texto de la home es importante para reforzar el posicionamiento del nombre y del perfil profesional.

### Si quieres cambiar cómo sale una página en Google o en la pestaña

Edita el front matter de esa página:

- `metaTitle` para controlar el título exacto
- `description` para la descripción
- `socialImage` si quieres una imagen específica
- `robots` si la quieres indexable o no

Recuerda:

- El navegador muestra principalmente `title` y `favicon`.
- Google y redes usan sobre todo `title`, `description`, `canonical` e imagen social.

### Si quieres cambiar el nombre principal del sitio

Edita `src/_data/site.js`:

- `name`
- `brand`
- `author`
- `defaultTitle`
- `defaultDescription`
- `jobTitle`

Normalmente:

- `name` es la identidad SEO.
- `brand` es lo que ves arriba en la cabecera.

Ahora mismo:

- SEO: `Pablo Magariños`
- Branding visible: `Pablo.dev`

### Si cambias el dominio

Debes actualizar estas tres piezas:

1. `src/_data/site.js`
   - `url`
2. `src/robots.txt`
   - línea del sitemap
3. `src/CNAME`
   - dominio exacto

Después conviene comprobar que el build genera canonicals y sitemap con el dominio nuevo.

### Si quieres cambiar el menú

Edita `src/_data/navigation.js`.

Ejemplo:

```js
module.exports = [
  { title: "About", url: "/" },
  { title: "Experience", url: "/experience/" },
  { title: "Contact", url: "/contact/" },
];
```

### Si quieres añadir una página nueva

1. Crea un markdown nuevo dentro de `src/`.
2. Añade front matter.
3. Si quieres que aparezca en el menú, añádela en `src/_data/navigation.js`.

Ejemplo:

```md
---
layout: page.njk
title: Blog
metaTitle: Blog | Pablo Magariños
description: Notes on AI research, mathematics, and engineering.
permalink: /blog/
---

# Blog

Page content here.
```

Notas:

- Si la página usa `layout`, entrará en el sitemap automáticamente.
- Si no quieres indexarla, añade `robots: noindex, nofollow`.

### Si quieres cambiar favicon o imagen social

Archivos a revisar:

- `src/assets/images/favicon.svg`
- `src/assets/images/favicon.png`
- `src/assets/images/og-default.svg`
- `src/assets/images/og-default.png`
- `src/_data/site.js`

Consejos:

- Mantén el favicon en SVG y PNG para compatibilidad.
- Usa PNG para Open Graph y Twitter.
- Si cambias el nombre o cargo principal del sitio, actualiza también el texto dentro de la imagen social.

## Sitemap, robots y páginas indexables

### Sitemap

`src/sitemap.xml.njk` recorre `collections.all` y mete en el sitemap las páginas que tengan `layout`.

En la práctica, ahora mismo entran:

- `/`
- `/experience/`
- `/contact/`

Si creas una nueva página con `layout`, aparecerá automáticamente.

### Robots

`src/robots.txt` permite indexación total y expone el sitemap:

```txt
User-agent: *
Allow: /

Sitemap: https://pablomagarinos.es/sitemap.xml
```

Si en el futuro quieres bloquear alguna página concreta, no se hace aquí; se hace mejor con `robots: noindex, nofollow` en el front matter de esa página.

## Flujo recomendado cuando actualizas la web

### Cambios de contenido normales

1. Edita el markdown correspondiente.
2. Si cambió el enfoque de la página, ajusta también `description`.
3. Ejecuta el build.
4. Comprueba el HTML generado.
5. Haz commit y push.

### Cambios de SEO

1. Revisa `src/_data/site.js`.
2. Revisa `src/_includes/base.njk`.
3. Si cambió dominio, revisa `src/robots.txt` y `src/CNAME`.
4. Si cambió la imagen social o favicon, actualiza los assets.
5. Ejecuta el build.
6. Valida `_site/index.html`, `_site/experience/index.html`, `_site/contact/index.html`, `_site/sitemap.xml`, `_site/robots.txt` y `_site/CNAME`.

### Cambios de estructura

1. Crea o mueve la página.
2. Revisa `permalink`.
3. Revisa `navigation.js`.
4. Ejecuta build.
5. Verifica links relativos, sitemap y canonical.

## Comandos útiles

### Desarrollo local

```bash
npm install
npm run dev
```

### Build de producción

```bash
npm run build
```

### En PowerShell si `npm.ps1` está bloqueado

En algunos equipos Windows PowerShell bloquea `npm.ps1`. Si pasa eso, usa:

```bash
cmd /c npm run build
```

o:

```bash
cmd /c npm run dev
```

## Checklist rápida antes de publicar

- La página abre y no hay errores de build.
- La home tiene un `<title>` correcto.
- Cada página tiene `description` útil.
- Los canonicals apuntan a `https://pablomagarinos.es/...`.
- `_site/sitemap.xml` contiene las URLs esperadas.
- `_site/robots.txt` referencia el sitemap correcto.
- `_site/CNAME` contiene `pablomagarinos.es`.
- El favicon se carga.
- La imagen social existe y es accesible.

## Validación manual recomendada

Después de hacer build, revisa:

- `_site/index.html`
- `_site/experience/index.html`
- `_site/contact/index.html`
- `_site/sitemap.xml`
- `_site/robots.txt`
- `_site/CNAME`

Busca en el HTML:

- `<title>`
- `meta name="description"`
- `rel="canonical"`
- `og:title`
- `og:image`
- `twitter:card`
- `application/ld+json`

## Notas importantes

### Codificación UTF-8

Usa UTF-8 al editar archivos con acentos como `Magariños`.

Puede pasar que PowerShell muestre algunos caracteres raros al hacer `Get-Content`, pero eso no significa necesariamente que el archivo esté mal. Lo importante es que el HTML generado y el navegador rendericen bien el texto.

### `_site` no es fuente

No hagas cambios manuales en `_site`.

Siempre cambia los archivos de `src/` o de configuración y luego reconstruye.

### Archivo `projects.md`

Aunque la ruta pública es `/experience/`, el archivo sigue llamándose `src/projects.md`.

Eso funciona bien, pero conviene recordarlo para no perder tiempo buscando la página equivocada.

## Resumen de archivos que más tocarás

- Contenido: `src/index.md`, `src/projects.md`, `src/contact.md`
- Menú: `src/_data/navigation.js`
- SEO global: `src/_data/site.js`
- Head y metadatos: `src/_includes/base.njk`
- Sitemap: `src/sitemap.xml.njk`
- Robots: `src/robots.txt`
- Dominio: `src/CNAME`
- Imagen social y favicon: `src/assets/images/`
- Build y rutas: `.eleventy.js`
- Despliegue: `.github/workflows/deploy.yml`
