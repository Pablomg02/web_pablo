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

La herramienta que convierte Markdown en HTML es **Eleventy**, un generador de sitios estáticos que funciona sobre Node.js. En la práctica, Eleventy lee los archivos Markdown, aplica las plantillas Nunjucks que definen el diseño, copia los recursos y escribe la web estática final en la carpeta *_site*.

La idea básica es que puedo escribir páginas y notas en **Markdown**, un formato de texto plano cómodo para escribir y fácil de mantener con control de versiones. Después, una plantilla envuelve ese contenido, de modo que cada página mantiene la misma estructura sin que yo tenga que repetir el mismo diseño a mano.

Escribir en Markdown me resulta útil porque es sencillo, pero también es útil para las personas y los sistemas que leen la web. Quien la visita recibe sobre todo HTML, CSS y JavaScript sencillos. El navegador no tiene que construir la página a partir de una aplicación compleja, y los buscadores pueden leer el contenido sin necesidad de entender un gran framework en el lado del cliente.

## Archivos estáticos

El resultado de la compilación es una **web estática**. La web publicada está hecha de archivos: documentos HTML, hojas de estilo, scripts, imágenes y metadatos.

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

Y lo más importante: este enfoque te da más control sobre lo que es tu web. No solo sobre su diseño, sino también sobre sus valores. En mi caso, por ejemplo, me gustó poder elegir un montaje que no vende la información de los usuarios a terceros.

No es la única forma de hacer una web, pero para la mía me parece la adecuada: **archivos sencillos, una publicación sencilla y muy poca maquinaria entre la escritura y quien la lee**.
