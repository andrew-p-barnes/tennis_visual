from django.db import models

class Player(models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    nationality = models.CharField(max_length=20)
    date_of_birth = models.DateField()

class Event(models.Model):
    name = models.CharField(max_length=20, unique_for_year="year")
    year = models.SmallIntegerField()
    ranking_type = models.CharField(max_length=20)
    setting = models.CharField(max_length=20)
    court_surface = models.CharField(max_length=20)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)




