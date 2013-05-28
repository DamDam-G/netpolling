#from models import *
from scan.LocalScan import *
import os
import re
import ConfigParser

def WriteCron():
    """commentaire temporaire
    @return:
    """
    path = "/home/damien/netpolling/netpolling/iw/scripts/"
    os.popen(path+"cron.pl")

def DoScan():
    """!
    @author Damien Goldenberg
    @name DoScan
    @brief This function execute the scan on the network
    @param - t : this is an int variable that represents the type of scan, 0 it's local 1 it's for subnetwork or external network
    @version V-0.1
    @copyright GNU GPL V-3
    """
    param = ConfigParser.RawConfigParser()
    param.read('conf/netpolling.conf')
    try:
        name = param.get('LocalScan', 'name')
        netmask = param.get('LocalScan', 'netmask')
        interface = param.get('LocalScan', 'interface')
        system = param.get('LocalScan', 'os')
        device = param.get('LocalScan', 'device')
        hostname = param.get('LocalScan', 'hostname')
        up = int(param.get('LocalScan', 'up'))
        if up == 1:
            scan = LocalScan(name, netmask, interface)
            scan.GetIpMac()
            if system == 1 or device == 1 or hostname == 1:
                for m in scan.net:
                    if param.os == 1:
                        m["os"] = scan.GetOS(m["ip"])
                    if param.device == 1:
                        m["device"] = scan.GetDevice()
                    if param.hostname == 1:
                        m["device"] = scan.GetHostName()
            return scan.GetNetwork(1)
        else:
            return {'error':'veuillez patientez le scan est en cours de fonctionnement'}
    except ConfigParser.Error, err:
        print 'Oops, une erreur dans votre fichier de conf (%s)' % err

if __name__ == "__main__":
    fd = open("conf/network.json", "w")
    fd.write(DoScan())
    fd.close()

"""
def SaveScan(lobj):
    for obj in lobj:
        (Interface(id_machine=Machine(name=obj.hostname,
                                    device=Device.objects.filter(name=obj.device),
                                    os=OS.objects.filter(name=obj.os)),
                    ip=obj.ip,
                    mac=obj.mac,
                    gw=Route.objects.filter(gw=obj.gw))).save()

def DoScan(t):
    !
    @author Damien Goldenberg
    @name DoScan
    @brief This function execute the scan on the network
    @param - t : this is an int variable that represents the type of scan, 0 it's local 1 it's for subnetwork or external network
    @version V-0.1
    @copyright GNU GPL V-3
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
"""