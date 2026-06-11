from rest_framework import serializers
from .models import Inscricao, Forum, Mensagem
class InscricaoSerializer(serializers.ModelSerializer):
    professor_nome = serializers.CharField(
        source = 'professor.perfil.nome',
        read_only = True
    )
    professor_email = serializers.EmailField(
        source = 'professor.perfil.email',
        read_only = True
    )
    curriculo = serializers.FileField(
        source = 'professor.curriculo',
        read_only = True
    )
    class Meta:
        model = Inscricao
        fields = [
            'id',
            'professor',
            'professor_nome',
            'professor_email',
            'curriculo',
            'status',
            'descricao',
            'analisado_por',
            'analisado_em',
            'data_create'
        ]
class MensagemSerializer(serializers.ModelSerializer):
    autor_nome = serializers.CharField(
        source='autor.nome',
        read_only=True
    )

    class Meta:
        model = Mensagem
        fields = [
            'id',
            'forum',
            'autor',
            'autor_nome',
            'resposta_para',
            'texto',
            'data_create',
            'data_update'
        ]
        read_only_fields = ['id', 'autor', 'data_create', 'data_update']


class ForumSerializer(serializers.ModelSerializer):
    mensagens = MensagemSerializer(many=True, read_only=True)

    class Meta:
        model = Forum
        fields = [
            'id',
            'conteudo',
            'mensagens',
            'data_create'
        ]
        read_only_fields = ['id', 'data_create']