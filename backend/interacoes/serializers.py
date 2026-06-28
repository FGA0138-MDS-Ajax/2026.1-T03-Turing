from rest_framework import serializers
from .models import Inscricao, Forum, Mensagem, Denuncia

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
class MensagemSerializer(serializers.ModelSerializer):
    autor_nome = serializers.CharField(
        source='autor.nome',
        read_only=True
    )
    autor_tipo = serializers.CharField(
        source='autor.tipo',
        read_only=True
    )

    class Meta:
        model = Mensagem
        fields = [
            'id',
            'forum',
            'autor',
            'autor_nome',
            'autor_tipo',
            'resposta_para',
            'texto',
            'data_create',
            'data_update'
        ]
        read_only_fields = ['id', 'autor', 'data_create', 'data_update']

    def validate_texto(self, value):
        if not value.strip():
            raise serializers.ValidationError("A mensagem não pode estar vazia.")
        return value

    def validate(self, data):
        resposta_para = data.get('resposta_para')
        if resposta_para:
            request = self.context.get('request')
            if request and request.user.tipo not in ['professor','admin']:
                raise serializers.ValidationError(
                    "Apenas professores ou admins podem responder mensagens"
                )
        return data


class ForumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Forum
        fields = [
            'id',
            'conteudo',
            'data_create'
        ]
        read_only_fields = ['id', 'data_create']

class DenunciaSerializer(serializers.ModelSerializer):
    denunciante_nome = serializers.CharField(source='denunciante.nome', read_only=True)
    denunciado_nome = serializers.CharField(source='denunciado.nome', read_only=True)

    class Meta:
        model = Denuncia
        fields = [
            'id',
            'mensagem',
            'motivo',
            'descricao',
            'evidencias',
            'denunciante',
            'denunciante_nome',
            'denunciado',
            'denunciado_nome',
            'status',
            'parecer_admin',
            'analisado_por',
            'data_create',
            'data_update'
        ]
        # Esses campos são preenchidos pelo sistema, o usuário não pode enviar no POST
        read_only_fields = ['id', 'denunciante', 'denunciado', 'data_create', 'data_update']

        extra_kwargs = {
            'motivo': {
                'required': True,       # Torna o campo obrigatório no POST
                'allow_blank': False,   # Não permite enviar string vazia ""
                'allow_null': False,    # Não deixa enviar null

                'error_messages': {
                    'required': 'O motivo da denúncia não pode estar vazio.',
                    'blank': 'O motivo da denúncia não pode estar vazio.',
                    'null': 'O motivo da denúncia não pode estar vazio.'
                }
            }
        }

    def validate_motivo(self,value):
        if not value or not value.strip():
            raise serializers.ValidationError("O motivo da denúncia não pode estar vazio.")
        return value
