from django.urls import path
from ..views import product_views as views


urlpatterns = [
    # admin part first
    path("create/", view=views.createProduct, name="create-product"),
    path("upload/", view=views.uploadImage, name="image-upload"),
    path("delete/<str:pk>/", view=views.deleteProduct, name="delete-product"),
    path("update/<str:pk>/", view=views.updateProduct, name="update-product"),

    path('top/', view=views.getTopProducts, name='get-top-products'),
    path("", view=views.getProducts, name="products"),
    path("<str:pk>/reviews/", view=views.createProductReview, name="create-review"),
    path("<str:pk>/", view=views.getProduct, name="product"),
]
