from django.contrib.auth.hashers import make_password
from django.core import mail
from django.test.utils import override_settings
from rest_framework.test import APIClient, APITestCase
from usuarios.models import Perfil,Admin

@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class EmailNotificacaoTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        perfil_admin=Perfil.objects.create(
            nome='Admin',
            email='admin@email.com',
            cpf='00000000000',
            data_nascimento='2000-01-01',
            tipo='admin',
            password=make_password('123456')
        )
        Admin.objects.create(
            perfil=perfil_admin
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

    #@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_email_notificacao_cadastro_professor(self):
        response = self.client.post('/api/usuarios/professores/', {
            "perfil": {
                "nome": "Luisa",
                "email": "luisa@email.com",
                "cpf": "12345678901",
                "data_nascimento": "2000-01-01",
                "tipo": "professor",
                "password": "123456"
            }
        }, format='json')
        print(response.data)
        print(response.status_code)
        print(mail.outbox[0].body)
        self.assertEqual(len(mail.outbox),1)
        self.assertIn('Luisa', mail.outbox[0].body)

    def test_email_cadastro_aluno(self):
        response = self.client.post('/api/usuarios/alunos/', {
            "perfil": {
                "nome": "Luisa",
                "email": "luisa@email.com",
                "cpf": "12345678901",
                "data_nascimento": "2000-01-01",
                "tipo": "aluno",
                "password": "123456"
            }
        }, format='json')
        print(response.data)
        print(response.status_code)
        print(mail.outbox[0].body)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Luisa', mail.outbox[0].body)

