from rest_framework import generics
from rest_framework.generics import ListCreateAPIView
from disciplinas.models import Material


class MaterialCreateListView(generics,ListCreateAPIView):
    queryset = Material.objects.all()
    serializer_class = None

class MaterialRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Material.objects.all()
    serializer_class = None