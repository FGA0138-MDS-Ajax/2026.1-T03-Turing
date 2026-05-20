from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Perfil, Admin, Aluno
from datetime import date
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


#   customizando como o token será pego
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):   #  método para construir o payload do token  
        token = super().get_token(user)

        token['nome'] = user.nome
        token['email'] = user.email
        token['role'] = user.role
        token['tipo'] = user.tipo

        return token




class PerfilSerializer(serializers.ModelSerializer):

    password = serializers.CharField( write_only=True)

    class Meta:
        model = Perfil
        
        fields = ['id', 'nome', 'email', 'cpf', 'password', 'data_nascimento', 'tipo', 
                  'role','data_create','data_update']

        extra_kwargs = {
            'tipo': {'read_only': True}, 
            'role': {'read_only': True},
            'data_create': {'read_only': True},
            'data_update': {'read_only': True}
        }

    def validate_nome(self, nome):
        if any(char.isdigit() for char in nome):
            raise serializers.ValidationError("O nome não pode conter números")

        return nome

    # valida idade maior que 100 e data futura
    def validate_data_nascimento(self, data_nascimento):
    
        hoje = date.today()

        if(data_nascimento > hoje):
            raise serializers.ValidationError("A data de nascimento não pode ser futura")

        idade = hoje.year - data_nascimento.year - ((hoje.month, hoje.day) < (data_nascimento.month, data_nascimento.day))

        if( idade >100):
            raise serializers.ValidationError("Limite máximo de idade ultrapassado")
        
        return data_nascimento
    

    def validate_cpf(self, cpf):
        if len(cpf) != 11 or not cpf.isdigit() :
            raise serializers.ValidationError("O cpf deve conter 11 dígitos")
        
        return cpf



class AdminSerializer(serializers.ModelSerializer):
    
    perfil = PerfilSerializer()

    class Meta:
        model = Admin
        fields = ['id', 'perfil']

    def create(self, validated_data):
        
        perfil_data = validated_data.pop('perfil')
        
    
        perfil_data['tipo'] = 'admin'
        perfil_data['role'] = 'admin'
        
        # salv o perfil no banco através do ORM
        perfil_instancia = Perfil.objects.create_user(**perfil_data)
        #  salva o admin no banco vinculado ao perfil recém-criado
        admin_instancia = Admin.objects.create(perfil=perfil_instancia)
        
        return admin_instancia
    
    def update(self, instance, validated_data):
    
        perfil_data = validated_data.pop('perfil', None)

        # (Futuramente os campos únicos dessa tabela deverão ser atualizados aqui, antes do instance.save)
        instance.save()

        if perfil_data:
            
            perfil = instance.perfil
            perfil.nome = perfil_data.get('nome', perfil.nome)
            perfil.cpf = perfil_data.get("cpf", perfil.cpf)
            perfil.email = perfil_data.get("email", perfil.email)
            perfil.data_nascimento = perfil_data.get ('data_nascimento',perfil.data_nascimento)

            
            password = perfil_data.get("password", None)
            if password:
                perfil.set_password(password)

            perfil.save()
        return instance

class AlunoSerializer(serializers.ModelSerializer):
    perfil = PerfilSerializer()

    class Meta:
        model = Aluno
        fields = ['id', 'perfil']

    def create(self, validated_data):

        perfil_data = validated_data.pop('perfil')
        perfil_data['tipo'] = 'aluno'
        perfil_data['role'] = 'aluno'

        perfil_instancia = Perfil.objects.create_user(**perfil_data)
        aluno_instancia = Aluno.objects.create(perfil = perfil_instancia)

        return aluno_instancia
    
    def update(self, instance, validated_data):
    
        perfil_data = validated_data.pop('perfil', None)

        # (Futuramente os campos únicos dessa tabela deverão ser atualizados aqui, antes do instance.save)
        instance.save()

        if perfil_data:
            
            perfil = instance.perfil
            perfil.nome = perfil_data.get('nome', perfil.nome)
            perfil.cpf = perfil_data.get("cpf", perfil.cpf)
            perfil.email = perfil_data.get("email", perfil.email)
            perfil.data_nascimento = perfil_data.get ('data_nascimento',perfil.data_nascimento)

            
            password = perfil_data.get("password", None)
            if password:
                perfil.set_password(password)

            perfil.save()
        return instance
    