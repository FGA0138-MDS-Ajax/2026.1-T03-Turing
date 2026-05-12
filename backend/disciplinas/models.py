from django.db import models

class Disciplina(models.Model):
    
    nome = models.CharField(max_length=255)
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
