from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InscricaoViewSet

router = DefaultRouter()

router.register(r'inscricoes', InscricaoViewSet, basename='inscricao')

urlpatterns = [
    path('', include(router.urls)),
]
