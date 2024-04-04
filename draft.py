from django.contrib import admin
from . models import *


class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'specialist', 'date_time',  'payment_status', 'status')
    search_fields = ['date_time']

    

class PaymentAdmin(admin.ModelAdmin):
    list_display = ('booking', 'amount', 'payment_method', 'transaction_id', 'timestamp', 'phone_number', 'payment_status')
    list_filter = ('payment_status',)
    search_fields = ('booking__patient__username', 'booking__specialist__full_name')

admin.site.register(SpecialistCategory)
admin.site.register(Specialist)
admin.site.register(SpecialistFeedback)
admin.site.register(Payment, PaymentAdmin)
admin.site.register(Appointment, AppointmentAdmin)

