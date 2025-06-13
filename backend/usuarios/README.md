# Aplicación: usuario

## Descripción
En donde se administra los roles de la aplicación web
en base al rol del usuario, que puede ser NULL si es invitado,
0 si es usuario y 1 si es administración.En base a este valor
se otorgan privilegios o funciones dentro de la aplicación web.
Solo el superuser puede crear usuarios administradores, al registrarse en la pagina automaticamente al iniciar sesión tendras rol 0 (usuario).

## Cuentas que use:
# usuario:         cristianeduardomontes@gmail.com 123456
# admin:          soulderr@gmail.com barcelona95

## Endpoints principales
- [Ejemplo: `GET /usuario/` - Lista todos los elementos]
- [Ejemplo: `POST /usuario/` - Crea un nuevo elemento]
