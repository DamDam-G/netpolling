#! /usr/bin/python
from scapy.all import *
import os
import time
import sys
import json

def GetBps(tmstmp) :
    (os.popen("tshark -i eth0 -z conv,ip -a duration:{0} > traffic".format(tmstmp)))
    time.sleep(float(tmstmp))
    #time.sleep(int(tmstmp))
    bwk = {}
    fd = open("traffic","r")
    for ligne in fd:
        if " <-> " in ligne:
            ip1 = ligne[0:15].rstrip()
            ip2 = ligne[25:41].rstrip()
            octet = ligne[90:100]
            bps = float(octet)/float(tmstmp)
            if "10.8." in ligne[0:6]:
                if ip1 in bwk:
                    bwk[ip1] += bps
                else:
                    bwk[ip1] = bps
            elif "10.8." in ligne[23:30]:
                if ip2 in bwk:
                    bwk[ip2] += bps
                else:
                    bwk[ip2] = bps
            else:
                print "Joe la praline"
    fd.close()
    return bwk
#test = GetBps(sys.argv[1])
#print test
