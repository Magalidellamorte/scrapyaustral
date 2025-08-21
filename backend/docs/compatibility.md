## Compatibilidad por endpoint (SCR-416)

Describe la compatibilidad de los endpoints con la Web del Marketplace.

El estado debe ser una de estas opciones:

1. Usar Como Está (**As-Is**): No requiere cambios, pudiendo usarse de forma directa o con cierta manipulación de los datos. En definitiva, toda la información se encuentra disponible.

2. **Refactorizar**: Requiere modificaciones. Se debe crear un issue de refactor vinculado.

3. **Reemplazar**: Es inviable. Se debe crear un issue para construir un nuevo endpoint.

Precondiciones

| Endpoint                            | Estado                           | Motivo/Decisión                                                                                                                                                                                                                                                                                                                                                                                   |
|-------------------------------------|----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `POST /offers`                      | **Usar Como Está (As-Is)**       | Endpoint completo para creación de anuncios con validación robusta, manejo de imágenes múltiples, procesamiento automático de direcciones geográficas y notificaciones. Totalmente compatible con implementaciones web usando FormData multipart. Las imágenes se redimensionan automáticamente y se almacenan eficientemente.                                                                    |
| `GET /offers`                       | **Usar Como Está (As-Is)**       | El endpoint provee toda la información necesaria para mostrar listas de anuncios con filtros avanzados. Incluye paginación, filtros por categorías, estados, tipos, condiciones, búsqueda por texto, y filtros específicos para usuarios propios/ajenos. La respuesta incluye todas las relaciones necesarias (usuario, categoría, imágenes, dirección, etc.). Compatible con el frontend actual. |
| `GET /offers/{id}`                  | **Usar Como Está (As-Is)**       | Retorna información completa de un anuncio específico incluyendo todas sus relaciones (usuario, categoría, imágenes, postulaciones, torkies, ratings, etc.). La estructura de datos es compatible con las necesidades del frontend para mostrar detalles de anuncios.                                                                                                                             |
| `POST /offers/{offer}/close`        | **Usar Como Está (As-Is)**       | Funcionalidad completa para cerrar anuncios con motivos de cierre. Maneja automáticamente el rechazo de postulaciones pendientes y notificaciones. La respuesta es consistente con el patrón de API. Compatible con el frontend actual.                                                                                                                                                           |
| `POST /offers/{offer}/ask_question` | **Usar Como Está (As-Is)**       | Permite hacer preguntas sobre anuncios creando mensajes de chat destacados. Incluye validación para evitar preguntas duplicadas y manejo de notificaciones. La funcionalidad es completa y compatible con el sistema de chat existente.                                                                                                                                                           |
| **Favoritos**                       | **N/A - Funcionalidad Frontend** | Los favoritos no están implementados en el backend. Actualmente se manejan localmente en el frontend móvil usando AsyncStorage. Para el marketplace web, se puede implementar la misma estrategia de almacenamiento local (localStorage) o crear endpoints específicos si se requiere sincronización entre dispositivos.                                                                          |
| auth/register                       | 2                                | el front espera email/contraseña, el back campos distintos                                                                                                                                                                                                                                                                                                                                        |
| auth/login                          | 1                                | ambos tratan con email y contraseña                                                                                                                                                                                                                                                                                                                                                               |
| postulations (get)                  | 2                                | idem offers (get)                                                                                                                                                                                                                                                                                                                                                                                 |
| offers/{offerId}/postulations       | 2                                | el back permite la opcion de paginacion                                                                                                                                                                                                                                                                                                                                                           |
| notifications (get)                 | 1                                | ambas funcionan igual                                                                                                                                                                                                                                                                                                                                                                             |
| notifications/read_all              | 1                                | no encontre uso de un endpoint que marque como leidas todas las notificaciones de un usuario (si solo una), asi que tecnicamente es compatible con lo existente                                                                                                                                                                                                                                   |
| notifications/count                 | 1                                | compatible, solo requieren la autenticacion del usuario                                                                                                                                                                                                                                                                                                                                           |

## Análisis Detallado - Funcionalidad de Creación de Anuncios

### POST /offers - Crear Anuncio

**Proceso interno completo:**

