from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminViewSet

 
router = DefaultRouter()
router.register(r'administradores', AdminViewSet, basename='admin')

urlpatterns = [
    path('api/', include(router.urls)),
]