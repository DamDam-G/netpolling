#-*- coding: utf-8 -*-
# Create your views here.

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
                #'data':[ScanParam.objects.filter(type=0), ScanParam.objects.filter(type=1)]
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
                #return render_to_response(views[id]['view']+'.html', {'local':views[id]['data'][0], 'extern':views[id]['data'][1]})
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
    param = list()
    #id = int(id)
    if id == 0:
        param.append('')
    elif id == 1:
        param.append('')
    elif id == 2:
        param.append('')
    elif id == 4:
        param.append('')
    else:
        param.append('')
    return HttpResponse(json.dumps(param))
    #return render(request, json.dumps(param), {})