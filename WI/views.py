#-*- coding: utf-8 -*-

import json
import os
import re
from django.shortcuts import render, render_to_response, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.core import serializers
import ConfigParser
from WI.models import *
from scan import *
import conf.netenv as ENV

def Index(request):
    """!
    @author Damien Goldenberg
    @name Index:
    @param - Request, HTTPRequest object
    @details Description:
    This is a view function. It displays the index
    """
    return render(request, 'index.html', {})

def Visitor(request):
    """!
    @author Damien Goldenberg
    @name Index:
    @param - Request, HTTPRequest object
    @details Description:
    This is a view function. It displays the index
    """
    return render_to_response('map.html', {"data":Param.objects.all()})

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

def Modal(request, id):
    """if request.is_ajax():
        return render(request, 'modal.html', {})
    else:
        return render(request, 'error.html', {type:"The request is not ajax"})"""
    if request.user.is_authenticated():
        views = ("scan", "screen", "visu", "log", "para", "disconnect", "help")
        return render(request, '{0}.html'.format(views[int(id)]), {})

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
    if request.is_ajax() and request.method == "POST":
        id = int(json.loads(request.body)["id"])
        views = ("scan", "screen", "visu", "log", "para", "disconnect", "help")
        modelInput = {"type":"", "name":"", "value":"", "required":"", "pattern":"", "placeholder":""}
        if 0 <= id < len(views):
            if id == 0:
                param = ConfigParser.RawConfigParser()
                param.read(ENV.conf+'netpolling.conf')
                try:
                    r = ScanParam.objects.all()
                    r.update(name=param.get("LocalScan", 'name').replace('"', ''))
                    r.update(netmask=param.get("LocalScan", 'netmask').replace('"', ''))
                    r.update(interface=param.get("LocalScan", 'interface').replace('"', ''))
                    r.update(bw=param.get("Listen", 'bw').replace('"', ''))
                    r.update(time=param.get("Listen", 'time').replace('"', ''))
                    r.update(ilisten=param.get("Listen", 'interface').replace('"', ''))
                except ConfigParser.Error, err:
                    print 'Oops, une erreur dans votre fichier de conf (%s)' % err
            elif id == 4:
                param = ConfigParser.RawConfigParser()
                param.read(ENV.conf+'netpolling.conf')
                try:
                    r = Param.objects.all()
                    r.update(move=param.get("Param", 'move').replace('"', ''))
                    r.update(zomd=param.get("Param", 'zoomd').replace('"', ''))
                    r.update(zoml=param.get("Param", 'zooml').replace('"', ''))
                except ConfigParser.Error, err:
                    print 'Oops, une erreur dans votre fichier de conf (%s)' % err

            if id == 0:
                data = ((ScanParam.objects.all()).values())[0]
                param = [
                            [{"title":"Option de scan"},
                             {"button":"Mettre à jour"}],
                            [{"type":"text", "name":"name", "value":data["name"], "required":"true", "pattern":"^[A-Za-z0-9_]{1,}$", "placeholder":"iti", "label":"Nom du scan"},
                            {"type":"text", "name":"mask", "value":data["netmask"], "required":"true", "pattern":"^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/[0-9]{1,2}$", "placeholder":"10.8.96.0/20", "label":"Masque réseau"},
                            {"type":"text", "name":"interface", "value":data["interface"], "required":"true", "pattern":"^[A-Za-z0-9_]{1,}$", "placeholder":"eth0", "label":"Interface réseau"}],
                            [{"type":"text", "name":"bw", "value":data["bw"], "required":"true", "pattern":"^[0-9]{1,}$", "placeholder":"152365", "label":"Bande passante (mo)"},
                            {"type":"text", "name":"interface", "value":data["ilisten"], "required":"true", "pattern":"^[A-Za-z0-9]{1,}$", "placeholder":"eth1", "label":"Interface d'écoute"},
                            {"type":"number", "name":"ptime", "value":data["time"], "required":"true", "pattern":"^[0-9]{1,}$", "placeholder":"56", "label":"Temps d'écoute"}]]
            elif id == 3:
                data = ((Log.objects.order_by('-id')[:15]).values())[0]
                param = [[{"title":"Option de scan"}], []]
                if len(data) == 0:
                    param[0].append([{"info":"Aucune notification n'est disponible"}])
                else:
                    cls = ["info", "success", "warning", "danger"]
                    for i in data:
                        param[1].append({"type":cls[int(i["type"])], "name":i["name"], "content":i["content"], "date":i["date"]})
            elif id == 4:
                data = ((Param.objects.all()).values())[0]
                param = [[{"title":"Journal"},
                        {"button":"Mettre à jour"}],
                        [{"type":"text", "name":"move", "value":data["move"], "required":"true", "pattern":"^[0-9]{1,},[0-9]{1,}$", "placeholder":"17,00", "label":"Coefficiant de déplacement"},
                        {"type":"text", "name":"dzoom", "value":data["zomd"], "required":"true", "pattern":"^0,[0-9]{1,}$", "placeholder":"0,1", "label":"Coefficiant de zoom sur les équipements"},
                        {"type":"text", "name":"lzoom", "value":data["zoml"], "required":"true", "pattern":"^0,[0-9]{1,}$", "placeholder":"0,25", "label":"Coefficiant de zoom sur les liens"}]]

            elif id == 1 or id == 5 or id == 6:
                param = {}
            else:
                return render_to_response('error.html', {'type':'error, the page doesn\'t exist (id)'})
            #print serializers.serialize('json', data)
            #param = {"data":serializers.serialize('json', data)}
            #return HttpResponse(serializers.serialize('json', data))
            return HttpResponse(json.dumps(param))
            #return render_to_response(views[id]+'.html', {'data':data})
            #else:
             #   return render_to_response('error.html', {'type':'error, the page doesn\'t exist'})
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
                if request.POST.get("type") == "scan":
                    if re.search("^[A-Za-z0-9_]{1,}$", request.POST.get("name"), re.IGNORECASE) and re.search("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/[0-9]{1,2}$", request.POST.get("mask"), re.IGNORECASE) and re.search("^[A-Za-z0-9]{1,}$", request.POST.get("interface"), re.IGNORECASE):
                        r = ScanParam.objects.all()
                        r.update(name=request.POST.get("name"))
                        r.update(netmask=request.POST.get("mask"))
                        r.update(interface=request.POST.get("interface"))
                        config = ConfigParser.RawConfigParser()
                        config.read(r''+ENV.conf+'netpolling.conf')
                        try:
                            config.set("LocalScan", 'name', r'"'+request.POST.get("name")+'"')
                            config.set("LocalScan", 'netmask', r'"'+request.POST.get("mask")+'"')
                            config.set("LocalScan", 'interface', r'"'+request.POST.get("interface")+'"')
                            with open(r''+ENV.conf+'netpolling.conf', 'wb') as configfile:
                                config.write(configfile)
                        except ConfigParser.Error, err:
                            print 'Oops, une erreur dans votre fichier de conf (%s)' % err
                        param = {'success':1, 'why':'Les paramétres ont bien été enregistré'}
                    else:
                        param = {'success':0, 'why':'error : format data incorrect'}
                elif request.POST.get("type") == "listen":
                    if re.search("^[A-Za-z0-9_]{2,}$", str(request.POST.get("interface"))) \
                        and re.search("^[0-9]{1,}$", str(request.POST.get("bw"))) \
                        and re.search("^[0-9]{1,}$", str(request.POST.get("ptime"))):
                        r = ScanParam.objects.all()
                        r.update(bw=request.POST.get("bw"))
                        r.update(time=request.POST.get("ptime"))
                        r.update(ilisten=request.POST.get("interface"))
                        config = ConfigParser.RawConfigParser()
                        config.read(r''+ENV.conf+'netpolling.conf')
                        try:
                            config.set("Listen", 'time', int(request.POST.get("ptime")))
                            config.set("Listen", 'bw', int(request.POST.get("bw")))
                            config.set("Listen", 'interface', r'"'+request.POST.get("interface")+'"')
                            with open(r''+ENV.conf+'netpolling.conf', 'wb') as configfile:
                                config.write(configfile)
                        except ConfigParser.Error, err:
                            print 'Oops, une erreur dans votre fichier de conf (%s)' % err
                        param = {'success':1, 'why':'Les paramétres ont bien été enregistré'}
                    else:
                        param = {'success':0, 'why':'error : format data incorrect'}
                else:
                    param = {'success':0, 'why':'error : type not exist'}
            else:
                param = {'success':0, 'why':'error : where is type?'}
        elif id == 1:
            if request.POST.get("name"):
                if re.search("^[A-Za-z0-9_]{1,}$", request.POST.get("name"), re.IGNORECASE):
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
            else:
                param = {'success':0, 'why':'error : format data incorrect'}
        elif id == 4:
            if request.POST.get("move") and request.POST.get("dzoom") and request.POST.get("lzoom"):
                if re.search("^[0-9]{1,},[0-9]{1,}$", request.POST.get("move"), re.IGNORECASE) and re.search("^0,[0-9]{1,}$", request.POST.get("dzoom"), re.IGNORECASE) and re.search("^0,[0-9]{1,}$", request.POST.get("lzoom"), re.IGNORECASE):
                    r = Param.objects.all()
                    r.update(move=request.POST.get("move").replace(",", "."))
                    r.update(zomd=request.POST.get("dzoom").replace(",", "."))
                    r.update(zoml=request.POST.get("lzoom").replace(",", "."))
                    config = ConfigParser.RawConfigParser()
                    config.read(r''+ENV.conf+'netpolling.conf')
                    try:
                        config.set("Param", 'move', float(request.POST.get("move").replace(",", ".")))
                        config.set("Param", 'zoomd', float(request.POST.get("dzoom").replace(",", ".")))
                        config.set("Param", 'zooml', float(request.POST.get("lzoom").replace(",", ".")))
                        with open(r''+ENV.conf+'netpolling.conf', 'wb') as configfile:
                            config.write(configfile)
                    except ConfigParser.Error, err:
                        print 'Oops, une erreur dans votre fichier de conf (%s)' % err
                    param = {'success':1, 'why':'Les paramétres ont bien été enregistré'}
                else:
                    param = {'success':0, 'why':'error : format data incorrect'}
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
    if request.is_ajax():
        fd = open(ENV.conf+"network.json", "r")
        network = fd.read()
        fd.close()
        return HttpResponse(network)
    return render_to_response('error.html', {'type':'error ajax'})

