from rest_framework import permissions

# Leitura aberta mas escrita de post, delete, patch, put apenas para professor e admin
class IsGoStudyProfOrAdmin(permissions.BasePermission):

    def has_permission(self, request, view,):
        #SAFE_METHODS para não alterar o banco
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return True

        is_professor = (request.user.tipo == 'professor')
        is_admin = (request.user.tipo == 'admin' or request.user.is_superuser)

        return is_professor or is_admin


