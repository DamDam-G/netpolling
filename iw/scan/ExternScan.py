#! /usr/bin/python2.7
# -*- coding:Utf-8 -*-
from scapy.all import *
import os
import re
import json
import Scan

class ExternScan(Scan):
    """!
    @author Damien Goldenberg
    @file ExternScan.py
    @name ExternScan
    @brief This class allows to scan a sub-network or an extern network
    @version V-1.1
    @copyright GNU GPL V-3
    """
    def __init__(self, name, mask, interface):
        #self.GetGW()
        Scan.GetRoute()
        Scan.__init___(self, name, mask, interface)

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

    def GetRoute(self):
        """!
        @author Damien Goldenberg
        @name GetRoute
        @brief This method analyze what is the route take of machines in this network
        @param - self : this is a variable that represents the current object
        @version V-0.1
        @copyright GNU GPL V-3
        """