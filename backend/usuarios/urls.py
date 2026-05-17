from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminViewSet

 
router = DefaultRouter()
router.register(r'administradores', AdminViewSet, basename='admin')

urlpatterns = [
    # (/api/usuarios/administradores/)
    path('', include(router.urls)),
]