from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InscricaoViewSet, ForumViewSet, MensagemViewSet, DenunciaViewSet

router = DefaultRouter()

router.register(r'inscricoes', InscricaoViewSet, basename='inscricao')
router.register(r'foruns', ForumViewSet, basename='forum')
router.register(r'mensagens', MensagemViewSet, basename='mensagem')
router.register(r'denuncias', DenunciaViewSet, basename='denuncia')

urlpatterns = [
    path('', include(router.urls)),
]