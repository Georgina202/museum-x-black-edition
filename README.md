# MUSEUM X — Black Edition

Repositorio: [Georgina202/museum-x-black-edition](https://github.com/Georgina202/museum-x-black-edition)

Aplicación Android de Tarea 6 desarrollada por Georgina Rivas con Ionic Angular standalone, TypeScript, SCSS y Capacitor. Museo digital con ocho herramientas, navegación horizontal y catálogo directo.

## Ejecutar

Requisitos verificados: Node 24.21.0, npm 11.19.0, Java 21.0.11, Android SDK 36. Gradle wrapper incluido (8.14.3). El SDK local se configura en `android/local.properties`, que no se publica.

```sh
npm ci
npm start
npm run build
npx cap sync android
npx cap open android
```

Compilar APK en Mac:

```sh
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
npm run apk
```

Resultado: `android/app/build/outputs/apk/debug/app-debug.apk`. Es un APK de pruebas firmado con clave debug; no una versión firmada para Play Store.

## Ocho salas

1. Portada Sala de colección: galería circular de mármol negro con caja de herramientas sobre pedestal y luz dorada. Arte generado guardado localmente; tipografía y botones HTML reales. Accesos al recorrido y al catálogo.
2. Genderize: nombre, predicción azul/rosa, estado neutro y probabilidad.
3. RandomUser: foto, nombre, apellido, nacimiento y edad. Datos ficticios.
4. Universidades: país en inglés, nombre, dominios y enlaces. Endpoint requerido: `https://adamix.net/proxy.php?country=Dominican+Republic`.
5. Santo Domingo: Open-Meteo, temperatura, sensación, humedad, viento, precipitación, código meteorológico y hora local de la fuente. Son datos modelados, no una lectura de estación local. Fuente: https://open-meteo.com/en/docs
6. PokéAPI: nombre/número, ilustración, experiencia base, habilidades y reproducción por toque de `cries.latest`.
7. WordPress público configurable, logo desde `site_icon_url`, tres entradas recientes, resumen seguro como texto y enlaces originales. 
8. Perfil con datos autorizados; fotografía real incorporada.

Navegación: flechas, gestos horizontales y catálogo directo. Botón Atrás: cierra catálogo o vuelve al historial de salas; desde portada sin historial cierra la aplicación Android. Las consultas caducan y sus resultados se descartan si se cambia de sala. Animaciones respetan movimiento reducido.

## Red y seguridad

Android declara INTERNET, usa HTTPS y desactiva tráfico HTTP de la aplicación. CapacitorHttp nativo habilitado para las consultas en Android; en navegador se usa fetch sujeto a CORS. No requiere permisos de ubicación, cámara ni almacenamiento. Los enlaces de universidades que la API ofrece en HTTP se abren externamente. No se inserta HTML remoto de WordPress: se convierte a texto. Errores HTTP, falta de conexión, resultados vacíos y sonido ausente tienen mensajes visibles.

## Autora

Georgina Rivas · Matrícula 20240032. Fotografía e información de contacto en la vista Acerca de. Icono Android basado en la fotografía de la autora.

## Validación

Compilaciones Angular y Gradle verificadas. La autora confirmó las pruebas en su teléfono Android Samsung Galaxy A14. Las APIs son servicios externos y pueden imponer cuotas o cambiar su disponibilidad.

```sh
node scripts/test-genderize.mjs
```

El informe `API-VALIDATION.json` recoge respuestas verificadas en una fecha concreta. `VALIDATION.md` documenta las comprobaciones y `DESIGN-COVER.md` / `DESIGN-INTERIORS.md` describen la dirección visual y los recursos generados. Las ilustraciones del museo se incluyen localmente; los datos e imágenes de personas, universidades, clima, Pokémon y publicaciones provienen de las APIs indicadas.

## Archivos del repositorio

Se incluyen fuentes, recursos visuales, proyecto Android, Gradle wrapper y archivo de bloqueo npm. Se excluyen dependencias instaladas, carpetas compiladas, rutas locales, archivos de entorno y claves de firma. Los APK se distribuyen como descargas separadas.

## Límite de Genderize

La cuota de Genderize pertenece al servicio externo. Una respuesta HTTP 429 no es una predicción ni un error de conexión. La app interpreta X-Rate-Limit-Reset, conserva el tiempo de espera y muestra la renovación en hora dominicana. Sin cabecera de reinicio, permite reintentar tras un minuto sin inventar una fecha.

Las respuestas válidas se conservan localmente durante siete días (hasta 150 nombres), identificadas como guardadas; repetir un nombre ignora mayúsculas y espacios duplicados y no gasta otra consulta. No se almacenan errores ni predicciones ficticias. Esto no recupera la cuota ya consumida y los nombres no guardados requieren cuota disponible.

Prueba aislada sin red: `node scripts/test-genderize.mjs`. Para ampliar cuota se requiere una autorización propia del proveedor; no se incluye ninguna clave en el APK.
