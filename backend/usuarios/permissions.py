from rest_framework import permissions

class IsGoStudyAdmin(permissions.BasePermission):
 
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            return request.user.perfil.role == 'admin'
        except AttributeError:
            return False