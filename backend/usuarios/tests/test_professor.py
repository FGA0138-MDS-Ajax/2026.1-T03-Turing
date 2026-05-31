from django.contrib.auth.hashers import make_password
from rest_framework.test import APIClient, APITestCase
from usuarios.models import Professor, Perfil


class ProfessorTestCase(APITestCase):
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
        perfil_criado = Perfil.objects.create(
            nome='aleatorio',
            email='gabriel@aleatorio.com',
            cpf='12345678901',
            data_nascimento='2005-05-12',
            tipo='professor',
        )

        Professor.objects.create(
            perfil=perfil_criado
        )

    def get_token(self):
        login = self.client.post('/api/usuarios/login/', {
            'email': 'admin@email.com',
            'password': '123456'
        }, format='json')
        token = login.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def setUp(self):
        self.get_token()


    def test_criacao_Professor(self):
        # verifica se o perfil foi criado corretamente
        perfil = Perfil.objects.get(id=2)
        print(perfil)
        professor = Professor.objects.get(perfil=perfil)
        self.assertEqual(perfil.tipo, 'professor')  # tipo do perfil é professor?
        self.assertEqual(professor.perfil, perfil)  # são iguais os objetos?


    def test_listar_professor_GET(self):
        response = self.client.get('/api/usuarios/professores/')
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)

    def test_criar_professor_POST(self):
        response = self.client.post('/api/usuarios/professores/', {
            "perfil": {
                "nome": "Nome do Professor",
                'email' : 'gabriel@aleatorio2.com',
                "cpf" : '12345678902',
                "data_nascimento" : '2005-05-12',
                "tipo" : 'professor',
                "password" : "make_password('123456')"
            }
        }, format='json')
        print(response.data)
        self.assertEqual(response.status_code, 201)

    def test_atualizar_professor_PATCH(self):
        response=self.client.patch('/api/usuarios/professores/1/', {
            "perfil": {
                "nome": "Novo Nome"
            }
        }, format='json', Authorization=self.client.credentials)
        print(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['perfil']['nome'],'Novo Nome')

    def test_atualizar_professor_PUT(self):
        response=self.client.put('/api/usuarios/professores/1/', {
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
        self.assertEqual(response.data['perfil']['nome'],'Novo Nome')

    def test_deletar_aluno_DELETE(self):
        response=self.client.delete('/api/usuarios/professores/1/')
        print(response.data)
        self.assertEqual(response.status_code, 204)
