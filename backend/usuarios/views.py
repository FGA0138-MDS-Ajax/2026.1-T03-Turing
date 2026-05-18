from rest_framework import viewsets, permissions
from .models import Professor, Admin
from .serializers import AdminSerializer, ProfessorSerializer
from .permissions import IsGoStudyProf, IsGoStudyAdmin

class ProfessorViewSet(viewsets.ModelViewSet):
    
    """
      ViewSet que fornece automaticamente as ações de:
    Criação (POST), Listagem (GET), Detalhes (GET), Atualização (PUT/PATCH) e Exclusão (DELETE)
    """
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer

    # Funcionamento: apenas autenticados
    permission_classes = [permissions.IsAuthenticated, IsGoStudyProf]


class AdminViewSet(viewsets.ModelViewSet):
    
    """
      ViewSet que fornece automaticamente as ações de:
    Criação (POST), Listagem (GET), Detalhes (GET), Atualização (PUT/PATCH) e Exclusão (DELETE)
    """
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    
    #OBS: comente essa linha caso queira criar admin via Insomnia/Postman:
    permission_classes = [permissions.IsAuthenticated, IsGoStudyAdmin]
