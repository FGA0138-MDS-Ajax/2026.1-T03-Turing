from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Professor, Admin, Aluno
from .serializers import AdminSerializer, ProfessorSerializer, AlunoSerializer
from .permissions import IsGoStudyProf, IsGoStudyAdmin


class PerfilViewSet(viewsets.ModelViewSet):
    
    def perform_destroy(self, instance):
        perfil =instance.perfil
        perfil.delete()

class ProfessorViewSet(PerfilViewSet):
    
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer

    def get_permissions(self):
        # se precisar desabiliar as funções de permissão de professo é apenas comentar essa função
        # Se for uma criação de cadastro, qualquer usuário pode preencher
        if self.action == 'create':
             return [AllowAny()]
        
        if self.action in ['update', 'partial_update']:
            return [(IsGoStudyAdmin | IsGoStudyProf)()]
        
        # somente admins ou professores poderam deletar um professor
        if self.action == 'destroy':
            return [(IsGoStudyAdmin | IsGoStudyProf)()]
       
        # a listagem de professor deve ser feita por qualquer usuário autenticado
        return [IsAuthenticated()]


class AdminViewSet(PerfilViewSet):
    
    """
      ViewSet que fornece automaticamente as ações de:
    Criação (POST), Listagem (GET), Detalhes (GET), Atualização (PUT/PATCH) e Exclusão (DELETE)
    """
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    
    # qualquer request pra CRUD de admin vai exisgir essas permissões
    permission_classes = [IsAuthenticated, IsGoStudyAdmin]

    
class AlunoViewSet(PerfilViewSet):

    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer


    