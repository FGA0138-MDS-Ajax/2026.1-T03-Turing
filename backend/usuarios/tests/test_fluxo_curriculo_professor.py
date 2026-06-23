from django.contrib.auth.hashers import make_password
from interacoes.models import Inscricao
from rest_framework.test import APIClient, APITestCase
from usuarios.models import Professor, Perfil, Admin, Aluno


class ProfessorTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        client = APIClient()

        Admin.objects.create(perfil=Perfil.objects.create(
            nome='Admin',
            email='admin@email.com',
            cpf='00000000000',
            data_nascimento='2000-01-01',
            tipo='admin',
            password=make_password('123456')
        ))
        login = client.post('/api/usuarios/login/', {
            'email': 'admin@email.com',
            'password': '123456'
        }, format='json')
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {login.data["access"]}')

        response = client.post('/api/usuarios/professores/', {
            "perfil": {
                "nome": "aleatorio",
                "email": "professor@email.com",
                "cpf": "12345678901",
                "data_nascimento": "2005-05-12",
                "tipo": "professor",
                "password": "123456"
            }
        }, format='json')
        cls.professor = response.data

        cls.aluno = Aluno.objects.create(perfil=Perfil.objects.create(
            nome='Admin',
            email='aluno@email.com',
            cpf='11111111111',
            data_nascimento='2000-01-01',
            tipo='aluno',
            password=make_password('123456')
        ))

    def get_token(self, email, password='123456'):
        login = self.client.post('/api/usuarios/login/', {
            'email': email,
            'password': password
        }, format='json')
        print(login.data)
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

    ## como aluno
    def test_aluno_criar_professor(self):
        self.get_token('aluno@email.com')
        response = self.client.post('/api/usuarios/professores/create_by_admin/', {
            'perfil': {"nome": "aleatorio",
                       "email": "professor@aleatorio.com",
                       "cpf": "1234567894",
                       "data_nascimento": "2005-05-12",
                       "tipo": "professor",
                       "password": "123456"}

        }, format='json')
        self.assertEqual(response.status_code, 403)

    ## como professor
    def test_professor_criar_professor(self):
        self.get_token('aleatorio@email.com')
        response = self.client.post('/api/usuarios/professores/create_by_admin/', {
            'perfil': {
                "nome": "aleatorio",
                "email": "professor@email.com",
                "cpf": "1234567894",
                "data_nascimento": "2005-05-12",
                "tipo": "professor",
                "password": "123456"
            }

        }, format='json')
        self.assertEqual(response.status_code, 403)

    def test_admin_criar_professor(self):
        response = self.client.post('/api/usuarios/professores/create_by_admin/', {
            'perfil': {
                "nome": "gabriel",
                "email": "professor12@email.com",
                "cpf": "1234567894",
                "data_nascimento": "2005-05-12",
                "tipo": "professor",
                "password": "123456"
            }
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['perfil']['nome'], 'gabriel')
        response2 = self.client.get('/api/interacoes/inscricoes/')
        print(response2.data)
        ## segundo teste
        self.assertEqual(response2.data[1]['status'], 'aprovado')
        self.assertIsNotNone(response2.data[1]['analisado_por'])

        ### terceiro teste
        response3 = self.client.post('/api/usuarios/login/', {
            'email':'professor@email.com',
            'password':'123456'
        })
        self.assertEqual(response3.status_code, 200)

        response4 = self.client.get('/api/usuarios/professores/')
        print(response4.data)
        self.assertEqual(response4.data[1]['perfil']['nome'], 'gabriel')


