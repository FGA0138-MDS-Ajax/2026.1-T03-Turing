from rest_framework import viewsets,mixins
from rest_framework.permissions import IsAuthenticated
from .models import Matricula
from .serializers import MatriculaSerializer
from usuarios.permissions import IsGoStudyAdmin, IsGoStudyProf, IsGoStudyAluno
from rest_framework.exceptions import ValidationError, PermissionDenied

class MatriculaViewSet(mixins.CreateModelMixin, mixins.ListModelMixin,  mixins.RetrieveModelMixin,
                       mixins.DestroyModelMixin,viewsets.GenericViewSet):


    serializer_class = MatriculaSerializer

    def get_permissions(self):

        if self.action =='create':
            return [(IsGoStudyAluno | IsGoStudyAdmin)()]
        
        if self.action =='destroy':
            return [(IsGoStudyAluno | IsGoStudyAdmin)()]

        return [IsAuthenticated()] 
    

    def get_queryset(self):    
        user = self.request.user

        if user.tipo == 'admin':
            return Matricula.objects.all()
    
        if user.tipo == "aluno":
            return Matricula.objects.filter(aluno__perfil= user)
        
        if user.tipo == 'professor':
            return Matricula.objects.filter(conteudo__professores__perfil=user).distinct()
        
        return Matricula.objects.none()
    

    def perform_create(self, serializer):
        user = self.request.user
        conteudo = serializer.validated_data.get("conteudo")

        if conteudo.status == 'encerrado':
            raise ValidationError({"conteudo": "Este conteúdo já foi encerrado e não aceita novas matrículas."})
        
        if user.tipo == 'aluno':
            serializer.save(aluno = user.aluno)
        
        if user.tipo == "admin":    
            if 'aluno' not in serializer.validated_data:
                raise ValidationError({"aluno": "É necessário especificar o ID do aluno a ser matriculado"})
            serializer.save()


    def perform_destroy(self, instance):

        user = self.request.user

        if user.tipo == "admin":
            instance.delete()
        
        elif user.tipo == 'aluno':
            if instance.aluno.perfil == user:
                instance.delete()
            
            else:
                raise PermissionDenied("erro: Você só pode cancelar a sua própria matrícula")
            
        else:
            raise PermissionDenied("Apenas administradores e o próprio aluno podem cancelar uma matrícula")