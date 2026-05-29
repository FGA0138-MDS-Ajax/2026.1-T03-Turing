from django.core.management.base import BaseCommand
from usuarios.models import Perfil, Admin
from django.db import IntegrityError

# implementa o comando para criar um admin no banco de dados via terminal

class Command(BaseCommand):
    
    def handle(self, *args, **kwargs):
        #credenciais pré-estabelecidas
        email_padrao = "admin123@gostudy.com"
        cpf_padrao = "00000000001"
        senha_padrao = "admin123"

        if Perfil.objects.filter(email=email_padrao).exists():
            self.stdout.write(self.style.WARNING(f'O Admin com e-mail {email_padrao} já existe no banco.'))
            return 

    
        if Perfil.objects.filter(cpf=cpf_padrao).exists():
            self.stdout.write(self.style.ERROR(f' O CPF {cpf_padrao} já está sendo usado por outro usuário de testes.'))
            return

        try:
            perfil = Perfil.objects.create_user(
                nome="Admin Turing",
                email=email_padrao,
                cpf=cpf_padrao,
                password=senha_padrao, 
                data_nascimento="2026-05-16",
                tipo="admin",
                
            )

            # ligando a tabela do Perfil recém-criado
            Admin.objects.create(perfil=perfil)

            self.stdout.write(self.style.SUCCESS(f' Admin criado com sucesso! Login: {email_padrao} | Senha: {senha_padrao}'))

        except IntegrityError as e:
            #  
            self.stdout.write(self.style.ERROR(f' erro de integridade no banco de dados: {e}'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'  erro inesperado ao criar o Admin: {e}'))