from rest_framework import generics, viewsets
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated

from .models import Conteudo, Disciplina
from .serializers import ConteudoSerializer, DisciplinaSerializer
from disciplinas.models import Material
from disciplinas.serializers import MaterialSerializer
from disciplinas.permissions import IsGoStudyProfOrAdmin
from usuarios.permissions import IsGoStudyAdmin


class MaterialViewSet(viewsets.ModelViewSet):
    serializer_class = MaterialSerializer
    def get_permissions(self):
        # Ações de list e retrieve são liberadas para todos
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        
        # Se for POST, PUT, PATCH ou DELETE: apenas admin e professor
        return [IsGoStudyProfOrAdmin()]


    def get_queryset(self):
        user = self.request.user
        queryset = Material.objects.all()

        if user.tipo == 'admin':
            pass

        # professores so podem ver materiais de conteudos lecionados
        elif user.tipo == 'professor':
            queryset = queryset.filter(conteudo__professores__perfil=user)

        # aluno so pode ver materiais de conteudos matriculados                  
        elif user.tipo =="aluno":
            queryset = queryset.filter(conteudo__matriculas__aluno__perfil=user)

        #retorna  uma lista vazia 
        else:
            return Material.objects.none()

        conteudo_id = self.request.query_params.get('conteudo')
        if conteudo_id is not None:
            queryset = queryset.filter(conteudo_id=conteudo_id)
        
        disciplina_id = self.request.query_params.get('disciplina')
        if disciplina_id is not None:
               queryset = queryset.filter(conteudo__disciplina_id=disciplina_id)

        return queryset.distinct()


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
