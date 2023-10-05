from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *
# Register your models here.


admin.site.register(Product)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("username", "email", "first_name", "last_name",
                    "is_staff", "is_confirmed",)
    list_filter = ("email", "is_staff", "is_confirmed",)
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal Info", {"fields": ("first_name",
                                      "last_name", "email")}),
        ("Permissions", {"fields": ("is_staff",
         "is_confirmed", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login",
                                        "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email", "password", "password", "is_staff",
                "is_confirmed", "groups", "user_permissions"
            )}
         ),
    )
    search_fields = ("username",)
    ordering = ("email",)


admin.site.register(CustomUser, CustomUserAdmin)
