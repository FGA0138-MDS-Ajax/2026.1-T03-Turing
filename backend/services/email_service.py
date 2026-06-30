from django.core.mail import send_mail
from django.conf import settings

def enviar_email(assunto, mensagem, destinatario):
    
    send_mail(
        subject=assunto,
        message=mensagem,
        from_email='gostudy.mds@gmail.com',
        recipient_list=[destinatario],
        fail_silently=False
    )

def enviar_email_boas_vindas_professor(nome, email):
    assunto='Cadastro de professor recebido - GoStudy',
    mensagem=f'''
Olá, {nome}!
Seu cadastro foi realizado com sucesso.
Seu currículo foi enviado para análise da equipe administrativa da GoStudy e sua inscrição está atualmente com status pendente.
Você receberá uma nova notificação quando sua solicitação for aprovada ou recusada.
Por favor, aguarde até 3 dias úteis para a revisão da sua inscrição.

Atenciosamente,
Equipe GoStudy
'''
    
    enviar_email(assunto, mensagem, email)

def enviar_email_boas_vindas_aluno(nome, email):
    assunto='Cadastro de aluno recebido - GoStudy',
    mensagem=f'''
Olá, {nome}!
Seu cadastro como aluno na plataforma GoStudy foi realizado com sucesso.
Sua conta já está ativa e pronta para utilização. Estamos felizes em te ter como estudante na nossa plataforma.
Bem-vindo(a) à GoStudy!

Atenciosamente,
Equipe GoStudy
'''
    
    enviar_email(assunto, mensagem, email)

def enviar_email_aprovacao_professor(nome, email):
    assunto='Aprovação de inscrição - GoStudy',
    mensagem=f'''Olá, {nome}!
Seu currículo foi avaliado por nossos administradores e sua inscrição foi aprovada!
Sua conta já está ativa e pronta para utilização.
Estamos felizes em te ter como professor na nossa plataforma.
Bem-vindo(a) à GoStudy!

Atenciosamente,
Equipe GoStudy
'''
    
    enviar_email(assunto, mensagem, email)

def enviar_email_rejeicao_professor(nome, email):
    assunto='Rejeição de inscrição - GoStudy',
    mensagem=f'''Olá, {nome}!
Seu currículo foi avaliado por nossos administradores e infelizmente sua inscrição foi recusada
Sua conta permanecerá inativa para utilização.
Agradecemos por sua inscrição.

Atenciosamente,
Equipe GoStudy
'''
    
    enviar_email(assunto, mensagem, email)

def enviar_email_redefinicao_senha(nome, email, reset_link):
    assunto = 'Redefinição de senha - GoStudy'
    mensagem =f'''Olá, {nome}!
Recebemos uma solicitação para redefinir sua senha no GoStudy.
Para criar uma nova senha, acesse o link abaixo:
{reset_link}
Se você não solicitou essa alteração, apenas ignore este email.

Atenciosamente,
Equipe GoStudy
'''
    
    enviar_email(assunto, mensagem, email)