1. **Validación de datos** (CreateOfferRequest):
   - Validación de campos obligatorios: offer_type_id, category_id, condition_id, title, description, quantity, measure_type_id
   - Validación de dirección obligatoria: street, street_number
   - Validación de límites de caracteres (title: 255, description: 2000)
   - Validación de existencia en tablas relacionadas (FK constraints)

2. **Creación del anuncio**:
   - Asignación automática del usuario autenticado
   - Estado inicial: "Pendiente" (offer_status_id = 1)
   - Fecha de vencimiento automática: +1 mes desde creación
   - Procesamiento de valores opcionales (precios, preferencias de entrega)

3. **Manejo de categorías**:
   - Sincronización con tabla pivot offer_offer_category
   - Almacenamiento de datos específicos por categoría (cantidad, condición, tipo de medida)

4. **Procesamiento de dirección**:
   - Creación automática de provincia, ciudad y barrio si no existen
   - Método `createOrGet` en modelos Province, City, Neighborhood
   - Asociación polimórfica con el anuncio

5. **Procesamiento de imágenes**:
   - Validación de formato y tamaño automática
   - Redimensionamiento a 800x600 manteniendo aspect ratio
   - Compresión JPEG al 60% de calidad
   - Nomenclatura automática con hash único
   - Almacenamiento en storage/public/images/offer/{offer_id}/
   - Registro de metadatos (path, bytes) en base de datos

6. **Notificaciones automáticas**:
   - Push notifications a usuarios suscritos a la categoría
   - Email de notificación a administrador del sistema
   - Manejo de errores silencioso (no bloquea la creación)

**Compatibilidad Web:** ✅ **As-Is**

### Puntos fuertes para implementación web:

1. **FormData multipart estándar**: Compatible con formularios HTML y bibliotecas JS/TS
2. **Validación server-side completa**: Reduce necesidad de validación duplicada en frontend
3. **Manejo robusto de imágenes**: Optimización automática sin intervención del frontend
4. **Creación dinámica de datos geográficos**: Flexibilidad para nuevas ubicaciones
5. **Transacciones implícitas**: Laravel maneja rollback automático en caso de error
6. **Respuestas estructuradas**: JSON consistente para éxito y errores

### Consideraciones de implementación web:

1. **Subida de archivos**: 
   - Usar FormData con Content-Type: multipart/form-data
   - Validar tamaño y tipo en frontend antes del envío
   - Mostrar progreso de subida para mejor UX

2. **Manejo de errores**:
   - Errores 422 contienen detalles específicos por campo
   - Errores 500 pueden ocurrir durante procesamiento de imágenes
   - Implementar retry logic para fallos de red

3. **Campos opcionales**:
   - pick_by_scraper/pick_by_donor como strings "true"/"false"
   - value_with_shipping/value_without_shipping solo para ofertas de venta
   - Coordenadas geográficas opcionales (GPS o geocoding)

4. **Tipos de datos**:
   - quantity es string (permite descripciones como "2 cajas grandes")
   - address[] como array associativo en FormData
   - images[] como array de archivos

### Flujo recomendado para web:

1. **Formulario progresivo**:
   - Paso 1: Tipo de oferta y categoría
   - Paso 2: Detalles del material (título, descripción, cantidad)
   - Paso 3: Dirección con autocompletado
   - Paso 4: Imágenes con preview
   - Paso 5: Revisión y confirmación

2. **Validación híbrida**:
   - Validación inmediata en frontend (UX)
   - Validación definitiva en backend (seguridad)
   - Mostrar errores específicos por campo

3. **Feedback visual**:
   - Loading states durante subida
   - Progress bars para imágenes
   - Confirmación visual al completar

### Diferencias con mobile app:

- **Mobile**: Usa React Native + Formik para validación
- **Web**: Puede usar HTML5 validation + bibliotecas JS
- **Imágenes**: Mobile usa ImagePicker, web usa file input
- **Geolocation**: Mobile tiene GPS nativo, web puede usar Geolocation API

### Tests recomendados:

1. **Validación de campos obligatorios**
2. **Subida de múltiples imágenes**
3. **Creación de nuevas ubicaciones geográficas**
4. **Manejo de errores de validación**
5. **Límites de tamaño de archivos**
6. **Caracteres especiales en descripciones**

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