def GetOS(request):
    """!
    @author Damien Goldenberg
    @name GetOS:
    @param - Request, HTTPRequest object
    @details Description:
    This is function determine the os
    """
    if request.is_ajax():
        if request.POST.get("ip") and re.search("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$", request.POST.get("ip"), re.IGNORECASE):
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
        if request.POST.get("name") and re.search("^[A-Za-z0-9_]{1,}$", request.POST.get("name"), re.IGNORECASE):
            r = Screenshot.objects.get(name=request.POST.get("name"))
            fd = open(ENV.screen+r.name+".json", "r")
            network = fd.read()
            fd.close()
            return HttpResponse(network)
        else:
            return HttpResponse("42, The Big Question of Life, the Universe and Everything.<br /> <div class=\"alert alert-error\">[ERROR] : hum hum ...  I think you must contact your admin system ;)</div>")
    else:
            return HttpResponse("42, The Big Question of Life, the Universe and Everything.<br /> <div class=\"alert alert-error\">[ERROR] : it's not a request ajax ... Are you stupid?</div>")

def DeleteMap(request):
    """!
    @author Damien Goldenberg
    @name GetMap:
    @param - Request, HTTPRequest object
    @details Description:
    This is function is for the viewer part (for seeing old maps)
    """
    if request.is_ajax():
        if request.POST.get("name") and re.search("^[A-Za-z0-9_]{1,}$", request.POST.get("name"), re.IGNORECASE):
            r = Screenshot.objects.get(name=request.POST.get("name"))
            os.popen("rm -rf "+ENV.screen+r.name+".json")
            r.delete()
            return HttpResponse("")
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
        if request.POST.get("name") and request.POST.get("ip") and request.POST.get("time") and re.search("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$", request.POST.get("ip"), re.IGNORECASE) and re.search("^[0-9]{1,}$", request.POST.get("time"), re.IGNORECASE) and re.search("^[A-Za-z0-9_]{1,}$", request.POST.get("name"), re.IGNORECASE):
            os.popen("timeout "+str(request.POST.get("time"))+"s tcpdump -i eth0 host "+request.POST.get("ip")+" -w "+ENV.listen+request.POST.get("name")+"-"+request.POST.get("ip")+".pcap")
            return HttpResponse(json.dumps({"success":1, "rep":"<div class=\"alert alert-success\"><a class='btn btn-info' href='/public/listen/"+request.POST.get("name")+"-"+request.POST.get("ip")+".pcap'>DL</a></div>"}))
        else:
            return HttpResponse(json.dumps({"success":0, "rep":"42, The Big Question of Life, the Universe and Everything.<br /> <div class=\"alert alert-error\">[ERROR] : hum hum ...  I think you must contact your admin system ;)</div>"}))
    else:
        return HttpResponse(json.dumps({"success":0, "rep":"42, The Big Question of Life, the Universe and Everything.<br /> <div class=\"alert alert-error\">[ERROR] : it's not a request ajax ... Are you stupid?</div>"}))

def GetParam(request):
    if request.is_ajax():
        param = ConfigParser.RawConfigParser()
        param.read(ENV.conf+'netpolling.conf')
        return HttpResponse(json.dumps({"success":"1", "why":"Data are loaded with successfull", "obj":{"move":param.get("Param", "move"), "zoomd":param.get("Param", "zoomd"), "zooml":param.get("Param", "zooml")}}))
    else:
        return HttpResponse(json.dumps({"success":"0", "why":"The request is not ajax"}))