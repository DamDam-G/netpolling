#!/usr/bin/python
# -*- coding: utf-8 -*-

import sqlite3 as lite
import sys
import conf.netenv as ENV

def PutLog(name, content, type):
    co = lite.connect(ENV.db+'netpolling.sql')
    try:
        with co:
            cur = co.cursor()
            print 'toto'
            cur.execute("INSERT INTO \"netpolling\".\"iw_log\" VALUES('', '"+name+"','"+content+"', '', "+str(type)+")")
            co.commit()
    except lite.Error, e:
        if co:
            co.rollback()
        print "Error %s:" % e.args[0]
        sys.exit(1)
    finally:
        if co:
            co.close()

if __name__ == "__main__":
    PutLog('toto', 'trolololol', 1)