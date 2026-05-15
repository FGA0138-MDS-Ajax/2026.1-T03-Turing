from django.db import models

class Turma(models.Model):
    disciplina = models.ForeignKey(
        'disciplinas.Disciplina',
        on_delete=models.CASCADE,
        related_name='turmas'
    )

    nome = models.CharField(max_length=255)

    def __str__(self):
        return self.nome
    
    class Meta:
        db_table = 'turma'
        constraints = [
            models.UniqueConstraint(
                fields=['disciplina','nome'],
                name='unique_turma_por_disciplina'
            )
        ]


class Matricula(models.Model):
    aluno = models.ForeignKey(
        'usuarios.Aluno',
        on_delete=models.CASCADE,
        related_name='matriculas'
    )
    turma = models.ForeignKey(
        Turma,
        on_delete=models.CASCADE,
        related_name='matriculas'
    )

    data_matricula = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.aluno} - {self.turma}"
    
    class Meta:
        db_table = 'matricula'
        constraints = [
            models.UniqueConstraint(
                fields=['aluno', 'turma'],
                name='unique_aluno_turma'
            )
        ]


class ProfessorTurma(models.Model):
    professor = models.ForeignKey(
        'usuarios.Professor',
        on_delete=models.CASCADE,
        related_name='turmas_lecionadas'
    )
    turma = models.ForeignKey(
        Turma,
        on_delete=models.CASCADE,
        related_name='professor_turmas'
    )

    def __str__(self):
        return f"{self.professor} - {self.turma}"
    
    class Meta:
        db_table = 'professor_turma'
        constraints = [
            models.UniqueConstraint(
                fields=['professor','turma'],
                name='unique_professor_turma'
            )
        ]