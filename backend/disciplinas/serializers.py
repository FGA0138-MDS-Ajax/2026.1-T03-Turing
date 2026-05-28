from rest_framework import serializers
from .models import Conteudo, Disciplina

class ConteudoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conteudo
        fields = '__all__'
        #disciplina já é obrigatorio pq é FK sem null=True


class DisciplinaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Disciplina
        fields = ['id', 'nome', 'descricao', 'data_create', 'data_update', 'prerequisitos_detalhados']
