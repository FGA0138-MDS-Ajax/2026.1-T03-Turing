from django.core.management.base import BaseCommand
from usuarios.models import Perfil, Aluno, Professor, Admin
from disciplinas.models import Disciplina, Conteudo, Material
from turmas.models import Matricula
from interacoes.models import Inscricao


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