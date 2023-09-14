from django.urls import path
from ..views import order_views as views

# '/api/orders/
urlpatterns = [
    path('', views.getOrders, name='orders'),
    path('add/', views.addOrderItems, name='orders-add'),
    path('myorders/', views.getMyOrders, name='myorders'),

    # dynamic values as below, in order to check the concrete paths and avoid treating them as dynamic values
    path('<str:pk>/', views.getOrderById, name='user-order'),
    path('<str:pk>/pay/', views.updateOrderToPaid, name='pay'),
    path('<str:pk>/delivered/', views.updateOrderToDelivered, name='order-delivered'),
]
