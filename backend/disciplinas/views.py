from rest_framework import generics, viewsets
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated

from .models import Conteudo, Disciplina
from .serializers import ConteudoSerializer, DisciplinaSerializer
from disciplinas.models import Material
from disciplinas.serializers import MaterialSerializer
from disciplinas.permissions import IsGoStudyProfOrAdmin
from usuarios.permissions import IsGoStudyAdmin

class MaterialCreateListView(generics.ListCreateAPIView):
    serializer_class = MaterialSerializer
    permission_classes = [IsGoStudyProfOrAdmin]

    def get_queryset(self):
        user = self.request.user

        # admin logado continua vendo todos os materiais
        if user.tipo == 'admin':
             return Material.objects.all()
        
        # professor logado ve so os materiais dos conteudos que ele tem
        if user.tipo == 'professor':
            if hasattr(user, 'professor'):
                return Material.objects.filter(
                    conteudo__professores=user.professor
                ).distinct()
            return Material.objects.none
        
        return Material.objects.all()

    
class MaterialRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MaterialSerializer
    permission_classes = [IsGoStudyProfOrAdmin]

    def get_queryset(self):
        user = self.request.user

        if user.tipo == 'admin':
            return Material.objects.all()

        if user.tipo == 'professor':
            if hasattr(user, 'professor'):
                return Material.objects.filter(
                    conteudo__professores=user.professor
                ).distinct()

            return Material.objects.none()

        return Material.objects.all()


class ConteudoViewSet(viewsets.ModelViewSet):
    serializer_class = ConteudoSerializer

    def get_queryset(self):
        user = self.request.user

        #se estiver logado como admin vai listar todos os conteudos
        if user.tipo == 'admin':
            return Conteudo.objects.all()

        #se tiver logado como professor vai listar so os conteudos do proprio professor
        if user.tipo == 'professor':
            if hasattr(user, 'professor'):
                return Conteudo.objects.filter(
                    professores=user.professor
                ).distinct()
            return Conteudo.objects.none

        return Conteudo.objects.all()

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
