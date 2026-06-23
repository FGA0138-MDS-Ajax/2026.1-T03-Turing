from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from disciplinas.models import Conteudo
from .models import Forum, Denuncia
from django.core.exceptions import ValidationError

@receiver(post_save, sender=Conteudo)
def criar_forum_ao_criar_conteudo(sender, instance, created, **kwargs):
    # Cria o fórum automaticamente quando um novo conteúdo é criado
    if created:
        Forum.objects.get_or_create(conteudo=instance)

@receiver(pre_delete, sender=Forum)
def barrar_exclusao_forum_denuncias(sender, instance, **kwargs):
    tem_denuncia_aberta= Denuncia.objects.filter(mensagem__forum=instance, status='pendente').exists()
    if tem_denuncia_aberta:
        raise ValidationError("Este fórum não pode ser excluído porque existem denúncias pendentes em aberto.")

