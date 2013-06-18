#! /usr/bin/python
from scan.LocalScan import *
import os
import conf.netenv as ENV
import ConfigParser
import time

def WriteCron():
    """commentaire temporaire
    @return:
    """
    os.popen(ENV.scripts+"cron.pl")


def GetBW(t):
    (os.popen("tshark -i eth0 -z conv,ip -a duration:{0} > {1}traffic".format(t, ENV.conf)))
    time.sleep(float(t))
    bwk = {}
    fd = open(ENV.conf+"traffic", "r")
    for line in fd:
        if " <-> " in line:
            ip1 = line[0:15].rstrip()
            ip2 = line[25:41].rstrip()
            octet = line[90:100]
            bps = float(octet)/float(t)
            if "10.8" in line[0:6]:
                if ip1 in bwk:
                    bwk[ip1] += bps
                else:
                    bwk[ip1] = bps
            elif "10.8" in line[23:30]:
                if ip2 in bwk:
                    bwk[ip2] += bps
                else:
                    bwk[ip2] = bps
            else:
                print "Joe la praline"
    fd.close()
    return bwk


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
            bwp = GetBW(56)
            for m in scan.net:
                for ligne in bwp:
                    if ligne == m["ip"]:
                        percent = (float(bwp[ligne])/float(15728640))*800.0
                        kilo = float(bwp[ligne])/float(1024)
                        m["bw"] = kilo
                        m["percent"] = percent
            return scan.GetNetwork(1)
        else:
            return {'error':'veuillez patientez le scan est en cours de fonctionnement'}
    except ConfigParser.Error, err:
        print 'Oops, une erreur dans votre fichier de conf (%s)' % err

if __name__ == "__main__":
    r = DoScan()
    fd = open(ENV.conf+"network.json", "w")
    fd.write(r)
    fd.close()
