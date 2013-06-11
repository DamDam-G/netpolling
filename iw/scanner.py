#from models import *
from scan.LocalScan import *
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
        if up == 1:
            scan = LocalScan(name, netmask, interface)
            scan.GetIpMac()
            fd = open(ENV.conf+"network.json", "r")
            for m in scan.net:
                    pass #traitement à faire pour la bw
            return scan.GetNetwork(1)
        else:
            return {'error':'veuillez patientez le scan est en cours de fonctionnement'}
    except ConfigParser.Error, err:
        print 'Oops, une erreur dans votre fichier de conf (%s)' % err

if __name__ == "__main__":
    fd = open(ENV.conf+"network.json", "w")
    fd.write(DoScan())
    fd.close()