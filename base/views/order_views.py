from datetime import datetime
import os
import pytz

# import related with the mailing
from django.template.loader import render_to_string
from django.core.mail.message import EmailMultiAlternatives
from django.conf import settings

import requests
from ..models import Product, Order, ShippingAddress, OrderItem
from ..serializers import OrderSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

# create an endpoint to see an order


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user

    try:
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({"detail": "Not Authorized to view this order"}, status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response({"detail": "Order does not exist"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user

    orders = user.order_set.all()

    serializer = OrderSerializer(orders, many=True)

    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()

    serializer = OrderSerializer(orders, many=True)

    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id=pk)

    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()
    return Response('Order was paid')


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)

    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()
    return Response('Order was delivered')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user

    data = request.data
    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({"detail": "No Order Items"}, status=status.HTTP_400_BAD_REQUEST)

    # (1) Create the order
    order = Order.objects.create(
        user=user,
        paymentMethod=data['paymentMethod'],
        taxPrice=data['taxPrice'],
        shippingPrice=data['shippingPrice'],
        totalPrice=data['totalPrice']
    )
    # (2) create shipping items
    shipping = ShippingAddress.objects.create(
        order=order,
        address=data['shippingAddress']['address'],
        city=data['shippingAddress']['city'],
        postalCode=data['shippingAddress']['postalCode'],
        country=data['shippingAddress']['country'],
        shippingPrice=data['shippingPrice'],
        office=data['shippingAddress']['office'],
        forwarder=data['shippingAddress']['forwarder']
    )
    # (3) create order items and set order to orderItem relationship
    for i in orderItems:
        product = Product.objects.get(_id=i['product'])

        item = OrderItem.objects.create(
            product=product,
            order=order,
            name=product.name,
            qty=i['qty'],
            price=i['price'],
            image=product.image.url
        )

        # (4) update the product countInStock
        product.countInStock -= int(item.qty)
        product.save()

    send_email_to_user(order, orderItems, shipping,
                       user.email, request.build_absolute_uri('/'))

    serializer = OrderSerializer(order, many=False)

    return Response(serializer.data)


def send_email_to_user(order, orderItems, shipping, usermail, url, html_template='order_confirmation.html'):
    shipping_address = ""
    if shipping.forwarder != "other":
        shipping_address += "office " + shipping.forwarder + " "
    shipping_address += shipping.address + " " + shipping.city + \
        " " + shipping.postalCode + " " + shipping.country
    local_tz = pytz.timezone('Europe/Sofia')
    created_at = order.createdAt.astimezone(
        local_tz).strftime('%d-%m-%Y %H:%M')
    context = {
        "current_url": url,
        "order_number": order._id,
        "created_at": created_at + "(Sofia time)",
        "shipping_address": shipping_address,
        "payment_method": order.paymentMethod,
        "ordered_items": orderItems,
        "order_net_amount": order.totalPrice - order.taxPrice - order.shippingPrice,
        "order_shipping_amount": order.shippingPrice,
        "order_tax": order.taxPrice,
        "order_total": order.totalPrice,
        "user_mail": usermail
    }
    email_template_to_user = render_to_string(
        html_template, context=context
    )
    email_obj = EmailMultiAlternatives(
        "mravolak.mine.bz - Yout order " +
        str(order._id) + " has been received",
        "Email Notification Example body",
        settings.EMAIL_HOST_USER,
        [usermail],
        ["viktorbbelchev@gmail.com"]
    )
    email_obj.attach_alternative(email_template_to_user, 'text/html')
    email_obj.send()


@api_view(['POST'])
def getSpeedy(request):
    payload = request.data
    payload["userName"] = os.environ.get('SPEEDY_API_USERNAME')
    payload["password"] = os.environ.get('SPEEDY_API_PASSWORD')
    # get the response from the URL
    # using `json=` automatically transforms "payload" to JSON and adds 'Content-Type': 'application/json' in headers
    try:
        response = requests.post(
            'https://api.speedy.bg/v1/location/office/nearest-offices', json=payload)
        # print(response.status_code)
        if (response.status_code == 200):
            result = response.json()
        else:
            raise Exception(
                f"Speedy's api is currently unavailable. Response type: {response.status_code}")
    except Exception as e:
        result = {"offices": [],
                  "error": {"message": str(e)},
                  "status": response.status_code}
    # print(result)
    return Response(result)
