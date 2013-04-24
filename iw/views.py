#-*- coding: utf-8 -*-
# Create your views here.

from django.shortcuts import render, render_to_response
from django.http import HttpResponse

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
<<<<<<< HEAD
    views = ('scan', 'visu', 'log', 'option', 'disconnect')
=======
    views = ('scan', 'screen', 'visu', 'log', 'para', 'disconnect')
>>>>>>> e3d4af8635b046511e963aaf4a7a849dd3b76128
    if request.is_ajax():
        if request.POST.get("id"):
            id = int(request.POST.get("id"))
            if id >= 0 and id < len(views):
                view = views[id]+".html"
            else:
                return render_to_response('error.html', {'type':'error, the page doesn\'t exist'})
            return render_to_response(view, {})
        return render_to_response('error.html', {'type':'error post'})
    return render_to_response('error.html', {'type':'error ajax'})