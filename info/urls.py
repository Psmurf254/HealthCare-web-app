from django.urls import path
from . import views
from .views import NotificationList, NotificationDetail
from .views import ReviewListCreateView, ReviewRetrieveUpdateDestroyView, create_notification, NotificationRetrieveUpdateDestroy

urlpatterns = [
    path('notifications/', NotificationList.as_view(), name='notification-list'),
    path('notifications/createNotification/', create_notification, name='create_notification'),
    path('notifications/upadte/<int:pk>/', NotificationRetrieveUpdateDestroy.as_view()),
    path('notifications/<int:pk>/', NotificationDetail.as_view(), name='notification-detail'),
    path('reviews/', ReviewListCreateView.as_view(), name='review-list-create'),
    path('review/create/', views.create_review,  name='create_review'),
    path('contact/', views.create_contact),
    path('reviews/<int:pk>/', ReviewRetrieveUpdateDestroyView.as_view(), name='review-retrieve-update-destroy'),
    path('about/', views.getAbout, name='about'),
]
