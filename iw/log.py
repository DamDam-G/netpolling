#!/usr/bin/python
# -*- coding: utf-8 -*-

import conf.netenv as ENV
def PutLog(name, content, date, type):
    fd = open("/opt/netpolling/iw/conf/log", "a")
    content = content.replace(' ','_')
    name = name.replace(' ','_')
    list = [name, content, date, str(type)]
    line = ' '.join(list) + "\n"
    fd.write(line)
    fd.close()
#    co = lite.connect("/opt/netpolling/netpolling.sql")
#    try:
#        with co:
#            cur = co.cursor()
#            print 'toto'
#            cur.execute("INSERT INTO \"netpolling\".\"iw_log\" VALUES('', '"+name+"','"+content+"', '', "+str(type)+")")
#            co.commit()
#    except lite.Error, e:
#        if co:
#            co.rollback()
#        print "Error %s:" % e.args[0]
#        sys.exit(1)
#    finally:
#        if co:
#            co.close()

if __name__ == "__main__":
    PutLog('tota coucou', 'trolololol qui tue des zobs', '01/12/64', 1)
