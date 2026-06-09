from django.contrib.auth.hashers import make_password
from rest_framework.test import APIClient, APITestCase
from usuarios.models import Admin, Perfil, Professor
from interacoes.models import Inscricao


class TestEstrucModeraInscricoes(APITestCase):
    @classmethod
    def setUpTestData(cls):
        client = APIClient()

        perfil_criado = Perfil.objects.create(
            nome='admin',
            email='admin@email.com',
            cpf='00000000000',
            data_nascimento='2005-12-12',
            tipo='admin',
            password=make_password('123456')
        )
        Admin.objects.create(
            perfil=perfil_criado
        )
        login = client.post('/api/usuarios/login/', {
            'email': 'admin@email.com',
            'password': '123456'
        }, format='json')
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {login.data["access"]}')
        perfil_professor = Perfil.objects.create(
            nome='professor teste',
            email='professor@email.com',
            cpf='22222222222',
            data_nascimento='2000-01-01',
            tipo='professor',
            password=make_password('123456'),
            is_active=False
        )
        cls.professor_id = client.post('/api/usuarios/professores/', {
            "perfil": {
                "nome": "Nome do professor",
                'email': 'gabriel@aleatorio2.com',
                "cpf": '12345678902',
                "data_nascimento": '2005-05-12',
                "tipo": 'professor',
                "password": '123456'
            }
        }, format='json').data['id']

        client.post('/api/usuarios/professores/', {
            "perfil": {
                "nome": "Nome do professor",
                'email': 'gabriel@aeatori2.com',
                "cpf": '12345678904',
                "data_nascimento": '2005-05-12',
                "tipo": 'professor',
                "password": '123456'
            }
        }, format='json').data['id']

        cls.inscricao = Inscricao.objects.get(professor__id=cls.professor_id)

    def get_token(self, email, password='123456'):
        login = self.client.post('/api/usuarios/login/', {
            'email': email,
            'password': password
        }, format='json')
        token = login.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def setUp(self):
        self.get_token('admin@email.com')

    ###

    def test_login_professro_inativo(self):
        response = self.client.post('/api/usuarios/login/', {
            'email': f'gabriel@aleatorio2.com',
            'password': '123456'
        }, format='json')
        print(response.data)
        self.assertEqual(
            response.status_code, 401)

    def test_inscricao_professor_aprovar(self):
        response= self.client.patch(f'/api/interacoes/inscricoes/{self.inscricao.id}/aprovar/')
        self.assertEqual(response.status_code, 200)
        print(response.data)

    def test_inscricao_professor_rejeitar(self):
        response= self.client.patch(f'/api/interacoes/inscricoes/{self.inscricao.id}/rejeitar/')
        self.assertEqual(response.status_code, 200)
        print(response.data)

    def test_login_aprovado(self):
        self.client.patch(f'/api/interacoes/inscricoes/{self.inscricao.id}/aprovar/')
        #aprovo a inscrição desse cara
        response = self.client.post('/api/usuarios/login/', {
            'email': f'gabriel@aleatorio2.com',
            'password': '123456'
        },format='json')
        print(response.data)
        # testo login
        self.assertEqual(response.status_code, 200)

    def test_login_rejeitado(self):
        self.client.patch(f'/api/interacoes/inscricoes/{self.inscricao.id}/rejeitar/')
        #aprovo a inscrição desse cara
        response = self.client.post('/api/usuarios/login/', {
            'email': f'gabriel@aleatorio2.com',
            'password': '123456'
        },format='json')
        print(response.data)
        # testo login
        self.assertEqual(response.status_code, 401)

    def test_Integridade_aprovar(self):
        self.client.patch(f'/api/interacoes/inscricoes/{self.inscricao.id}/aprovar/')
        response = self.client.patch(f'/api/interacoes/inscricoes/{self.inscricao.id}/aprovar/')
        resopnse2=self.client.patch(f'/api/interacoes/inscricoes/{self.inscricao.id}/rejeitar/')
        print(response.data)
        print(resopnse2.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(resopnse2.status_code, 400)

    def test_Integridade_rejeitar(self):
        self.client.patch(f'/api/interacoes/inscricoes/{self.inscricao.id}/rejeitar/')
        response = self.client.patch(f'/api/interacoes/inscricoes/{self.inscricao.id}/rejeitar/')
        response2 = self.client.patch(f'/api/interacoes/inscricoes/{self.inscricao.id}/aprovar/')
        print(response.data)
        print(response2.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response2.status_code, 400)

    def test_professores_aprovados(self):
        self.client.patch(f'/api/interacoes/inscricoes/{self.inscricao.id}/aprovar/')
        response = self.client.get('/api/usuarios/professores/')
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)