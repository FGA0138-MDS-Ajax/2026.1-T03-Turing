from rest_framework import serializers
from .models import Inscricao
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
