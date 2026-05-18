from rest_framework import permissions

class IsGoStudyProf(permissions.BasePermission):

   # permissão que concede acesso apenas a usuários autenticados com a role 'professor'
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            return request.user.perfil.role == 'professor'
        except AttributeError:
            return False
        