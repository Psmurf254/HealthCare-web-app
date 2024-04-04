from django.contrib import admin
from . models import Notification, Review, About, Contact

class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'rating', 'date',)
    list_filter = ('user', 'date',)
    search_fields = ('user__username', 'rating', 'review_text',)
    date_hierarchy = 'date'

admin.site.register(Review, ReviewAdmin)
admin.site.register(Notification)
admin.site.register(About)
admin.site.register(Contact)

