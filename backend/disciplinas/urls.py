from django.urls import path, include
from django.contrib import admin

from rest_framework.routers import DefaultRouter
from .views import ConteudoViewSet, DisciplinaViewSet

router = DefaultRouter()
router.register(r'conteudos', ConteudoViewSet, basename='conteudo')
router.register(r'', DisciplinaViewSet, basename='disciplina')

urlpatterns = [
    path('', include(router.urls)),
]