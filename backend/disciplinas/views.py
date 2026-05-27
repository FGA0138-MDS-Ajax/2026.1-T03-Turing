from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from django.shortcuts import render
from .models import Conteudo
from .serializers import ConteudoSerializer
from usuarios.permissions import IsGoStudyAdmin, IsAluno
from turmas.models import Matricula

class ConteudoViewSet(viewsets.ModelViewSet):
    queryset = Conteudo.objects.all()
    serializer_class = ConteudoSerializer

    def get_permissions(self):
        # Apenas admin pode criar, atualizar e deletar
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsGoStudyAdmin()]
        
        # GET ou vizualizar só precisa estar logado
        return [IsAuthenticated()]
    
    # Rota customizada: /api/conteudos/<id>/matricular/
    @action(detail=True, methods=['post'], permission_classes=[IsAluno])
    def matricular(self, request, pk=None):
        conteudo = self.get_object()
        aluno = request.user.aluno

        matricula, created = Matricula.objects.get_or_create(
            aluno=aluno,
            conteudo=conteudo
        )

        if created:
            return Response({'detail': "Matrícula realizada com sucesso"}, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': 'Aluno já matriculado.'}, status=status.HTTP_400_BAD_REQUEST)
        
    

    
    
