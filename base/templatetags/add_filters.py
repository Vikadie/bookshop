from django import template

register = template.Library()


@register.filter(name='private')
def private(obj, attribute):
    """Returns private fields"""
    return getattr(obj, attribute)


@register.filter(name='multiply')
def multiply(value, arg):
    """Multiply two values integer value"""
    return float(value) * float(arg)


@register.filter(name='toFixed')
def toFixed(value, arg):
    """round float "value" number to arg"""
    return f"{round(float(value), int(arg)):.2f}"
