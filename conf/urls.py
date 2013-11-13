from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
                       url('^$', 'WI.views.Index'),
                       url(r'^index/$', 'WI.views.Index'),
                       url(r'^co/$', 'WI.views.Co'),
                       url(r'^manager/$', 'WI.views.Manager'),
                       url(r'^modal/(\d{1,})/$', 'WI.views.Modal'),
                       url(r'^control/$', 'WI.views.Control'),
                       url(r'^getjson/$', 'WI.views.GetJson'),
                       url(r'^param/$', 'WI.views.GetParam'),
                       url(r'^os/$', 'WI.views.GetOS'),
                       url(r'^visu/$', 'WI.views.Visu'),
                       url(r'^screenshot/$', 'WI.views.GetMap'),
                       url(r'^delete/$', 'WI.views.DeleteMap'),
                       url(r'^sniff/$', 'WI.views.Sniff'),
                       url(r'^connect/$', 'WI.views.FCo'),
                       url(r'^disconnect/$', 'WI.views.Disconnect'),
                       url(r'^visitor/$', 'WI.views.Visitor'),
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^ajaxform/(\d{1})/$', 'WI.views.AjaxForm'))
