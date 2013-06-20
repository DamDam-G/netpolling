#!/usr/bin/python
# -*- coding: utf-8 -*-

import sqlite3 as lite
import sys
import conf.netenv as ENV

def PutLog(name, content, type):
    try:
        co = lite.connect(ENV.bd+'test.db')
        with co:
            cur = co.cursor()
            cur.execute("INSERT INTO iw_log VALUES('"+name+"','"+content+"', now(), "+type+"")
            co.close()
    except lite.Error, e:
        if co:
            co.rollback()
        print "Error %s:" % e.args[0]
        sys.exit(1)
    finally:
        if co:
            co.close()d 