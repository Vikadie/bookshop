from ..models import FooterTerms
from ..serializers import FooterTermsSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


@api_view(["GET"])
def getTerms(request):
    terms = FooterTerms.objects.all()

    serializer = FooterTermsSerializer(terms, many=True)

    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def checkKeyAvailability(request, key):
    print(key)
    existingKey = FooterTerms.objects.filter(mainKey=key)
    if len(existingKey) > 0:
        return Response(True)
    else:
        return Response(False)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def createTermsByKey(request):
    data = request.data
    # (1) Create the order
    footerTerm = FooterTerms.objects.create(
        mainKey=data["key"],
        titleBg=data["key"]['titleBg'],
        titleEn=data["key"]['titleEn'],
        htmlBg=data["key"]['htmlBg'],
        htmlEn=data["key"]['htmlEn']
    )

    serializer = FooterTermsSerializer(footerTerm, many=False)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def updateTermsByKey(request, changedTerm):
    try:
        term = FooterTerms.objects.get(mainKey=changedTerm["key"])
        term.titleBg = changedTerm["key"]['titleBg'],
        term.titleEn = changedTerm["key"]['titleEn'],
        term.htmlBg = changedTerm["key"]['htmlBg'],
        term.htmlEn = changedTerm["key"]['htmlEn']
        term.save()
        serializer = FooterTermsSerializer(term, many=False)
        return Response(serializer.data)
    except:
        return Response({"detail": "mainKey does not exist"}, status=status.HTTP_400_BAD_REQUEST)
