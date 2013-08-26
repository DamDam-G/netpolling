#!/usr/bin/python
# -*- coding: utf-8 -*-
import sqlite3
import sys
import datetime
import conf.netenv as ENV

def PutLog(name, content, type):

    """!
    @author Damien Goldenberg
    @name : PutLog
    @param - name, content, date, type (0-3, info-success-warning-danger)
    @details Description:
    This is gen log
    """
    co = sqlite3.connect(ENV.db)
    try:
        with co:
            cur = co.cursor()
            cur.execute("INSERT INTO iw_log VALUES(?, ?, ?, ?, ?)", (cur.lastrowid, name, content, datetime.datetime.now(), type))
            co.commit()
    except sqlite3.Error, e:
        if co:
            co.rollback()
        print "Error %s:" % e.args[0]
        sys.exit(1)
    finally:
        if co:
            co.close()

if __name__ == "__main__":
    PutLog('tota coucou', 'trolololol qui tue des zobs', 1)
