from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Perfil, Professor

class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil
        
        fields = ['id', 'nome', 'email', 'cpf', 'senha', 'data_nascimento', 'tipo', 
                  'role','data_create','data_update']

        extra_kwargs = {
            'senha': {'write_only': True},
            'tipo': {'read_only': True}, 
            'role': {'read_only': True},
            'data_create': {'read_only': True},
            'data_update': {'read_only': True}
        }

class ProfessorSerializer(serializers.ModelSerializer):
    
    perfil = PerfilSerializer()

    class Meta:
        model = Professor
        fields = ['id', 'perfil']

    def create(self, validated_data):
        
        perfil_data = validated_data.pop('perfil')
        
        # senha criptografada pelo django
        perfil_data['senha'] = make_password(perfil_data['senha'])
    
        perfil_data['tipo'] = 'professor'
        perfil_data['role'] = 'professor'
        
        # salv o perfil no banco através do ORM
        perfil_instancia = Perfil.objects.create(**perfil_data)
        #  salva o admin no banco vinculado ao perfil recém-criado
        professor_instancia = Professor.objects.create(perfil=perfil_instancia)
        
        return professor_instancia