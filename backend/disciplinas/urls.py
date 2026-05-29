from django.urls import path, include
from .views import MaterialCreateListView, MaterialRetrieveUpdateDestroyAPIView
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from .views import ConteudoViewSet

urlpatterns = [
    path('materiais/', MaterialCreateListView.as_view(), name='materiais-create-view'),
    path('materiais/<int:pk>/', MaterialRetrieveUpdateDestroyAPIView.as_view(), name='materiais-detail-view'),
    path('', include(router.urls)),
]

router = DefaultRouter()
router.register(r'conteudos', ConteudoViewSet, basename='conteudo')

