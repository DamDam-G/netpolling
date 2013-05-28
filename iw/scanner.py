from models import *
from scan.LocalScan import *
import os
import re

def WriteCron():
    """commentaire temporaire
    @return:
    """
    path = "/home/damien/netpolling/netpolling/iw/scripts/"
    os.popen(path+"cron.pl")

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
    @param - t : this is an int variable that represents the type of scan, 0 it's local 1 it's for subnetwork or external network
    @version V-0.1
    @copyright GNU GPL V-3
    """
    param = ScanParam.objects.get(type=t)
    if param.up == 1:
        scan = LocalScan(param.name, param.netmask, param.interface)
        scan.GetIpMac()
        if param.os == 1 or param.device == 1 or param.hostname == 1:
            for m in scan.net:
                if param.os == 1:
                    m["os"] = scan.GetOS(m["ip"])
                if param.device == 1:
                    m["device"] = scan.GetDevice()
                if param.hostname == 1:
                    m["device"] = scan.GetHostName()
        return scan
    else:
        return 1

if __name__ == "__main__":
    #os.environ['DJANGO_SETTINGS_MODULE'] = 'netpolling.settings'
    print (os.popen("echo $DJANGO_SETTINGS_MODULE")).read()
    s = DoScan(0)
    print s.net
