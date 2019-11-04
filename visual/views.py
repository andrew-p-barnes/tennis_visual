from django.shortcuts import render
from .models import Player, Event
from django.http import JsonResponse
from django.core import serializers

# Create your views here.

def select_player(request):
    print("got here")
    request_players = request.GET['lastNames']
    last_names = request_players.split()
    print(last_names)
    events_qs = Event.objects.filter(player__last_name__in=last_names).select_related('player')
    print(events_qs)

    events_list = []

    for event in events_qs:
        events_list.append({
            'name': event.name,
            'year': event.year,
            'ranking_type': event.ranking_type,
            'setting': event.setting,
            'court_surface': event.court_surface,
            'last_name': event.player.last_name
        })

    print(events_list)

    # selected_events_json = serializers.serialize('json', events_list)
    # print(selected_events_json)
    return JsonResponse(events_list, safe=False)

def event_list(request):
    events = Event.objects.all()
    players = Player.objects.all()
    return render(request, 'visual/player_list.html', {'events': events, 'players': players})

def player_list(request):
    print("reached")
    if request.method == 'GET':
        players = Player.objects.all()
        players_json = serializers.serialize('json', players)
        print(players_json)
        return JsonResponse(players_json, safe=False)

def event_charts(request):
    print("reached charts")
    if request.method == 'GET':
        events_qs = Event.objects.all().select_related('player')

        events_list = []

        for event in events_qs:
            events_list.append({
                'name': event.name,
                'year': event.year,
                'ranking_type': event.ranking_type,
                'setting': event.setting,
                'court_surface': event.court_surface,
                'last_name': event.player.last_name
            })

        # events_json = serializers.serialize('json', events)
        # print(events_json)
        return JsonResponse(events_list, safe=False)

def test_list(request):
    return render(request, 'visual/list.html')
