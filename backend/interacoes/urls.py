from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InscricaoViewSet, ForumViewSet

router = DefaultRouter()

router.register(r'inscricoes', InscricaoViewSet, basename='inscricao')
router.register(r'foruns', ForumViewSet, basename='forum')

urlpatterns = [
    path('', include(router.urls)),
]