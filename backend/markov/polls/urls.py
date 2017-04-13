from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^initialization$', views.Initialization, name='Initialization'),
    url(r'^update_text$', views.UpdateText, name='UpdateText'),
    url(r'^continue$', views.Continue, name='Continue'),
]
