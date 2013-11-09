#! /usr/bin/python2.7
# -*- coding:Utf-8 -*-
from scan.scan.Scan import *

class LocalScan(Scan):
    """!
    @author Damien Goldenberg
    @file LocalScan.py
    @name LocalScan
    @brief This class allows to scan a local network
    @version V-2.1
    @copyright GNU GPL V-3
    """

    @staticmethod
    def Scanner(name, mask, interface):
        pass
    def __init__(self, name, mask, interface):
        Scan.__init__(self, name, mask, interface)
        self.GetGW()
        Scan.GetRoute(self)

    def GetIpMac(self):
        """!
        @author Damien Goldenberg
        @name GetIp
        @brief This method scans the network to get addresses ip and mac of all machines up
        @param - self : this is a variable that represents the current object
        @version V-1.0
        @copyright GNU GPL V-3
        """
        n = list()
        cmd = (os.popen("arp-scan -g --interface="+self.interface+" "+self.mask)).readlines()
        #to = cmd.readlines()
        i = 0
        while i < len(cmd):
            if re.match("\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}", cmd[i]):
                    ip = (cmd[i].split("\t"))[0]
                    mac = (cmd[i].split("\t"))[1]
                    n.append({"mac": mac, "ip": ip, "device": self.GetDevice(mac), "os": None, "bw": None, "percent": None, "hostname": self.GetHostName(ip)})
            i += 1
        self.net = n

    def GetHostName(self, ip):
        """!
        @author
        @name GetHostName
        @brief This method try to get the hostname of the machine
        @param - self : this is a variable that represents the current object
        @version V-0.0
        @copyright GNU GPL V-3
        """
        return ((os.popen("dig +short -x "+ip)).read())[:-2]

    def GetGW(self):
        """!
        @author Damien Goldenberg
        @name GetGW
        @brief This method get the gateway of the network
        @param - self : this is a variable that represents the current object
        @version V-0.1
        @copyright GNU GPL V-3
        """
        self.gw = list(set(((os.popen('route -n | grep -e "0\.0\.0\.0 *[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\} *0\.0\.0\.0"')).read()).split(" ")))[2]


if __name__ == "__main__":
    #scan = LocalScan('home', '10.8.96.0/20', 'eth0')
    scan = LocalScan('home', '192.168.0.0/24', 'eth0')
    scan.GetIpMac()
    print scan.GetNetwork(1)
    #print scan.GetOS("10.8.111.153")
    #scan.GetGW()
    #print scan.gw
    #scan.GetRoute()
   # print "gw = "+scan.gw
    #print scan.route