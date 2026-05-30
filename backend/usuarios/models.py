from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


# classe de gerenciamento para criação de perfil

class PerfilManager(BaseUserManager):
    
    #método para criar os users padrões (admin, professor e aluno) 
    def create_user(self, email, password=None,**extra_fields):

        if not email:
            raise ValueError("O email é obrigatório")
        
        email = self.normalize_email(email)
        
    #esses campos impedem que novos usuarios padrões tenham acesso ao painel admin do DJANGO (não é o mesmo que o nosso admin)
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)

        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # senha salva com hash  automaticamente
        user.save(using=self._db)
        return user
    

    # método para criar o admin nativo do Django e ter acesso ao painel
    def create_superuser(self, email, password = None, **extra_fields):
        
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        # definindo que o superuser vai ter o tipo  do user admin padrão
        extra_fields.setdefault('tipo', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser precisa ter is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser precisa ter is_superuser=True.')

        return self.create_user(email, password, **extra_fields)



class Perfil(AbstractBaseUser, PermissionsMixin):
    TIPO_CHOICES = [
        ('aluno', 'Aluno'),
        ('professor', 'Professor'),
        ('admin', 'Administrador'),
    ]

    nome = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    cpf = models.CharField(max_length=11, unique=True)
    #senha = models.CharField(max_length=255) O abstractBaseUser cria o campo password automaticamente na tabela
    data_nascimento = models.DateField()
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    data_create = models.DateTimeField(auto_now_add=True)
    data_update = models.DateTimeField(auto_now=True)

    is_staff = models.BooleanField(default=False) 
    is_active = models.BooleanField(default=True) #é usado na autenticação, se estiver False o usuario perde acesso a Api

    # vinculando objects com o Gerenciado customizado 
    objects = PerfilManager()

    #vai usar o email no lugar de username para fazer a autenticação
    USERNAME_FIELD = 'email'
    #campos requiridos para se preencher ao criar um superuser nativo do Django
    REQUIRED_FIELDS = ['cpf', 'nome', 'data_nascimento']

    def __str__(self):
        return self.nome

    class Meta:
        db_table = 'perfil'


class Aluno(models.Model):
    perfil = models.OneToOneField(
        Perfil,
        on_delete=models.CASCADE,
        related_name='aluno'
    )

    def __str__(self):
        return self.perfil.nome

    class Meta:
        db_table = 'aluno'


class Professor(models.Model):
    perfil = models.OneToOneField(
        Perfil,
        on_delete=models.CASCADE,
        related_name='professor'
    )

    curriculo = models.FileField(
        upload_to='curriculos/',
        null=True,
        blank=True
    )
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('aprovado', 'Aprovado'),
        ('rejeitado', 'Rejeitado'),
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')

    def __str__(self):
        return self.perfil.nome

    class Meta:
        db_table = 'professor'


class Admin(models.Model):
    perfil = models.OneToOneField(
        Perfil,
        on_delete=models.CASCADE,
        related_name='admin'
    )

    def __str__(self):
        return self.perfil.nome

    class Meta:
        db_table = 'admin'