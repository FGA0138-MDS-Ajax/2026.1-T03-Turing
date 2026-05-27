from django.urls import path
from .views import MaterialCreateListView, MaterialRetrieveUpdateDestroyAPIView

urlpatterns = [
    path('materiais/', MaterialCreateListView.as_view(), name='materiais-create-view'),
    path('materiais/<int:pk>/', MaterialRetrieveUpdateDestroyAPIView.as_view(), name='materiais-detail-view'),
]

