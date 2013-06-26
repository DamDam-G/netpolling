#-*- coding: utf-8 -*-

import json
import os
from django.shortcuts import render, render_to_response, redirect
from django.http import HttpResponse
from models import *
from scanner import *
import ConfigParser
import conf.netenv as ENV
from scapy.all import *
from django.contrib.auth import authenticate, login, logout

def Index(request):
    """!
    @author Damien Goldenberg
    @name Index:
    @param - Request, HTTPRequest object
    @details Description:
    This is a view function. It displays the index
    """
    return render(request, 'index.html', {})

def Co(request):
    """!
    @author Damien Goldenberg
    @name Co:
    @param - Request, HTTPRequest object
    @details Description:
    This is a view function. It displays the connection form
    """
    return render(request, 'co.html', {})

def FCo(request):
    """!
    @author Damien Goldenberg
    @name FCo:
    @param - Request, HTTPRequest object
    @details Description:
    This is function determine if the user can connect or not
    """
    username = request.POST.get("pseudo")
    password = request.POST.get("pwd")
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return redirect('/manager/')
    else:
        return render(request, 'index.html', {"cls": "error", "why":"Login / Mot de passe incorrect."})

def Disconnect(request):
    """!
    @author Damien Goldenberg
    @name Disconnect:
    @param - Request, HTTPRequest object
    @details Description:
    This is function logout the user
    """
    logout(request)
    return render(request, 'index.html', {"cls": "info", "why":"Vous venez d'être déconnecté."})

def Manager(request):
    """!
    @author Damien Goldenberg
    @name Manager:
    @param - Request, HTTPRequest object
    @details Description:
    This is a view function. It displays the interface manager
    """
    if request.user.is_authenticated():
        return render(request, 'manager.html', {})
    else:
        return redirect('/index/', {"cls": "error", "why":"Vous devez être connecté."})

def Manager2(request):
    """!
    @author Damien Goldenberg
    @name Manager2:
    @param - Request, HTTPRequest object
    @details Description:
    This is a view function. It displays the interface manager
    """
    if request.user.is_authenticated():
        return render(request, 'manager2.html', {"cls": "error", "why":"Vous devez être connecté."})
    else:
        return redirect('/index/', {})

def Visu(request):
    """!
    @author Damien Goldenberg
    @name Visu:
    @param - Request, HTTPRequest object
    @details Description:
    This is a view function. It displays the interface manager
    """
    if request.user.is_authenticated():
        return render(request, 'visu.html', {'data':Screenshot.objects.all()})
    else:
        return redirect('/index/', {"cls": "error", "why":"Vous devez être connecté."})

def Control(request):
    """!
    @author Damien Goldenberg
    @name Control:
    @param - Request, HTTPRequest object
    @details Description:
    This is a view function that works with ajax request.
    It displays the interface the content of the manager
    """

    #views = ('scan', 'screen', 'visu', 'log', 'para', 'disconnect')
    if request.is_ajax():
        if request.POST.get("id"):
            id = int(request.POST.get("id"))
            if id == 0:
                param = ConfigParser.RawConfigParser()
                param.read(ENV.conf+'netpolling.conf')
                try:
                    name = ["LocalScan", "ExternScan"]
                    i = 0
                    while i < len(name):
                        r = ScanParam.objects.filter(type=i)
                        r.update(name=param.get(name[i], 'name').replace('"', ''))
                        r.update(netmask=param.get(name[i], 'netmask').replace('"', ''))
                        r.update(interface=param.get(name[i], 'interface').replace('"', ''))
                        r.update(device=int(param.get(name[i], 'device')))
                        r.update(os=int(param.get(name[i], 'os')))
                        r.update(hostname=int(param.get(name[i], 'hostname')))
                        i += 1
                except ConfigParser.Error, err:
                    print 'Oops, une erreur dans votre fichier de conf (%s)' % err
            elif id == 3:
                file = (os.popen("cat "+ENV.conf+"log")).readlines()
                os.popen("echo '' > "+ENV.conf+"log")
                #os.popen("rm -rf > "+ENV.conf+"log; touch "+ENV.conf+"log")
                i = 0
                while i < len(file):
                    if len(file) > 1:
                        l = file[i].split(" ")
                        r = Log()
                        r.name = l[0].replace("_", " ")
                        r.content = l[1].replace("_", " ")
                        r.date = l[2]
                        r.type = l[3]
                        r.save()
                    i += 1
            elif id == 4:
                param = ConfigParser.RawConfigParser()
                param.read(ENV.conf+'netpolling.conf')
                try:
                    r = Param.objects.all()
                    r.update(interface=param.get("Listen", 'interface').replace('"', ''))
                    r.update(time=param.get("Listen", 'time').replace('"', ''))
                except ConfigParser.Error, err:
                    print 'Oops, une erreur dans votre fichier de conf (%s)' % err
            views = [
                        {
                            'view':'scan',
                            'data':ScanParam.objects.all()
                        },
                        {
                            'view':'screen',
                            'data':''
                        },
                        {
                            'view':'visu',
                            'data':Screenshot.objects.all()
                        },
                        {
                            'view':'log',
                            'data':Log.objects.order_by('-id')[:15]
                        },
                        {
                            'view':'para',
                            'data':Param.objects.all()
                        },
                        {
                            'view':'disconnect',
                            'data':''
                        },
                        {
                            'view':'help',
                            'data':''
                        }]

            if id >= 0 and id < len(views):
                return render_to_response(views[id]['view']+'.html', {'data':views[id]['data']})
            else:
                return render_to_response('error.html', {'type':'error, the page doesn\'t exist'})
        return render_to_response('error.html', {'type':'error post'})
    return render_to_response('error.html', {'type':'error ajax'})

