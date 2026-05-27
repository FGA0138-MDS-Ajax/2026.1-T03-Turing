
from rest_framework import serializers
from .models import Matricula

class MatriculaSerializer(serializers.BaseSerializer):

    class Meta:
        model = Matricula

        fields =['id','aluno','conteudo','matriculado_em']

        #campos que o front pode apenas ler (GET)
        read_only_fields = ['id','matriculado_em']


    def to_representation(self, instance):

        representacao = super().to_representation(instance)

        representacao["conteudo_detalhes"]={
            "id": instance.conteudo.id,
            "nome": instance.conteudo.nome,
            "descricao": instance.conteudo.descricao,
            "status": instance.conteudo.status
        }

        representacao["disciplina_id"]= instance.conteudo.disciplica.id
        
        return representacao