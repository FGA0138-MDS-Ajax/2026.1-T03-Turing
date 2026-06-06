from django.contrib.auth.hashers import make_password
from rest_framework.test import APIClient, APITestCase

from turmas.models import Matricula
from usuarios.models import Aluno, Perfil
from django.core.files.uploadedfile import SimpleUploadedFile
from disciplinas.models import Conteudo,Disciplina,Material
""""
Nesse arquivo existem testes para adição de conteudo como Aluno, ele não deve conseguir acessar essas rotas
"""
### COMO ALUNO

class MaterialTestCaseAdmin(APITestCase):
    @classmethod
    def setUpTestData(cls):
        perfil_criado = Perfil.objects.create(
            nome='ALuno',
            email='aluno@email.com',
            cpf='00000000000',
            data_nascimento='2005-12-12',
            tipo='aluno',
            password=make_password('123456')
        )
        Aluno.objects.create(
            perfil=perfil_criado
        )
        cls.disciplina=Disciplina.objects.create(
            nome="teste",
            descricao="testando",

        )

        cls.outra_disciplina=Disciplina.objects.create(
            nome="outra disciplina",
            descricao="d",
        )

        cls.conteudo_criado = Conteudo.objects.create(
            nome="conteudoTeste",
            descricao="teste",
            status="ativo",
            disciplina_id=cls.disciplina.id
        )

        cls.conteudo_nao_matriculado=Conteudo.objects.create(
            nome="conteudoNaoMatriculado",
            descricao="teste",
            status="ativo",
            disciplina_id=cls.disciplina.id
        )

        Matricula.objects.create(
            aluno=Aluno.objects.get(perfil=perfil_criado),
            conteudo=cls.conteudo_criado,
        )

        cls.material=Material.objects.create(
            nome="testeMatriculado",
            descricao="teste",
            arquivo="pdf",
            conteudo_id=cls.conteudo_criado.id,
            tipo="pdf",
        )

        cls.material_nao_matriculado=Material.objects.create(
            nome="teste",
            descricao="teste",
            arquivo="pdf",
            conteudo_id=cls.conteudo_nao_matriculado.id,
            tipo="pdf",
        )



    def get_token(self):
        login = self.client.post('/api/usuarios/login/', {
            'email': 'aluno@email.com',
            'password': '123456'
        }, format='json')
        token = login.data['access']
        print(token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def setUp(self):
        self.get_token()


    def test_Get_materiais(self):
        response = self.client.get('/api/disciplinas/materiais/')
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)

    def test_mandar_material_pdf_POST(self):
        arquivo=SimpleUploadedFile('teste.pdf', b'pdf', content_type='application/pdf')
        data = {
            "nome": "material teste",
            "tipo": "pdf",
            "conteudo": self.conteudo_criado.id,
            'arquivo': arquivo
        }
        response = self.client.post('/api/disciplinas/materiais/', data=data, format='multipart')
        print(response.data)
        self.assertEqual(response.status_code, 403)



    def testMaterial_especifico_GET(self):
        # self.cria()
        response = self.client.get(f'/api/disciplinas/materiais/{self.material.id}/')
        # print(response.data)
        self.assertEqual(response.status_code, 200)

    def testMaterial_especifico_nao_matriculado_GET(self):
        response=self.client.get(f'/api/disciplinas/materiais/{self.material_nao_matriculado.id}/')
        self.assertEqual(response.status_code, 404)

    def testAlterar_material_especifico_PUT(self):
        # self.cria()
        arquivo = SimpleUploadedFile('teste.pdf', b'pdf', content_type='application/pdf')
        data = {
            "nome": "Novo Nome",
            "tipo": "pdf",
            "conteudo": self.conteudo_criado.id,
            'arquivo': arquivo
        }
        response=self.client.put(f'/api/disciplinas/materiais/{self.material.id}/', data=data
        , format='multipart')
        print(response.data)
        self.assertEqual(response.status_code, 403)

    def testAlterar_material_especifico_Arquivo_PATCH(self):
        # self.cria()
        arquivo = SimpleUploadedFile('teste.pdf', b'pdf', content_type='application/pdf')
        data= {"arquivo": arquivo}
        response=self.client.patch(f'/api/disciplinas/materiais/{self.material.id}/', data=data
        , format='multipart')
        print(response.data)
        self.assertEqual(response.status_code, 403)

    def testAlterar_material_especifico_outros_campos_PATCH(self):
        # self.cria()
        dataSemArquivo = {"nome": "Novo Nome"}
        response2= self.client.patch(f'/api/disciplinas/materiais/{self.material.id}/', data=dataSemArquivo
        , format='multipart')
        self.assertEqual(response2.status_code, 403)


    def testDeletar_material_especifico_DELETE(self):
        # self.cria()
        response=self.client.delete(f'/api/disciplinas/materiais/{self.material.id}/')
        self.assertEqual(response.status_code, 403)

    def test_filtro_conteudo_matriculado(self):
        response = self.client.get(
            f"/api/disciplinas/materiais/?conteudo={self.conteudo_criado.id}"
        )
        self.assertEqual(response.status_code, 200)
        ids = [m["id"] for m in response.data]
        self.assertIn(self.material.id, ids)
        self.assertNotIn(self.material_nao_matriculado.id, ids)

    def test_filtro_conteudo_nao_matriculado(self):
        response = self.client.get(
            f"/api/disciplinas/materiais/?conteudo={self.conteudo_nao_matriculado.id}"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_filtro_disciplina_com_matricula(self):
        response = self.client.get(
            f"/api/disciplinas/materiais/?disciplina={self.disciplina.id}"
        )
        self.assertEqual(response.status_code, 200)
        ids = [m["id"] for m in response.data]
        self.assertIn(self.material.id, ids)

    def test_filtro_disciplina_sem_matricula(self):
        response = self.client.get(
            f"/api/disciplinas/materiais/?disciplina={self.outra_disciplina.id}"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])