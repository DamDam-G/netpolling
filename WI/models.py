from django.db import models

# Create your models here.

class ScanParam(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField()
    netmask = models.TextField()
    interface = models.TextField()
    time = models.IntegerField()
    ilisten = models.TextField()
    bw = models.BigIntegerField()
    up = models.BooleanField()

class Screenshot(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField(max_length=100)
    path = models.TextField(max_length=255)

class Log(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField(max_length=100)
    content = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    type = models.IntegerField()

class Param(models.Model):
    id = models.AutoField(primary_key=True)
    move = models.FloatField()
    zomd = models.FloatField()
    zoml = models.FloatField()

class Device(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField()
    mac = models.TextField()