from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
                       url('^$', 'netpolling.iw.views.Index'),
                       url(r'^index/$', 'netpolling.iw.views.Index'),
                       url(r'^co/$', 'netpolling.iw.views.Co'),
                       url(r'^manager/$', 'netpolling.iw.views.Manager'),
                       url(r'^manager2/$', 'netpolling.iw.views.Manager2'),
                       url(r'^control/$', 'netpolling.iw.views.Control'),
                       url(r'^getjson/$', 'netpolling.iw.views.GetJson'),
                       url(r'^os/$', 'netpolling.iw.views.GetOS'),
                       url(r'^visu/$', 'netpolling.iw.views.Visu'),
                       url(r'^screenshot/$', 'netpolling.iw.views.GetMap'),
                       url(r'^delete/$', 'netpolling.iw.views.DeleteMap'),
                       url(r'^sniff/$', 'netpolling.iw.views.Sniff'),
                       url(r'^connect/$', 'netpolling.iw.views.FCo'),
                       url(r'^disconnect/$', 'netpolling.iw.views.Disconnect'),
                       url(r'^visitor/$', 'netpolling.iw.views.Visitor'),
                       url(r'^ajaxform/(\d{1})/$', 'netpolling.iw.views.AjaxForm'))
