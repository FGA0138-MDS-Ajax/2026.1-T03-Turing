from django.core.mail import send_mail

def enviar_email(assunto, mensagem, destinatario):
    
    send_mail(
        subject=assunto,
        message=mensagem,
        from_email='gostudy.mds@gmail.com',
        recipient_list=[destinatario],
        fail_silently=False
    )