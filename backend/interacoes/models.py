from django.db import models
from django.core.exceptions import ValidationError

class Pergunta(models.Model):
    aluno = models.ForeignKey(
        'usuarios.Aluno',
        on_delete=models.CASCADE,
        related_name='perguntas'
    )

    texto = models.TextField()
    data_create = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.aluno}: {self.texto[:25]}..."
    
    class Meta:
        db_table = 'pergunta'


class Resposta(models.Model):
    pergunta = models.OneToOneField(
        Pergunta,
        on_delete=models.CASCADE,
        related_name='resposta'
    )
    professor = models.ForeignKey(
        'usuarios.Professor',
        on_delete=models.CASCADE,
        related_name='respostas'
    )

    conteudo = models.TextField()
    data_create = models.DateTimeField(auto_now_add=True)
    data_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.professor}: {self.conteudo[:25]}..."
    
    class Meta:
        db_table = 'resposta'


class Inscricao(models.Model):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('aprovado', 'Aprovado'),
        ('recusado', 'Recusado')
    ]

    professor = models.ForeignKey(
        'usuarios.Professor',
        on_delete=models.CASCADE
    )
    admin = models.ForeignKey(
        'usuarios.Admin',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')
    descricao = models.TextField()
    data_create = models.DateTimeField(auto_now_add=True)
    data_update = models.DateTimeField(auto_now=True)


class Denuncia(models.Model):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('analisado', 'Analisado'),
        ('recusado', 'Recusado')
    ]

    pergunta = models.ForeignKey(
        Pergunta,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    resposta = models.ForeignKey(
        Resposta,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    admin = models.ForeignKey(
        'usuarios.Admin',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    denunciante = models.ForeignKey(
        'usuarios.Perfil',
        on_delete=models.CASCADE,
        related_name='denuncias'
    )
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pen')
    descricao = models.TextField()
    data_create = models.DateTimeField(auto_now_add=True)
    data_update = models.DateTimeField(auto_now=True)

    def clean(self):
        if not self.pergunta and not self.resposta:
            raise ValidationError("A denúncia deve estar ligada a uma pergunta ou resposta")
        if self.pergunta and self.resposta:
            raise ValidationError("A denúncia não pode estar ligada a uma pergunta e resposta ao mesmo tempo")