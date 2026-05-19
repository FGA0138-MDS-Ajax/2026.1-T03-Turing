from rest_framework import permissions

class IsGoStudyAdmin(permissions.BasePermission):
    """
    permissão que concede acesso apenas a usuários autenticados cujo perfil possua a role 'admin'
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            return request.user.role == 'admin'
        except AttributeError:
            return False