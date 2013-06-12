#! /usr/bin/python
#from models import *
from scan.LocalScan import *
import bw
import os
import conf.netenv as ENV
import ConfigParser

def WriteCron():
    """commentaire temporaire
    @return:
    """
    os.popen(ENV.scripts+"cron.pl")

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
    param.read(ENV.conf+'netpolling.conf')
    try:
        name = param.get('LocalScan', 'name')
        netmask = param.get('LocalScan', 'netmask')
        interface = param.get('LocalScan', 'interface')
        up = int(param.get('LocalScan', 'up'))
        n = list()
        if up == 1:
            scan = LocalScan(name, netmask, interface)
            scan.GetIpMac()
            bwp = bw.GetBps(10)
            for m in scan.net:
                for ligne in bwp:
                   if ligne == m["ip"]:
                        pourcent = (float(bwp[ligne])/float(15728640))*100.0
                        kilo = float(bwp[ligne])/float(1024)
                        n.append({"device":m["device"], "ip":m["ip"], "mac":m["mac"], "os":m["os"], "bw":kilo, "percent":pourcent})
            return json.dumps(n)
        else:
            return {'error':'veuillez patientez le scan est en cours de fonctionnement'}
    except ConfigParser.Error, err:
        print 'Oops, une erreur dans votre fichier de conf (%s)' % err

if __name__ == "__main__":
    fd = open(ENV.conf+"network.json", "w")
    fd.write(DoScan())
    fd.close()
