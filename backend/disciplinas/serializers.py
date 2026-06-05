from rest_framework import serializers
from .models import Conteudo, Disciplina
from disciplinas.models import Material

    #Classe de Materiais
class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__' #Deixei o all para traduzir todos campos, mas qualquer coisa eu arrumo

    def validate_nome(self, value):
        nome = value.strip() if value else ""
        if not nome:
            raise serializers.ValidationError("O nome do material não pode ser vazio, adicione um nome válido.")

        return nome

    def validate(self, data):
            # Agora vai usar o novo valor ou valor existente no banco
        tipo = data.get('tipo', self.instance.tipo if self.instance else None)
        arquivo = data.get('arquivo', self.instance.arquivo if self.instance else None)
        link = data.get('link', self.instance.link if self.instance else None)


            # Tem que ter arquivo ou link, conforme a issue
        if not arquivo and not link:
            raise serializers.ValidationError("O Material deve conter um arquivo ou link")

        if tipo in ['link', 'video']:
            if not link:
                raise serializers.ValidationError(f"Para o material ({tipo}) deve conter um link(URL)")

            # Verifica se o arquivo esta nos formatos aceitos
        novo_arquivo = data.get('arquivo')
        if novo_arquivo:
            extensao = novo_arquivo.name.split('.')[-1].lower()

            if tipo == 'pdf' and extensao != 'pdf':
                raise serializers.ValidationError({"arquivo":"Você selecionou PDF, mas enviou um arquivo com formato diferente."})

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
        
class DisciplinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disciplina
        fields = '__all__'
