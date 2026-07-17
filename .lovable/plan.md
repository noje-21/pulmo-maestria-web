## Objetivo
Hacer que el botón "UNIRME AL ATENEO" en `AteneoPromo.tsx` coincida en tamaño, proporción y posición con el botón azul original del flyer `ateneo-flyer-blank.png`.

## Diagnóstico
Actualmente el botón usa un ancho compartido con el bloque de credenciales (~55% del contenedor) y padding en `cqw`, lo que lo hace más ancho y con distinta altura que el botón dibujado en el flyer original. En el flyer, el botón:
- Ocupa aproximadamente el 40–45% del ancho del contenedor (no todo el ancho del bloque izquierdo).
- Es una píldora más compacta y baja.
- Está alineado a la izquierda, no centrado sobre el bloque de credenciales.

## Cambios en `src/features/ateneos/components/AteneoPromo.tsx`
1. Separar visualmente el botón del bloque de credenciales:
   - Quitar el ancho compartido (`width: 55%`) del contenedor padre.
   - Dar al botón un ancho propio ajustado al del flyer (~42cqw) y auto-height por padding.
2. Ajustar padding y tipografía del botón:
   - Reducir padding vertical (~0.9cqw) y horizontal (~1.6cqw).
   - Bajar el `font-size` a ~1.55cqw para que la píldora quede compacta como en el flyer.
   - Reducir el ícono de video a ~1.6cqw.
3. Reposicionar:
   - Mantener `left: 9%` y ajustar el `top` para que quede sobre la zona correspondiente del flyer.
   - Colocar el bloque de credenciales debajo con su propio ancho (~52cqw), sin compartir contenedor de ancho con el botón.
4. Verificar en móvil (375, 390) y escritorio (1280) que el botón conserve proporción respecto al flyer y no se solape con las credenciales.

## Verificación
Capturar screenshots con Playwright a 375px, 768px y 1280px, comparando el botón renderizado con el botón del PNG del flyer para confirmar coincidencia visual.