def AjaxForm(request, id):
    """!
    @author Damien Goldenberg
    @name AjaxForm:
    @param - Request, HTTPRequest object
    @details Description:
    This is function. Choice the good model and return an answer
    """

    if request.is_ajax():
        id = int(id)
        if id == 0:
            if request.POST.get("type"):
                if request.POST.get("type") == "local" or request.POST.get("type") == "extern":
                    t = 0 if request.POST.get("type") == "local" else 1
                    device=1 if request.POST.get("device") else 0
                    os=1 if request.POST.get("os") else 0
                    hostname=1 if request.POST.get("hostname") else 0
                    r = ScanParam.objects.filter(type=t)
                    r.update(name=request.POST.get("name"))
                    r.update(netmask=request.POST.get("mask"))
                    r.update(interface=request.POST.get("interface"))
                    r.update(device=device)
                    r.update(os=os)
                    r.update(hostname=hostname)
                    config = ConfigParser.RawConfigParser()
                    config.read(r''+ENV.conf+'netpolling.conf')
                    section = ["LocalScan", "ExternScan"]
                    try:
                        config.set(section[t], 'name', r'"'+request.POST.get("name")+'"')
                        config.set(section[t], 'netmask', r'"'+request.POST.get("mask")+'"')
                        config.set(section[t], 'interface', r'"'+request.POST.get("interface")+'"')
                        config.set(section[t], 'device', device)
                        config.set(section[t], 'os', os)
                        config.set(section[t], 'hostname', hostname)
                        with open(r''+ENV.conf+'netpolling.conf', 'wb') as configfile:
                            config.write(configfile)
                    except ConfigParser.Error, err:
                        print 'Oops, une erreur dans votre fichier de conf (%s)' % err
                    param = {'success':1, 'why':'Les paramétres ont bien été enregistré'}
                else:
                    param = {'success':0, 'why':'error : type scan'}
            else:
                param = {'success':0, 'why':'error : type not exist'}
        elif id == 1:
            if request.POST.get("name"):
                r = Screenshot()
                r.name = request.POST.get("name")
                r.path = '/public/screenshots/'+request.POST.get("name")+'.json'
                r.save()
                fd = open(ENV.screen+request.POST.get("name")+".json", "w")
                fd.write(request.POST.get("net"))
                fd.close()
                param = {'success':1, 'why':'La carte a bien été enregistré'}
            else:
                param = {'success':0, 'why':'error : map name'}
        elif id == 4:
            if request.POST.get("pinterface") and request.POST.get("ptime"):
                r = Param.objects.all()
                r.update(interface=request.POST.get("pinterface"))
                r.update(time=request.POST.get("ptime"))
                config = ConfigParser.RawConfigParser()
                config.read(r''+ENV.conf+'netpolling.conf')
                try:
                    config.set("Listen", 'interface', r'"'+request.POST.get("pinterface")+'"')
                    config.set("Listen", 'time', r''+request.POST.get("ptime"))
                    with open(r''+ENV.conf+'netpolling.conf', 'wb') as configfile:
                        config.write(configfile)
                    param = {'success':1, 'why':'Les paramétres ont bien été enregistré'}
                except ConfigParser.Error, err:
                    print 'Oops, une erreur dans votre fichier de conf (%s)' % err
                    param = {'success':1, 'why':'Fichier introuvable, veuillez contacter votre admin système ;) '}
            else:
                param = {'success':0, 'why':'error : Informations manquantes'}
        else:
            return render_to_response('error.html', {'type':'error post'})
        return HttpResponse(json.dumps(param))
    return render_to_response('error.html', {'type':'error ajax'})

