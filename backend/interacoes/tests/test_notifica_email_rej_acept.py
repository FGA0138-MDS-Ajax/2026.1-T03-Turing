from django.contrib.auth.hashers import make_password
from django.core import mail
from django.test.utils import override_settings
from rest_framework.test import APIClient, APITestCase
from usuarios.models import Perfil, Admin
from interacoes.models import Inscricao
from usuarios.models import Professor


@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class EmailModeracaoTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        client = APIClient()

        perfil_admin = Perfil.objects.create(
            nome='admin',
            email='admin@email.com',
            cpf='00000000000',
            data_nascimento='2000-01-01',
            tipo='admin',
            password=make_password('123456')
        )
        Admin.objects.create(perfil=perfil_admin)

        login = client.post('/api/usuarios/login/', {
            'email': 'admin@email.com',
            'password': '123456'
        }, format='json')
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {login.data["access"]}')

        response = client.post('/api/usuarios/professores/', {
            "perfil": {
                "nome": "Luisa",
                "email": "luisa@email.com",
                "cpf": "12345678901",
                "data_nascimento": "2000-01-01",
                "tipo": "professor",
                "password": "123456"
            }
        }, format='json')
        cls.professor_id = response.data['id']
        cls.inscricao_id = Inscricao.objects.get(professor__id=cls.professor_id).id

    def get_token(self):
        login = self.client.post('/api/usuarios/login/', {
            'email': 'admin@email.com',
            'password': '123456'
        }, format='json')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {login.data["access"]}')

    def setUp(self):
        self.get_token()

    def test_email_notificacao_cadastro_professor_aprovado(self):
        response = self.client.patch(f'/api/interacoes/inscricoes/{self.inscricao_id}/aprovar/')
        print(response.data)
        print(response.status_code)
        print(mail.outbox[0].body)
        self.assertEqual(len(mail.outbox),1)
        self.assertIn('Luisa', mail.outbox[0].body)

    def test_email_notificação_cadastro_professor_rejeitado(self):
        response = self.client.patch(f'/api/interacoes/inscricoes/{self.inscricao_id}/rejeitar/')
        print(response.data)
        print(response.status_code)
        print(mail.outbox[0].body)
        self.assertEqual(len(mail.outbox),1)
        self.assertIn('Luisa', mail.outbox[0].body)