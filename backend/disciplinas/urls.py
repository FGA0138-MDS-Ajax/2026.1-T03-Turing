from django.urls import path, include
from django.contrib import admin

from rest_framework.routers import DefaultRouter
from .views import ConteudoViewSet, DisciplinaViewSet, DisciplinaPrerequisitoViewSet

router = DefaultRouter()
router.register(r'conteudos', ConteudoViewSet, basename='conteudo')
router.register(r'disciplinas', DisciplinaViewSet, basename='disciplina')
router.register(r'prerequisitos', DisciplinaPrerequisitoViewSet, basename='prerequisito')

urlpatterns = [
    path('', include(router.urls)),
]