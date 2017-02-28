from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^json_shit$', views.json_shit, name='json_shit'),
]
