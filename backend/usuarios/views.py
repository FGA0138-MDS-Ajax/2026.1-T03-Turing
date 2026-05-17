from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Admin
from .serializers import AdminSerializer
from .permissions import IsGoStudyAdmin

class AdminViewSet(viewsets.ModelViewSet):
    
    """
      ViewSet que fornece automaticamente as ações de:
    Criação (POST), Listagem (GET), Detalhes (GET), Atualização (PUT/PATCH) e Exclusão (DELETE)
    """
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    
    #OBS: comente essa linha caso queira criar admin via Insomnia/Postman:
    permission_classes = [IsAuthenticated, IsGoStudyAdmin]