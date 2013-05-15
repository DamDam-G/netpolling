from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
                       url('^$', 'netpolling.iw.views.Index'),
                       url(r'^index/$', 'netpolling.iw.views.Index'),
                       url(r'^co/$', 'netpolling.iw.views.Co'),
                       url(r'^manager/$', 'netpolling.iw.views.Manager'),
                       url(r'^control/$', 'netpolling.iw.views.Control'),
                       url(r'^test/$', 'netpolling.iw.views.Scan'),
                       url(r'^ajaxform/(\d{1})/$', 'netpolling.iw.views.AjaxForm'))
