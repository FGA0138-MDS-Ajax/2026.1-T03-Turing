from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminViewSet, AlunoViewSet

 
router = DefaultRouter()
router.register(r'administradores', AdminViewSet, basename='admin')
router.register(r'alunos', AlunoViewSet, basename='aluno')

urlpatterns = [
    # (/api/usuarios/administradores/)
    path('', include(router.urls)),
]