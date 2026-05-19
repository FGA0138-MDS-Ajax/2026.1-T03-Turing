from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminViewSet
from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


# indica ao django que a serializer com o token personalizado será usada
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


router = DefaultRouter()
router.register(r'administradores', AdminViewSet, basename='admin')

urlpatterns = [
   #  inclui todas as rotas registradas no router acima no caminho: /api/usuarios/
    path('', include(router.urls)),

    path('login/', CustomTokenObtainPairView.as_view(), name ='token_obtain_pair'), # rota para gerar os tokens

    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]