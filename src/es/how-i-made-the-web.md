---
layout: page.njk
title: Cómo hice la web
description: Una nota breve sobre cómo se construye, se genera y se publica esta web.
permalink: /es/how-i-made-the-web/
pageKey: how-i-made-the-web
---

# Cómo hice la web

Esta web no está hecha con WordPress, con un editor visual ni con un creador de webs. Está hecha desde cero.

Eso no significa que cada línea sea complicada. De hecho, la idea es casi la contraria: la web se construye con un pequeño conjunto de herramientas sencillas, para que pueda entender lo que pasa y mantener el resultado final lo más limpio posible.

## Node.js

La web se construye con Node.js. Más concretamente, Node.js ejecuta el proceso de compilación que convierte los archivos fuente en la web final.

La herramienta que convierte los archivos fuente en HTML es **Eleventy**, un generador de sitios estáticos que funciona sobre Node.js. En la práctica, Eleventy lee el contenido, aplica las plantillas Nunjucks que definen el diseño, procesa las imágenes, copia los recursos y escribe la web estática final en la carpeta *_site*.

## Markdown y plantillas

Al principio, casi toda la web estaba escrita en **Markdown**, un formato de texto plano cómodo para escribir y fácil de mantener con control de versiones. Una plantilla envolvía cada archivo, de modo que todas las páginas mantenían la misma estructura sin que yo tuviera que repetir el diseño a mano.

Eso funciona muy bien para la prosa, pero no tanto para las páginas que en realidad son listas: mi experiencia, mis publicaciones, mis enlaces. Los estilos tenían que adivinar qué era cada trozo de texto por su posición (el párrafo después de un título era una fecha, la cursiva dentro de un título era un cargo), y el diseño dependía de esa suposición.

Por eso ahora el Markdown queda para la escritura: {% if site.showThoughts %}**Reflexiones** y {% endif %}**Notas técnicas**, además de un par de páginas sencillas como esta. Las páginas estructuradas guardan su contenido en pequeños archivos de datos, una entrada por puesto o por publicación, y tienen sus propias plantillas, en las que cada elemento tiene nombre. Eso me da mucha más **flexibilidad con el estilo** de cada página, y añadir una publicación es solo añadir una entrada. Incluso el archivo *llms.txt*, un resumen de la web para modelos de lenguaje, se genera a partir de los mismos datos, así que no puede quedarse desactualizado.

En cualquier caso, quien visita la web recibe sobre todo HTML, CSS y JavaScript sencillos. El navegador no tiene que construir la página a partir de una aplicación compleja, y los buscadores pueden leer el contenido sin necesidad de entender un gran framework en el lado del cliente.

## Dos idiomas

