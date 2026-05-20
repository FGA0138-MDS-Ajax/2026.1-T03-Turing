from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Professor, Admin
from .serializers import AdminSerializer, ProfessorSerializer
from .permissions import IsGoStudyProf, IsGoStudyAdmin

class PerfilViewSet(viewsets.ModelViewSet):
    
    def perform_destroy(self, instance):
        perfil =instance.perfil
        perfil.delete()

class ProfessorViewSet(PerfilViewSet):
    
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer

    # Funcionamento: apenas autenticados
    permission_classes = [IsAuthenticated, IsGoStudyProf]


class AdminViewSet(PerfilViewSet):
    
    """
      ViewSet que fornece automaticamente as ações de:
    Criação (POST), Listagem (GET), Detalhes (GET), Atualização (PUT/PATCH) e Exclusão (DELETE)
    """
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    
    #OBS: comente essa linha caso queira criar admin via Insomnia/Postman:
    permission_classes = [IsAuthenticated, IsGoStudyAdmin]
