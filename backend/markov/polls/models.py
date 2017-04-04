from __future__ import unicode_literals

from django.db import models

class Story(models.Model):
    story_name = models.CharField(max_length = 50)
    user_name  = models.CharField(max_length = 50)

class Frame(models.Model):
    background_image  = models.CharField(max_length = 50)
    story             = models.ForeignKey(Story)

class Character(models.Model):
    name       = models.CharField(max_length = 50)
    direction  = models.CharField(max_length = 5)
    position   = models.CharField(max_length = 5)
    text       = models.CharField(max_length = 70)
    frame      = models.ForeignKey(Frame)
