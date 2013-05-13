from django.db import models

# Create your models here.

class ScanParam(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField()
    netmask = models.TextField()
    interface = models.TextField()
    os = models.BooleanField()
    hostname = models.BooleanField()
    type = models.IntegerField()

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

class Machine(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField()
    device = models.ForeignKey('Device')
    os = models.ForeignKey('OS')

class Interface(models.Model):
    id = models.AutoField(primary_key=True)
    id_machine = models.ForeignKey('Machine')
    ip = models.IPAddressField()
    mac = models.TextField(max_length=17)
    gw = models.ForeignKey('Route')

class Route(models.Model):
    id = models.AutoField(primary_key=True)
    gw = models.IPAddressField()

class BandWidth(models.Model):
    id = models.AutoField(primary_key=True)
    id_machine = models.ForeignKey('Machine')
    bw = models.IntegerField()

class OS(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField()

class Device(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField()