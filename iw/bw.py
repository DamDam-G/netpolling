#! /usr/bin/python
from scapy.all import *
import os
import time
import sys
import json
def GetBps(tmstmp) :
	scan = (os.popen("tshark -i eth0 -z conv,ip -a duration:{0} > traffic".format(tmstmp))) 
	time.sleep(tmstmp)
	bwk = {}
	fichier = open("traffic","r")
	for ligne in fichier:
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
#		print bwk
	return bwk
	fichier.close()
#vidage = (os.popen(">bandwidth.json"))
#fichier = open("bw.json","w")
#bwip = list()
#for ligne in bwk:
#        ipm = ligne.rstrip()
#	bwi = float(15728640)
#	mega = float(bwk[ligne])/float(1024)
#	bwa = (float(bwk[ligne])/bwi)*100.0
#	bwip.append({"ip":ipm, "pourcent":bwa, "mega":mega})
#	print ipm,"    ",bwa,"    ",bwk[ligne]
#print bwk
#fichier.write(json.dumps(bwip))
#fichier.close()
