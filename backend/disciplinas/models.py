from django.db import models
from django.core.exceptions import ValidationError

class Disciplina(models.Model):
    
    nome = models.CharField(max_length=255, unique=True)
    descricao = models.TextField()
    carga_horaria = models.IntegerField()
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
