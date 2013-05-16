from models import *
from scan.LocalScan import *
import os
import re

def WriteCron(time):
    """commentaire temporaire
    time : temps entre chaque scan
    @param time:
    @return:
    """
    cron = (os.popen('cat /etc/crontab')).read()
    if time:
        #calcul du temps pour les crontab
        t = 0
        #crontab pour mettre tout les scans les x temps
        c = "*/"+str(t)+"* * * * root /opt/netpolling/netpolling/iw/scanner.py"
        fd = open("/etc/crontab", "w")
        if re.match("\*\/1 +\* +\* +\* +\* +root +\/opt\/netpolling\/netpolling\/iw\/scanner.py", cron):
            re.sub(r"("+cron+")", r" \1 ", c)
            fd.write(cron)
            fd.close()
        else:
            fd = open("/etc/crontab", "w")
            fd.write(cron+"\n"+c+"\n")
            fd.close()


def SaveScan(lobj):
    for obj in lobj:
        (Interface(id_machine=Machine(name=obj.hostname,
                                    device=Device.objects.filter(name=obj.device),
                                    os=OS.objects.filter(name=obj.os)),
                    ip=obj.ip,
                    mac=obj.mac,
                    gw=Route.objects.filter(gw=obj.gw))).save()

def DoScan(t):
    """!
    @author Damien Goldenberg
    @name DoScan
    @brief This function execute the scan on the network
    @param - type : this is an int variable that represents the type of scan, 0 it's local 1 it's for subnetwork or external network
    @version V-0.1
    @copyright GNU GPL V-3
    """
    param = ScanParam.objects.get(type=t)
    scan = LocalScan(param.name, param.netmask, param.interface)
    scan.GetIpMac()
    if param.os == 1 or param.device == 1 or param.hostname == 1:
        for m in scan.net:
            if param.os == 1:
                m["os"] = scan.GetOS(m["ip"])
            if param.device == 1:
                m["device"] = scan.Getdevice()
            if param.hostname == 1:
                m["device"] = scan.GetHostName()
    return scan

if __name__ == "__main__":
    s = DoScan(0)
    print s.net
