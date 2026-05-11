from django.db import models


class Perfil(models.Model):
    TIPO_CHOICES = [
        ('aluno', 'Aluno'),
        ('professor', 'Professor'),
        ('admin', 'Administrador'),
    ]

    nome = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    cpf = models.BigIntegerField(unique=True)
    senha = models.CharField(max_length=255)
    data_nascimento = models.DateField()
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    role = models.CharField(max_length=50)
    data_create = models.DateTimeField(auto_now_add=True)
    data_update = models.DateTimeField(auto_now=True)

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