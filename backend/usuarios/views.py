from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
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

    def get_permissions(self):
        # Se for uma criação de cadastro, qualquer usuário pode preencher
        if self.action == 'create':
            return [AllowAny()]
        
        # Para qualquer outra ação (GET, PUT, PATCH, DELETE), exige autenticação de professor
        return [IsAuthenticated(), IsGoStudyProf()]


class AdminViewSet(PerfilViewSet):
    
    """
      ViewSet que fornece automaticamente as ações de:
    Criação (POST), Listagem (GET), Detalhes (GET), Atualização (PUT/PATCH) e Exclusão (DELETE)
    """
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    
    #OBS: comente essa linha caso queira criar admin via Insomnia/Postman:
    permission_classes = [IsAuthenticated, IsGoStudyAdmin]
