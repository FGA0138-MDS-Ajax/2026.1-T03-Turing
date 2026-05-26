from rest_framework import serializers
from disciplinas.models import Material


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__' #Deixei o all para traduzir todos campos, mas qualquer coisa eu arrumo

