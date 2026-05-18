from rest_framework import viewsets, permissions
from .models import Professor
from .serializer import ProfessorSerializer
from .permissions import IsGoStudyProf

class ProfessorViewSet(viewsets.ModelViewSet):
    
    """
      ViewSet que fornece automaticamente as ações de:
    Criação (POST), Listagem (GET), Detalhes (GET), Atualização (PUT/PATCH) e Exclusão (DELETE)
    """
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer

    # Funcionamento: apenas autenticados
    permission_classes = [permissions.IsAuthenticated, IsGoStudyProf]

