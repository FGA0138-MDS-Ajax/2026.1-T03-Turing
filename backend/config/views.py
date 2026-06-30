import os
from django.http import FileResponse, Http404
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def servir_arquivo_inline(request, caminho):
    arquivo_path = os.path.join(settings.MEDIA_ROOT, caminho)
    
    if not os.path.exists(arquivo_path):
        raise Http404("Arquivo não encontrado.")
    
    response = FileResponse(open(arquivo_path, 'rb'), content_type='application/pdf')
    response['Content-Disposition'] = 'inline'
    response['X-Frame-Options'] = 'SAMEORIGIN'
    return response