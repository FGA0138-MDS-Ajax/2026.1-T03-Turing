from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InscricaoViewSet, ForumViewSet, MensagemViewSet

router = DefaultRouter()

router.register(r'inscricoes', InscricaoViewSet, basename='inscricao')
router.register(r'foruns', ForumViewSet, basename='forum')
router.register(r'mensagens', MensagemViewSet, basename='mensagem')

urlpatterns = [
    path('', include(router.urls)),
]