from django.contrib.auth.hashers import make_password
from rest_framework.test import APIClient, APITestCase
from usuarios.models import Admin, Perfil, Aluno, Professor
from disciplinas.models import Conteudo, Disciplina
from interacoes.models import Inscricao


class ConteudoTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        client = APIClient()
        Perfil.objects.create(
            nome='Admin',
            email='admin@email.com',
            cpf='00000000000',
            data_nascimento='2000-01-01',
            tipo='admin',
            password=make_password('123456')
        )
        login = client.post('/api/usuarios/login/', {
            'email': 'admin@email.com',
            'password': '123456'
        }, format='json')
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {login.data["access"]}')

        response = client.post('/api/usuarios/professores/', {
            "perfil": {
                "nome": "aleatorio",
                "email": "professor1@email.com",
                "cpf": "12345678901",
                "data_nascimento": "2005-05-12",
                "tipo": "professor",
                "password": "123456"
            }
        }, format='json')
        cls.professor = response.data
        Perfil.objects.create(
            nome='Aluno Teste',
            email='aluno@email.com',
            cpf='11111111111',
            data_nascimento='2000-01-01',
            tipo='aluno',
            password=make_password('123456')
        )


        cls.disciplina = Disciplina.objects.create(
            nome='Cálculo I',
            descricao='Introdução a limites, derivadas e integrais.',
        )
        cls.conteudo= Conteudo.objects.create(
            nome='Derivadas',
            descricao='Derivadas',
            disciplina=cls.disciplina,
            status='ativo',

        )

    def get_token(self, email, password='123456'):
        login = self.client.post('/api/usuarios/login/', {
            'email': email,
            'password': password
        }, format='json')
        token = login.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def setUp(self):
        self.get_token('admin@email.com')

        professor = Professor.objects.get(id=self.professor['id'])
        inscricao = Inscricao.objects.get(professor=professor)
        inscricao.status = 'aprovado'
        inscricao.perfil_aprovado = True
        inscricao.save()
        professor.perfil.is_active = True
        professor.perfil.save()

### get anonimo
    def test_listar_conteudo_GET(self):
        self.client.credentials()
        response = self.client.get('/api/disciplinas/conteudos/')
        self.assertEqual(response.status_code, 401)

### como aluno
    def test_listar_conteudo_GET_aluno(self):
        self.get_token('aluno@email.com')
        response = self.client.get('/api/disciplinas/conteudos/')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)
        print(response.data)

    def test_post_conteudo(self):
        self.get_token('professor1@email.com')
        response = self.client.post('/api/disciplinas/conteudos/', {
            "nome": "Derivadas",
            "descricao": "Derivadas",
            'status': 'ativo',
            "disciplina": self.disciplina.id,
            'professores':[]
        }, format='json')
        self.assertEqual(response.status_code, 403)

    def test_put_conteudo(self):
        self.get_token('professor1@email.com')
        response = self.client.put('/api/disciplinas/conteudos/1/', {
            "nome": "Derivadas",
            "descricao": "Derivadas",
            'status': 'ativo',
            "disciplina": self.disciplina.id,
            'professores':[3]
        },format='json')
        self.assertEqual(response.status_code, 403)
        print(response.data)

    def test_delete_conteudo(self):
        self.get_token('professor1@email.com')
        response = self.client.delete('/api/disciplinas/conteudos/1/')
        self.assertEqual(response.status_code, 403)
        print(response.data)

### como admin

    def test_post_admin(self):
        response = self.client.post('/api/disciplinas/conteudos/', {
            "nome": "integrais",
            "descricao": "integrais",
            'status': 'ativo',
            "disciplina": self.disciplina.id,
            'professores':[]
        },format='json')
        print(response.data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['nome'], 'integrais')

    def test_put_admin(self):
        response = self.client.put(f'/api/disciplinas/conteudos/{self.professor['id']}/', {
            "nome": "integrais",
            "descricao": "integrais",
            'status': 'encerrado',
            "disciplina": self.disciplina.id,
            'professores':[1]
        },format='json')
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['nome'], 'integrais')
        self.assertEqual(response.data['status'], 'encerrado')

    def test_patch_admin(self):
        response = self.client.patch('/api/disciplinas/conteudos/1/', {

            'status': 'encerrado',
            'descricao': 'descricao alterada'

        },format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'encerrado')
        print(response.data)

    def test_get_admin(self):
        response = self.client.get('/api/disciplinas/conteudos/')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)

    def test_delete_admin(self):
        response = self.client.delete('/api/disciplinas/conteudos/1/')
        self.assertEqual(response.status_code, 204)