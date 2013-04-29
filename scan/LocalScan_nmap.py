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
    def __init__(self, name, net, interface):
        self.net = net
        self.name = name
        self.interface = interface


    def GetIpMac(self):
        """
        GetIp :
        @details This method scans the network to get adresses ip of all machines
        """
        n = list()
        conf = os.popen("ifconfig "+self.interface)
        conf = conf.readlines()
        myconf = {'ip':((conf[1].split(":"))[1].split(" "))[0], 'mac': ((conf[0].split("HWaddr"))[1].split(" "))[1]}
        cmd = os.popen("nmap -sP "+self.net)
        to = cmd.readlines()
        i = 0
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
        return n

    def GetIp(self):
        """
        GetIp :
        @details This method scans the network to get adresses ip of all machines
        """
        n = list()
        cmd = os.popen("nmap -sP "+self.net)
        for elem in cmd:
            if re.match("Nmap scan report for \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}", elem):
                ip = elem.split(" ")
                n.append({"mac": None, "ip": ip[4].replace('\n', ''), "device": None, "os": None, "hostname": None, "route": None})
        return n

    def GetMac(self, ip):
        cmd = os.popen("arping -c 1 " +ip)
        for elem in cmd:
            #\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}
            if re.match("Unicast reply from "+ip+" \[[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}\]", elem):
                mac = elem.split(" ")
                break
        return mac[4].replace(']', '').replace('[', '')

    def GetDevice(self):
        """
        GetDevice :
        """
        return

    def GetOS(self, ip):
        """
        GetOS :
        """
        cmd = os.popen("nmap -o os.log -O "+ip)
        rep = open("/home/damien/netpolling/netpolling/scan/os.log", "r")
        tmp = rep.read()
        print tmp
        system = ''
        return system

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
    #scan = LocalScan('home', "10.8.96.1/20")
    scan = LocalScan('home', '192.168.0.*', 'eth0')
    #l = scan.GetIp()
    #print l
    #print scan.GetMac(l[0]["ip"])
    #print scan.GetIpMac()
    print scan.GetOS("192.168.0.")