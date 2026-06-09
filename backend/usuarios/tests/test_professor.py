from django.contrib.auth.hashers import make_password
from interacoes.models import Inscricao
from rest_framework.test import APIClient, APITestCase
from usuarios.models import Professor, Perfil, Admin


class ProfessorTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        client=APIClient()
        Perfil.objects.create(
            nome='admin',
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
                "email": "gabriel@aleatorio.com",
                "cpf": "12345678901",
                "data_nascimento": "2005-05-12",
                "tipo": "professor",
                "password": "123456"
            }
        }, format='json')
        cls.professor_id = response.data['id']

        # perfil_criado = Perfil.objects.create(
        #     nome='aleatorio',
        #     email='gabriel@aleatorio.com',
        #     cpf='12345678901',
        #     data_nascimento='2005-05-12',
        #     tipo='professor',
        # )
        #
        # cls.professor=professor.objects.create(
        #     perfil=perfil_criado
        # )

    def get_token(self):
        login = self.client.post('/api/usuarios/login/', {
            'email': 'admin@email.com',
            'password': '123456'
        }, format='json')
        token = login.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def setUp(self):
        self.get_token()
        from interacoes.models import Inscricao
        professor= Professor.objects.get(id=self.professor_id)
        print(professor)
        inscricao = Inscricao.objects.get(professor=professor)
        inscricao.status = 'aprovado'
        inscricao.save()

    def test_criacao_Professor(self):
        # verifica se o perfil foi criado corretamente
        professor= Professor.objects.get(id=self.professor_id)
        self.assertEqual(professor.perfil.tipo, 'professor')  # tipo do perfil é professor?

    def test_listar_professor_GET(self):
        response = self.client.get('/api/usuarios/professores/')
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)

    def test_criar_professor_POST(self):
        response = self.client.post('/api/usuarios/professores/', {
            "perfil": {
                "nome": "Nome do professor",
                'email': 'gabriel@aleatorio2.com',
                "cpf": '12345678902',
                "data_nascimento": '2005-05-12',
                "tipo": 'professor',
                "password": "make_password('123456')"
            }
        }, format='json')
        print(response.data)
        self.assertEqual(response.status_code, 201)

    def test_atualizar_professor_PATCH(self):
        response = self.client.patch(f'/api/usuarios/professores/{self.professor_id}/', {
            "perfil": {
                "nome": "Novo Nome"
            }
        }, format='json', Authorization=self.client.credentials)
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['perfil']['nome'], 'Novo Nome')

    def test_atualizar_professor_PUT(self):
        response = self.client.put(f'/api/usuarios/professores/{self.professor_id}/', {
            "perfil": {
                "nome": "Novo Nome",
                "email": "prof1@email.com",
                "cpf": "12345678903",
                "password": "123456",
                "data_nascimento": "2000-01-01"
            }
        }, format='json')
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['perfil']['nome'], 'Novo Nome')

    def test_deletar_aluno_DELETE(self):
        response = self.client.delete(f'/api/usuarios/professores/{self.professor_id}/')
        print(response.data)
        self.assertEqual(response.status_code, 204)
