from django.contrib.auth.hashers import make_password
from django.db.models import Model
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from disciplinas.models import Disciplina, Conteudo
from interacoes.models import Mensagem, Forum, Denuncia
from usuarios.models import Perfil, Aluno, Admin


class DenunciasTestCase(APITestCase):

    @classmethod
    def setUpTestData(cls):
        Perfil.objects.create(
            nome='Admin',
            email='admin@email.com',
            cpf='00000000000',
            data_nascimento='2000-01-01',
            tipo='admin',
            password=make_password('123456')
        )
        Admin.objects.create(perfil=Perfil.objects.get(nome='Admin'))
        cls.perfil_criado = Perfil.objects.create(
            nome='aluno',
            email='aluno@aleatorio.com',
            cpf='12345678901',
            data_nascimento='2005-05-12',
            tipo='aluno',
            password=make_password('123456')
        )
        perfil_criado2 = Perfil.objects.create(
            nome='aluno2',
            email='aluno2@aleatorio.com',
            cpf='12345678902',
            data_nascimento='2005-05-12',
            tipo='aluno',
            password=make_password('123456')
        )

        cls.aluno = Aluno.objects.create(
            perfil=cls.perfil_criado
        )

        cls.aluno2 = Aluno.objects.create(
            perfil=perfil_criado2
        )

        cls.Disciplina = Disciplina.objects.create(
            nome='teste',
            descricao='testando',
        )

        cls.conteudo=Conteudo.objects.create(
            nome='teste',
            descricao='testando',
            status='ativo',
            disciplina_id=cls.Disciplina.id
        )
        forum=Forum.objects.get(conteudo_id=cls.conteudo.id)
        cls.mensagem=Mensagem.objects.create(
            texto='mensagemTeste',
            autor_id=cls.perfil_criado.id,
            forum_id=forum.id,
        )

    def get_token(self, email, password='123456'):
        login = self.client.post('/api/usuarios/login/', {
            'email': email,
            'password': password
        }, format='json')
        token = login.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def test_criar_denuncia(self):
        self.get_token('aluno@aleatorio.com')
        response=self.client.post('/api/interacoes/denuncias/', {
            'motivo': 'testando',
            'descricao': 'testando',
            'mensagem': self.mensagem.id
        })
        print(response.data)
        self.assertEqual(response.status_code, 201)

    def test_user_nao_autenticado(self):
        response = self.client.post('/api/interacoes/denuncias/', {
            'status': 'pendente',
            'descricao': 'testando',
            'mensagem': self.mensagem.id
        })
        print(response.data)
        self.assertEqual(response.status_code, 401)

    def test_motivo_vazio(self):
        self.get_token('aluno@aleatorio.com')
        response = self.client.post('/api/interacoes/denuncias/', {
            'descricao': 'testando',
            'mensagem': self.mensagem.id
        })
        print(response.data)
        self.assertEqual(response.status_code, 400)