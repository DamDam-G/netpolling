from models import *
from scan.LocalScan import *

def WriteCron():
    return True

def SaveScan(scan):
    return True

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
        for scan.net in m:
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
