import os

ip = input("Tappez l'adresse ip du serveur")
os.popen("python /opt/netpolling/manage.py runserver "+str(ip)+":4242 >> netpolling.log")
