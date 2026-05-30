from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Inscricao
from .serializers import InscricaoSerializer
from usuarios.permissions import IsGoStudyAdmin

class InscricaoViewSet(viewsets.ModelViewSet):
    queryset = Inscricao.objects.all()
    serializer_class = InscricaoSerializer
    permission_classes = [IsAuthenticated, IsGoStudyAdmin]
    
    def get_queryset(self):
        queryset = Inscricao.objects.all()
        status_param = self.request.query_params.get('status')
       
        if status_param:
            queryset = queryset.filter(status=status_param)
            
        return queryset
