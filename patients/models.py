from django.db import models
from django.contrib.auth.models import User

class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, default=None)

    # Personal Information
    full_name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10)
    date_of_birth = models.DateField()
    contact_phone = models.CharField(max_length=15)
    contact_email = models.EmailField()

    # Health Information
    medical_history = models.TextField()
    allergies = models.TextField()
    medications = models.TextField()
    immunization_records = models.TextField()

    # Emergency Contact
    emergency_contact_name = models.CharField(max_length=255)
    emergency_contact_phone = models.CharField(max_length=15)

    # Telemedicine Preferences
    telemedicine_consultations_allowed = models.BooleanField(default=True)
    secure_messaging_enabled = models.BooleanField(default=True)

    # Health Tracking
    blood_pressure = models.CharField(max_length=20, blank=True, null=True)
    heart_rate = models.CharField(max_length=20, blank=True, null=True)
    weight = models.CharField(max_length=20, blank=True, null=True)

    # Medication Management
    current_medications = models.TextField()
    prescription_history = models.TextField()

    # Language Preferences
    preferred_language = models.CharField(max_length=50)

    # Feedback and Ratings
    feedback_ratings = models.FloatField(default=0.0)
    doctor_feedback_history = models.TextField()

    # Health Education Materials Access
    access_to_education_materials = models.BooleanField(default=True)

    # Notifications Preferences
    appointment_reminders_enabled = models.BooleanField(default=True)
    communication_alerts_enabled = models.BooleanField(default=True)

    # Profile Picture
    profile_picture = models.ImageField(upload_to='patient_profile_pics/', null=True, blank=True)

    # Accessibility Preferences
    accessibility_tools_enabled = models.BooleanField(default=True)

    # User Settings
    notification_preferences = models.BooleanField(default=True)
    account_security_settings = models.BooleanField(default=True)

    def __str__(self):
        return self.full_name


class Disease(models.Model):
    name = models.CharField(max_length=100)
    symptoms = models.TextField()
    causes = models.TextField()

    def __str__(self):
        return self.name