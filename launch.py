import os

path = "/opt/netpolling/"
ip = raw_input("Tappez l'adresse ip du serveur : ")
print """
                   |"|                                      #   ___         _     _       _     _       .      .       _   _
     (((          _|_|_         ()_()          `  ___  '    #  <_*_>      o' \,=./ `o   o' \,=./ `o   .  .:::.        '\\-//`       __MMM__
    (o o)         (o o)         (o o)         -  (O o)  -   #  (o o)         (o o)         (o o)        :(o o):  .     (o o)         (o o)
ooO--(_)--Ooo-ooO--(_)--Ooo-ooO--`o'--Ooo----ooO--(_)--Ooo--8---(_)--Ooo-ooO--(_)--Ooo-ooO--(_)--Ooo-ooO--(_)--Ooo-ooO--(_)--Ooo-ooO--(_)--Ooo-
\n\n"""
print """
.__   __.  _______ .___________.   .______     ______    __       __       __  .__   __.   _______
|  \ |  | |   ____||           |   |   _  \   /  __  \  |  |     |  |     |  | |  \ |  |  /  _____|
|   \|  | |  |__   `---|  |----`   |  |_)  | |  |  |  | |  |     |  |     |  | |   \|  | |  |  __
|  . `  | |   __|      |  |        |   ___/  |  |  |  | |  |     |  |     |  | |  . `  | |  | |_ |
|  |\   | |  |____     |  |        |  |      |  `--'  | |  `----.|  `----.|  | |  |\   | |  |__| |
|__| \__| |_______|    |__|        | _|       \______/  |_______||_______||__| |__| \__|  \______|

\n\n"""
print "\n\nThe Net Polling server run on the http://"+ip+":4242\n\nWhy 4242?\nBecause 42, it's the Big Question of Life, the Universe and Everything"
os.popen("python "+path+"manage.py runserver "+str(ip)+":4242 >> "+path+"netpolling.log")