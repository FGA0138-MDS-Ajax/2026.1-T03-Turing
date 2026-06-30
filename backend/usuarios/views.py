from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Professor, Admin, Aluno, Perfil
from .serializers import AdminSerializer, ProfessorSerializer, AlunoSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from .permissions import IsGoStudyProf, IsGoStudyAdmin
from interacoes.models import Inscricao
from django.utils import timezone
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from services.email_service import enviar_email_redefinicao_senha
import logging

class PerfilViewSet(viewsets.ModelViewSet):
    
    def perform_destroy(self, instance):
        perfil =instance.perfil
        perfil.delete()

class ProfessorViewSet(PerfilViewSet):
    
    serializer_class = ProfessorSerializer

    # faz o get retornar apenas professores aprovados
    def get_queryset(self):
        return Professor.objects.filter(
            inscricao__status='aprovado'
        )

    def get_permissions(self):
        # se precisar desabiliar as funções de permissão de professor é apenas comentar essa função
        # Se for uma criação de cadastro, qualquer usuário pode preencher
        if self.action == 'create':
             return [AllowAny()]
        
        if self.action == 'create_by_admin':
            return [IsGoStudyAdmin()]
        
        if self.action in ['update', 'partial_update']:
            return [(IsGoStudyAdmin | IsGoStudyProf)()]
        
        # somente admins ou professores poderam deletar um professor
        if self.action == 'destroy':
            return [(IsGoStudyAdmin | IsGoStudyProf)()]
       
        # a listagem de professor deve ser feita por qualquer usuário autenticado
        return [IsAuthenticated()]

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsGoStudyAdmin])

    def create_by_admin(self, request):
        perfil_data = request.data.get('perfil')
        perfil_data['tipo'] = 'professor'
        perfil_instancia = Perfil.objects.create_user(**perfil_data)

        perfil_instancia.is_active = True
        perfil_instancia.save()

        professor = Professor.objects.create(perfil=perfil_instancia, curriculo=None)

        Inscricao.objects.create(
            professor=professor,
            status='aprovado',
            descricao='professor adicionado com sucesso por adm',
            analisado_por = request.user.admin,
            analisado_em = timezone.now())   

        return Response(
            ProfessorSerializer(professor).data,
            status=status.HTTP_201_CREATED
        )

class AdminViewSet(PerfilViewSet):
    
    """
      ViewSet que fornece automaticamente as ações de:
    Criação (POST), Listagem (GET), Detalhes (GET), Atualização (PUT/PATCH) e Exclusão (DELETE)
    """
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    
    # qualquer request pra CRUD de admin vai exigir essas permissões
    permission_classes = [IsAuthenticated, IsGoStudyAdmin]

    
class AlunoViewSet(PerfilViewSet):

    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer

    def get_permissions(self):
            
            # qualquer um pode chamar o endpoint de criar um aluno
            if self.action == 'create':
                return [AllowAny()]
            
            # para o restando dos endpoints é exigido que o usuário esteja logado
            return [IsAuthenticated()]
    
User = get_user_model()
logger = logging.getLogger(__name__)

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        user = User.objects.filter(
            email__iexact=email,
            is_active=True
        ).first()

        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"{settings.FRONTEND_URL}/redefinir-senha/{uid}/{token}"

            enviar_email_redefinicao_senha(
                nome=user.nome,
                email=user.email,
                reset_link=reset_link
            )
        
        logger.info("Solicitação de recuperacao de senha recebida para email: %s", email)

        return Response(
            {"detail": "Se o email informado estiver cadastrado, enviaremos um link para redefinição de senha."},
            status=status.HTTP_200_OK
        )

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"detail": "Senha redefinida com sucesso."},
            status=status.HTTP_200_OK
        )    