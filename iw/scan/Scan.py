#! /usr/bin/python2.7
# -*- coding:Utf-8 -*-
from scapy.all import *
import os
import re
import json

class Scan:
    """!
    @author Damien Goldenberg
    @file lScan.py
    @name Scan
    @brief This class is the mother class scan
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
        #self.GetRoute()

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

    def GetNetwork(self, opt):
        """!
        @author Damien Goldenberg
        @name GetNetwork
        @brief This method analyze what is the route take of machines in this network
        @param - self : this is a variable that represents the current object
        @param - opt : this is a variable that represents the form of the return
        @version V-0.1
        @copyright GNU GPL V-3
        """
        n = {'gw':self.gw, 'route':self.route, 'net':self.net}
        if opt == 0:
            return n
        elif opt == 1:
            return json.dumps(n)
        else:
            print "[ERROR] GetNetwork(self, opt) : opt must equal 0 (dict) or 1 (json)"