#!/usr/bin/python2.7

import sys, struct, os
from socket import *

class Ether():
    def __init__(self,dhw,shw, ptype):
        self.shw = shw # ex:
        self.dhw = dhw #'ff:ff:ff:ff:ff:ff'
        self.type = ptype # ex: 0x806
    def __str__(self):
        return (mac2str(self.dhw) + mac2str(self.shw) + struct.pack('!H',self.type))

class Arp_who_has():
    def __init__(self, hw_src, ip_src, hw_dst, ip_dst):
        self.hwdst = mac2str(hw_dst)
        self.hwsrc = mac2str(hw_src)
        self.ipsrc = ip2str(ip_src)
        self.ipdst = ip2str(ip_dst)
        self.hwtype = 0x1 # ARPHRD_ETHER 1 (Ethernet 10Mbps)
        self.ptype = 0x800 # IP
        self.hwlen= 6
        self.plen = 4
        self.op= 1 # ARPOP_REQUEST 1 (ARP request)
    def __str__(self):
        w = struct.pack('!HHBBH', self.hwtype, self.ptype, self.hwlen, self.plen, self.op)
        return w + self.hwsrc + self.ipsrc + self.hwdst + self.ipdst

ETH_BROADCAST = 'ff:ff:ff:ff:ff:ff'
ETH_UNSPECIFIED = '00:00:00:00:00:00'
def getMacAddress(iface):
    for line in os.popen("/sbin/ifconfig "+iface):
        if line.find('Ether') > -1:
            return line.split()[4]

def ip2str(ip):
    return ''.join([chr(int(i)) for i in ip.split('.')])

def mac2str(mac):
    return ''.join([chr(int(i,16)) for i in mac.split(':')])

def str2ip(s):
    return '.'.join([str(ord(i)) for i in s])

def str2mac(s):
    return '%02x:%02x:%02x:%02x:%02x:%02x' % tuple(map(ord,list(s)))

sd = socket(PF_PACKET, SOCK_RAW)
sd.bind(('eth1', 0x806))
HOST = gethostbyname(gethostname())
MAC = getMacAddress('eth1')
ether = str(Ether(ETH_BROADCAST, MAC, 0x806))
arp = str(Arp_who_has(MAC, HOST, ETH_UNSPECIFIED, '192.168.2.148'))
data = ether + arp
sd.send(data)
ans = sd.recv(1024)
rarp = struct.unpack('!HccBBH6s4s6s4s',ans[14:42])
print '%s is at %s' % (str2ip(rarp[7]), str2mac(rarp[6]))


#if len(sys.argv) < 4:
 #   print("Epic Failed\nYou must to precise the network mask and your IP")
  #  sys.exit(1)

#mask = sys.argv[1]
#ip = sys.argv[2]
#life = IsLife()

