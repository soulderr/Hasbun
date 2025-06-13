# Aplicación: contacto

## Descripción
Gestiona los mensajes enviados por usuarios desde el formulario de contacto. Los mensajes pueden ser listados y eliminados por un administrador.

## Funcionalidades
- Envío de mensajes por parte de usuarios (autenticados o no)
- Visualización y eliminación de mensajes por parte del administrador

## Modelos
- `MensajeContacto`: contiene nombre, email, mensaje y fecha de envío.

## Endpoints principales
- `POST /contacto/`: Enviar mensaje de contacto
- `GET /contacto/mensajes/`: Listar mensajes (admin)
- `DELETE /contacto/mensajes/<id>/`: Eliminar mensaje (admin)

## Requisitos
- Autenticación JWT para vistas de administración
