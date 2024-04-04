import logging
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Specialist, SpecialistCategory, Appointment, Payment
from .serializers import *
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from rest_framework.decorators import permission_classes
from info.models import Notification
import requests
import json
from django.utils.datastructures import MultiValueDictKeyError
from django.shortcuts import redirect
from rest_framework.renderers import JSONRenderer
from django.views.decorators.csrf import csrf_exempt 
from time import sleep
from rest_framework.generics import ListCreateAPIView




logger = logging.getLogger(__name__)

@api_view(['GET'])
def getCategories(request):
    try:
        categories = SpecialistCategory.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        error_message = f"Error retrieving categories: {str(e)}"
        logger.error(error_message)
        return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def getSpecialists(request):
    try:
        specialists = Specialist.objects.filter(status='active')
        serializer = SpecialistSerializer(specialists, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        error_message = f"Error retrieving specialists: {str(e)}"
        logger.error(error_message)
        return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def getSpecialistById(request, specialist_id):
    try:
        specialist = get_object_or_404(Specialist, id=specialist_id)
        serializer = SpecialistSerializer(specialist)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        error_message = f"Error retrieving specialist: {str(e)}"
        logger.error(error_message)
        return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    
class SpecialistListView(generics.ListCreateAPIView):
    serializer_class = SpecialistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return patient data for the authenticated user
        return Specialist.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
           
            return Response({"detail": "Specialist data not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_specialist(request):
    try:
        recieved_data = request.data
        recieved_data['user'] = request.user.id

        serializer = SpecialistSerializer(data=recieved_data) 
        if serializer.is_valid():
            serializer.save()
            print('specialist successfully created')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('Validation Error:', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print('Error:', str(e))
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
#update specialist profile
    
class SpecialistUpdateRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Specialist.objects.all()
    serializer_class =  SpecialistSerializer  


class AppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(patient=self.request.user).order_by('-date_time')


class SpecialistAppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        specialist = get_object_or_404(Specialist, user=self.request.user)
        return Appointment.objects.filter(specialist=specialist).order_by('-date_time')
    
#get specialist appointments to check overlap:
class GetSpecialistAppointmentListCreateView(ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        specialist_id = self.kwargs['id'] 
        specialist = get_object_or_404(Specialist, id=specialist_id)
        return Appointment.objects.filter(specialist=specialist).order_by('-date_time')


class SpecialistFeedbackListCreate(generics.ListCreateAPIView):
    queryset = SpecialistFeedback.objects.all()
    serializer_class = SpecialistFeedbackSerializer

class SpecialistFeedbackRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = SpecialistFeedback.objects.all()
    serializer_class =  SpecialistFeedbackSerializer   

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_specialist_feedback(request, specialist_id):
    received_data = request.data

    try:
        specialist_feedback_data = {
            'specialist': specialist_id,
            'patient': request.user.id,
            'rating': request.data.get('rating'),
            'feedback_text': request.data.get('feedback_text'),
            'timezone': timezone.now()
        }

       

        serializer = SpecialistFeedbackSerializer(data=specialist_feedback_data)

        if serializer.is_valid():
            serializer.save()
    
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('Validation Error:', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print('Error:', str(e))
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class AppointmentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(patient=self.request.user)


    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_appointment_and_stk_push(request):
    try:
        received_data = request.data
        print('Recieved data', received_data)
        
        received_date_str = received_data['date_time']
        received_date = timezone.make_aware(datetime.fromisoformat(received_date_str))
        
        received_data['date_time'] = received_date
        received_data['patient'] = request.user.id
        received_data['created_at'] = timezone.now()
        

        serializer = AppointmentSerializer(data=received_data)

        if serializer.is_valid():
            appointment = serializer.save()
            # Create a notification for the user
            notification_message = f"Appointment successfully created on {appointment.date_time}. Complete the payment process"
            Notification.objects.create(user=request.user, message=notification_message)

            # Send an email to the user
            email_subject = 'Appointment Confirmation'
            email_message = f"Your appointment on {appointment.date_time} has been successfully created. Complete the payment process."
            send_mail(email_subject, email_message, settings.DEFAULT_FROM_EMAIL, [request.user.email])

            # Send STK push
            total_amount = float(received_data['amount'])
            print(appointment.id)
            payload = {
                "BusinessShortCode": 174379,
                "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjMwODI5MTEzNTEy",
                "Timestamp": "20230829113512",
                "TransactionType": "CustomerPayBillOnline",
                "Amount": total_amount,  
                "PartyA": received_data['phone_number'],
                "PartyB": 174379,
                "PhoneNumber": received_data['phone_number'],
                "CallBackURL": f"https://6d0b-105-29-165-226.ngrok-free.app/api/payment_webhook/?appointment_id={appointment.id}",
                "AccountReference": "Health 360",
                "TransactionDesc": "Payment for Booking Services",
                "appointment_id": appointment.id,
            }

          

            stk_push_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
            stk_push_headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer BLlTe3MYKDpeTUc88YFVw8ave1sh',
            }
            

            stk_push_response = requests.post(stk_push_url, json=payload, headers=stk_push_headers)
           

            if stk_push_response.status_code == 200:
                # STK push request sent successfully
               return JsonResponse({'message': 'Payment processing...', 'appointment_id': appointment.id}, status=200)
            
            else:
                # STK push request failed
                error_message = f'STK push request failed with status code {stk_push_response.status_code}: {stk_push_response.text}'
                logger.error(error_message)
                return JsonResponse({'success': False, 'error': 'STK push request failed. Please try again later.'}, status=400)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.error(f"Error creating appointment and initiating STK push: {str(e)}")
        return JsonResponse({'success': False, 'error': str(e)}, status=500)
    


@csrf_exempt
@permission_classes([IsAuthenticated])
def payment_webhook(request):
    appointment_id = None  
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            logger.info(f"Received M-Pesa webhook data: {data}")

            # Check for a successful payment or user cancellation
            result_code = data.get('Body', {}).get('stkCallback', {}).get('ResultCode')
            result_desc = data.get('Body', {}).get('stkCallback', {}).get('ResultDesc')

            if result_code == 0:
                # Payment was successful
                logger.debug("Processing successful payment...")

                # Extract relevant data from the CallbackMetadata list
                callback_metadata = data.get('Body', {}).get('stkCallback', {}).get('CallbackMetadata', {}).get('Item', [])

                # Log the entire callback metadata for debugging
                logger.debug(f"Callback Metadata: {callback_metadata}")

                # Extract and log specific details
                amount = None
                mpesa_receipt_number = None
                phone_number = None

                for item in callback_metadata:
                    name = item.get('Name')
                    value = item.get('Value')
                    logger.debug(f"Callback Metadata Item: Name={name}, Value={value}")

                    if name == 'Amount':
                        amount = value
                    elif name == 'MpesaReceiptNumber':
                        mpesa_receipt_number = value
                    elif name == 'PhoneNumber':
                        phone_number = value

                logger.debug(f"Extracted Payment Details: Amount={amount}, ReceiptNumber={mpesa_receipt_number}, PhoneNumber={phone_number}")

                # Extract appointment_id from the query parameters of the callback URL
                try:
                    query_params = request.GET
                    appointment_id = query_params.get('appointment_id')
                except MultiValueDictKeyError:
                    return JsonResponse({'message': 'Payment failed. Missing appointment_id in query parameters.'}, status=400)

                if amount and mpesa_receipt_number and phone_number and appointment_id:
                    # Set the payment status to "paid" here
                    payment_status = Payment.PAID_STATUS  

                   
                    payment, created = Payment.objects.get_or_create(
                        booking_id=appointment_id,
                        defaults={
                            'amount': amount,
                            'transaction_id': mpesa_receipt_number,
                            'phone_number': phone_number,
                            'payment_status': payment_status
                        }
                    )

                    if not created:
                        logger.warning("Payment already exists for this appointment.")
                    else:
                        logger.info("Payment created successfully.")

                    # Update the payment method field to indicate M-Pesa
                    payment.payment_method = 'M-Pesa'
                    payment.save()

                    # Update the appointment status to "confirmed"
                    try:
                        appointment = Appointment.objects.get(id=appointment_id)
                        appointment.status = 'approved'
                        appointment.payment_status = 'completed'
                        appointment.save()

                        logger.info(f"Appointment {appointment_id} has been confirmed.")

                        # Send an email confirmation to the user
                        try:
                            user = appointment.patient  # Access the CustomUser associated with the patient

                            # Compose the email subject and message
                            email_subject = 'Appointment Confirmation'
                            email_message = f'Your appointment with {appointment.specialist} on {appointment.date_time} has been confirmed.'

                            # Send the email
                            send_mail(
                                email_subject,
                                email_message,
                                settings.DEFAULT_FROM_EMAIL,
                                [user.email],
                                fail_silently=False,
                            )

                            logger.info(f"Email confirmation sent to {user.email}")

                            # Create a notification for the user
                            try:
                                # Compose the notification message
                                notification_message = f'Your appointment with {appointment.specialist} on {appointment.date_time} has been confirmed.'

                                # Create the notification
                                Notification.objects.create(
                                    user=user,
                                    message=notification_message,
                                )
                                logger.info("Notification created successfully.")
                            except Exception as e:
                                logger.error(f"Error creating notification: {e}")
                        except Exception as e:
                            logger.error(f"Error sending email confirmation: {e}")
                    except Appointment.DoesNotExist:
                        logger.warning(f"Appointment {appointment_id} not found.")
                    except Exception as e:
                        logger.error(f"Error updating Appointment: {e}")

                    return JsonResponse({'message': 'Payment succeeded.'}, status=200)

            elif result_code == 1032:
            

                logger.info(f"Appointment {appointment_id} has been confirmed.")
                # User canceled the request
                logger.warning(f"Payment canceled by user: {result_desc}")

                # Extract appointment_id from the query parameters of the callback URL
                try:
                    query_params = request.GET
                    appointment_id = query_params.get('appointment_id')
                except MultiValueDictKeyError:
                    return JsonResponse({'message': 'Payment failed. Missing appointment_id in query parameters.'}, status=400)

                # Delete the appointment
                if appointment_id:
                    try:
                        appointment = Appointment.objects.get(id=appointment_id)
                        appointment.delete()

                        logger.info(f"Appointment {appointment_id} has been deleted.")
                    except Appointment.DoesNotExist:
                        logger.warning(f"Appointment {appointment_id} not found.")
                    except Exception as e:
                        logger.error(f"Error deleting Appointment: {e}")
                else:
                    logger.warning("Appointment ID is missing in the query parameters.")

                # Send a notification to the user
                try:
                    user = appointment.patient  # Access the CustomUser associated with the patient

                    # Compose the notification message
                    notification_message = f'Your appointment for {appointment.specialist} from {appointment.date_time} has been canceled.'

                    # Create the notification
                    Notification.objects.create(
                        user=user,
                        message=notification_message,
                    )
                    logger.info("Cancellation notification created successfully.")
                except Exception as e:
                    logger.error(f"Error creating cancellation notification: {e}")

                # Return a success response
                return JsonResponse({'message': 'Appointment canceled.'}, status=200)

            else:
                # Other failure cases
                return JsonResponse({'message': f'Payment failed. ResultCode: {result_code}, ResultDesc: {result_desc}'}, status=400)

        except json.JSONDecodeError as e:
            logger.error(f"Error decoding JSON data: {e}")
            return JsonResponse({'message': 'Invalid JSON data'}, status=400)
    else:
        logger.warning(f"Received a non-POST request: {request.method}")
        return JsonResponse({'message': 'Method Not Allowed'}, status=405)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def payment_waiting(request, appointment_id):
    appointment = get_object_or_404(Appointment, id=appointment_id)
    payment = get_object_or_404(Payment, booking=appointment_id)
    print('appointment id', appointment)

    # Poll for payment completion status
    MAX_ATTEMPTS = 10
    attempts = 0

    while attempts < MAX_ATTEMPTS:
        # Check if payment status has been updated
        appointment.refresh_from_db()
        if appointment.payment_status == 'completed':
            # Payment completed, return success response
            data = {
                "message": "Payment successful",
                "appointment_id": appointment_id,
                "status": "completed",
                "amount_received": payment.amount,
                'transaction_id': payment.transaction_id

               
            }
            return Response(data, status=status.HTTP_200_OK)
        
        # Payment not completed yet, wait and retry
        sleep(2)  # Wait for 2 seconds
        attempts += 1

    # If payment status is not updated after maximum attempts, return timeout error
    return Response({"message": "Payment timed out. Please try again later."}, status=status.HTTP_408_REQUEST_TIMEOUT)