def GetJson(request):
    """!
    @author Damien Goldenberg
    @name GetJson:
    @param - Request, HTTPRequest object
    @details Description:
    This is function give the json data about scan network
    """
    fd = open(ENV.conf+"network.json", "r")
    network = fd.read()
    fd.close()
    return HttpResponse(network)

def GetOS(request):
    """!
    @author Damien Goldenberg
    @name GetOS:
    @param - Request, HTTPRequest object
    @details Description:
    This is function determine the os
    """
    if request.is_ajax():
        if request.POST.get("ip"):
            return HttpResponse(json.dumps({"success":0, "rep":((os.popen("nmap -O "+request.POST.get("ip"))).read()).replace('\n', '<br />')}))
        else:
            return HttpResponse(json.dumps({"success":0, "rep":"42, The Big Question of Life, the Universe and Everything.<br /> <div class=\"alert alert-error\">[ERROR] : problem about @ip</div>"}))
    else:
            return HttpResponse(json.dumps({"success":0, "rep":"42, The Big Question of Life, the Universe and Everything.<br /> <div class=\"alert alert-error\">[ERROR] : it's not a request ajax ... Are you stupid?</div>"}))


def GetMap(request):
    """!
    @author Damien Goldenberg
    @name GetMap:
    @param - Request, HTTPRequest object
    @details Description:
    This is function is for the viewer part (for seeing old maps)
    """
    if request.is_ajax():
        if request.POST.get("name"):
            r = Screenshot.objects.get(name=request.POST.get("name"))
            fd = open(ENV.screen+r.name+".json", "r")
            network = fd.read()
            fd.close()
            return HttpResponse(network)
        else:
            return HttpResponse("42, The Big Question of Life, the Universe and Everything.<br /> <div class=\"alert alert-error\">[ERROR] : hum hum ...  I think you must contact your admin system ;)</div>")
    else:
            return HttpResponse("42, The Big Question of Life, the Universe and Everything.<br /> <div class=\"alert alert-error\">[ERROR] : it's not a request ajax ... Are you stupid?</div>")

def Sniff(request):
    """!
    @author Damien Goldenberg
    @name FCo:
    @param - Request, HTTPRequest object
    @details Description:
    This is function sniff a machine
    """
    if request.is_ajax():
        if request.POST.get("name") and request.POST.get("ip") and request.POST.get("time"):
            os.popen("timeout "+str(request.POST.get("time"))+"s tcpdump -i eth0 host "+request.POST.get("ip")+" -w "+ENV.listen+request.POST.get("name")+"-"+request.POST.get("ip")+".pcap")
            #a = sniff(filter="host "+str(request.POST.get("ip"))+"", count=1000000, timeout=int(request.POST.get("time")))
            #wrpcap(ENV.listen+request.POST.get("name")+"-"+request.POST.get("ip")+".pcap", a)
            #wrpcap("toto.pcap", a)
            return HttpResponse(json.dumps({"success":1, "rep":"<div class=\"alert alert-success\"><a class='btn btn-info' href='/public/listen/"+request.POST.get("name")+"-"+request.POST.get("ip")+".pcap'>DL</a></div>"}))
            #return HttpResponse("<div class=\"alert alert-success\">L'écoute a été terminé avec succès</div><a class='btn btn-info' href='/public/listen/"+request.POST.get("name")+"-"+request.POST.get("ip")+".pcap'>DL</a>")
        else:
            return HttpResponse(json.dumps({"success":0, "rep":"42, The Big Question of Life, the Universe and Everything.<br /> <div class=\"alert alert-error\">[ERROR] : hum hum ...  I think you must contact your admin system ;)</div>"}))
    else:
<<<<<<< HEAD
        param.append('')
    return HttpResponse(json.dumps(param))
=======
            return HttpResponse(json.dumps({"success":0, "rep":"42, The Big Question of Life, the Universe and Everything.<br /> <div class=\"alert alert-error\">[ERROR] : it's not a request ajax ... Are you stupid?</div>"}))
>>>>>>> integration
