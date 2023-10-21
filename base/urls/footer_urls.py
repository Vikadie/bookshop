from django.urls import path
from ..views import footer_views as views

urlpatterns = [
    path('', views.getTerms, name='get-terms'),
    path('check/<str:key>/', views.checkKeyAvailability, name='key-check'),
]
