from . models import *
from rest_framework.serializers import ModelSerializer

class CategorySerializer(ModelSerializer):
    class Meta:
        model = SpecialistCategory
        fields = '__all__'
class SpecialistSerializer(ModelSerializer):
    class Meta:
        model = Specialist
        fields = '__all__'

class AppointmentSerializer(ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'specialist', 'date_time', 'description', 'status', 'payment_status', 'created_at', 'updated_at']
        read_only_fields = ['status', 'payment_status', 'created_at', 'updated_at']

class PaymentSerializer(ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class SpecialistFeedbackSerializer(ModelSerializer):
    class Meta:
        model = SpecialistFeedback
        fields = '__all__'