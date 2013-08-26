import os
import re
import ConfigParser

python = ["wget www.python.org/ftp/python/2.7.5/Python-2.7.5.tgz", "tar -xzvf Python-2.7.5.tgz", "cd Python-2.7.5/", "./configure", "make", "make altinstall", "cd .."]
apt = ["nmap", "python-scapy", "tcpdump", "arp-scan", "tshark"]
django = ["wget https://www.djangoproject.com/download/1.5.1/tarball/", "tar xzvf Django-1.5.1.tar.gz", "cd Django-1.5.1", "python setup.py install", "cd .."]
clean = ["Python-2.7.5.tgz", "Django-1.5.1.tar.gz"]
conf = "/opt/netpolling/netpolling/conf/"

os.popen("cd ~")

for i in python:
    os.popen(i)

for i in apt:
    os.popen("apt-get install "+i+" -y")

for i in django:
    os.popen(i)

for i in clean:
    os.popen("rm -rf "+i)

os.popen("cd /opt/netpolling/")
os.popen("perl /opt/netpolling/netpolling/iw/scripts/cron.pl")
os.popen("chmod -R 600 /opt/netpolling/")
os.popen("chown -R root:root /opt/netpolling/")
os.popen("python /opt/netpolling/change_password")
print("Netpolling is ready to run.\nTo run netpolling server use the launch.py.\nFor configure netpolling, connect on the web interface.")