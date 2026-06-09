from django.contrib.auth.hashers import make_password
from rest_framework.test import APIClient, APITestCase
from usuarios.models import Admin, Perfil

class AdminTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        perfil_criado = Perfil.objects.create(
            nome='admin',
            email='admin@email.com',
            cpf='00000000000',
            data_nascimento='2005-12-12',
            tipo='admin',
            password=make_password('123456')
        )
        cls.admin=Admin.objects.create(
            perfil=perfil_criado
        )

    def get_token(self):
        login = self.client.post('/api/usuarios/login/', {
            'email': 'admin@email.com',
            'password': '123456'
        }, format='json')
        token = login.data['access']
        print(token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def setUp(self):
        self.get_token()


    def test_criacao_Admin(self):
        # verifica se o perfil foi criado corretamente
        perfil = Perfil.objects.get(id=self.admin.perfil.id)
        print(perfil)
        admin = Admin.objects.get(perfil=perfil)
        self.assertEqual(perfil.tipo, 'admin')
        self.assertEqual(admin.perfil, perfil)

    ### CRUD

    def test_listar_admin_GET(self):
        response = self.client.get('/api/usuarios/administradores/')
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)

    def test_criar_admin_POST(self):
        response = self.client.post('/api/usuarios/administradores/', {
            "perfil": {
                "nome": "Nome do Admim",
                'email': 'gabriel@aleatorio2.com',
                "cpf": '12345678902',
                "data_nascimento": '2005-05-12',
                "tipo": 'admin',
                "password": make_password('123456')
            }
        }, format='json')
        print(response.data)
        self.assertEqual(response.status_code, 201)

    def test_atualizar_admin_PATCH(self):
        response=self.client.patch(f'/api/usuarios/administradores/{self.admin.id}/', {
            "perfil": {
                "nome": "Novo Nome"
            }
        }, format='json', Authorization=self.client.credentials)
        print(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['perfil']['nome'],'Novo Nome')

    def test_atualizar_admin_PUT(self):
        response=self.client.put(f'/api/usuarios/administradores/{self.admin.id}/', {
              "perfil": {
                "nome": "Novo Nome",
                "email": "admin1@email.com",
                "cpf": "12345678903",
                "password": "123456",
                "data_nascimento": "2000-01-01"
              }
        }, format='json')
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['perfil']['nome'],'Novo Nome')

    def test_deletar_aluno_DELETE(self):
        response=self.client.delete(f'/api/usuarios/administradores/{self.admin.id}/')
        print(response.data)
        self.assertEqual(response.status_code, 204)