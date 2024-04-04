
from django.contrib import admin

import specialists.models as models


class SpecialistCategoryAdmin(admin.ModelAdmin):

    list_display = ('id', 'name', 'description', 'icon')
    search_fields = ('name',)


class SpecialistAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'user',
        'status',
        'category',
        'full_name',
        'gender',
        'date_of_birth',
        'contact_phone',
        'contact_email',
        'description',
        'medical_license_number',
        'years_of_experience',
        'medical_certifications',
        'achievements',
        'background',
        'x',
        'whatsApp',
        'facebook',
        'instagram',
        'pricing',
        'secure_messaging_with_patients',
        'on_call_information',
        'emergency_contact_details',
        'languages_spoken',
        'feedback_history',
        'access_to_education_materials',
        'profile_picture',
        'accessibility_tools_preferences',
        'logout_options',
    )
    list_filter = (
        'user',
        'date_of_birth',
        'secure_messaging_with_patients',
        'access_to_education_materials',
        'accessibility_tools_preferences',
        'logout_options',
        'id',
        'status',
        'category',
        'full_name',
        'gender',
        'contact_phone',
        'contact_email',
        'description',
        'medical_license_number',
        'years_of_experience',
        'medical_certifications',
        'achievements',
        'background',
        'x',
        'whatsApp',
        'facebook',
        'instagram',
        'pricing',
        'on_call_information',
        'emergency_contact_details',
        'languages_spoken',
        'feedback_history',
        'profile_picture',
    )


class AppointmentAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'patient',
        'specialist',
        'date_time',
        'description',
        'phone_number',
        'status',
        'payment_status',
        'created_at',
        'updated_at',
    )
    list_filter = (
        'patient',
        'specialist',
        'date_time',
        'created_at',
        'updated_at',
        'id',
        'description',
        'phone_number',
        'status',
        'payment_status',
    )
    date_hierarchy = 'created_at'


class SpecialistFeedbackAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'specialist',
        'patient',
        'rating',
        'feedback_text',
        'timestamp',
    )
    list_filter = (
        'specialist',
        'patient',
        'timestamp',
        'id',
        'rating',
        'feedback_text',
    )


class PaymentAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'booking',
        'amount',
        'payment_method',
        'transaction_id',
        'timestamp',
        'phone_number',
        'payment_status',
    )
    list_filter = (
        'booking',
        'timestamp',
        'id',
        'amount',
        'payment_method',
        'transaction_id',
        'phone_number',
        'payment_status',
    )


def _register(model, admin_class):
    admin.site.register(model, admin_class)


_register(models.SpecialistCategory, SpecialistCategoryAdmin)
_register(models.Specialist, SpecialistAdmin)
_register(models.Appointment, AppointmentAdmin)
_register(models.SpecialistFeedback, SpecialistFeedbackAdmin)
_register(models.Payment, PaymentAdmin)
