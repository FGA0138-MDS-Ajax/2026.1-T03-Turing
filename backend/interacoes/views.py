from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.exceptions import PermissionDenied
from .models import Inscricao, Forum, Mensagem, Denuncia
from .serializers import InscricaoSerializer, ForumSerializer, MensagemSerializer, DenunciaSerializer
from usuarios.permissions import IsGoStudyAdmin, IsGoStudyProf, IsGoStudyAluno
from services.email_service import enviar_email_aprovacao_professor, enviar_email_rejeicao_professor
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from rest_framework.pagination import PageNumberPagination
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
            return Response({'erro': 'essa inscrição ja foi analisada'}, status=status.HTTP_400_BAD_REQUEST)
        inscricao.status = 'aprovado'
        inscricao.analisado_por = request.user.admin
        inscricao.analisado_em = timezone.now()
        perfil = inscricao.professor.perfil
        perfil.is_active = True
        perfil.save()
        inscricao.save()
        enviar_email_aprovacao_professor(perfil.nome, perfil.email)
        return Response({'mensagem': 'Inscrição aprovada com sucesso'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def rejeitar(self, request, pk=None):
        inscricao = self.get_object()
        if inscricao.status != 'pendente':
            return Response({'erro': 'essa inscrição ja foi analisada'}, status=status.HTTP_400_BAD_REQUEST)
        inscricao.status = 'recusado'
        inscricao.analisado_por = request.user.admin
        inscricao.analisado_em = timezone.now()
        perfil = inscricao.professor.perfil
        perfil.is_active = False
        perfil.save()
        inscricao.save()
        enviar_email_rejeicao_professor(perfil.nome, perfil.email)
        return Response({'mensagem': 'inscrição recusada com sucesso'}, status=status.HTTP_200_OK)


class ForumViewSet(
    mixins.RetrieveModelMixin, # Permite GET /api/foruns/{id}/
    mixins.UpdateModelMixin,   # Permite PUT/PATCH /api/foruns/{id}/
    mixins.DestroyModelMixin,  # Permite DELETE /api/foruns/{id}/
    mixins.ListModelMixin,     #  Permite GET /api/foruns/ 
    viewsets.GenericViewSet  # Bloqueia o CreateModelMixin removendo o post
    ):

    serializer_class = ForumSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.tipo == 'admin':
            return Forum.objects.all().distinct()

        if user.tipo == 'professor':
            return Forum.objects.filter(
                conteudo__professores=user.professor
            ).distinct()

        if user.tipo == 'aluno':
            return Forum.objects.filter(
                conteudo__matriculas__aluno=user.aluno
            ).distinct()

        return Forum.objects.none()

    def get_permissions(self):
        #somente admins poderão: listar todos, atualizar, e deletar
        if self.action in [ 'update', 'partial_update', 'destroy', 'list']:
            return [IsGoStudyAdmin()]
        return [IsAuthenticated()]


#definição da paginação para as mensangens
class MensagemPagination(PageNumberPagination):
    page_size = 10  # numero de msgs por pagina 
    page_size_query_param = 'page_size'  
    max_page_size = 100

class MensagemViewSet(viewsets.ModelViewSet):
    serializer_class = MensagemSerializer
    permission_classes = [IsAuthenticated]

    pagination_class = MensagemPagination

    def get_queryset(self):
        user = self.request.user
        forum_id = self.request.query_params.get('forum')

        if user.tipo == 'admin':
            queryset = Mensagem.objects.all()
        elif user.tipo == 'professor':
            queryset = Mensagem.objects.filter(
                forum__conteudo__professores=user.professor
            )
        elif user.tipo == 'aluno':
            queryset = Mensagem.objects.filter(
                forum__conteudo__matriculas__aluno=user.aluno
            )
        else:
            return Mensagem.objects.none()

        if forum_id:
            queryset = queryset.filter(forum_id=forum_id)

        return queryset.distinct().order_by('data_create')


    def get_permissions(self):
        # Qualquer autenticado pode tentar; checagem de autor é feita em perform_update/destroy
        return [IsAuthenticated()]


    #admins são livres para mandar msg; alunos e professores precisam pertencer ao conteudo
    def perform_create(self, serializer):
        forum = serializer.validated_data.get('forum')
        user = self.request.user

        if user.tipo == 'aluno':
            tem_acesso = forum.conteudo.matriculas.filter(aluno=user.aluno).exists()
            if not tem_acesso:
                raise PermissionDenied("Você não está matriculado neste conteúdo.")
            
        elif user.tipo == 'professor':
            if user.professor not in forum.conteudo.professores.all():
                raise PermissionDenied("Você não é professor desta disciplina.")
            
        serializer.save(autor=self.request.user)


    def _verificar_autor_e_denuncia(self, instance):
        user = self.request.user
        # Só o autor ou o admin pode editar/deletar 
        if user.tipo != 'admin' and instance.autor != self.request.user:
            raise PermissionDenied("Você só pode editar ou deletar suas próprias mensagens.")

        # Não pode editar/deletar se houver denúncia pendente sobre a mensagem
        denuncia_pendente = Denuncia.objects.filter(
            mensagem=instance,
            status='pendente'
        ).exists()
        if denuncia_pendente:
            raise PermissionDenied("Esta mensagem possui uma denúncia em análise e não pode ser alterada ou excluída.")


    def perform_update(self, serializer):
        self._verificar_autor_e_denuncia(serializer.instance)
        serializer.save()


    def perform_destroy(self, instance):
        self._verificar_autor_e_denuncia(instance)
        instance.delete()


    @action(detail=False, methods=['get'], url_path='pendentes')
    def pendentes(self, request):
        if request.user.tipo != 'professor':
            return Response(
                {'erro': 'Apenas professores podem acessar perguntas pendentes'},
                status=status.HTTP_403_FORBIDDEN
            )

        professor = request.user.professor

        perguntas = Mensagem.objects.filter(
            forum__conteudo__professores=professor,
            resposta_para=None
        ).exclude(
            respostas__autor__tipo='professor'
        ).distinct().order_by('data_create')

        # paginação para mensagens pendentes
        page = self.paginate_queryset(perguntas)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(perguntas, many=True)
        return Response(serializer.data)

class StandartResultsSetPagination(PageNumberPagination):
    #Paginação padrão
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class DenunciaViewSet(viewsets.ModelViewSet):
    queryset = Denuncia.objects.all().order_by('-data_create')
    serializer_class = DenunciaSerializer
    pagination_class = StandartResultsSetPagination

    def get_permissions(self):
        # O usuário logado pode criar uma denúncia
        if self.action == 'create':
            return [IsAuthenticated()]
        # Só Admins podem listar, ver, editar ou deletar as denúncias
        return [IsAuthenticated(), IsGoStudyAdmin()]

    def perform_create(self, serializer):
        # Registra, identifica e salva as denuncias
        mensagem = serializer.validated_data.get('mensagem')
        denunciante_perfil = self.request.user.perfil
        denunciado_perfil = mensagem.autor

        serializer.save(
            denunciante=denunciante_perfil,
            denunciado=denunciado_perfil,
            status='pendente'
        )







