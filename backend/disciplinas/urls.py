from django.urls import path, include
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from .views import ConteudoViewSet, DisciplinaViewSet, MaterialViewSet
router = DefaultRouter()
router.register(r'conteudos', ConteudoViewSet, basename='conteudo')
router.register(r'', DisciplinaViewSet, basename='disciplina')
router.register(r'disciplinas/materiais', MaterialViewSet, basename='materiais')


urlpatterns = [
    #path('materiais/', MaterialCreateListView.as_view(), name='materiais-create-view'),
    #path('materiais/<int:pk>/', MaterialRetrieveUpdateDestroyAPIView.as_view(), name='materiais-detail-view'),
    path('', include(router.urls)),
]



