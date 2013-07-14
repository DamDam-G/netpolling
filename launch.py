import os

ip = input("Tappez l'adresse ip du serveur")
os.popen("python /opt/netpolling/manage.py runserver "+ip+":4242")
