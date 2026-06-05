from django.contrib.auth.hashers import make_password
from rest_framework.test import APIClient, APITestCase
from disciplinas.models import Disciplina
from usuarios.models import Perfil, Aluno, Admin


class DisciplinaTestCase(APITestCase):
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
        Perfil.objects.create(
            nome='Aluno Teste',
            email='aluno@email.com',
            cpf='11111111111',
            data_nascimento='2000-01-01',
            tipo='aluno',
            password=make_password('123456')
        )
        Perfil.objects.create(
            nome='professor teste',
            email='professor@email.com',
            cpf='22222222222',
            data_nascimento='2000-01-01',
            tipo='professor',
            password=make_password('123456')
        )
        cls.disciplina = Disciplina.objects.create(
            nome='Cálculo I',
            descricao='Introdução a limites, derivadas e integrais.',
        )

    def get_token(self, email, password='123456'):
        login= self.client.post('/api/usuarios/login/', {
            'email': email,
            'password': password
        }, format='json')
        token = login.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def setUp(self):
        self.get_token('admin@email.com')

### testes com usuarios anonimos

    def test_listar_disciplinas_GET(self):
        self.client.credentials() # limpa as credenciais, é como um logout
        response = self.client.get('/api/disciplinas/')
        self.assertEqual(response.status_code, 401)

### teste nome duplicado
    def test_nome_duplicado(self):
        self.get_token('admin@email.com')
        self.client.post('/api/disciplinas/', {
            "nome": "Estrutura de nada",
            'descricao': 'horrivel'
        }, format='json')

        response = self.client.post('/api/disciplinas/', {
            "nome": "Estrutura de nada",
            'descricao': 'horrivel'
        }, format='json')
        self.assertEqual(response.status_code, 400)

    ### alunos ou professores
    def test_listar_disciplinas_GET_aluno(self):
        self.get_token('professor@email.com')
        response = self.client.get('/api/disciplinas/')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)

    def test_criar_disciplinas_aluno(self):
        self.get_token('aluno@email.com')
        response = self.client.post('/api/disciplinas/',{
            "nome": "Estrutura de Dados",
            "descricao": "Estudo de listas, pilhas, filas e árvores."
        }, format='json')
        self.assertEqual(response.status_code, 403)

    def test_put_disciplina_aluno(self):
        self.get_token('aluno@email.com')
        response = self.client.put(f'/api/disciplinas/{self.disciplina.id}/',{
            "nome": "Estrutura de Dados",
            'descricao':  'descricao teste'
        },format='json')
        self.assertEqual(response.status_code, 403)

    def test_delete_disciplina_aluno(self):
        self.get_token('aluno@email.com')
        response = self.client.delete(f'/api/disciplinas/{self.disciplina.id}/')
        self.assertEqual(response.status_code, 403)

    def test_patch_disciplina_aluno(self):
        self.get_token('aluno@email.com')
        response = self.client.patch(f'/api/disciplinas/{self.disciplina.id}/',{
            "nome": "Estrutura de Dades",
        },format='json')
        self.assertEqual(response.status_code, 403)

### admin
    def test_criar_disciplinas_admin(self):
        self.get_token('admin@email.com')
        response=self.client.post('/api/disciplinas/',{
            "nome": "Estrutura de nada",
            'descricao':'horrivel'
        },format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['nome'], 'Estrutura de nada')

    def test_patch_disciplina_admin(self):
        self.get_token('admin@email.com')
        response=self.client.patch(f'/api/disciplinas/{self.disciplina.id}/',{
            "nome": "Estrutura de Dadis",
        },format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['nome'], 'Estrutura de Dadis')

    def test_put_disciplina_admin(self):
        self.get_token('admin@email.com')
        response= self.client.put(f'/api/disciplinas/{self.disciplina.id}/',{
            "nome": "Estrutura de Dadis",
            'descricao':'coco'
        },format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['nome'], 'Estrutura de Dadis')

    def test_delete_disciplina_admin(self):
        self.get_token('admin@email.com')
        response = self.client.delete(f'/api/disciplinas/{self.disciplina.id}/')
        self.assertEqual(response.status_code, 204)

    def test_entrada_de_dados(self):
        self.get_token('admin@email.com')
        response = self.client.post('/api/disciplinas/', {
            "nome": "Estrutura de nada",
        }, format='json')
        print(response.data)
        self.assertEqual(response.status_code, 400)

        self.get_token('admin@email.com')
        response = self.client.post('/api/disciplinas/', {
            'descricao': 'horrivel'
        }, format='json')
        self.assertEqual(response.status_code, 400)



