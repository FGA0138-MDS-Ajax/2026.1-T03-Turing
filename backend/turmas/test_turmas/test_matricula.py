from django.contrib.auth.hashers import make_password
from rest_framework.test import APIClient, APITestCase
from turmas.models import Matricula
from usuarios.models import Admin, Perfil, Aluno, Professor
from disciplinas.models import Conteudo, Disciplina


class MatriculaTestCase(APITestCase):
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
        cls.aluno = Aluno.objects.create(
            perfil=Perfil.objects.create(
                nome='Aluno Teste',
                email='aluno@email.com',
                cpf='11111111111',
                data_nascimento='2000-01-01',
                tipo='aluno',
                password=make_password('123456')
            ))
        cls.aluno_terceiro = Aluno.objects.create(
            perfil=Perfil.objects.create(
                nome='Aluno Teste',
                email='aluno@gmail.com',
                cpf='11111111112',
                data_nascimento='2000-01-01',
                tipo='aluno',
                password=make_password('123456')
            ))
        perfil_professor = Perfil.objects.create(
            nome='professor teste',
            email='professor@email.com',
            cpf='22222222222',
            data_nascimento='2000-01-01',
            tipo='professor',
            password=make_password('123456')
        )
        cls.professor = Professor.objects.create(
            perfil=perfil_professor
        )
        cls.disciplina = Disciplina.objects.create(
            nome='Cálculo I',
            descricao='Introdução a limites, derivadas e integrais.',
        )

        cls.conteudo = Conteudo.objects.create(
            nome='Derivadas',
            descricao='Derivadas',
            disciplina=cls.disciplina,
            status='ativo'

        )
        cls.conteudo2 = Conteudo.objects.create(
            nome='Derivadas3',
            descricao='Derivadas3',
            disciplina=cls.disciplina,
            status='encerrado'
        )

        cls.matricula = Matricula.objects.create(
            aluno=cls.aluno,
            conteudo=cls.conteudo
        )
        cls.matricula2=Matricula.objects.create(
            aluno=cls.aluno_terceiro,
            conteudo=cls.conteudo
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

    ## admin
    def test_criar_matricula_POST(self):
        response = self.client.post('/api/matriculas/', {
            "aluno": self.aluno.id,
            "conteudo": self.conteudo.id
        }, format='json')
        print(response.data)
        self.assertEqual(response.status_code, 201)

    def test_listar_matricula_GET(self):
        response = self.client.get('/api/matriculas/', format='json')
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)

    def test_deletar_matricula_DELETE(self):
        response = self.client.delete(f'/api/matriculas/{self.matricula.id}/')
        print(response.data)
        self.assertEqual(response.status_code, 204)

    def test_matricula_contudo_encerrado(self):
        response = self.client.post('/api/matriculas/',
                                    {'conteudo': self.conteudo2.id}, format='json')
        self.assertEqual(response.status_code, 400)

    ### alunos
    def test_delete_matricula_aluno_terceiro(self):
        self.get_token('aluno@email.com')
        response = self.client.delete(f'/api/matriculas/{self.matricula2.id}/')
        print(response.data)
        self.assertEqual(response.status_code, 404)

    def test_post_conteudo_encerrado(self):
        self.get_token('aluno@email.com')
        response = self.client.post('/api/matriculas/',
                                    {'conteudo': self.conteudo2.id}, format='json')
        self.assertEqual(response.status_code, 400)

    def test_deletar_matricula_aluno_DELETE(self):
        self.get_token('aluno@email.com')
        response = self.client.delete(f'/api/matriculas/{self.matricula.id}/')
        print(response.data)
        self.assertEqual(response.status_code, 204)

    def test_post_aluno_matricula_POST(self):
        self.get_token('aluno@email.com')
        response = self.client.post('/api/matriculas/', {
            "conteudo": self.conteudo.id
        }, format='json')
        print(response.data)
        self.assertEqual(response.status_code, 201)

    def test_get_aluno_matricula_GET(self):
        self.get_token('aluno@gmail.com')
        response = self.client.get('/api/matriculas/', format='json')
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)

    def test__matricula_aluno_terceiro(self):
        self.get_token('aluno@email.com')
        response = self.client.post('/api/matriculas/', {
            'aluno': self.aluno_terceiro.id,
            'conteudo': self.conteudo.id,
        }, format='json')
        self.assertEqual(response.status_code, 201)
        print(response.data)

    ## professores

    def test_professores_get(self):
        self.get_token('professor@email.com')
        response = self.client.get('/api/matriculas/')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)
        print(response.data)
