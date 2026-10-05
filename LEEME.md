# Invitación de boda · Aureliano & Ester

## Estructura (súbela completa a GitHub, con las mismas carpetas)
- index.html: textos y estructura
- css/style.css: colores (arriba, en :root), tipografías y animaciones
- js/main.js: bloque CONFIG (lugar, mapa, fotos, música, URL del formulario) y la lógica
- apps-script/Code.gs: código para guardar confirmaciones en Google Sheets
- fotos/ y musica/: tus archivos propios

## Qué cambiar y dónde
1. Lugar, dirección y enlace de "Cómo llegar": js/main.js > CONFIG (lugar, direccion, mapaUrl). El mapa incorporado se cambia en index.html (etiqueta iframe de la sección Invitación)
2. Fotos: guárdalas en fotos/ con estos nombres: foto_novios.jpeg (portada), vestimenta.jpeg (código de vestimenta) y galeria_1.jpeg ... galeria_4.jpeg. Si falta un archivo, la página muestra un marcador con su nombre
3. Decoración con imágenes (opcional): coloca en decoracion/ rama_esquina.webp, flor_espiritu_santo.webp, cordon.webp y sello.webp (fondo transparente). Detalles en decoracion/LEEME.txt
3. Música: guarda el MP3 en musica/ y escribe CONFIG.musica = "musica/cancion.mp3"
4. Colores: css/style.css > :root
5. Vista previa en WhatsApp: en index.html, pon en og:image la dirección completa de tu foto de portada ya publicada

## Confirmaciones en Google Sheets
1. Crea una hoja y escribe en la fila 1: Fecha | Nombre | Personas | Asistencia | Mensaje
2. Extensiones > Apps Script: pega el contenido de apps-script/Code.gs y guarda
3. Implementar > Nueva implementación > Aplicación web. Ejecutar como: yo. Acceso: cualquier persona
4. Copia la URL y pégala en CONFIG.scriptUrl (js/main.js)
5. Si cambias el script, crea una nueva implementación
6. Prueba enviando una confirmación y bórrala después

## Publicar en GitHub Pages
1. Crea un repositorio público en github.com
2. Add file > Upload files: sube todo el contenido de esta carpeta, manteniendo carpetas
3. Settings > Pages > Branch: main, carpeta / (root) > Save
4. Tu enlace: https://tu-usuario.github.io/nombre-del-repositorio/