Toda la web existe en inglés y en español. Cada página tiene su versión en español en la misma dirección bajo */es/*, y los archivos de datos llevan los dos idiomas uno al lado del otro. Si falta una traducción, la compilación falla en lugar de publicar una página a medio llenar.

## Archivos estáticos

El resultado de la compilación es una **web estática**. La web publicada está hecha de archivos: documentos HTML, hojas de estilo, scripts, imágenes y metadatos.

Las fotos también pasan por la compilación: Eleventy genera varios tamaños en WebP y JPEG y elimina los metadatos de la cámara, así que los originales nunca se publican. Las Notas técnicas se pueden descargar además en PDF, maquetadas con Pandoc y LaTeX. Esos los genero en mi ordenador, porque la compilación automática no tiene LaTeX instalado.

No hay ningún servidor privado generando cada página cuando alguien la visita. Una vez compilada la web, los archivos ya están ahí, listos para servirse. Para una web personal como la mía es suficiente, y hace que todo el sistema sea más ligero.

Las webs estáticas tienen límites. No pueden hacer fácilmente cosas que requieren lógica en el servidor, cuentas de usuario, bases de datos o llamadas privadas a APIs. Pero para ensayos, notas, páginas de investigación, enlaces y navegación básica, los archivos estáticos no son una limitación. Son la solución más directa.

## GitHub Pages

La web está alojada en **GitHub Pages**. Para quien no lo conozca, GitHub Pages permite publicar una web directamente desde un repositorio de GitHub, gratis.

La condición principal es que la web tiene que ser estática. Puede responder a peticiones GET normales, porque los visitantes necesitan pedir páginas, estilos y recursos, pero no es un sitio para lógica de backend a medida. Para mi proyecto, ese compromiso está perfectamente bien.

El dominio por defecto de GitHub Pages no es especialmente elegante, pero si tienes un dominio puedes conectarlo a la web. Los dominios con nombres personales suelen ser bastante baratos, sobre todo si no necesitas un *.com*, así que el resultado final puede seguir pareciendo una web independiente normal.

## GitHub Actions

El proceso de publicación está automatizado con GitHub Actions. Cuando subo cambios a la rama principal, GitHub arranca un flujo de trabajo.

Ese flujo descarga el repositorio, instala las dependencias de Node.js, ejecuta el comando de compilación y sube la carpeta *_site* generada como artefacto de Pages. Después, GitHub despliega esos archivos generados en GitHub Pages.

En la práctica, el flujo me permite editar los archivos fuente, escribir notas nuevas, hacer commit de los cambios y subirlos. El resto ocurre automáticamente.

## Programar con IA

Por supuesto, usé IA para ayudarme a programar la web.

No sé JavaScript avanzado y no soy un experto en frameworks de Node.js. Pero construir esta web y otras que he hecho antes me ha enseñado mucho sobre cómo se montan las webs: cómo se alojan, qué hace realmente el servidor, qué herramientas existen y cuánto se puede conseguir manteniendo las cosas sencillas.

La IA no sustituyó las decisiones que hay detrás de la web. La elección de escribir en Markdown, el diseño, los colores, la política de privacidad, el contenido y la forma de alojar la web son míos. Lo que me dio la IA fue una manera de entender lo que estaba haciendo y de traducir mis intenciones a código sin tener que pararme en cada detalle de implementación.

Aun así, usar IA no elimina la necesidad de un **propósito**. La dirección tiene que ser tuya, y también la curiosidad por entender, al menos a grandes rasgos, lo que estás haciendo. El equilibrio entre velocidad y control acompaña a los humanos desde hace muchísimo tiempo, y no creo que debamos renunciar al **control** sobre las cosas que nos importan.

Para mí, sinceramente, el JavaScript avanzado no es una de esas cosas. Pero descubrir nuevas arquitecturas, entender un poco más sobre el software y la informática y hacer algo que refleje mis propios valores sí lo es.

Sin esa ayuda, probablemente la web no existiría en su forma actual. Hacer webs no es mi actividad principal, pero las muchas horas y el cariño que le estoy dedicando me están enseñando sobre un campo que quizá nunca habría explorado de otra forma.

## Por qué lo elegí

Me gusta este enfoque porque mantiene la web cerca del material del que está hecha. El código fuente es legible, el resultado publicado es sencillo y el despliegue es automático.

También creo que más gente debería probar montajes como el mío, sobre todo ahora que la IA facilita las partes técnicas. Puedes hacer páginas que se queden en internet, alojarlas gratis y mantenerlas portables. Si GitHub Pages dejara algún día de ser gratis, o dejara de existir, una web estática como la mía seguiría siendo fácil de alojar en otro sitio.

Y lo más importante: este enfoque te da más control sobre lo que es tu web. No solo sobre su diseño, sino también sobre sus valores. En mi caso, por ejemplo, me gustó poder elegir un montaje que no rastrea a quien visita la web ni vende su información a terceros.

No es la única forma de hacer una web, pero para la mía me parece la adecuada: **archivos sencillos, una publicación sencilla y muy poca maquinaria entre la escritura y quien la lee**.
