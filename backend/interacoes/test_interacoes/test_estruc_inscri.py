from django.contrib.auth.hashers import make_password
from rest_framework.test import APIClient, APITestCase
from usuarios.models import Admin, Perfil, Professor
from interacoes.models import Inscricao


class TestEstrucModeraInscricoes(APITestCase):

    @classmethod
    def setUpTestData(cls):
        perfil_criado = Perfil.objects.create(
            nome='Admin',
            email='admin@email.com',
            cpf='00000000000',
            data_nascimento='2005-12-12',
            tipo='admin',
            password=make_password('123456')
        )
        Admin.objects.create(
            perfil=perfil_criado
        )

        perfil_professor = Perfil.objects.create(
            nome='professor teste',
            email='professor@email.com',
            cpf='22222222222',
            data_nascimento='2000-01-01',
            tipo='professor',
            password=make_password('123456')
        )
        cls.professor = Professor.objects.create(
            perfil=perfil_professor
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

    ### anonimo
    def test_get_inscricoes_anonimo(self):
        self.client.credentials()
        response = self.client.get('/api/interacoes/inscricoes/')
        self.assertEqual(response.status_code, 401)


###aluno/professor
    def test_get_inscricoes_aluno_professor(self):
        self.get_token('professor@email.com')
        response = self.client.get('/api/interacoes/inscricoes/')
        self.assertEqual(response.status_code, 403)
        print(response.data, 'mostrei inscrições ')

    def test_get_inscricoes_pendente(self):
        self.get_token('professor@email.com')
        response = self.client.get('/api/interacoes/inscricoes/?status=pendente')
        self.assertEqual(response.status_code, 403)
        self.assertIsInstance(response.data, list)

    ### admin

    def test_get_inscricoes_admin(self):
        response1 = self.client.post('/api/usuarios/professores/', {
            "perfil": {
                "nome": "Nome do Professor",
                'email': 'gabriel@aleatorio2.com',
                "cpf": '12345678902',
                "data_nascimento": '2005-05-12',
                "tipo": 'professor',
                "password": "make_password('123456')"
            }
        }, format='json')
        print(response1.data)
        self.assertEqual(response1.status_code, 201)

        response = self.client.get('/api/interacoes/inscricoes/')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)
        print(response.data)

    def test_get_inscricoes_pendente(self):
        response1 = self.client.post('/api/usuarios/professores/', {
            "perfil": {
                "nome": "Nome do Professor",
                'email': 'gabriel@aleatorio2.com',
                "cpf": '12345678902',
                "data_nascimento": '2005-05-12',
                "tipo": 'professor',
                "password": "make_password('123456')"
            }
        }, format='json')
        print(response1.data)
        self.assertEqual(response1.status_code, 201)

        response2 = self.client.get('/api/interacoes/inscricoes/')
        self.assertEqual(response2.status_code, 200)
        self.assertIsInstance(response2.data, list)
        print(response2.data)
        response= self.client.get('/api/interacoes/inscricoes/?status=pendente')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)