from django.urls import reverse
from ..serializers import MyTokenObtainPairSerializer, UserSerializer, UserSerializerWithToken

from ..models import CustomUser as User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.utils import json
# for creating the custom Error Handler (in case of repeating username, which should be unique)
from rest_framework import status
from rest_framework import serializers

# to hash a password
from django.contrib.auth.hashers import make_password

# customizing the JWT response
from rest_framework_simplejwt.views import TokenObtainPairView

# import related with the mailing
from django.template.loader import render_to_string
from django.core.mail.message import EmailMultiAlternatives
from django.conf import settings

import jwt
import requests

import uuid


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError as e:
            return Response({'detail': e.detail['non_field_errors'][0]}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


@api_view(['POST'])
def facebookLogin(request):
    FACEBOOK_URL = "https://graph.facebook.com/"
    data = request.data

    user_id = data["userID"]
    try:
        # get users email
        # https://graph.facebook.com/{your-user-id}?fields=id,email,first_name,last_name&access_token={your-user-access-token}
        user_info_url = FACEBOOK_URL + user_id
        user_info_payload = {
            "fields": "id,email,first_name,last_name",
            "access_token": data["accessToken"],
        }

        user_info_request = requests.get(
            user_info_url, params=user_info_payload)
        user_info_response = json.loads(user_info_request.text)

        users_email = user_info_response["email"]

        existing_user = User.objects.filter(username=users_email)

        if (len(existing_user) == 0):
            user = User.objects.create(
                first_name=user_info_response['first_name'],
                last_name=user_info_response['last_name'],
                username=users_email,
                email=users_email,
                is_confirmed=data['confirmed'],
                password=make_password(user_info_response["id"])
            )
            send_email_to_user(
                user_info_response['first_name']+user_info_response['last_name'], users_email)

            send_email_to_admin(
                user_info_response['first_name']+user_info_response['last_name'], users_email)
        else:
            user = existing_user[0]

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except Exception as e:
        message = {
            'detail': str(e)
        }
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def googleLoginUser(request):
    data = request.data

    token = data["credential"]
    # for creating the custom Error Handler (jwt.decode() error) use try
    try:
        # convert data JWT to dict:
        data = jwt.decode(token, options={"verify_signature": False})

        # if (data["aud"] != settings.__dict__['SOCIAL_AUTH_GOOGLE_OAUTH2_KEY']):
        #     raise Exception("Wrong Google OAUTH2 Key!")
        existing_user = User.objects.filter(username=data['email'])

        if (len(existing_user) == 0):
            user = User.objects.create(
                first_name=data['given_name'],
                last_name=data['family_name'],
                username=data['email'],
                email=data['email'],
                is_confirmed=data['confirmed'],
                password=make_password(data["sub"])
            )

            send_email_to_user(data['name'], data['email'])

            send_email_to_admin(data['name'], data['email'])

        else:
            user = existing_user[0]

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except Exception as e:
        message = {
            'detail': str(e)
        }
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def registerUser(request):
    data = request.data

# for creating the custom Error Handler (in case of repeating username, which should be unique) use try
    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data["password"])
        )

        unique_guid = uuid.uuid5(
            namespace=uuid.NAMESPACE_DNS, name=str(user.date_joined)+data['email'])
        link = f"{'http://localhost:5173/' if settings.DEBUG else request.build_absolute_uri('/')}#/confirmation/{data['email']}+{unique_guid}?redirect=/"
        # print("link", link)
        send_email_to_user(link, data['email'],
                           html_template='email_confirm_new_user.html')

        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)
    except:
        message = {
            'detail': 'User with this email already exists. Please follow the instruction sent in your mailbox. \
                If you haven\'t received any, please write to mravolak@gmail.com'
        }
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def confirmation(request, key):
    email, unique_guid = key.split("+")

    user = User.objects.filter(email=email)[0]

    local_unique_guid = uuid.uuid5(
        namespace=uuid.NAMESPACE_DNS, name=str(user.date_joined)+email)

    if str(unique_guid) == str(local_unique_guid) and (not user.is_confirmed):
        user.is_confirmed = True
        user.save()

        serializer = UserSerializerWithToken(user, many=False)

        send_email_to_user(user.get_full_name(), email)

        return Response(serializer.data)
    else:
        return Response({'detail': 'The activation link is incorrect or has been used already. In case of an error please contact us on mravolak@gmail.com.'}, status=status.HTTP_401_UNAUTHORIZED)


def send_email_to_user(username, usermail, html_template='email_new_user.html'):
    email_template_to_user = render_to_string(
        html_template,
        {
            "username": username,
            "mail": usermail
        })
    email_obj = EmailMultiAlternatives(
        "mravolak.mine.bz - Welcome" if html_template == 'email_new_user.html' else "mravolak.mine.bz - Моля, потвърдете профила си / Please confirm your profile",
        "Email Notification Example body",
        settings.EMAIL_HOST_USER,
        [usermail],
    )
    email_obj.attach_alternative(email_template_to_user, 'text/html')
    email_obj.send()


def send_email_to_admin(username, usermail, way="google"):
    email_template_to_me = render_to_string(
        'email_new_subscription.html',
        {
            "username": username,
            "email": usermail,
            "way": way
        })
    email_obj = EmailMultiAlternatives(
        "Email Notification Example subject to me",
        "Email Notification Example body to me",
        settings.EMAIL_HOST_USER,
        ["viktorbbelchev@gmail.com"],
    )
    email_obj.attach_alternative(email_template_to_me, 'text/html')
    email_obj.send()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    # this user is not the Django User, but it is the one based on the JWT (therefore it is 'user' with small 'u'), because we added JWT
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    # this user is not the Django User, but it is the one based on the JWT (therefore it is 'user' with small 'u'), because we added JWT
    user = request.user
    # we need the updated user with new token
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data

    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']

    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    # this user is not the Django User, but it is the one based on the JWT (therefore it is 'user' with small 'u'), because we added JWT
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    # this user is not the Django User, but it is the one based on the JWT (therefore it is 'user' with small 'u'), because we added JWT
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request, pk):
    user = User.objects.get(id=pk)

    data = request.data

    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']
    user.is_confirmed = data['confirmed']

    user.save()

    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    userToDelete = User.objects.get(id=pk)
    userToDelete.delete()
    return Response('User was deleted')
