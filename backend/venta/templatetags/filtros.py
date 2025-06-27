from django import template

register = template.Library()

@register.filter
def formatear_miles(valor):
    try:
        valor = int(round(float(valor)))
        return f"{valor:,}".replace(",", ".")
    except:
        return valor
