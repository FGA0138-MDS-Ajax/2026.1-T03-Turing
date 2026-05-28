from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Inscricao
from .serializers import InscricaoSerializer
from usuarios.permissions import IsGoStudyAdmin
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

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

        return Response(
            {'mensagem': 'inscrição recusada com sucesso'},
            status=status.HTTP_200_OK
        )