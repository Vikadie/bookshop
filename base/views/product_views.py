from ..models import Product, Review
from ..serializers import ProductSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')
    if (query == None):
        query = ''

    # name__icontains=query means if the query is part of the name of a product (i means it is case insensitive)
    products = Product.objects.filter(
        Q(name__icontains=query) | Q(description__icontains=query)).order_by('-createdAt')

    # we need to paginate now
    # we take to page as search params from the front-end
    page = request.query_params.get('page')
    paginator = Paginator(products, 5)

    if page == None:
        page = 1

    page = int(page)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:  # if we have not sent a page at all
        products = paginator.page(1)  # we start from the first page
    except EmptyPage:  # if for some reason there is no content on the page sent by FE
        # we return the last possible page
        products = paginator.page(paginator.num_pages)

    # we are serizlizing many products
    serializer = ProductSerializer(products, many=True)
    return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages})


@api_view(['GET'])
def getTopProducts(request):
    # filter products by raging which is >= 4, ordered by rating, descending (with - in front)
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(_id=pk)

    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']

    product.save()
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    # will just prefill the data, that will be updated in the FE afterwards and sent to update endpoint
    user = request.user
    product = Product.objects.create(
        user=user,
        name='Sample Name',
        brand='Sample Brand',
        category='Sample Category',
        description='',
        price=0,
        countInStock=0,
    )

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    productToDelete = Product.objects.get(_id=pk)
    productToDelete.delete()
    return Response('Product Deleted')


@api_view(['POST'])
@permission_classes([IsAdminUser])
def uploadImage(request):
    data = request.data

    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)

    # we need to send form-data from the front-end by using the 'multipart/form-data'
    product.image = request.FILES.get('image')
    product.save()
    return Response('Image was uploaded')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    product = Product.objects.get(_id=pk)
    user = request.user
    data = request.data

    # 1 scenario. review already exists => stop it
    alreadyExists = product.review_set.filter(user=user).exists()

    if alreadyExists:
        content = {'detail': 'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 2. no rating or 0 => stop it
    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 3. create review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )

        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        product.rating = sum([r.rating for r in reviews]) / len(reviews)

        product.save()
        return Response("Review added")
