from rest_framework import permissions

class IsGoStudyProf(permissions.BasePermission):

    """
    permissão que concede acesso apenas a usuários autenticados cujo perfil possua o tipo 'professor'
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            return request.user.tipo == 'professor'
        except AttributeError:
            return False
        

class IsGoStudyAdmin(permissions.BasePermission):
    """
    permissão que concede acesso apenas a usuários autenticados cujo perfil possua o tipo 'admin'
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:      
            return request.user.tipo == 'admin'
        except AttributeError:
            return False
        
# Permite acesso apenas para usuarios tipo 'aluno'.
class IsAluno(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.tipo == 'aluno')
        