# patients/views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Patient, Disease
from .serializers import *
from rest_framework import status
from rest_framework import status


class PatientListCreateView(generics.ListCreateAPIView):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return patient data for the authenticated user
        return Patient.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
           
            return Response({"detail": "Patient data not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

# get all patients
class AllPatientListCreateView(generics.ListCreateAPIView):
    serializer_class = PatientSerializer

    def get_queryset(self):
        return Patient.objects.all()


class PatientRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
       
        return Patient.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
       
        serializer.save()


class GetPatientDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
       
        return Patient.objects.all()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def patient_statistics(request):
    try:
        patient = Patient.objects.get(user=request.user)
        total_appointments = patient.patient_appointments.count()
        completed_appointments = patient.patient_appointments.filter(status='approved').count()
        pending_appointments = patient.patient_appointments.filter(status='processing').count()

        # Add more logic to calculate additional statistics if needed

        statistics_data = {
            'total_appointments': total_appointments,
            'completed_appointments': completed_appointments,
            'pending_appointments': pending_appointments,
            # Add more fields as needed for additional statistics
        }

        serializer = PatientStatisticsSerializer(statistics_data)
        return Response(serializer.data, status=200)
    except Exception as e:
        error_message = f"Error retrieving patient statistics: {str(e)}"
        return Response({"error": error_message}, status=500)
        

class UserReviewsView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    def get_queryset(self):
        user_id = self.kwargs.get('pk')
      
        return Patient.objects.filter(user_id=user_id)
    


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_patient(request):
    try:
        recieved_data = request.data
        recieved_data['user'] = request.user.id

        serializer = PatientSerializer(data=recieved_data) 
        if serializer.is_valid():
            serializer.save()
            print('patient added successfully')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('Validation Error:', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print('Error:', str(e))
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
def getDiseases(request):
    try:
        diseases = Disease.objects.all()
        serializer = DiseaseSerializer(diseases, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        error_message = f"Error retrieving categories: {str(e)}"
        return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)