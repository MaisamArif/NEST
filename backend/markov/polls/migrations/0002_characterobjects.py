# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-05 14:53
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CharacterObjects',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('character_id', models.IntegerField()),
                ('name', models.CharField(max_length=50)),
                ('position', models.CharField(max_length=50)),
                ('socialbility', models.FloatField()),
                ('initial_emotion', models.IntegerField()),
                ('personality', models.CharField(max_length=9999)),
                ('impact', models.CharField(max_length=9999)),
                ('closeness', models.CharField(max_length=9999)),
                ('story', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='polls.Story')),
            ],
        ),
    ]
