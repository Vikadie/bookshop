from django.urls import path
from ..views import footer_views as views

urlpatterns = [
    path('', views.getTerms, name='get-terms'),
    path('create/', views.createTerm, name='create-term'),
    path('update/', views.updateTerm, name='update-term'),
    path('delete/<str:pk>/', views.deleteTerm, name='delete-term'),
    path('check/<str:key>/', views.checkKeyAvailability, name='term-check'),
]
