from django.db import models
from django.contrib.auth.models import User

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_read = models.BooleanField(default=False)
    

    def __str__(self):
        return self.message

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()
    review_text = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

class About(models.Model):
     impact = models.TextField()
     commitment = models.TextField()
     vision = models.TextField()
     philosophy = models.TextField()

     
class Contact(models.Model):
     message = models.TextField()
     phone_number = models.CharField(max_length=15)
     email = models.EmailField()
     timestamp = models.DateTimeField(auto_now_add=True)

     def __str__(self):
        return f"Contact {self.pk}"