
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MatriculaViewSet


router = DefaultRouter()

router.register(r'', MatriculaViewSet, basename='matricula')


urlpatterns =[
    path('', include(router.urls)),
]

