#-*- coding: utf-8 -*-

from django.shortcuts import render, render_to_response
from django.http import HttpResponse
from models import *
import json

def Index(request):
    """
    @author Damien Goldenberg
    @name Index:
    @param - Request, HTTPRequest object
    @details Description:
    This is a view function. It displays the index
    """
    return render(request, 'index.html', {})

def Co(request):
    """
    @author Damien Goldenberg
    @name Co:
    @param - Request, HTTPRequest object
    @details Description:
    This is a view function. It displays the connection form
    """
    return render(request, 'co.html', {})

def Manager(request):
    """
    @author Damien Goldenberg
    @name Manager:
    @param - Request, HTTPRequest object
    @details Description:
    This is a view function. It displays the interface manager
    """
    return render(request, 'manager.html', {})

def Control(request):
    """
    @author Damien Goldenberg
    @name Control:
    @param - Request, HTTPRequest object
    @details Description:
    This is a view function that works with ajax request.
    It displays the interface the content of the manager
    """

    #views = ('scan', 'screen', 'visu', 'log', 'para', 'disconnect')
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
                'data':Log.objects.order_by('-id')
            },
            {
                'view':'para',
                'data':''#Para.objects.all()
            },
            {
                'view':'disconnect',
                'data':''
            }]
    if request.is_ajax():
        if request.POST.get("id"):
            id = int(request.POST.get("id"))
            if id >= 0 and id < len(views):
                return render_to_response(views[id]['view']+'.html', {'data':views[id]['data']})
            else:
                return render_to_response('error.html', {'type':'error, the page doesn\'t exist'})
        return render_to_response('error.html', {'type':'error post'})
    return render_to_response('error.html', {'type':'error ajax'})

def AjaxForm(request, id):
    """
    @author Damien Goldenberg
    @name Manager:
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
                    r = ScanParam.objects.filter(type=t)
                    r.update(ip=1 if request.POST.get("ip") else 0)
                    r.update(mac=1 if request.POST.get("mac") else 0)
                    r.update(os=1 if request.POST.get("os") else 0)
                    r.update(hostname=1 if request.POST.get("name") else 0)
                    param = {'success':1, 'why':'Les paramétres ont bien été enregistré'}
                else:
                    param = {'success':0, 'why':'error : type scan'}
            else:
                param = {'success':0, 'why':'error : type not exist'}
        elif id == 1:
            if request.POST.get("name"):
                r = Screenshot()
                r.name = request.POST.get("name")
                r.path = '/public/img/screenshots/'+request.POST.get("name")+'.png'
                r.save()
                param = {'success':1, 'why':'La carte a bien été enregistré'}
            else:
                param = {'success':0, 'why':'error : map name'}
        elif id == 2:
            param = {'success':1, 'why':'La carte est en cours de chargement<img src="/public/img/loading.gif" />'}
        elif id == 4:
            param = {'success':0, 'why':''}
        else:
            return render_to_response('error.html', {'type':'error post'})
        return HttpResponse(json.dumps(param))
    return render_to_response('error.html', {'type':'error ajax'})