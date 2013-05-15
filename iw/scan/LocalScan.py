#! /usr/bin/python2.7
# -*- coding:Utf-8 -*-
from scapy.all import *
import os
import re

class LocalScan:
    """!
    @author Damien Goldenberg
    @file LocalScan.py
    @name LocalScan
    @brief This class allows to scan a local network
    @param - net : this variable contain a list with some dictionary who represent machines up (contain ip, mac, hostname, os)
    @param - name : this variable contain the name for identify the scan in the database
    @param - mask : this variable contain the pattern of the network (ex : 192.168.0.0/24 or 10.8.96.0/20)
    @param - interface : this variable contain the network interface on the app works
    @param - gw : this variable contain the gateway of the network
    @param - route : this variable the path to go to the gateway
    @version V-2.0
    @copyright GNU GPL V-3
    """
    def __init__(self, name, mask, interface):
        """!
        @author Damien Goldenberg
        @name __init__
        @fn __init__(self, name, mask, interface)
        @brief This function initializes the object
        @param - self : this is a variable that represents the current object
        @param - name : this variable contain the name for identify the scan in the database
        @param - mask : this variable contain the pattern of the network (ex : 192.168.0.0/24 or 10.8.96.0/20)
        @param - interface : this variable contain the network interface on the app works
        @version V-0.4
        @copyright GNU GPL V-3
        """
        self.net = []
        self.name = name
        self.interface = interface
        self.mask = mask
        self.gw = ''
        self.route = []
        self.GetGW()
        self.GetRoute()

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
        conf = (os.popen("ifconfig "+self.interface)).readlines()
        #conf = conf.readlines()
        myconf = {'ip':((conf[1].split(":"))[1].split(" "))[0], 'mac': ((conf[0].split("HWaddr"))[1].split(" "))[1]}
        cmd = (os.popen("nmap -sP "+self.mask)).readlines()
        #to = cmd.readlines()
        i = 0
        while i < len(cmd):
            if re.match("Nmap scan report for \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}", cmd[i]):
                if re.match((cmd[i].split(" "))[4].replace("\n", ""), myconf["ip"]):
                    n.append({"mac": myconf["mac"], "ip": myconf["ip"], "device": None, "os": None, "hostname": None})
                else:
                    ip = (cmd[i].split(" "))[4].replace("\n", " ")
                    i += 2
                    if re.match("MAC Address: [A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}", cmd[i]):
                        mac = (cmd[i].split(" "))[2]
                    else:
                        mac = None
                    n.append({"mac": mac, "ip": ip, "device": None, "os": None, "hostname": None})
            i += 1
        self.net = n

    def GetDevice(self):
        """!
        @author
        @name GetDevice
        @brief This method to get the device of a machine
        @param - self : this is a variable that represents the current object
        @version V-0.0
        @copyright GNU GPL V-3
        """
        return

    def GetOS(self, ip):
        """!
        @author Damien Goldenberg
        @name GetOS
        @brief This method scans a machine to get the os
        @param[in] - self : this is a variable that represents the current object
        @param[in] - ip : this is variable represents the address ip of the machine that would like to scan
        @param[out] - system : this variable contain the type of os (windows, linux, mac)
        @version V-0.1
        @copyright GNU GPL V-3
        """
        #nmap -sV --version-all
        cmd = (os.popen("nmap -O "+ip)).readlines()
        #to = cmd.readlines()
        i = 0
        system = "Unknown"
        while i < len(cmd):
            if re.search(".*Linux.*", cmd[i], re.IGNORECASE):
                system = "Linux"
                break
            if re.search(".*Windows.*", cmd[i], re.IGNORECASE):
                system = "Windows"
                break
            if re.search(".*Mac.*", cmd[i], re.IGNORECASE):
                system = "Mac"
                break
            i += 1

        return system

    def GetHostName(self):
        """!
        @author
        @name GetHostName
        @brief This method try to get the hostname of the machine
        @param - self : this is a variable that represents the current object
        @version V-0.0
        @copyright GNU GPL V-3
        """

        return

    def GetGW(self):
        """!
        @author Damien Goldenberg
        @name GetGW
        @brief This method get the gateway of the network
        @param - self : this is a variable that represents the current object
        @version V-0.1
        @copyright GNU GPL V-3
        """
        cmd = os.popen("route | grep default")
        cmd = cmd.read()
        self.gw = list(set(cmd.split(' ')))[3]

    def GetRoute(self):
        """!
        @author Damien Goldenberg
        @name GetRoute
        @brief This method analyze what is the route take of machines in this network
        @param - self : this is a variable that represents the current object
        @version V-0.1
        @copyright GNU GPL V-3
        """
        t = traceroute("8.8.8.8")
        i = 0
        path = list()
        print "gw = "+self.gw
        while i < len(t):
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
    scan.GetIpMac()
    print scan.net
    #print scan.GetOS("10.8.111.153")
    #scan.GetGW()
    #print scan.gw
    #scan.GetRoute()
   # print "gw = "+scan.gw
    #print scan.route