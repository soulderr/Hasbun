Aplicacion principal del proyecto en donde se encuentran
las urls generales del proyecto, las configuraciones,
y toda la columna del proyecto de backend realizado con Django.

Proyecto esta configurado para ejecutar una base de datos
MySQL, lo debes ajustar a tus parametros.

# Crear base de datos vacia [nombre], contraseña si tienes[contraseña],el host y el puerto depende de tu configuracion puede variar.Luego realizar los python manage.py makemigrations para realizar todas las migracionesde las tablas y luego python manage.py migrate para ejectuar. recuerda estar en la carpeta backend donde se encuentra el archivo manage.py

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': '[nombre]',
        'USER': 'root',
        'PASSWORD': '[contraseña]',
        'HOST': 'localhost',
        'PORT': '3308',
    }
}

# Tambien recordar que Django tiene incorporado un superuser que se puede crear con el comandopython manage.py createsuperuser, tendras que ingresar sus credenciales y luego tendras que ir al servidor que se esta ejecutando el backend (python manage.py runserver) y poner /admin, teniendo acceso a todas las tablas de la BD.

# 🧠 ¿Qué hace exactamente?
# Este comando exporta todo el contenido de tu base de datos a un archivo JSON (datos_iniciales.json) que luego puedes reutilizar para importar esos mismos datos en otra instancia del proyecto.

# 🧾 Desglose de la instrucción
# python manage.py dumpdata:	Exporta todos los datos de la base de datos a un archivo JSON
# --natural-foreign:	Usa identificadores legibles en claves foráneas (por ejemplo, nombres en lugar de IDs)
# --indent 4:	Aplica sangría de 4 espacios para que el JSON resultante sea más legible
# > datos_iniciales.json:	Redirige la salida del comando al archivo datos_iniciales.json

# 🛠 ¿Cómo lo uso después?
# Para importar los datos en otro dispositivo, basta con correr:

# bash

# python manage.py loaddata datos_iniciales.json
# Eso poblará automáticamente la base de datos con los datos exportados.

