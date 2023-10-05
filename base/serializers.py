from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework import serializers
# from django.contrib.auth.models import User
from .models import Order, OrderItem, Product, ShippingAddress, Review, CustomUser
import os


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data


# customizing the JWT response
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """If we just want to add info without changing the returning pair we can go simply overwtiting the get_token classmethod
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['message'] = 'hello world'
        # ...

        return token"""
    """to modify the pair intead go inside the TokenObtainPairSerializer and override the validate method instead"""

    def validate(self, attrs):
        data = super().validate(attrs)
        print(f"self.user.is_confirmed {self.user.is_confirmed}")
        if (self.user.is_confirmed):
            serializer = UserSerializerWithToken(self.user).data
        else:
            raise serializers.ValidationError(
                f"Моля следвайте инструкциите от mravolak.mine.bz изпратени на {self.user} / Please follow instruction from mravolak.mine.bz sent to {self.user}")
        for k, v in serializer.items():
            data[k] = v

        return data


# 1/ customizing the User
class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    lastName = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    confirmed = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', '_id', 'username',
                  'email', 'name', 'lastName', 'isAdmin', 'confirmed']

    def get_name(self, obj):  # obj is the user object here
        name = obj.first_name
        if name == "":
            name = obj.email
        return name

    def get_lastName(self, obj):  # obj is the user object here
        return obj.last_name

    def get__id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_staff

    def get_confirmed(self, obj):
        return obj.is_confirmed


# 2/ cutomizing the new User
class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', '_id', 'username', 'email',
                  'name', 'last_name', 'isAdmin', 'token', 'confirmed']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_shippingAddress(self, obj):
        try:
            address = ShippingAddressSerializer(
                obj.shippingaddress, many=False).data
        except:
            address = False
        return address

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data
