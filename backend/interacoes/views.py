from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Inscricao, Forum, Mensagem
from .serializers import InscricaoSerializer, ForumSerializer, MensagemSerializer
from usuarios.permissions import IsGoStudyAdmin, IsGoStudyProf, IsGoStudyAluno
from services.email_service import enviar_email_aprovacao_professor, enviar_email_rejeicao_professor
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from turmas.models import Matricula

class InscricaoViewSet(viewsets.ModelViewSet):
    queryset = Inscricao.objects.all()
    serializer_class = InscricaoSerializer
    permission_classes = [IsAuthenticated, IsGoStudyAdmin]
    
    def get_queryset(self):
        queryset = Inscricao.objects.all()
        status_param = self.request.query_params.get('status')
       
        if status_param:
            queryset = queryset.filter(status=status_param)
            
        return queryset
    
    @action(detail=True, methods=['patch'])
    def aprovar(self, request, pk=None):
        inscricao = self.get_object()

        if inscricao.status != 'pendente':
            return Response(
            {'erro': 'essa inscrição ja foi analisada'},
            status=status.HTTP_400_BAD_REQUEST
        )

        inscricao.status = 'aprovado'
        inscricao.analisado_por = request.user.admin
        inscricao.analisado_em = timezone.now()
        perfil = inscricao.professor.perfil
        perfil.is_active = True
        perfil.save()
        inscricao.save()

        enviar_email_aprovacao_professor(perfil.nome, perfil.email)

        return Response(
            {'mensagem': 'Inscrição aprovada com sucesso'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['patch'])
    def rejeitar(self, request, pk=None):
        inscricao = self.get_object()

        if inscricao.status != 'pendente':
            return Response(
            {'erro': 'essa inscrição ja foi analisada'},
            status=status.HTTP_400_BAD_REQUEST
        )

        inscricao.status = 'recusado'
        inscricao.analisado_por = request.user.admin
        inscricao.analisado_em = timezone.now()
        perfil = inscricao.professor.perfil
        perfil.is_active = False
        perfil.save()
        inscricao.save()

        enviar_email_rejeicao_professor(perfil.nome, perfil.email)

        return Response(
            {'mensagem': 'inscrição recusada com sucesso'},
            status=status.HTTP_200_OK
        )
    
class ForumViewSet(viewsets.ModelViewSet):
    serializer_class = ForumSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Admin vê todos os fóruns
        if user.tipo == 'admin':
            return Forum.objects.all()

        # Professor vê fóruns dos conteúdos que ministra
        if user.tipo == 'professor':
            return Forum.objects.filter(
                conteudo__professores=user.professor
            )

        # Aluno vê fóruns dos conteúdos em que está matriculado
        if user.tipo == 'aluno':
            return Forum.objects.filter(
                conteudo__matriculas__aluno=user.aluno,
                conteudo__matriculas__status='ativa'
            )

        return Forum.objects.none()

    def get_permissions(self):
        # Apenas admin pode criar, editar e deletar fóruns
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsGoStudyAdmin()]
        return [IsAuthenticated()]