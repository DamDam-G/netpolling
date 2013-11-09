#-*- coding: utf-8 -*-
import os
import re
import sys
import ConfigParser

def check_param(obj):
    while 42:
        value = raw_input(obj["query"])
        if re.search(obj["regex"], value):
            return value
        else:
            print obj["error"]

path = "/opt/netpolling/"
apt = ["nmap", "python-scapy", "tcpdump", "arp-scan", "tshark"]
conf = path+"WI/conf/"

print("Installation des dépendances")

for i in apt:
    os.popen("apt-get install "+i+" -y")

where = (os.popen("pwd").readlines())[0].replace("\n", "")

print("Vérification de l'emplace de l'application")

if where == "/opt/netpolling/":
    pass
else:
    print """[ERROR] the Net Polling app must be located in the /opt, with the architecture :
    /opt/
        netpolling/
                    change_password.py
                    install.py
                    laucnh.py
                    manage.py
                    netpolling/"""
    sys.exit(0)

print("Préparation du fichier de configuration")
name = raw_input("Nom du scan : ")
netmask = {"value": "", "query": "Veuillez fournir le masque réseau (ex : 10.8.96.0/20) : ", "error": "Il faut un masque réseau au format suivant : 10.8.96.0/20", "regex": "^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$"}
interface1 = raw_input("Veuillez indiquer l'interface réseau de scan : ")
interface2 = raw_input("Veuillez indiquer l'interface réseau d'analyse de bande passante : ")
bw = {"value":0, "query":"Veuillez indiquer la bande passante (en mo) dédiée au réseau : ", "error":"Votre bande passante doit être un nombre", "regex":"^[0-9]{1,}$"}
netmask["value"] = check_param(netmask)
bw["value"] = check_param(bw)
print("Ecriture du fichier de configuration")
config = ConfigParser.RawConfigParser()
config.read(r''+conf+'netpolling.conf')
try:
    config.set("LocalScan", "name", name)
    config.set("LocalScan", "netmask", netmask["value"])
    config.set("LocalScan", "interface", interface1)
    config.set("Listen", "interface", interface2)
    config.set("Listen", "bw", bw["value"])
    with open(r''+conf+'netpolling.conf', 'wb') as configfile:
        config.write(configfile)
except ConfigParser.Error, err:
    print 'Oops, une erreur dans votre fichier de conf (%s)' % err
print "Initialisation de la crontab"
os.popen("perl /opt/netpolling/netpolling/WI/scripts/cron.pl")
print "Mise en place des droit Unix"
os.popen("chmod -R 600 /opt/netpolling/")
print "Mise en place du propirétaire et du groupe root"
os.popen("chown -R root:root /opt/netpolling/")
os.popen("python /opt/netpolling/change_password")
print("Netpolling is ready to run.\nTo run netpolling server use the launch.py.\nFor configure netpolling, connect on the web interface.")