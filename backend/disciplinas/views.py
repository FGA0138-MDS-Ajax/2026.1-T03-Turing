from rest_framework import generics, viewsets
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated

from .models import Conteudo, Disciplina
from .serializers import ConteudoSerializer, DisciplinaSerializer
from disciplinas.models import Material
from disciplinas.serializers import MaterialSerializer
from disciplinas.permissions import IsGoStudyProfOrAdmin
from usuarios.permissions import IsGoStudyAdmin

from rest_framework.decorators import action
from rest_framework.response import Response

class MaterialCreateListView(generics.ListCreateAPIView):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    permission_classes = [IsGoStudyProfOrAdmin]

    
class MaterialRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    permission_classes = [IsGoStudyProfOrAdmin]


class ConteudoViewSet(viewsets.ModelViewSet):
    queryset = Conteudo.objects.all()
    serializer_class = ConteudoSerializer

    def get_permissions(self):
        # Apenas admin pode criar, atualizar e deletar
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsGoStudyAdmin()]
        
        # GET ou visualizar só precisa estar logado
        return [IsAuthenticated()]

class DisciplinaViewSet(viewsets.ModelViewSet):
    queryset = Disciplina.objects.all()
    serializer_class = DisciplinaSerializer

    def get_permissions(self):
        # Apenas admin pode criar (create), editar (update/partial_update) e deletar (destroy)
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsGoStudyAdmin()]
        
        # Alunos e professores autenticados podem apenas visualizar (list, retrieve)
        return [IsAuthenticated()]
    
    # Endpoint que lista conteúdos de uma disciplina específica
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def conteudos(self, request, pk=None):
        disciplina = self.get_object()
        conteudos = Conteudo.objects.filter(disciplina=disciplina)
        serializer = ConteudoSerializer(conteudos, many=True)
        return Response(serializer.data)