## Compatibilidad por endpoint (SCR-416)

Describe la compatibilidad de los endpoints con la Web del Marketplace.

El estado debe ser una de estas opciones:

1. Usar Como Está (**As-Is**): No requiere cambios, pudiendo usarse de forma directa o con cierta manipulación de los datos. En definitiva, toda la información se encuentra disponible.

2. **Refactorizar**: Requiere modificaciones. Se debe crear un issue de refactor vinculado.

3. **Reemplazar**: Es inviable. Se debe crear un issue para construir un nuevo endpoint.

Precondiciones

| Endpoint | Estado | Motivo/Decisión |
|---|---|---|
| `POST /offers` | **Usar Como Está (As-Is)** | Endpoint completo para creación de anuncios con validación robusta, manejo de imágenes múltiples, procesamiento automático de direcciones geográficas y notificaciones. Totalmente compatible con implementaciones web usando FormData multipart. Las imágenes se redimensionan automáticamente y se almacenan eficientemente. |

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
