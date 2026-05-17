from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from usuarios.models import Perfil, Admin

# implementa o comando para criar um admin no banco de dados

class Command(BaseCommand):
    
    def handle(self, *args, **kwargs):

        if not Perfil.objects.filter(email='admin123@gostudy.com').exists():
            perfil = Perfil.objects.create(
                nome="Admin123",
                email="admin123@gostudy.com",
                cpf="00000000000",
                senha=make_password("@admin123"),
                data_nascimento="2026-05-16",
                tipo="admin",
                role="admin"
            )
            Admin.objects.create(perfil=perfil)
            self.stdout.write(self.style.SUCCESS('Admin criado com sucesso no GoStudy!'))

        else:
            self.stdout.write(self.style.WARNING('Admin já existe no banco '))