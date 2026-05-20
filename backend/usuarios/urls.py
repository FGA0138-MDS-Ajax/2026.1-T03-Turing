from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfessorViewSet, AdminViewSet

router = DefaultRouter()

router.register(r'administradores', AdminViewSet, basename='admin')
router.register(r'professores', ProfessorViewSet, basename='professor')

urlpatterns = [
    # (/api/usuarios/)
    path('', include(router.urls)),
]