from urllib import response

from django.contrib.auth.hashers import make_password
from rest_framework.test import APIClient, APITestCase
from usuarios.models import Admin, Perfil, Professor, Aluno
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator



class RecSenhaTestCase(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.aluno = Aluno.objects.create(
            perfil=Perfil.objects.create(
                nome='Aluno Teste',
                email='aluno@email.com',
                cpf='11111111112',
                data_nascimento='2000-01-01',
                tipo='aluno',
                password=make_password('123456')
            ))


    def get_token(self, email, password='123456'):
        login = self.client.post('/api/usuarios/login/', {
            'email': email,
            'password': password
        }, format='json')
        token = login.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        return login


    def setUp(self):
        #self.get_token('admin@email.com')
        pass

    def test_recuperacao_senha(self):
        response = self.client.post('/api/usuarios/recuperar-senha/', {
            'email':'aluno@email.com'
        })
        print(response.data)
        self.assertEqual(response.status_code, 200)

    # def test_redefinir_senha_token_valido(self):
    #     uid = urlsafe_base64_encode(force_bytes(self.aluno.id))
    #     token = default_token_generator.make_token(self.aluno.perfil)
    #
    #     response = self.client.post(f'/api/usuarios/confirmar-redefinicao-senha/', {
    #         'uid': uid,
    #         'token': token,
    #         'nova_senha': 'NovaSenha123',
    #         'confirmar_senha': 'NovaSenha123'
    #     },format='json')
    #     print(response.data)
    #     self.assertEqual(response.status_code, 200)


    def test_login_nova_senha(self):
        uid = urlsafe_base64_encode(force_bytes(self.aluno.perfil.id))
        token = default_token_generator.make_token(self.aluno.perfil)

        self.client.post('/api/usuarios/confirmar-redefinicao-senha/', {
            'uid': uid,
            'token': token,
            'nova_senha': 'NovaSenha123',
            'confirmar_senha': 'NovaSenha123'
        }, format='json')
        response = self.get_token('aluno@email.com', 'NovaSenha123')
        print(response.data)
        self.assertEqual(response.status_code, 200)

    def test_login_email_inexistente(self):
        response = self.client.post('/api/usuarios/recuperar-senha/', {
            'email': 'emailnaoexist@email.com'
        })
        print(response.data)
        self.assertEqual(response.status_code, 200)

    def test_redefinir_senha_token_invalido(self):
        uid = urlsafe_base64_encode(force_bytes(self.aluno.perfil.id))
        response = self.client.post('/api/usuarios/confirmar-redefinicao-senha/', {
            'uid': uid,
            'token': 'token-invalido-123',
            'nova_senha': 'NovaSenha123',
            'confirmar_senha': 'NovaSenha123'
        }, format='json')
        print(response.data)
        self.assertEqual(response.status_code, 400)

    def test_confirmar_nova_senha_dif(self):
        uid = urlsafe_base64_encode(force_bytes(self.aluno.perfil.id))
        token = default_token_generator.make_token(self.aluno.perfil)

        response =self.client.post('/api/usuarios/confirmar-redefinicao-senha/', {
            'uid': uid,
            'token': token,
            'nova_senha': 'NovaSenha',
            'confirmar_senha': 'NovaSenha123'
        }, format='json')

        print(response.data)
        self.assertEqual(response.status_code, 400)

    def test_login_senha_antiga(self):
        uid = urlsafe_base64_encode(force_bytes(self.aluno.perfil.id))
        token = default_token_generator.make_token(self.aluno.perfil)

        self.client.post('/api/usuarios/confirmar-redefinicao-senha/', {
            'uid': uid,
            'token': token,
            'nova_senha': 'NovaSenha123',
            'confirmar_senha': 'NovaSenha123'
        }, format='json')
        response = self.client.post('/api/usuarios/login/', {
            'email': 'aluno@email.com',
            'password': '123456'
        }, format='json')
        print(response.data)
        self.assertEqual(response.status_code, 401)