from django.contrib.auth.hashers import make_password
from rest_framework.test import APIClient, APITestCase
from usuarios.models import Professor, Perfil
from django.core.files.uploadedfile import SimpleUploadedFile
from disciplinas.models import Conteudo,Disciplina,Material
""""
Nesse arquivo existem testes para adição de conteudo como Professor, ele tb deve ter acesso a tudo
"""
### COMO PROFESSOR

class MaterialTestCaseProfesor(APITestCase):
    @classmethod
    def setUpTestData(cls):
        perfil_criado = Perfil.objects.create(
            nome='professor',
            email='professor@email.com',
            cpf='00000000000',
            data_nascimento='2005-12-12',
            tipo='professor',
            password=make_password('123456')
        )
        Professor.objects.create(
            perfil=perfil_criado
        )
        cls.disciplina=Disciplina.objects.create(
            nome="teste",
            descricao="testando",

        )
        cls.conteudo_criado = Conteudo.objects.create(
            nome="conteudoTeste",
            descricao="teste",
            status="ativo",
            disciplina_id=cls.disciplina.id
        )
        cls.conteudo_criado.professores.add(Professor.objects.get(perfil=perfil_criado))
        cls.material=Material.objects.create(
            nome="teste",
            descricao="teste",
            arquivo="pdf",
            conteudo_id=cls.conteudo_criado.id,
            tipo="pdf",
        )


    def get_token(self):
        login = self.client.post('/api/usuarios/login/', {
            'email': 'professor@email.com',
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
        self.assertEqual(response.status_code, 201)


    def testMaterial_especifico_GET(self):
        # self.cria()
        response = self.client.get(f'/api/disciplinas/materiais/{self.material.id}/')
        # print(response.data)
        self.assertEqual(response.status_code, 200)

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
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['nome'],'Novo Nome')

    def testAlterar_material_especifico_Arquivo_PATCH(self):
        # self.cria()
        arquivo = SimpleUploadedFile('teste.pdf', b'pdf', content_type='application/pdf')
        data= {"arquivo": arquivo}
        response=self.client.patch(f'/api/disciplinas/materiais/{self.material.id}/', data=data
        , format='multipart')
        print(response.data)
        self.assertEqual(response.status_code, 200)

    def testAlterar_material_especifico_outros_campos_PATCH(self):
        # self.cria()
        dataSemArquivo = {"nome": "Novo Nome"}
        response2= self.client.patch(f'/api/disciplinas/materiais/{self.material.id}/', data=dataSemArquivo
        , format='multipart')
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(response2.data['nome'],'Novo Nome')


    def testDeletar_material_especifico_DELETE(self):
        # self.cria()
        response=self.client.delete(f'/api/disciplinas/materiais/{self.material.id}/')
        self.assertEqual(response.status_code, 204)

class MaterialFiltrosTestCase(APITestCase):

    @classmethod
    def setUpTestData(cls):
        # Professor dono
        perfil_prof = Perfil.objects.create(
            nome="prof filtro",
            email="prof.filtro@email.com",
            cpf="11111111111",
            data_nascimento="2000-01-01",
            tipo="professor",
            password=make_password("123456"),
        )
        cls.professor = Professor.objects.create(perfil=perfil_prof)

        # Professor de outra coisa
        perfil_outro = Perfil.objects.create(
            nome="outro prof",
            email="outro.prof@email.com",
            cpf="22222222222",
            data_nascimento="2000-01-01",
            tipo="professor",
            password=make_password("123456"),
        )
        cls.outro_professor = Professor.objects.create(perfil=perfil_outro)

        cls.disciplina = Disciplina.objects.create(nome="disciplina filtro", descricao="d")
        cls.outra_disciplina = Disciplina.objects.create(nome="outra disciplina", descricao="d")

        cls.conteudo = Conteudo.objects.create(
            nome="conteudo do prof",
            descricao="d",
            status="ativo",
            disciplina_id=cls.disciplina.id,
        )
        cls.conteudo.professores.add(cls.professor)

        # Conteúdo de outro professor (mesma disciplina)
        cls.conteudo_outro = Conteudo.objects.create(
            nome="conteudo de outro",
            descricao="d",
            status="ativo",
            disciplina_id=cls.disciplina.id,
        )
        cls.conteudo_outro.professores.add(cls.outro_professor)

        cls.material = Material.objects.create(
            nome="material do prof",
            descricao="d",
            arquivo="pdf",
            conteudo_id=cls.conteudo.id,
            tipo="pdf",
        )
        cls.material_outro = Material.objects.create(
            nome="material de outro prof",
            descricao="d",
            arquivo="pdf",
            conteudo_id=cls.conteudo_outro.id,
            tipo="pdf",
        )

    def login_como(self, email):
        login = self.client.post(
            "/api/usuarios/login/", {"email": email, "password": "123456"}, format="json"
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")

    def setUp(self):
        self.login_como("prof.filtro@email.com")

    def test_filtro_conteudo_proprio(self):
        response = self.client.get(f"/api/disciplinas/materiais/?conteudo={self.conteudo.id}")
        self.assertEqual(response.status_code, 200)
        ids = [m["id"] for m in response.data]
        self.assertIn(self.material.id, ids)
        self.assertNotIn(self.material_outro.id, ids)

    def test_filtro_conteudo_de_outro_prof_retorna_vazio(self):
        response = self.client.get(
            f"/api/disciplinas/materiais/?conteudo={self.conteudo_outro.id}"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_filtro_disciplina(self):
        response = self.client.get(
            f"/api/disciplinas/materiais/?disciplina={self.disciplina.id}"
        )
        self.assertEqual(response.status_code, 200)
        ids = [m["id"] for m in response.data]
        # Só aparece o material do professor logado
        self.assertIn(self.material.id, ids)
        self.assertNotIn(self.material_outro.id, ids)

    def test_filtro_disciplina_sem_materiais_retorna_vazio(self):
        response = self.client.get(
            f"/api/disciplinas/materiais/?disciplina={self.outra_disciplina.id}"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])
