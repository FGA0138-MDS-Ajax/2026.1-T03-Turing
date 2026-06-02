from urllib import response

from django.contrib.auth.hashers import make_password
from rest_framework.test import APIClient
from django.db import DataError, IntegrityError
from rest_framework.test import APIClient, APITestCase
from usuarios.models import Aluno, Perfil
from usuarios.serializers import PerfilSerializer


class AlunoTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.payload = self.payload = \
            {
                'perfil': {
                    "nome": "Nome do ALUNO",
                    "email": "novo.aluno@gostu.com",
                    "cpf": "12345678905",
                    "password": "SuaSenhaSegura",
                    "data_nascimento": "1998-05-16"
                }
            }
        self.get_token()

    # metodo que vai rodar toda vez antes de cada teste
    @classmethod
    def setUpTestData(cls):
        Perfil.objects.create(
            nome='Admin',
            email='admin@email.com',
            cpf='00000000000',
            data_nascimento='2000-01-01',
            tipo='administrador',
            password=make_password('123456')
        )
        perfil_criado = Perfil.objects.create(
            nome='aleatorio',
            email='gabriel@aleatorio.com',
            cpf='12345678901',
            data_nascimento='2005-05-12',
            tipo='aluno',
        )

        cls.aluno=Aluno.objects.create(
            perfil=perfil_criado
        )

    def get_token(self):
        login = self.client.post('/api/usuarios/login/', {
            'email': 'admin@email.com',
            'password': '123456'
        }, format='json')
        token = login.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def test_criacao_aluno(self):
        # verifica se o perfil foi criado corretamente
        perfil = Perfil.objects.get(id=self.aluno.perfil.id)
        aluno = Aluno.objects.get(perfil=perfil)
        self.assertEqual(perfil.tipo, 'aluno')  # tipo do perfil é aluno?
        self.assertEqual(aluno.perfil, perfil)  # são iguais os objetos?

    ### TESTE DE PERFIL E VERIFICACOES DE PERFIL

    def test_verificacao_cpf_mais_de_11_caracteres(self):
        with self.assertRaises(DataError):
            perfil_criado = Perfil.objects.create(
                nome='aleatorio',
                email='gabriel@gmail.com',
                cpf='1234567890112',
                data_nascimento='2005-05-12',
                tipo='aluno',
            )

    def test_verificacao_cpf_menos_de_11_caracteres(self):
        dados = {
            'nome': 'aleatorio',
            'email': 'gabriel@gmail.com',
            'cpf': '12345',
            'data_nascimento': '2005-05-12',
            'tipo': 'aluno',
        }

        serializer = PerfilSerializer(data=dados)
        self.assertFalse(serializer.is_valid())
        print(serializer.errors)
        self.assertIn('cpf', serializer.errors)

    def test_validacao_cpf_duplicado(self):
        with self.assertRaises(IntegrityError):
            perfil_criado = Perfil.objects.create(
                nome='aleatorio2',
                email='gabriel@gmail2.com',
                cpf='12345678901',
                data_nascimento='2005-05-12',
                tipo='aluno',
            )

    def test_verificacao_cpf_com_letras(self):
        dados = {
            'nome': 'aleatorio',
            'email': 'teste@teste.com',
            'cpf': '12345678ab@',
            'data_nascimento': '2005-05-12',
            'tipo': 'aluno',
        }

        serializer = PerfilSerializer(data=dados)
        self.assertFalse(serializer.is_valid())
        print(serializer.errors)

    def test_validacao_campos_obrigatorios(self):
        dados = {
            'email': 'gabriel@gmail.com',
            'cpf': '12345',
            'data_nascimento': '2005-05-12',
            'tipo': 'aluno',
        }

        serializer = PerfilSerializer(data=dados)
        self.assertFalse(serializer.is_valid())
        self.assertIn('cpf', serializer.errors)

    def test_validacao_email_duplicado(self):
        with self.assertRaises(IntegrityError):
            perfil_criado = Perfil.objects.create(
                nome='aleatorio3',
                email='gabriel@gmail.com',
                cpf='12345678901',
                data_nascimento='2005-05-12',
                tipo='aluno',
            )

    def test_nome_valido(self):
        dados = {
            'nome': 1,
            'email': 'gabriel@gmail.com',
            'cpf': '12345',
            'data_nascimento': '2005-05-12',
            'tipo': 'aluno',
        }

        serializer = PerfilSerializer(data=dados)
        self.assertFalse(serializer.is_valid())
        print(serializer.errors)
        self.assertIn('nome', serializer.errors)

    def test_data_de_nascimento_futura(self):
        dados = {
            'nome': 'aleatorio3',
            'email': 'gabriel@gmail.com',
            'cpf': '12345',
            'data_nascimento': '2030-05-12',
            'tipo': 'aluno',
        }

        serializer = PerfilSerializer(data=dados)
        self.assertFalse(serializer.is_valid())
        print(serializer.errors)
        self.assertIn('data_nascimento', serializer.errors)

    def test_criar_aluno_POST(self):
        response = self.client.post('/api/usuarios/alunos/', self.payload, format='json')
        print(response.data)
        self.assertEqual(response.status_code, 201)

    def test_listar_aluno_GET(self):
        self.client.post('/api/usuarios/alunos/', self.payload, format='json')
        response = self.client.get('/api/usuarios/alunos/', self.payload)
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)

    def test_atualizar_aluno_PATCH(self):
        self.client.post('/api/usuarios/alunos/', self.payload, format='json')
        response = self.client.patch(f'/api/usuarios/alunos/{self.aluno.id}/', {
            "perfil": {
                "nome": "Novo Nome"
            }
        }, format='json')
        # print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['perfil']['nome'], 'Novo Nome')

    def test_atualizar_aluno_PUT(self):
        self.client.post('/api/usuarios/alunos/', self.payload, format='json')
        response = self.client.put(f'/api/usuarios/alunos/{self.aluno.id}/', {
            "perfil": {"nome": "Nome do ALUNi",
                       "email": "novo.aluno@gost.com",
                       "cpf": "12345678908",
                       "password": "SuaSenhaSegura",
                       "data_nascimento": "1998-05-16"}

        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['perfil']['nome'], 'Nome do ALUNi')

    def test_deletar_aluno_DELETE(self):
        self.client.post('/api/usuarios/alunos/', self.payload, format='json')
        response1 = self.client.get('/api/usuarios/alunos/', self.payload)
        print("resposta: ", response1.data)
        response = self.client.delete(f'/api/usuarios/alunos/{self.aluno.id}/')
        print(response.context_data)
        self.assertEqual(response.status_code, 204)
