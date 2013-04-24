#! /usr/bin/python2.7
# -*- coding:Utf-8 -*-
from scapy.all import *
#from scapy.modules.nmap import *
"""
@package docstring
This file contain the class : LocalScan
"""

class LocalScan:
    """
    LocalScan :
    @param - net : this variable contain the pattern of the network (ex : 192.168.0.* or 10.8.12.* for netmask /24)
    @param - name : this variable contain the name for identify the scan in the database
    """
    def __init__(self, name, net):
        self.net = net
        self.name = name

    def GetIpAndMac(self):
        """
        GetIpAndMac :
        @details This method scans the network to get adresses ip and mac of all machines
        """
        ans, unans = arping(self.net, timeout=120)
        l = list()

        for elem in ans:
            l.append({"mac": elem[1].src, "ip": elem[1].psrc, "device": None, "os": None, "hostname": None, "route": None})
        return l

    def GetDevice(self):
        """
        GetDevice :
        """
        return

    def GetOS(self, ip):
        """
        GetOS :
        """
        #load_module("nmap")
        #conf.nmap_base
        #ans, unans = nmap_fp(ip)
        #traitement de la réponse pour en resortir un os
        os = ''
        return os

    def GetHostName(self):
        """
        GetHostName :
        """
        # utiliser nslookup /host à test (il faut un servuer dns voir ce que ça donne à l'école
        return

    def GetRoute(self):
        """
        GetRoute :
        """
        return

if __name__ == "__main__":
    scan = LocalScan('home', "10.8.96.1/20")
    #scan = LocalScan('home', '192.168.0.*')
    l = scan.GetIpAndMac()
    #for elem in l:
     #   elem.os = scan.GetOS(elem.ip)
    print l