from django.contrib import admin
from .models import Usuario
from django.contrib.auth.admin import UserAdmin

class UsuarioAdmin(UserAdmin):
    model = Usuario
    list_display = ('email', 'username', 'first_name', 'last_name', 'rol', 'is_staff', 'is_active')
    list_filter = ('rol', 'is_staff', 'is_active')
    fieldsets = (
        (None, {
            'fields': ('username', 'email', 'password', 'first_name', 'last_name', 'rol')
        }),
        ('Permisos', {
            'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')
        }),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'email', 'password1', 'password2',
                'first_name', 'last_name', 'rol', 'is_staff', 'is_active'
            ),
        }),
    )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

admin.site.register(Usuario, UsuarioAdmin)
