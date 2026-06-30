from django.utils import timezone

from django.core.management.base import BaseCommand
from usuarios.models import Perfil, Aluno, Professor, Admin
from disciplinas.models import Disciplina, Conteudo, Material, DisciplinaPrerequisito
from turmas.models import Matricula
from interacoes.models import Inscricao, Forum, Mensagem, Denuncia


# Rodar a seed pela primeira vez
# python manage.py seed

# Teste limpo do zero, simulando ambiente novo
# python manage.py flush --noinput
# python manage.py migrate
# python manage.py seed

class Command(BaseCommand):
    help = 'Popula o banco com dados de exemplo para desenvolvimento e testes'

    def handle(self, *args, **kwargs):
        # Admin
        admin_perfil, created = Perfil.objects.get_or_create(
            email="admin123@gostudy.com",
            defaults={
                'nome': 'Admin Turing',
                'cpf': '00000000001',
                'tipo': 'admin',
                'data_nascimento': '2026-05-16',
            }
        )
        if created:
            admin_perfil.set_password('admin123')
            admin_perfil.save()
            Admin.objects.create(perfil=admin_perfil)
            self.stdout.write(self.style.SUCCESS('Admin criado'))
        admin = Admin.objects.get(perfil=admin_perfil)

        admin2_perfil, created = Perfil.objects.get_or_create(
            email="admin2@gostudy.com",
            defaults={
                'nome': 'Ada Lovelace',
                'cpf': '00000000099',
                'tipo': 'admin',
                'data_nascimento': '1990-12-10',
                'is_active': True,
            }
        )
        if created:
            admin2_perfil.set_password('admin123')
            admin2_perfil.save()
            Admin.objects.create(perfil=admin2_perfil)
            self.stdout.write(self.style.SUCCESS('Admin 2 criado'))

        # Professor
        prof_perfil, created = Perfil.objects.get_or_create(
            email="professor@gostudy.com",
            defaults={
                'nome': 'Professor Teste',
                'cpf': '00000000002',
                'tipo': 'professor',
                'data_nascimento': '1990-01-01',
                'is_active': True,
            }
        )
        if created:
            prof_perfil.set_password('123456')
            prof_perfil.save()
            professor = Professor.objects.create(perfil=prof_perfil)
            Inscricao.objects.create(
                professor=professor,
                status='aprovado',
                descricao='Professor de seed'
            )
            self.stdout.write(self.style.SUCCESS('Professor criado'))
        else:
            professor = Professor.objects.get(perfil=prof_perfil)

        # Aluno
        aluno_perfil, created = Perfil.objects.get_or_create(
            email="aluno@gostudy.com",
            defaults={
                'nome': 'Aluno Teste',
                'cpf': '00000000003',
                'tipo': 'aluno',
                'data_nascimento': '2008-05-10',
                'is_active': True,
            }
        )
        if created:
            aluno_perfil.set_password('123456')
            aluno_perfil.save()
            aluno = Aluno.objects.create(perfil=aluno_perfil)
            self.stdout.write(self.style.SUCCESS('Aluno criado'))
        else:
            aluno = Aluno.objects.get(perfil=aluno_perfil)

        # Disciplina
        disciplina, _ = Disciplina.objects.get_or_create(
            nome="Matemática",
            defaults={'descricao': 'Disciplina de matemática do ensino médio'}
        )

        # Conteudo
        conteudo, created = Conteudo.objects.get_or_create(
            nome="Frações",
            defaults={
                'disciplina': disciplina,
                'descricao': 'Conteúdo sobre frações',
                'status': 'ativo',
            }
        )
        if created:
            conteudo.professores.add(professor)
            self.stdout.write(self.style.SUCCESS('Conteúdo criado'))

        # Material
        Material.objects.get_or_create(
            conteudo=conteudo,
            nome="PDF de Frações",
            defaults={
                'tipo': 'pdf',
                'descricao': 'Material introdutório sobre frações',
            }
        )

        # Matrícula
        Matricula.objects.get_or_create(aluno=aluno, conteudo=conteudo)

        self.stdout.write(self.style.SUCCESS('Seed completo executado com sucesso!'))
        self.stdout.write(self.style.SUCCESS('Admin: admin123@gostudy.com / admin123'))
        self.stdout.write(self.style.SUCCESS('Professor: professor@gostudy.com / 123456'))
        self.stdout.write(self.style.SUCCESS('Aluno: aluno@gostudy.com / 123456'))

        # SEED EXPANDIDA
        professores_data = [
            {
                'email': 'carla.fisica@gostudy.com',
                'nome': 'Carla Mendes',
                'cpf': '11111111101',
                'nascimento': '1985-03-22',
                'status_inscricao': 'aprovado',
                'descricao': 'Mestre em Física, especialista em mecânica clássica',
            },
            {
                'email': 'bruno.quimica@gostudy.com',
                'nome': 'Bruno Carvalho',
                'cpf': '11111111102',
                'nascimento': '1988-07-14',
                'status_inscricao': 'aprovado',
                'descricao': 'Doutor em Química, ênfase em química orgânica',
            },
            {
                'email': 'fernanda.bio@gostudy.com',
                'nome': 'Fernanda Lima',
                'cpf': '11111111103',
                'nascimento': '1992-11-02',
                'status_inscricao': 'aprovado',
                'descricao': 'Bióloga, especialista em genética e ecologia',
            },
            {
                'email': 'rodrigo.historia@gostudy.com',
                'nome': 'Rodrigo Alves',
                'cpf': '11111111104',
                'nascimento': '1980-02-19',
                'status_inscricao': 'aprovado',
                'descricao': 'Historiador, foco em história do Brasil e geopolítica',
            },
            {
                'email': 'patricia.portugues@gostudy.com',
                'nome': 'Patrícia Souza',
                'cpf': '11111111105',
                'nascimento': '1987-09-30',
                'status_inscricao': 'aprovado',
                'descricao': 'Letras, redação e literatura brasileira',
            },
            {
                'email': 'lucas.cs@gostudy.com',
                'nome': 'Lucas Martins',
                'cpf': '11111111106',
                'nascimento': '1995-06-05',
                'status_inscricao': 'pendente',
                'descricao': 'Engenheiro de Software, quer ensinar lógica de programação',
            },
            {
                'email': 'mariana.geo@gostudy.com',
                'nome': 'Mariana Costa',
                'cpf': '11111111107',
                'nascimento': '1991-04-17',
                'status_inscricao': 'recusado',
                'descricao': 'Geografia, cadastro recusado por documentação incompleta',
            },
        ]

        professores = {'Professor Teste': professor}

        for p in professores_data:
            perfil, created = Perfil.objects.get_or_create(
                email=p['email'],
                defaults={
                    'nome': p['nome'],
                    'cpf': p['cpf'],
                    'tipo': 'professor',
                    'data_nascimento': p['nascimento'],
                    'is_active': p['status_inscricao'] == 'aprovado',
                }
            )
            if created:
                perfil.set_password('123456')
                perfil.save()
                prof_obj = Professor.objects.create(perfil=perfil)
                Inscricao.objects.create(
                    professor=prof_obj,
                    analisado_por=admin if p['status_inscricao'] != 'pendente' else None,
                    analisado_em=timezone.now() if p['status_inscricao'] != 'pendente' else None,
                    status=p['status_inscricao'],
                    descricao=p['descricao'],
                )
                self.stdout.write(self.style.SUCCESS(f'Professor criado: {p["nome"]}'))
            else:
                prof_obj = Professor.objects.get(perfil=perfil)
            professores[p['nome']] = prof_obj

        # ----------------------------------------------------------
        # Mais alunos
        # ----------------------------------------------------------
        alunos_data = [
            {'email': 'joao.silva@gostudy.com', 'nome': 'João Silva', 'cpf': '22222222201', 'nascimento': '2007-01-15'},
            {'email': 'maria.oliveira@gostudy.com', 'nome': 'Maria Oliveira', 'cpf': '22222222202',
             'nascimento': '2008-03-21'},
            {'email': 'pedro.santos@gostudy.com', 'nome': 'Pedro Santos', 'cpf': '22222222203',
             'nascimento': '2006-08-09'},
            {'email': 'ana.pereira@gostudy.com', 'nome': 'Ana Pereira', 'cpf': '22222222204',
             'nascimento': '2009-05-30'},
            {'email': 'gabriel.souza@gostudy.com', 'nome': 'Gabriel Souza', 'cpf': '22222222205',
             'nascimento': '2007-11-12'},
            {'email': 'beatriz.almeida@gostudy.com', 'nome': 'Beatriz Almeida', 'cpf': '22222222206',
             'nascimento': '2008-09-04'},
            {'email': 'lucas.ferreira@gostudy.com', 'nome': 'Lucas Ferreira', 'cpf': '22222222207',
             'nascimento': '2006-12-25'},
            {'email': 'julia.rodrigues@gostudy.com', 'nome': 'Júlia Rodrigues', 'cpf': '22222222208',
             'nascimento': '2009-02-18'},
            {'email': 'matheus.gomes@gostudy.com', 'nome': 'Matheus Gomes', 'cpf': '22222222209',
             'nascimento': '2007-07-07'},
            {'email': 'larissa.barbosa@gostudy.com', 'nome': 'Larissa Barbosa', 'cpf': '22222222210',
             'nascimento': '2008-04-29'},
        ]

        alunos = {'Aluno Teste': aluno}

        for a in alunos_data:
            perfil, created = Perfil.objects.get_or_create(
                email=a['email'],
                defaults={
                    'nome': a['nome'],
                    'cpf': a['cpf'],
                    'tipo': 'aluno',
                    'data_nascimento': a['nascimento'],
                    'is_active': True,
                }
            )
            if created:
                perfil.set_password('123456')
                perfil.save()
                aluno_obj = Aluno.objects.create(perfil=perfil)
                self.stdout.write(self.style.SUCCESS(f'Aluno criado: {a["nome"]}'))
            else:
                aluno_obj = Aluno.objects.get(perfil=perfil)
            alunos[a['nome']] = aluno_obj

        # ----------------------------------------------------------
        # Mais disciplinas
        # ----------------------------------------------------------
        disciplinas_data = [
            {'nome': 'Física', 'descricao': 'Disciplina de física do ensino médio'},
            {'nome': 'Química', 'descricao': 'Disciplina de química do ensino médio'},
            {'nome': 'Biologia', 'descricao': 'Disciplina de biologia do ensino médio'},
            {'nome': 'História', 'descricao': 'Disciplina de história geral e do Brasil'},
            {'nome': 'Português', 'descricao': 'Língua portuguesa, gramática e redação'},
            {'nome': 'Geografia', 'descricao': 'Disciplina de geografia física e humana'},
            {'nome': 'Computação', 'descricao': 'Lógica de programação e fundamentos de computação'},
        ]

        disciplinas = {'Matemática': disciplina}
        for d in disciplinas_data:
            disc_obj, _ = Disciplina.objects.get_or_create(
                nome=d['nome'],
                defaults={'descricao': d['descricao']}
            )
            disciplinas[d['nome']] = disc_obj

        # ----------------------------------------------------------
        # Mais conteúdos (com professores responsáveis)
        # ----------------------------------------------------------
        conteudos_data = [
            {
                'nome': 'Equações de 1º Grau',
                'disciplina': 'Matemática',
                'descricao': 'Resolução de equações lineares com uma incógnita',
                'status': 'ativo',
                'professores': ['Professor Teste'],
            },
            {
                'nome': 'Geometria Plana',
                'disciplina': 'Matemática',
                'descricao': 'Áreas, perímetros e propriedades de figuras planas',
                'status': 'ativo',
                'professores': ['Professor Teste'],
            },
            {
                'nome': 'Leis de Newton',
                'disciplina': 'Física',
                'descricao': 'As três leis fundamentais da mecânica clássica',
                'status': 'ativo',
                'professores': ['Carla Mendes'],
            },
            {
                'nome': 'Cinemática',
                'disciplina': 'Física',
                'descricao': 'Estudo do movimento sem considerar suas causas',
                'status': 'ativo',
                'professores': ['Carla Mendes'],
            },
            {
                'nome': 'Tabela Periódica',
                'disciplina': 'Química',
                'descricao': 'Organização e propriedades dos elementos químicos',
                'status': 'ativo',
                'professores': ['Bruno Carvalho'],
            },
            {
                'nome': 'Ligações Químicas',
                'disciplina': 'Química',
                'descricao': 'Ligações iônicas, covalentes e metálicas',
                'status': 'encerrado',
                'professores': ['Bruno Carvalho'],
            },
            {
                'nome': 'Genética Mendeliana',
                'disciplina': 'Biologia',
                'descricao': 'Leis de Mendel e herança genética',
                'status': 'ativo',
                'professores': ['Fernanda Lima'],
            },
            {
                'nome': 'Ecossistemas',
                'disciplina': 'Biologia',
                'descricao': 'Relações ecológicas e cadeias alimentares',
                'status': 'ativo',
                'professores': ['Fernanda Lima'],
            },
            {
                'nome': 'Brasil Colônia',
                'disciplina': 'História',
                'descricao': 'Período colonial brasileiro (1500-1822)',
                'status': 'ativo',
                'professores': ['Rodrigo Alves'],
            },
            {
                'nome': 'Era Vargas',
                'disciplina': 'História',
                'descricao': 'O governo de Getúlio Vargas e suas fases',
                'status': 'ativo',
                'professores': ['Rodrigo Alves'],
            },
            {
                'nome': 'Redação Dissertativa',
                'disciplina': 'Português',
                'descricao': 'Estrutura e técnicas de redação dissertativo-argumentativa',
                'status': 'ativo',
                'professores': ['Patrícia Souza'],
            },
            {
                'nome': 'Literatura Modernista',
                'disciplina': 'Português',
                'descricao': 'Movimento modernista na literatura brasileira',
                'status': 'ativo',
                'professores': ['Patrícia Souza'],
            },
            {
                'nome': 'Climas do Brasil',
                'disciplina': 'Geografia',
                'descricao': 'Tipos climáticos e suas características no território brasileiro',
                'status': 'ativo',
                'professores': ['Professor Teste'],
            },
            {
                'nome': 'Introdução à Lógica de Programação',
                'disciplina': 'Computação',
                'descricao': 'Algoritmos, variáveis, estruturas condicionais e de repetição',
                'status': 'ativo',
                'professores': ['Professor Teste'],
            },
        ]

        conteudos = {'Frações': conteudo}
        for c in conteudos_data:
            conteudo_obj, created = Conteudo.objects.get_or_create(
                nome=c['nome'],
                defaults={
                    'disciplina': disciplinas[c['disciplina']],
                    'descricao': c['descricao'],
                    'status': c['status'],
                }
            )
            if created:
                for nome_prof in c['professores']:
                    conteudo_obj.professores.add(professores[nome_prof])
                self.stdout.write(self.style.SUCCESS(f'Conteúdo criado: {c["nome"]}'))
            conteudos[c['nome']] = conteudo_obj

        # ----------------------------------------------------------
        # Mais materiais
        # ----------------------------------------------------------
        materiais_data = [
            {'conteudo': 'Frações', 'nome': 'Vídeo aula: Operações com frações', 'tipo': 'video',
             'descricao': 'Videoaula explicando soma, subtração, multiplicação e divisão de frações'},
            {'conteudo': 'Frações', 'nome': 'Lista de exercícios - Frações', 'tipo': 'documento',
             'descricao': 'Lista com 20 exercícios sobre frações'},
            {'conteudo': 'Equações de 1º Grau', 'nome': 'Slides: Equações lineares', 'tipo': 'apresentacao',
             'descricao': 'Slides introdutórios sobre equações de 1º grau'},
            {'conteudo': 'Equações de 1º Grau', 'nome': 'Khan Academy - Equações', 'tipo': 'link',
             'descricao': 'Link externo com exercícios interativos', 'link': 'https://pt.khanacademy.org/math/algebra'},
            {'conteudo': 'Geometria Plana', 'nome': 'PDF: Fórmulas de área e perímetro', 'tipo': 'pdf',
             'descricao': 'Resumo com as principais fórmulas de geometria plana'},
            {'conteudo': 'Leis de Newton', 'nome': 'Vídeo: As três leis de Newton', 'tipo': 'video',
             'descricao': 'Explicação visual das leis de Newton com experimentos'},
            {'conteudo': 'Leis de Newton', 'nome': 'PDF: Resumo de mecânica', 'tipo': 'pdf',
             'descricao': 'Resumo teórico das leis de Newton'},
            {'conteudo': 'Cinemática', 'nome': 'Apresentação: MRU e MRUV', 'tipo': 'apresentacao',
             'descricao': 'Slides sobre movimento retilíneo uniforme e uniformemente variado'},
            {'conteudo': 'Tabela Periódica', 'nome': 'Imagem: Tabela Periódica completa', 'tipo': 'imagem',
             'descricao': 'Imagem em alta resolução da tabela periódica'},
            {'conteudo': 'Ligações Químicas', 'nome': 'PDF: Tipos de ligações químicas', 'tipo': 'pdf',
             'descricao': 'Material teórico sobre ligações iônicas, covalentes e metálicas'},
            {'conteudo': 'Genética Mendeliana', 'nome': 'Vídeo: Leis de Mendel', 'tipo': 'video',
             'descricao': 'Aula sobre as leis de Mendel e cruzamentos genéticos'},
            {'conteudo': 'Ecossistemas', 'nome': 'Documento: Cadeias e teias alimentares', 'tipo': 'documento',
             'descricao': 'Material de apoio sobre relações ecológicas'},
            {'conteudo': 'Brasil Colônia', 'nome': 'PDF: Linha do tempo - Brasil Colônia', 'tipo': 'pdf',
             'descricao': 'Linha do tempo dos principais eventos do período colonial'},
            {'conteudo': 'Era Vargas', 'nome': 'Vídeo: A Era Vargas em 10 minutos', 'tipo': 'video',
             'descricao': 'Resumo em vídeo sobre os governos de Getúlio Vargas'},
            {'conteudo': 'Redação Dissertativa', 'nome': 'PDF: Estrutura da redação ENEM', 'tipo': 'pdf',
             'descricao': 'Guia de estrutura para redação dissertativo-argumentativa'},
            {'conteudo': 'Literatura Modernista', 'nome': 'Documento: Autores modernistas', 'tipo': 'documento',
             'descricao': 'Resumo dos principais autores e obras do modernismo'},
            {'conteudo': 'Climas do Brasil', 'nome': 'Imagem: Mapa climático do Brasil', 'tipo': 'imagem',
             'descricao': 'Mapa ilustrativo dos climas brasileiros'},
            {'conteudo': 'Introdução à Lógica de Programação', 'nome': 'PDF: Fundamentos de algoritmos', 'tipo': 'pdf',
             'descricao': 'Material introdutório sobre lógica de programação'},
            {'conteudo': 'Introdução à Lógica de Programação', 'nome': 'Replit - Exercícios práticos', 'tipo': 'link',
             'descricao': 'Ambiente online para praticar lógica de programação', 'link': 'https://replit.com'},
        ]

        for m in materiais_data:
            Material.objects.get_or_create(
                conteudo=conteudos[m['conteudo']],
                nome=m['nome'],
                defaults={
                    'tipo': m['tipo'],
                    'descricao': m['descricao'],
                    'link': m.get('link'),
                }
            )

        self.stdout.write(self.style.SUCCESS('Materiais extras criados'))

        # ----------------------------------------------------------
        # Matrículas (alunos em conteúdos)
        # ----------------------------------------------------------
        matriculas_data = [
            ('João Silva', 'Frações'),
            ('João Silva', 'Equações de 1º Grau'),
            ('Maria Oliveira', 'Frações'),
            ('Maria Oliveira', 'Leis de Newton'),
            ('Pedro Santos', 'Cinemática'),
            ('Pedro Santos', 'Tabela Periódica'),
            ('Ana Pereira', 'Genética Mendeliana'),
            ('Ana Pereira', 'Ecossistemas'),
            ('Gabriel Souza', 'Brasil Colônia'),
            ('Gabriel Souza', 'Era Vargas'),
            ('Beatriz Almeida', 'Redação Dissertativa'),
            ('Beatriz Almeida', 'Literatura Modernista'),
            ('Lucas Ferreira', 'Climas do Brasil'),
            ('Lucas Ferreira', 'Introdução à Lógica de Programação'),
            ('Júlia Rodrigues', 'Geometria Plana'),
            ('Júlia Rodrigues', 'Equações de 1º Grau'),
            ('Matheus Gomes', 'Introdução à Lógica de Programação'),
            ('Matheus Gomes', 'Frações'),
            ('Larissa Barbosa', 'Tabela Periódica'),
            ('Larissa Barbosa', 'Ligações Químicas'),
        ]

        for nome_aluno, nome_conteudo in matriculas_data:
            Matricula.objects.get_or_create(
                aluno=alunos[nome_aluno],
                conteudo=conteudos[nome_conteudo],
            )

        self.stdout.write(self.style.SUCCESS('Matrículas extras criadas'))

        # ----------------------------------------------------------
        # Fóruns + Mensagens (perguntas e respostas)
        # ----------------------------------------------------------
        foruns = {}
        for nome_conteudo, conteudo_obj in conteudos.items():
            forum_obj, _ = Forum.objects.get_or_create(conteudo=conteudo_obj)
            foruns[nome_conteudo] = forum_obj

        mensagens_data = [
            {
                'conteudo': 'Frações',
                'autor': aluno_perfil,
                'texto': 'Não entendi como soma frações com denominadores diferentes, alguém pode ajudar?',
                'respostas': [
                    {'autor': prof_perfil,
                     'texto': 'Você precisa encontrar o MMC dos denominadores antes de somar. Vou postar um exemplo no material.'},
                    {'autor': alunos['Maria Oliveira'].perfil,
                     'texto': 'Também tinha essa dúvida, o vídeo do material ajudou bastante!'},
                ]
            },
            {
                'conteudo': 'Equações de 1º Grau',
                'autor': alunos['Júlia Rodrigues'].perfil,
                'texto': 'Qual a diferença entre equação e função de 1º grau?',
                'respostas': [
                    {'autor': prof_perfil,
                     'texto': 'Equação tem um valor fixo de igualdade, já a função relaciona x e y variando.'},
                ]
            },
            {
                'conteudo': 'Leis de Newton',
                'autor': alunos['Maria Oliveira'].perfil,
                'texto': 'A terceira lei de Newton vale para objetos parados também?',
                'respostas': [
                    {'autor': professores['Carla Mendes'].perfil,
                     'texto': 'Sim! Ação e reação existem mesmo em repouso, como o seu peso e a normal da cadeira.'},
                ]
            },
            {
                'conteudo': 'Tabela Periódica',
                'autor': alunos['Pedro Santos'].perfil,
                'texto': 'Como faço para memorizar os grupos da tabela periódica?',
                'respostas': [
                    {'autor': professores['Bruno Carvalho'].perfil,
                     'texto': 'Tente associar os grupos a características como reatividade, é mais fácil que decorar.'},
                    {'autor': alunos['Larissa Barbosa'].perfil,
                     'texto': 'Eu uso flashcards, funciona muito bem comigo.'},
                ]
            },
            {
                'conteudo': 'Genética Mendeliana',
                'autor': alunos['Ana Pereira'].perfil,
                'texto': 'Qual a diferença entre genótipo e fenótipo?',
                'respostas': [
                    {'autor': professores['Fernanda Lima'].perfil,
                     'texto': 'Genótipo é a composição genética, fenótipo é a característica observável resultante dela.'},
                ]
            },
            {
                'conteudo': 'Brasil Colônia',
                'autor': alunos['Gabriel Souza'].perfil,
                'texto': 'O ciclo do ouro e o ciclo do açúcar aconteceram ao mesmo tempo?',
                'respostas': [
                    {'autor': professores['Rodrigo Alves'].perfil,
                     'texto': 'Não exatamente, o açúcar predominou no início e o ouro ganhou força a partir do século XVIII.'},
                ]
            },
            {
                'conteudo': 'Redação Dissertativa',
                'autor': alunos['Beatriz Almeida'].perfil,
                'texto': 'É obrigatório citar uma proposta de intervenção na redação do ENEM?',
                'respostas': [
                    {'autor': professores['Patrícia Souza'].perfil,
                     'texto': 'Sim, ela é um dos critérios de avaliação e a ausência reduz bastante a nota.'},
                ]
            },
            {
                'conteudo': 'Introdução à Lógica de Programação',
                'autor': alunos['Matheus Gomes'].perfil,
                'texto': 'Qual a diferença entre estrutura de repetição "para" e "enquanto"?',
                'respostas': [
                    {'autor': prof_perfil,
                     'texto': 'O "para" é usado quando você já sabe o número de repetições, o "enquanto" quando depende de uma condição.'},
                    {'autor': alunos['Lucas Ferreira'].perfil, 'texto': 'Boa explicação, ficou mais claro agora!'},
                ]
            },
        ]

        for m in mensagens_data:
            forum_obj = foruns[m['conteudo']]
            pergunta, created = Mensagem.objects.get_or_create(
                forum=forum_obj,
                autor=m['autor'],
                texto=m['texto'],
                defaults={'resposta_para': None}
            )
            if created:
                for r in m['respostas']:
                    Mensagem.objects.get_or_create(
                        forum=forum_obj,
                        autor=r['autor'],
                        texto=r['texto'],
                        resposta_para=pergunta,
                    )

        self.stdout.write(self.style.SUCCESS('Fórum, perguntas e respostas criados'))

        # ----------------------------------------------------------
        # Inscrições extras de professores (histórico)
        # ----------------------------------------------------------
        # (já criadas via professores_data acima)

        # ----------------------------------------------------------
        # Denúncias
        # ----------------------------------------------------------
        mensagem_ofensiva = Mensagem.objects.filter(
            forum=foruns['Introdução à Lógica de Programação']
        ).first()

        denuncias_data = [
            {
                'mensagem': mensagem_ofensiva,
                'denunciante': alunos['Lucas Ferreira'].perfil,
                'denunciado': alunos['Matheus Gomes'].perfil,
                'motivo': 'Linguagem inadequada no fórum',
                'evidencias': 'Print da conversa anexado ao chamado',
                'status': 'analisado',
                'parecer_admin': 'Mensagem revisada, não configura violação grave. Usuário orientado.',
                'analisado_por': admin,
                'descricao': 'Denúncia referente a comentário considerado ofensivo no fórum de Lógica de Programação.',
            },
            {
                'mensagem': None,
                'denunciante': aluno_perfil,
                'denunciado': alunos['Pedro Santos'].perfil,
                'motivo': 'Comportamento de assédio em chat privado',
                'evidencias': 'Capturas de tela enviadas por e-mail',
                'status': 'pendente',
                'parecer_admin': None,
                'analisado_por': None,
                'descricao': 'Denúncia de comportamento inadequado fora do fórum.',
            },
            {
                'mensagem': None,
                'denunciante': alunos['Maria Oliveira'].perfil,
                'denunciado': professores['Mariana Costa'].perfil,
                'motivo': 'Conteúdo de material didático incorreto',
                'evidencias': 'Material com informações desatualizadas',
                'status': 'recusado',
                'parecer_admin': 'Denúncia analisada, não houve erro factual no material.',
                'analisado_por': Admin.objects.get(perfil=admin2_perfil),
                'descricao': 'Denúncia sobre suposto erro em conteúdo de Geografia.',
            },
        ]

        for d in denuncias_data:
            Denuncia.objects.get_or_create(
                denunciante=d['denunciante'],
                denunciado=d['denunciado'],
                motivo=d['motivo'],
                defaults={
                    'mensagem': d['mensagem'],
                    'evidencias': d['evidencias'],
                    'status': d['status'],
                    'parecer_admin': d['parecer_admin'],
                    'analisado_por': d['analisado_por'],
                    'descricao': d['descricao'],
                }
            )

        self.stdout.write(self.style.SUCCESS('Denúncias criadas'))

        # ==========================================================
        # Resumo final
        # ==========================================================
        self.stdout.write(self.style.SUCCESS('================================================'))
        self.stdout.write(self.style.SUCCESS('Seed completo (original + expandido) executado!'))
        self.stdout.write(self.style.SUCCESS('================================================'))
        self.stdout.write(self.style.SUCCESS('Admin: admin123@gostudy.com / admin123'))
        self.stdout.write(self.style.SUCCESS('Admin 2: admin2@gostudy.com / admin123'))
        self.stdout.write(self.style.SUCCESS('Professor: professor@gostudy.com / 123456'))
        self.stdout.write(self.style.SUCCESS('Aluno: aluno@gostudy.com / 123456'))
        self.stdout.write(self.style.SUCCESS('Demais professores/alunos criados com senha padrão "123456"'))