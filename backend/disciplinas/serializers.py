from rest_framework import serializers
from .models import Conteudo, Disciplina, DisciplinaPrerequisito

class ConteudoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conteudo
        fields = '__all__'
        #disciplina já é obrigatorio pq é FK sem null=True
        
class DisciplinaPrerequisitoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DisciplinaPrerequisito
        fields = '__all__'

class DisciplinaSerializer(serializers.ModelSerializer):
    prerequisitos_detalhados = serializers.SerializerMethodField()
    # Exibe a lista de pré-requisitos ao dar um GET

    class Meta:
        model = Disciplina
        fields = ['id', 'nome', 'descricao', 'data_create', 'data_update', 'prerequisitos_detalhados']

    def get_prerequisitos_detalhados(self, obj):
        # Busca as disciplinas que são pré-requisito dessa
        lista_prerequisitos = obj.prerequisitos.all()
        return [
            {"id": item.prerequisito.id, "nome": item.prerequisito.nome}
            for item in lista_prerequisitos
        ]