import json
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.


"""
without Django-Rest-Framework
def getRoutes(request):
    routes = [
        '/api/products/',
        '/api/products/create/',

        '/api/products/upload/',

        '/api/products/<id>/reviews/',

        '/api/products/top/',
        '/api/products/<id>/',

        '/api/products/delete/<id>/',
        '/api/products/<update>/<id>/',
    ]
    # with JsonResponse we need to provide safe=False, unless we pass in a Disctionary instead of "Hello" string (or tuple, list, etc.)
    # return JsonResponse("Hello", safe=False)
    return JsonResponse(routes, safe=False)


def getProducts(request):
    # adding json_dumps_params={'ensure_ascii': False} to be able to read cylliric
    return JsonResponse(products, safe=False, json_dumps_params={'ensure_ascii': False})
    # other options to read cylliric in the response:
    # return HttpResponse(json.dumps(products, ensure_ascii=False),
    #                     content_type="application/json")
"""


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/products/',
        '/api/products/create/',

        '/api/products/upload/',

        '/api/products/<id>/reviews/',

        '/api/products/top/',
        '/api/products/<id>/',

        '/api/products/delete/<id>/',
        '/api/products/<update>/<id>/',
    ]

    return Response(routes)
