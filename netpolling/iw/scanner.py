#! /usr/bin/python
from scan.LocalScan import *
import Queue
import threading
import os
import conf.netenv as ENV
import ConfigParser
import time
import log

exitFlag = 0

class myThread (threading.Thread):
    def __init__(self, threadID, name, q, t):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.name = name
        self.q = q
        self.type = t
        self.result = []

    def run(self):
        print "Starting " + self.name
        self.result = process_data(self.name, self.q, self.type)
        print "Exiting " + self.name

def process_data(threadName, q, t):
    while not exitFlag:
        queueLock.acquire()
        if not workQueue.empty():
            data = q.get()
            queueLock.release()
            #print "%s processing %s" % (threadName, data)
            r = GetBW() if t == 0 else scan.GetIpMac()
        else:
            queueLock.release()
        time.sleep(1)
    return r

def WriteCron():
    """!
    @author Damien Goldenberg
    @name WriteCron
    @brief This function write a crontab
    @version V-0.1
    @copyright GNU GPL V-3
    """
    os.popen(ENV.scripts+"cron.pl")


def GetBW():
    """!
    @author Alexis Boulanger
    @name GetBw
    @brief This function listen the network on specify interface
    @version V-0.1
    @copyright GNU GPL V-3
    """
    param = ConfigParser.RawConfigParser()
    param.read(ENV.conf+'netpolling.conf')
    interface = param.get("Listen", "interface")
    duration = param.get("Listen", "time")
    (os.popen("tshark -i {0} -z conv,ip -a duration:{1} > {2}traffic".format(interface, duration, ENV.conf)))
    time.sleep(float(duration))
    bwk = {}
    fd = open(ENV.conf+"traffic", "r")
    for line in fd:
        if " <-> " in line:
            ip1 = line[0:15].rstrip()
            ip2 = line[25:41].rstrip()
            octet = line[90:100]
            bps = float(octet)/float(duration)
            if "10.8" in line[0:6]:
                if ip1 in bwk:
                    bwk[ip1] += bps
                else:
                    bwk[ip1] = bps
            elif "10.8" in line[23:30]:
                if ip2 in bwk:
                    bwk[ip2] += bps
                else:
                    bwk[ip2] = bps
	    else:
               	print "Joe la praline" 
    fd.close()
    return bwk


def DoScan():
    """!
    @author Damien Goldenberg
    @name DoScan
    @brief This function execute the scan on the network
    @param - t : this is an int variable that represents the type of scan, 0 it's local 1 it's for subnetwork or external network
    @version V-0.1
    @copyright GNU GPL V-3
    """
    param = ConfigParser.RawConfigParser()
    param.read(ENV.conf+'netpolling.conf')
    try:
        name = param.get('LocalScan', 'name')
        netmask = param.get('LocalScan', 'netmask')
        interface = param.get('LocalScan', 'interface')
        up = int(param.get('LocalScan', 'up'))
        n = list()
        if up == 1:
            scan = LocalScan(name, netmask, interface)
            threadList = ["bandwidth", "scan"]
            nameList = ["bw", "arp"]
            queueLock = threading.Lock()
            workQueue = Queue.Queue(10)
            threads = []
            threadID = 1
            i = 0

            # Create new threads
            for tName in threadList:
                thread = myThread(threadID, tName, workQueue, i)
                thread.start()
                threads.append(thread)
                threadID += 1
                i += 1

            # Fill the queue
            queueLock.acquire()
            for word in nameList:
                workQueue.put(word)
            queueLock.release()

            # Wait for queue to empty
            while not workQueue.empty():
                pass

            # Notify threads it's time to exit
            exitFlag = 1

            # Wait for all threads to complete
            for t in threads:
                t.join()
            print "Exiting Main Thread"
            bwp = threads[0].result
            for m in scan.net:
                for line in bwp:
                    if line == m["ip"]:
                        percent = (float(bwp[line])/float(15728640))*800.0
                        kilo = float(bwp[line])/float(1024)
                        m["bw"] = kilo
                        m["percent"] = percent
                        ip = m["ip"]
                        if percent > 70.0:
                            print ip
                            print (log.PutLog("Bandwidth overused", "ip", time.strftime('%H %M %D'), 3))
            return scan.GetNetwork(1)
        else:
            return {'error':'veuillez patientez le scan est en cours de fonctionnement'}
    except ConfigParser.Error, err:
        print 'Oops, une erreur dans votre fichier de conf (%s)' % err

if __name__ == "__main__":
    r = DoScan()
    fd = open(ENV.conf+"network.json", "w")
    fd.write(r)
    fd.close()
