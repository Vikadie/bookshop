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
def createTerm(request):
    data = request.data

    if FooterTerms.objects.filter(mainKey=data["mainKey"]):
        return Response({"detail": "mainKey does exist already"}, status=status.HTTP_400_BAD_REQUEST)
    # (1) Create the new term
    footerTerm = FooterTerms.objects.create(
        mainKey=data["mainKey"],
        titleBg=data['titleBg'],
        titleEn=data['titleEn'],
        htmlBg=data['htmlBg'],
        htmlEn=data['htmlEn']
    )

    serializer = FooterTermsSerializer(footerTerm, many=False)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def updateTerm(request):
    changedTerm = request.data

    try:
        term = FooterTerms.objects.get(id=changedTerm["id"])
        term.mainKey = changedTerm["mainKey"]
        term.titleBg = changedTerm['titleBg']
        term.titleEn = changedTerm['titleEn']
        term.htmlBg = changedTerm['htmlBg']
        term.htmlEn = changedTerm['htmlEn']
        term.save()
        serializer = FooterTermsSerializer(term, many=False)
        return Response(serializer.data)
    except:
        return Response({"detail": "mainKey does not exist"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteTerm(request, pk):
    termToDelete = FooterTerms.objects.get(id=pk)
    termToDelete.delete()
    return Response({"action": "Term Deleted"})
