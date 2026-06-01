from django.db import models
from django.core.exceptions import ValidationError

class Disciplina(models.Model):
    
    nome = models.CharField(max_length=255, unique=True)
    descricao = models.TextField()
    data_create = models.DateTimeField(auto_now_add=True)
    data_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nome
    
    class Meta:
        db_table = 'disciplina'


class DisciplinaPrerequisito(models.Model):
    disciplina = models.ForeignKey(
        Disciplina,
        on_delete=models.CASCADE,
        related_name='prerequisitos'
    )
    prerequisito = models.ForeignKey(
        Disciplina,
        on_delete=models.CASCADE,
        related_name='requerida_por'
    )

    def __str__(self):
        return f"{self.disciplina} requer {self.prerequisito}"

    class Meta:
        db_table = 'disciplina_prerequisito'
        constraints = [
            models.UniqueConstraint(
                fields=['disciplina','prerequisito'],
                name='unique_disciplina_prerequisito'
            )
        ]

    def clean(self):
        if self.disciplina_id == self.prerequisito_id:
            raise ValidationError("Uma disciplina não pode ser pré requisito dela mesma")

class Conteudo(models.Model):
    STATUS_CHOICES = [
        ('ativo', 'Ativo'),
        ('encerrado', 'Encerrado'),
    ]

    disciplina = models.ForeignKey(
        Disciplina,
        on_delete=models.CASCADE,
        related_name='conteudos'
    )
    professores = models.ManyToManyField(
        'usuarios.Professor',
        related_name='conteudos',
        blank=True
    )
    nome = models.CharField(max_length=255)
    descricao = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ativo')
    data_create = models.DateTimeField(auto_now_add=True)
    data_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nome

    class Meta:
        db_table = 'conteudo'


class Material(models.Model):
    TIPO_CHOICES = [
        ('pdf', 'PDF'),
        ('video', 'Vídeo'),
        ('imagem', 'Imagem'),
        ('link', 'Link Externo'),
        ('apresentacao', 'Apresentação'),
        ('documento', 'Documento'),
    ]

    conteudo = models.ForeignKey(
        Conteudo,
        on_delete=models.CASCADE,
        related_name='materiais'
    )

    nome = models.CharField(max_length=255)
    descricao = models.TextField(null=True, blank=True)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    arquivo = models.FileField(upload_to='materiais/', null=True, blank=True)
    link = models.URLField(null=True, blank=True)
    data_create = models.DateTimeField(auto_now_add=True)
    data_update = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.nome

    class Meta:
        db_table = 'material'