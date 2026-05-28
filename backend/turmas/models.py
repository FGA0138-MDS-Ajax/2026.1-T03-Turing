from django.db import models

class Matricula(models.Model):
   

    aluno = models.ForeignKey(
        'usuarios.Aluno',
        on_delete=models.CASCADE,
        related_name='matriculas'
    )
    conteudo = models.ForeignKey(
        'disciplinas.Conteudo',
        on_delete=models.CASCADE,
        related_name='matriculas',
        null=True,
        blank=True
    )

    matriculado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.aluno} - {self.conteudo}"
    
    class Meta:
        db_table = 'matricula'
        constraints = [
            models.UniqueConstraint(
                fields=['aluno', 'conteudo'],
                name='unique_aluno_conteudo'
            )
        ]


