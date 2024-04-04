from django.db import models
from patients.models import Patient
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver


class SpecialistCategory(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    icon = models.ImageField(upload_to='category_images/', blank=True, null=True)

    def __str__(self):
        return self.name


class Specialist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, default=None)
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('in_active', 'In_Active'),
       
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_active')
    category = models.ForeignKey(SpecialistCategory, on_delete=models.CASCADE)

    # Personal Information
    full_name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10)
    date_of_birth = models.DateField()
    contact_phone = models.CharField(max_length=15)
    contact_email = models.EmailField()

    # Professional Information
    description = models.TextField(blank=True, null='True')
    medical_license_number = models.CharField(max_length=50)
    years_of_experience = models.PositiveIntegerField()
    medical_certifications = models.TextField()
    achievements = models.TextField(blank=True, null=True)
    background = models.TextField(blank=True, null=True)

   #socials
    x =  models.TextField(blank=True, null='True')
    whatsApp =  models.TextField(blank=True, null='True')
    facebook =  models.TextField(blank=True, null='True')
    instagram =  models.TextField(blank=True, null='True')

    # payment
    pricing = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Telemedicine Availability
    secure_messaging_with_patients = models.BooleanField(default=True)


    # Emergency Response Availability
    on_call_information = models.TextField()
    emergency_contact_details = models.CharField(max_length=255)

    # Language Proficiency
    languages_spoken = models.CharField(max_length=255)

    # Feedback and Ratings
    feedback_history = models.TextField()

    # Health Education Materials Access
    access_to_education_materials = models.BooleanField(default=True)

   

    # Profile Picture
    profile_picture = models.ImageField(upload_to='doctor_profile_pics/', null=True, blank=True)

    # Accessibility Preferences
    accessibility_tools_preferences = models.BooleanField(default=True)

    # Logout and Account Deactivation Options
    logout_options = models.BooleanField(default=True)

    


    def __str__(self):
        return self.full_name
    

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('processing', 'Processing'),
        ('approved', 'Approved'),
        ('finished', 'Finished'),
        ('cancelled', 'Cancelled'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    patient = models.ForeignKey(User, related_name='patient_appointments', on_delete=models.CASCADE)
    specialist = models.ForeignKey(Specialist, related_name='specialist_appointments', on_delete=models.CASCADE)
    date_time = models.DateTimeField()
    description = models.TextField()
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='processing')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(default=datetime.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Appointment for {self.patient.username} with {self.specialist.full_name} at {self.date_time}"

    def save(self, *args, **kwargs):
        # Set the status to 'expired' if the appointment date and time are in the past
        if self.date_time < timezone.now():
            self.status = 'finished'

        # # Set the status to 'processing' if payment is pending or 'approved' if payment is completed
        # if self.payment_status == 'pending':
        #     self.status = 'processing'
        # elif self.payment_status == 'completed':
        #     self.status = 'approved'

        super(Appointment, self).save(*args, **kwargs)

class SpecialistFeedback(models.Model):
    specialist = models.ForeignKey(Specialist, on_delete=models.CASCADE, related_name='feedbacks')
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_feedbacks')
    rating = models.FloatField()
    feedback_text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback from {self.patient.username} for {self.specialist.full_name}"



class Payment(models.Model):
    booking = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    transaction_id = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    phone_number = models.CharField(max_length=15)

    PAID_STATUS = 'completed'
    UNPAID_STATUS = 'pending'
    PAYMENT_STATUS_CHOICES = [
        (PAID_STATUS, 'completed'),
        (UNPAID_STATUS, 'pending'),
    ]
    payment_status = models.CharField(
        max_length=10,
        choices=PAYMENT_STATUS_CHOICES,
        default=UNPAID_STATUS
    )


