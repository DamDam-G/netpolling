from django.db import models

# Create your models here.

class ScanParam(models.Model):
    id = models.AutoField(primary_key=True)
    ip = models.BooleanField()
    mac = models.BooleanField()
    os = models.BooleanField()
    hostname = models.BooleanField()
    type = models.IntegerField()

class Screenshot(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField(max_length=100)
    path = models.TextField(max_length=255)

