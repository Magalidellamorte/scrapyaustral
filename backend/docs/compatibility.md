## Compatibilidad por endpoint (SCR-416)

Describe la compatibilidad de los endpoints con la Web del Marketplace.

El estado debe ser una de estas opciones:

1. Usar Como Está (**As-Is**): No requiere cambios, pudiendo usarse de forma directa o con cierta manipulación de los datos. En definitiva, toda la información se encuentra disponible.

2. **Refactorizar**: Requiere modificaciones. Se debe crear un issue de refactor vinculado.

3. **Reemplazar**: Es inviable. Se debe crear un issue para construir un nuevo endpoint.

Precondiciones

| Endpoint | Estado | Motivo/Decisión |
|---|---|---|

auth/register | 2 | el front espera email/contraseña, el back campos distintos

auth/login | 1 | ambos tratan con email y contraseña

offers (get) | 2 | el offers del backend es un endpoint mucho mas sofisticado, con filtros y paginacion

offers (post) | 3 | el frontend y el backend tienen una forma muy diferente de funcionar: el back espera que se manden imagenes, ningun estudio quimico, etc, el front espera un endpoint para subir imagenes y analisis, conseguir las urls, mandarlas al back, y como esto varias diferencias en pasos. son incompatibles, hay que rehacer casi todo.

offers/{offerId} | 1 | sin contar el uso de supabase, ambos tratan con un id

postulations (get) | 2 | idem offers (get)

offers/{offerId}/postulations | 2 | el back permite la opcion de paginacion

notifications (get) | 1 | ambas funcionan igual

notifications/read_all | 1 | no encontre uso de un endpoint que marque como leidas todas las notificaciones de un usuario (si solo una), asi que tecnicamente es compatible con lo existente

notifications/count | 1 | compatible, solo requieren la autenticacion del usuario








