from rest_framework import serializers
from .models import Conteudo

class ConteudoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conteudo
        fields = '__all__'
        #disciplina já é obrigatorio pq é FK sem null=True
        