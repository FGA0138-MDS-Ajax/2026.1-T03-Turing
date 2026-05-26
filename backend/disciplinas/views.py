from rest_framework import generics
from rest_framework.generics import ListCreateAPIView
from disciplinas.models import Material
from disciplinas.serializers import MaterialSerializer


class MaterialCreateListView(generics.ListCreateAPIView):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer

class MaterialRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer