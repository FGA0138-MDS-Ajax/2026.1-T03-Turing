from urllib import response

import pytest
from rest_framework.templatetags.rest_framework import data
from rest_framework.test import APIClient
from django.db import DataError, IntegrityError
from django.test import TestCase
from usuarios.models import Aluno, Perfil
from usuarios.serializers import PerfilSerializer


class AlunoTestCase(TestCase):
    # metodo que vai rodar toda vez antes de cada teste
    @classmethod
    def setUpTestData(cls):
        perfil_criado = Perfil.objects.create(
            nome='aleatorio',
            email='gabriel@aleatorio.com',
            cpf='12345678901',
            data_nascimento='2005-05-12',
            tipo='aluno',
            role='aluno',
        )

        Aluno.objects.create(
            perfil=perfil_criado
        )

    def test_criacao_aluno(self):
        # verifica se o perfil foi criado corretamente
        perfil = Perfil.objects.get(id=1)
        aluno = Aluno.objects.get(perfil=perfil)
        self.assertEqual(perfil.tipo, 'aluno')  # tipo do perfil é aluno?
        self.assertEqual(aluno.perfil, perfil)  # são iguais os objetos?

    def test_verificacao_cpf_mais_de_11_caracteres(self):
        with self.assertRaises(DataError):
            perfil_criado = Perfil.objects.create(
                nome='aleatorio',
                email='gabriel@gmail.com',
                cpf='1234567890112',
                data_nascimento='2005-05-12',
                tipo='aluno',
                role='aluno',
            )

    def test_verificacao_cpf_menos_de_11_caracteres(self):
        dados = {
            'nome': 'aleatorio',
            'email': 'gabriel@gmail.com',
            'cpf': '12345',
            'data_nascimento': '2005-05-12',
            'tipo': 'aluno',
            'role': 'aluno',
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
                role='aluno',
            )

    def test_verificacao_cpf_com_letras(self):
        dados = {
            'nome': 'aleatorio',
            'email': 'teste@teste.com',
            'cpf': '12345678ab@',
            'data_nascimento': '2005-05-12',
            'tipo': 'aluno',
            'role': 'aluno',
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
            'role': 'aluno',
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
                role='aluno',
            )

    def test_nome_valido(self):
        dados = {
            'nome': 1,
            'email': 'gabriel@gmail.com',
            'cpf': '12345',
            'data_nascimento': '2005-05-12',
            'tipo': 'aluno',
            'role': 'aluno',
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
            'role': 'aluno',
        }

        serializer = PerfilSerializer(data=dados)
        self.assertFalse(serializer.is_valid())
        print(serializer.errors)
        self.assertIn('data_nascimento', serializer.errors)


class Test_crud_aluno(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.payload = \
            {
                'perfil': {
                    "nome": "Nome do Administrador",
                    "email": "novo.admin@gostudy.com",
                    "cpf": "12345678901",
                    "password": "SuaSenhaSegura",
                    "data_nascimento": "1998-05-16"
                }
            }

    def test_criar_aluno(self):
        response = self.client.post('/api/usuarios/alunos/', self.payload, format='json')
        print(response.data)
        self.assertEqual(response.status_code, 201)


    def test_listar_aluno(self):
        self.client.post('/api/usuarios/alunos/', self.payload, format='json')
        response = self.client.get('/api/usuarios/alunos/', self.payload)
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)
