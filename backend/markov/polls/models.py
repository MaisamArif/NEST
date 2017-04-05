from __future__ import unicode_literals

from django.db import models

class Story(models.Model):
    story_name = models.CharField(max_length = 50)
    user_name  = models.CharField(max_length = 50)

class CharacterObjects(models.Model):
    story           = models.ForeignKey(Story)
    character_id    = models.IntegerField()
    name            = models.CharField(max_length = 50)
    position        = models.CharField(max_length = 50)
    socialbility    = models.FloatField()
    recent_emotion  = models.IntegerField()
    personality     = models.CharField(max_length = 9999)
    impact          = models.CharField(max_length = 9999)
    closeness       = models.CharField(max_length = 9999)

class Frame(models.Model):
    background_image  = models.CharField(max_length = 50)
    story             = models.ForeignKey(Story)

class Character(models.Model):
    name       = models.CharField(max_length = 50)
    direction  = models.CharField(max_length = 5)
    text       = models.CharField(max_length = 70)
    frame      = models.ForeignKey(Frame)
