#-*- coding: utf-8 -*-
# Create your views here.

from django.shortcuts import render

def index(request):
    return render(request, 'index.html', {})

def co(request):
    return  render(request, 'co.html', {})
