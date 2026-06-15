from django.db.models.signals import post_save
from django.dispatch import receiver
from disciplinas.models import Conteudo
from .models import Forum


@receiver(post_save, sender=Conteudo)
def criar_forum_ao_criar_conteudo(sender, instance, created, **kwargs):
    # Cria o fórum automaticamente quando um novo conteúdo é criado
    if created:
        Forum.objects.get_or_create(conteudo=instance)