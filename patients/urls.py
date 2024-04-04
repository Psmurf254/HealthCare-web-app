
from django.urls import path
from . import views
from .views import *
from .views import patient_statistics

urlpatterns = [
    path('patients/', PatientListCreateView.as_view(), name='patient-list-create'),
    path('all_patients/', AllPatientListCreateView.as_view()),
    path('patients/create/', create_patient, name='patient-list-create'),
    path('patients/<int:pk>/', PatientRetrieveUpdateDestroyView.as_view(), name='patient-retrieve-update-destroy'),
    path('appointment/patients/<int:pk>/', GetPatientDetails.as_view(), name='patient-retrieve-update-destroy'),
    path('patients/statistics/', patient_statistics, name='patient-statistics'),
    path('review/<int:pk>/', UserReviewsView.as_view(), name='patient-retrieve-update-destroy'),
    path('disease_data/', views.getDiseases, name='disease_data'),
]
