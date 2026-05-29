from rest_framework import serializers
from disciplinas.models import Material

    #Classe de Materiais
class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__' #Deixei o all para traduzir todos campos, mas qualquer coisa eu arrumo

    def validate(self, data):
        tipo = data.get('tipo')
        arquivo = data.get('arquivo')
        link = data.get('link')

            # Tem que ter arquivo ou link, conforme a issue
        if not arquivo and not link:
            raise serializers.ValidationError("O Material deve conter um arquivo ou link")

        if tipo in ['link', 'video']:
            if not link:
                raise serializers.ValidationError(f"Para o material ({tipo}) deve conter um link(URL)")

            # Verifica se o arquivo esta nos formatos aceitos
        if arquivo:
            extensao = arquivo.name.split('.')[-1].lower()

            if tipo == 'pdf' and extensao != 'pdf':
                raise serializers.ValidationError({"Você selecionou PDF, mas enviou um arquivo com formato diferente."})

            elif tipo == 'imagem' and extensao not in ['jpg', 'jpeg', 'png', 'gif', 'webp']:
                raise serializers.ValidationError(
                    {"arquivo": "Para Imagem, deve-se inserir um formato aceito"})

            elif tipo == 'apresentacao' and extensao not in ['ppt', 'pptx', 'odp']:
                raise serializers.ValidationError(
                    {"arquivo": "Para Apresentação, envie um arquivo no formato aceito"})

            elif tipo == 'documento' and extensao not in ['doc', 'docx', 'txt', 'pdf', 'odt']:
                raise serializers.ValidationError(
                    {"arquivo": "Para Documento, envie um arquivo no formato aceito"})

        return data




from .models import Conteudo

class ConteudoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conteudo
        fields = '__all__'
        #disciplina já é obrigatorio pq é FK sem null=True
        
