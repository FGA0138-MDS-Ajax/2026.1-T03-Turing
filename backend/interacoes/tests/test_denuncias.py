from django.contrib.auth.hashers import make_password
from django.db.models import Model
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from disciplinas.models import Disciplina, Conteudo
from interacoes.models import Mensagem, Forum, Denuncia
from usuarios.models import Perfil, Aluno, Admin, Professor


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

        perfil_criado3 = Perfil.objects.create(
            nome='professor',
            email='professor@aleatorio.com',
            cpf='12345678903',
            data_nascimento='2005-05-12',
            tipo='professor',
            password=make_password('123456')
        )
        Professor.objects.create(
            perfil=perfil_criado3,
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

    def cria_denuncia(self):
        self.get_token('aluno@aleatorio.com')
        response = self.client.post('/api/interacoes/denuncias/', {
            'descricao': 'mensagem TESTE',
            'motivo': 'testando',
            'mensagem': self.mensagem.id
        })
        denuncia = Denuncia.objects.get(descricao='mensagem TESTE')
        return denuncia.id

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
            'descricao': '',
            'mensagem': self.mensagem.id
        })
        print(response.data)
        self.assertEqual(response.status_code, 400)

    ###Admim rotas
    def test_admin_list_GET(self):
        self.get_token('admin@email.com')
        response = self.client.get('/api/interacoes/denuncias/', )
        print(response.data)
        self.assertEqual(response.status_code, 200)

    def test_admim_PATCH(self):
        denuncia=DenunciasTestCase.cria_denuncia(self)
        self.get_token('admin@email.com')
        response = self.client.patch(f'/api/interacoes/denuncias/{denuncia}/', {
            'status': 'analisado',
        })
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'analisado')

    def test_admin_PUT(self):
        denuncia=DenunciasTestCase.cria_denuncia(self)
        self.get_token('admin@email.com')
        response = self.client.put(f'/api/interacoes/denuncias/{denuncia}/', {
            'mensagem_id': 1, 'denunciante_id': 2, 'denunciado_id': 2, 'motivo': 'teste', 'evidencias': '',
            'parecer_admin': '', 'analisado_por_id': '', 'status': 'analisado', 'descricao': 'mensagem TESTE'
        })
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'analisado')

    def test_nao_deve_editar_mensagem_com_denuncia_pendente(self):
        self.get_token('admin@email.com')
        Denuncia.objects.create(
            mensagem=self.mensagem,
            denunciante=self.aluno2.perfil,
            denunciado=self.mensagem.autor,
            status='pendente'
        )
        response = self.client.delete(
            f'/api/interacoes/mensagens/{self.mensagem.id}/'
        )
        print(response.data)
        self.assertEqual(response.status_code, 403)

    def test_admin_em_analise_DELETE(self):
        denuncia=DenunciasTestCase.cria_denuncia(self)
        self.get_token('admin@email.com')
        response = self.client.delete(f'/api/interacoes/denuncias/{denuncia}/')
        print(response.data)
        self.assertEqual(response.status_code, 200)

    ###Como outros Users
    def test_aluno_list_GET(self):
        self.get_token('aluno@aleatorio.com')
        response = self.client.get('/api/interacoes/denuncias/', )
        print(response.data)
        self.assertEqual(response.status_code, 403)

    def test_anonimo_list_GET(self):
        response = self.client.get('/api/interacoes/denuncias/', )
        print(response.data)
        self.assertEqual(response.status_code, 401)

    def test_professor_list_GET(self):
        self.get_token('professor@aleatorio.com')
        response = self.client.get('/api/interacoes/denuncias/')
        print(response.data)
        self.assertEqual(response.status_code, 403)

    def test_professor_detail_GET(self):
        denuncia = self.cria_denuncia()

        self.get_token('professor@aleatorio.com')
        response = self.client.get(
            f'/api/interacoes/denuncias/{denuncia}/'
        )

        print(response.data)
        self.assertEqual(response.status_code, 403)

    def test_professor_PATCH(self):
        denuncia = self.cria_denuncia()

        self.get_token('professor@aleatorio.com')
        response = self.client.patch(
            f'/api/interacoes/denuncias/{denuncia}/',
            {'status': 'analisado'}
        )

        print(response.data)
        self.assertEqual(response.status_code, 403)

    def test_professor_PUT(self):
        denuncia = self.cria_denuncia()

        self.get_token('professor@aleatorio.com')
        response = self.client.put(
            f'/api/interacoes/denuncias/{denuncia}/',
            {
                'mensagem': self.mensagem.id,
                'motivo': 'teste',
                'descricao': 'teste'
            }
        )

        print(response.data)
        self.assertEqual(response.status_code, 403)

    def test_professor_DELETE(self):
        denuncia = self.cria_denuncia()

        self.get_token('professor@aleatorio.com')
        response = self.client.delete(
            f'/api/interacoes/denuncias/{denuncia}/'
        )

        print(response.data)
        self.assertEqual(response.status_code, 403)

    def test_aluno_detail_GET(self):
        denuncia = self.cria_denuncia()

        self.get_token('aluno@aleatorio.com')
        response = self.client.get(
            f'/api/interacoes/denuncias/{denuncia}/'
        )

        self.assertEqual(response.status_code, 403)

    def test_aluno_PATCH(self):
        denuncia = self.cria_denuncia()

        self.get_token('aluno@aleatorio.com')
        response = self.client.patch(
            f'/api/interacoes/denuncias/{denuncia}/',
            {'status': 'analisado'}
        )

        self.assertEqual(response.status_code, 403)

    def test_aluno_PUT(self):
        denuncia = self.cria_denuncia()

        self.get_token('aluno@aleatorio.com')
        response = self.client.put(
            f'/api/interacoes/denuncias/{denuncia}/',
            {
                'mensagem': self.mensagem.id,
                'motivo': 'teste',
                'descricao': 'teste'
            }
        )

        self.assertEqual(response.status_code, 403)

    def test_aluno_DELETE(self):
        denuncia = self.cria_denuncia()

        self.get_token('aluno@aleatorio.com')
        response = self.client.delete(
            f'/api/interacoes/denuncias/{denuncia}/'
        )

        self.assertEqual(response.status_code, 403)