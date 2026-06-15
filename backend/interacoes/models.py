from django.db import models
from django.core.exceptions import ValidationError


class Forum(models.Model):
    conteudo = models.OneToOneField(
        'disciplinas.Conteudo',
        on_delete=models.CASCADE,
        related_name='forum'
    )
    data_create = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Forum do conteúdo: {self.conteudo.nome}"

    class Meta:
        db_table = 'forum'


class Mensagem(models.Model):
    forum = models.ForeignKey(
        Forum,
        on_delete=models.CASCADE,
        related_name='mensagens'
    )
    autor = models.ForeignKey(
        'usuarios.Perfil',
        on_delete=models.CASCADE,
        related_name='mensagens'
    )
    resposta_para = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='respostas'
    )
    texto = models.TextField()
    data_create = models.DateTimeField(auto_now_add=True)
    data_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.autor}: {self.texto[:25]}..."

    class Meta:
        db_table = 'mensagem'


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
    analisado_por = models.ForeignKey(
        'usuarios.Admin',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='inscricoes_analisadas'
    )
    analisado_em = models.DateTimeField(null=True, blank=True)
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

    mensagem = models.ForeignKey(
        Mensagem,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    denunciante = models.ForeignKey(
        'usuarios.Perfil',
        on_delete=models.CASCADE,
        related_name='denuncias',
        null=True,
        blank=True
    )
    denunciado = models.ForeignKey(
        'usuarios.Perfil',
        on_delete=models.CASCADE,
        related_name='denuncias_recebidas',
        null=True,
        blank=True
    )
    motivo = models.TextField(null=True, blank=True)
    evidencias = models.TextField(null=True, blank=True)
    parecer_admin = models.TextField(null=True, blank=True)
    analisado_por = models.ForeignKey(
        'usuarios.Admin',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='denuncias_analisadas'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')
    descricao = models.TextField()
    data_create = models.DateTimeField(auto_now_add=True)
    data_update = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'denuncia'