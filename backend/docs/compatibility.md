## Compatibilidad por endpoint (SCR-416)

Describe la compatibilidad de los endpoints con la Web del Marketplace.

El estado debe ser una de estas opciones:

1. Usar Como Está (**As-Is**): No requiere cambios, pudiendo usarse de forma directa o con cierta manipulación de los datos. En definitiva, toda la información se encuentra disponible.

2. **Refactorizar**: Requiere modificaciones. Se debe crear un issue de refactor vinculado.

3. **Reemplazar**: Es inviable. Se debe crear un issue para construir un nuevo endpoint.

Precondiciones

| Endpoint | Estado | Motivo/Decisión |
|---|---|---|
| `GET /offers` | **Usar Como Está (As-Is)** | El endpoint provee toda la información necesaria para mostrar listas de anuncios con filtros avanzados. Incluye paginación, filtros por categorías, estados, tipos, condiciones, búsqueda por texto, y filtros específicos para usuarios propios/ajenos. La respuesta incluye todas las relaciones necesarias (usuario, categoría, imágenes, dirección, etc.). Compatible con el frontend actual. |
| `GET /offers/{id}` | **Usar Como Está (As-Is)** | Retorna información completa de un anuncio específico incluyendo todas sus relaciones (usuario, categoría, imágenes, postulaciones, torkies, ratings, etc.). La estructura de datos es compatible con las necesidades del frontend para mostrar detalles de anuncios. |
| `POST /offers/{offer}/close` | **Usar Como Está (As-Is)** | Funcionalidad completa para cerrar anuncios con motivos de cierre. Maneja automáticamente el rechazo de postulaciones pendientes y notificaciones. La respuesta es consistente con el patrón de API. Compatible con el frontend actual. |
| `POST /offers/{offer}/ask_question` | **Usar Como Está (As-Is)** | Permite hacer preguntas sobre anuncios creando mensajes de chat destacados. Incluye validación para evitar preguntas duplicadas y manejo de notificaciones. La funcionalidad es completa y compatible con el sistema de chat existente. |
| **Favoritos** | **N/A - Funcionalidad Frontend** | Los favoritos no están implementados en el backend. Actualmente se manejan localmente en el frontend móvil usando AsyncStorage. Para el marketplace web, se puede implementar la misma estrategia de almacenamiento local (localStorage) o crear endpoints específicos si se requiere sincronización entre dispositivos. |

## Análisis Detallado

### Comportamiento Endpoints de Anuncios

#### GET /offers - Lista de Anuncios
**Proceso interno:**
1. El controlador recibe los parámetros de filtrado desde la query string
2. Aplica el filtro utilizando `OfferFilter` que permite filtrar por:
   - `own`: Anuncios propios vs. de otros usuarios
   - `offerTypes`: Tipos de oferta (vender, donar, etc.)
   - `offerStatuses`: Estados (pendiente, finalizado, etc.)
   - `categories`: Categorías de materiales
   - `conditions`: Condición del material
   - `search`: Búsqueda por título o descripción
3. Aplica lógica especial para usuarios tipo "torky":
   - Filtra por zona específica (neighborhood_id: 368)
   - Excluye anuncios que ya tienen torkies asignados
   - Aumenta el límite de paginación a 1000
4. Carga relaciones automáticamente: `user`, `category`, `offerType`, `address`, `images`, etc.
5. Ordena por fecha de creación descendente
6. Aplica paginación y retorna con metadatos de paginación

**Compatibilidad Web:** ✅ **As-Is**
- Todos los filtros necesarios están disponibles
- La paginación es estándar y compatible
- Las relaciones cargadas incluyen toda la información necesaria
- El formato de respuesta es consistente con patrones REST

#### GET /offers/{id} - Anuncio Específico
**Proceso interno:**
1. Busca el anuncio por ID utilizando model binding de Laravel
2. Carga automáticamente todas las relaciones definidas en el modelo
3. Incluye información especial para torkies y postulaciones del usuario actual
4. Retorna el objeto completo con todas sus relaciones

**Compatibilidad Web:** ✅ **As-Is**
- Información completa del anuncio disponible
- Todas las relaciones necesarias están incluidas
- Estructura de datos clara y bien definida

#### POST /offers/{offer}/close - Cerrar Anuncio
**Proceso interno:**
1. Valida que el anuncio no esté ya cerrado
2. Rechaza automáticamente todas las postulaciones pendientes o aceptadas
3. Envía notificaciones push a los postulantes afectados
4. Actualiza el estado del anuncio y asigna el motivo de cierre
5. Retorna respuesta de éxito/error estructurada

**Compatibilidad Web:** ✅ **As-Is**
- Funcionalidad completa de cierre de anuncios
- Manejo automático de notificaciones (aunque en web podríían ser diferentes)
- Validaciones adecuadas
- Respuesta consistente

#### POST /offers/{offer}/ask_question - Preguntar sobre Anuncio
**Proceso interno:**
1. Valida que el usuario no haya hecho una pregunta previamente
2. Crea un mensaje de chat destacado (`highlighted: true`)
3. Envía notificación push al propietario del anuncio
4. Retorna respuesta de éxito/error

**Compatibilidad Web:** ✅ **As-Is**
- Integración completa con sistema de chat
- Validaciones apropiadas para evitar spam
- Notificaciones automáticas (adaptables para web)

### Consideraciones Adicionales

#### Autenticación
- Todos los endpoints requieren autenticación Bearer token
- Compatible con implementaciones web estándar
- El token se puede obtener del endpoint `/auth/login`

#### Paginación
- Utiliza el patrón estándar de Laravel con metadatos completos
- Includes `current_page`, `total`, `per_page`, etc.
- Compatible con bibliotecas de paginación frontend estándar

#### Filtros
- Sistema de filtros robusto y extensible
- Query parameters estándar
- Compatibles con formularios web y manipulación de URL

#### Imágenes
- Las rutas de imágenes son relativas al storage público
- Requiere configuración del servidor web para servir archivos estáticos
- Compatible con CDN si es necesario

### Recomendaciones para Implementación Web

1. **Reutilizar lógica de filtros**: Los mismos parámetros de query funcionarán en web
2. **Implementar favoritos localmente**: Usar localStorage inicialmente, migrar a backend si se requiere sincronización
3. **Adaptar notificaciones**: Convertir las push notifications a notificaciones web o email
4. **Optimizar carga de imágenes**: Implementar lazy loading para mejorar performance
5. **Mantener compatibilidad de API**: No modificar los endpoints existentes para preservar compatibilidad con mobile
