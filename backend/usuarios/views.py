from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Admin
from .serializers import AdminSerializer
from .permissions import IsGoStudyAdmin

class AdminViewSet(viewsets.ModelViewSet):
    
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    
    permission_classes = [IsAuthenticated, IsGoStudyAdmin]