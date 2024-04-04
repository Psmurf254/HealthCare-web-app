from django.urls import path
from . import views
from .views import AppointmentListCreateView, AppointmentRetrieveUpdateDestroyView, getSpecialistById, create_specialist_feedback, create_specialist, SpecialistAppointmentListCreateView, SpecialistListView, SpecialistUpdateRetrieveUpdateDestroyView, GetSpecialistAppointmentListCreateView


urlpatterns = [
    path('categories/', views.getCategories, name='categories'),
    path('specialists/specialist/', SpecialistListView.as_view(), name='specialists_list'),
    path('specialists/', views.getSpecialists, name='specialists'),
    path('specialists/create/', create_specialist, name='specialists_create'),
    path('specialist/update/<int:pk>/', SpecialistUpdateRetrieveUpdateDestroyView.as_view(), name='specialist-retrieve-update-destroy'),
    path('appointments/specialist/', SpecialistAppointmentListCreateView.as_view(), name='specialist_appointment-list-create'),
    path('specialist_appointments/<int:id>/', GetSpecialistAppointmentListCreateView.as_view()),
    
    path('appointments/', AppointmentListCreateView.as_view(), name='appointment-list-create'),

    path('specialist_feedback/', views.SpecialistFeedbackListCreate.as_view()),
    path('specialist_feedback/<int:pk>/', views.SpecialistFeedbackRetrieveUpdateDestroy.as_view()),
    path('appointments/<int:specialist_id>/feedback/', create_specialist_feedback, name='create_specialist_feedback'),
    
    path('appointments/create/', views.create_appointment_and_stk_push, name='create'),
    path('appointments/<int:pk>/', AppointmentRetrieveUpdateDestroyView.as_view(), name='appointment-retrieve-update-destroy'),
    path('payment_webhook/', views.payment_webhook, name='payment_webhook'),
    path('payment_waiting/<int:appointment_id>/', views.payment_waiting, name='payment_waiting'),
    path('specialists/<int:specialist_id>/', getSpecialistById, name='get_specialist_by_id'),

    #confrencing
   
    

]