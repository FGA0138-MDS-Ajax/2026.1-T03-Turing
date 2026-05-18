from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfessorViewSet, AdminViewSet

router = DefaultRouter()
router.register(r'administradores', AdminViewSet, basename='admin')

router = DefaultRouter()
router.register(r'Professores', ProfessorViewSet, basename='professor')

urlpatterns = [
    # (/api/usuarios/administradores/)
    path('', include(router.urls)),
]