import os
import re
import ConfigParser

def check_param(obj):
    while 42:
        value = raw_input(obj.query)
        if re.search(obj.regex, value):
            return value
        else:
            print obj.error

path = "/opt/netpolling/"
python = ["wget www.python.org/ftp/python/2.7.5/Python-2.7.5.tgz", "tar -xzvf Python-2.7.5.tgz", "cd Python-2.7.5/", "./configure", "make", "make altinstall", "cd .."]
apt = ["nmap", "python-scapy", "tcpdump", "arp-scan", "tshark"]
django = ["wget https://www.djangoproject.com/download/1.5.1/tarball/", "tar xzvf Django-1.5.1.tar.gz", "cd Django-1.5.1", "python setup.py install", "cd .."]
clean = ["Python-2.7.5.tgz", "Django-1.5.1.tar.gz"]
conf = path+"netpolling/conf/"
i = 0

os.popen("cd /opt/")

for i in python:
    os.popen(i)

for i in apt:
    os.popen("apt-get install "+i+" -y")

for i in django:
    os.popen(i)

for i in clean:
    os.popen("rm -rf "+i)

name = raw_input("Nom du scan : ")
netmask = {"value":"", "query":"Veuillez fournir le masque réseau (ex : 10.8.96.0/20) : ", "error":"Il faut un masque réseau au format suivant : 10.8.96.0/20", "regex":"^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$"}
interface1 = raw_input("Veuillez indiquer l'interface réseau de scan : ")
interface2 = raw_input("Veuillez indiquer l'interface réseau d'analyse de bande passante : ")
bw = {"value":0, "query":"Veuillez indiquer la bande passante (en mo) dédiée au réseau : ", "error":"Votre bande passante doit être un nombre", "regex":"^[0-9]{1,}$"}
netmask.value = check_param(netmask)
bw.value = check_param(bw)
os.popen("cd /opt/netpolling/")
print "Initialisation de la crontab"
os.popen("perl /opt/netpolling/netpolling/iw/scripts/cron.pl")
print "Mise en place des droit Unix"
os.popen("chmod -R 600 /opt/netpolling/")
print "Mise en place du propirétaire et du groupe root"
os.popen("chown -R root:root /opt/netpolling/")
os.popen("python /opt/netpolling/change_password")
print("Netpolling is ready to run.\nTo run netpolling server use the launch.py.\nFor configure netpolling, connect on the web interface.")