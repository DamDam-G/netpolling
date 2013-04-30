#! /usr/bin/python2.7
# -*- coding:Utf-8 -*-
from scapy.all import *
import os
import re
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
    def __init__(self, name, mask, interface):
        self.net = []
        self.name = name
        self.interface = interface
        self.mask = mask
        self.gw = self.GetGW()
        self.route = []
        self.GetRoute()

    def GetIpMac(self):
        """
        GetIp :
        @details This method scans the network to get adresses ip of all machines
        """
        n = list()
        conf = os.popen("ifconfig "+self.interface)
        conf = conf.readlines()
        myconf = {'ip':((conf[1].split(":"))[1].split(" "))[0], 'mac': ((conf[0].split("HWaddr"))[1].split(" "))[1]}
        cmd = os.popen("nmap -sP "+self.mask)
        to = cmd.readlines()
        i = 0
        print to
        while i < len(to):
            if re.match("Nmap scan report for \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}", to[i]):
                if re.match((to[i].split(" "))[4].replace("\n", ""), myconf["ip"]):
                    n.append({"mac": myconf["mac"], "ip": myconf["ip"], "device": None, "os": None, "hostname": None, "route": None})
                else:
                    ip = (to[i].split(" "))[4].replace("\n", " ")
                    i += 2
                    if re.match("MAC Address: [A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}", to[i]):
                        mac = (to[i].split(" "))[2]
                    else:
                        mac = None
                    n.append({"mac": mac, "ip": ip, "device": None, "os": None, "hostname": None, "route": None})
            i += 1
        self.net = n

    def GetDevice(self):
        """
        GetDevice :
        """
        return

    def GetOS(self, ip):
        """
        GetOS :
        """
        cmd = os.popen("nmap -O "+ip)
        to = cmd.readlines()
        i = 0
        system = "Unknown"
        while i < len(to):
            if re.search(".*Linux.*", to[i], re.IGNORECASE):
                system = "Linux"
                break
            if re.search(".*Windows.*", to[i], re.IGNORECASE):
                system = "Windows"
                break
            if re.search(".*Mac.*", to[i], re.IGNORECASE):
                system = "Mac"
                break
            i += 1

        return system

    def GetHostName(self):
        """
        GetHostName :
        """
        # utiliser nslookup /host à test (il faut un servuer dns voir ce que ça donne à l'école
        return

    def GetGW(self):
        cmd = os.popen("route | grep default")
        cmd = cmd.read()
        self.gw = list(set(cmd.split(' ')))[3]

    def GetRoute(self):
        """
        GetRoute :
        """
        t = traceroute("8.8.8.8")
        i = 0
        path = list()
        while i < len(t):
            print t[0][i][1].src
            self.route.append(t[0][i][1].src)
            if t[0][i][1].src == self.gw:
                break
            i += 1

if __name__ == "__main__":
    scan = LocalScan('home', '10.8.96.0/20', 'eth0')
    #scan = LocalScan('home', '192.168.0.*', 'eth0')
    #l = scan.GetIp()
    #print l
    #print scan.GetMac(l[0]["ip"])
    #scan.GetIpMac()
    #print scan.net
    #print scan.GetOS("10.8.111.153")
    #scan.GetGW()
    #print scan.gw
    #scan.GetRoute()
    print scan.route