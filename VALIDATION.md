# Validación - 22 octubre 2026

- Compilación Angular: correcta, comprobación estricta de plantillas TypeScript activada.
- Gradle assembleDebug: correcto con JDK 21.0.11, Gradle 8.14.3 y SDK 36.
- INTERNET presente en manifest. Tráfico claro deshabilitado.
- Seis endpoints públicos: HTTP 200 y estructura válida (ver informe JSON adjunto).
- Genderize: predicción real y probabilidad.
- RandomUser: resultado con nacimiento y fotografía.
- Universidades: 26 instituciones de Dominican Republic.
- Open-Meteo: datos actuales y zona America/Santo_Domingo.
- PokéAPI: Pikachu, experiencia 112, dos habilidades y URL real de sonido.
- WordPress seleccionado por la usuaria: tres entradas y logo público desde wordpress.org/news.
- CORS: las cinco primeras fuentes respondieron `*`; WordPress reflejó Origin de prueba http://localhost. Esto es una prueba HTTP, no garantía para cualquier sitio WordPress.
- Interfaz móvil revisada en navegador integrado. Se detectó y corrigió la notificación de cambio de estado después de consultas asíncronas.

Pendientes de recursos: repositorio publicado, alojamiento del APK y PDF final con QR reales.

Pruebas en navegador: Genderize (Alex masculino), RandomUser con fecha y edad, clima actual, Pikachu con habilidades. Reproducción de sonido solicitada sin error visible. APK instalado y arrancado en emulador API 37; registros confirman WebView y plugin App sin excepción fatal. La comprobación física del gesto Atrás y audio en un teléfono sigue pendiente.

WordPress comprobado en interfaz: logo real, tres publicaciones, resúmenes y enlaces originales. Perfil con nombre corregido confirmado. Navegación Atrás del navegador comprobada de perfil a revista.

Pokémon inexistente: respuesta HTTP 404 y estado de error visible. Manejo final distingue resultado ausente, límite de consultas, tiempo agotado y error de conexión.

Actualización: fotografía real de la usuaria integrada al perfil y a los iconos Android en cinco densidades, incluidos iconos adaptativos. Referencias al foro retiradas a petición de la usuaria. No se inició el emulador durante esta actualización.

26 octubre 2026 - Portada Sala de colección implementada según opción 3 aprobada. Comprobada en navegador móvil: imagen sin texto integrado, título y controles HTML reales; inicio del recorrido, regreso con Atrás y apertura/cierre de catálogo correctos. Portada sin cabecera de salas ni puntos/flechas. Animación respeta movimiento reducido. Angular y Gradle assembleDebug correctos. No se abrió emulador.

26 octubre 2026 - Interiores Museo sereno y cristal: Angular y Gradle assembleDebug correctos. Genderize Alex y PokéAPI Pikachu consultados en navegador con respuestas reales; campo enfocado conserva texto nítido y borde dorado; información Genderize desplegable verificada. Alpha de superficies 18-22%, foco 30-38%, blur 4px. La fotografía del cielo se identifica como ilustración. No se abrió emulador.

Revisión del enunciado: ocho vistas implementadas. Seis APIs comprobadas otra vez con HTTP 200. Pendientes: repositorio remoto publicado, URL pública APK y prueba física completa. La portada utiliza arte generado de caja de herramientas, no fotografía documental. Foro no publicado por indicación de la usuaria, aunque figura en el enunciado. PDF a cargo de la usuaria. Transparencia final: superficies 8-10%, foco 18-22%, blur 2px; compilaciones Angular y Gradle correctas.

27 octubre 2026 - Genderize HTTP 429 real: límite 10, restantes 0, reinicio indicado por cabecera. Corregido manejo de cuota, persistencia de espera y caché normalizada de respuestas válidas (7 días / 150 nombres). Pruebas aisladas de caché, caducidad, renovación, última consulta, almacenamiento no disponible y respuesta inválida correctas. Angular y Gradle correctos. Sin emulador.

27 octubre 2026 - La autora confirmó la validación funcional en su teléfono. Foro excluido por indicación expresa. Publicación del repositorio público con fotografía y contacto autorizada por la autora. PDF a cargo de la autora.
