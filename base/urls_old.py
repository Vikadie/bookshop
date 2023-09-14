from django.urls import path
from . import views


# urlpatterns = [
#     # path("", view=views.getRoutes, name="routes"), # it was just for trial
#     path('users/login/', views.MyTokenObtainPairView.as_view(),
#          name='token_obtain_pair'),
#     path("users/register", views.registerUser, name="register"),
#     path("users/profile/", view=views.getUserProfile, name="users-profile"),
#     path("users/", view=views.getUsers, name="users"),
#     path("products/", view=views.getProducts, name="products"),
#     path("products/<str:pk>/", view=views.getProduct, name="product"),
# ]
