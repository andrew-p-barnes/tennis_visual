from django.shortcuts import render
from .models import Player, Event
from django.http import JsonResponse
from django.core import serializers
import requests
from bs4 import BeautifulSoup
import re

# Create your views here.

def select_player(request):
    print("got here")
    request_players = request.GET['lastNames']
    last_names = request_players.split()
    print(last_names)
    request_ranking_types = request.GET['rankingTypes']
    ranking_types = request_ranking_types.split()
    print(ranking_types)
    events_qs = Event.objects.filter(player__last_name__in=last_names).filter(ranking_type__in=ranking_types).select_related('player')
    print(events_qs)

    events_list = []

    for event in events_qs:
        events_list.append({
            'name': event.name,
            'year': event.year,
            'ranking_type': event.ranking_type,
            'setting': event.setting,
            'court_surface': event.court_surface,
            'last_name': event.player.last_name,
            'date_of_birth': event.player.date_of_birth
        })

    print(events_list)

    players_qs = Player.objects.filter(last_name__in=last_names)

    players_list = []

    for player in players_qs:
        players_list.append({
            'first_name': player.first_name,
            'last_name': player.last_name,
            'nationality': player.nationality,
            'date_of_birth': player.date_of_birth
        })

    requested_data = {
        "events": events_list,
        "players": players_list
    }

    # selected_events_json = serializers.serialize('json', events_list)
    # print(selected_events_json)
    return JsonResponse(requested_data)

def event_list(request):
    players = Player.objects.all()
    # events = Event.objects.all()
    return render(request, 'visual/player_list.html', {'players': players})

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
                'last_name': event.player.last_name,
                'date_of_birth': event.player.date_of_birth
            })

        players_qs = Player.objects.all()

        players_list = []

        for player in players_qs:
            players_list.append({
                'first_name': player.first_name,
                'last_name': player.last_name,
                'nationality': player.nationality,
                'date_of_birth': player.date_of_birth
            })

        requested_data = {
            "events": events_list,
            "players": players_list
        }

        # events_json = serializers.serialize('json', events)
        # print(events_json)
        return JsonResponse(requested_data)

def test_list(request):
    return render(request, 'visual/list.html')

def render_update_view(request):
    players = Player.objects.all()
    return render(request, 'visual/update_page.html', {'players': players})

def event_creator(request):
    if request.method == 'GET':
        request_player = request.GET['playerName']
        first_name = request_player.split()[0]
        last_name = request_player.split()[1]
        player_id = Player.objects.get(last_name=last_name, first_name=first_name)

        player_url_dict = {
            "Nadal": "https://www.atptour.com/en/players/rafael-nadal/n409/titles-and-finals",
            "Federer": "https://www.atptour.com/en/players/roger-federer/f324/titles-and-finals",
            "Djokovic": "https://www.atptour.com/en/players/novak-djokovic/d643/titles-and-finals",
            "Murray": "https://www.atptour.com/en/players/andy-murray/mc10/titles-and-finals",
            "del_Potro": "https://www.atptour.com/en/players/juan-martin-del-potro/d683/titles-and-finals",
            "Wawrinka": "https://www.atptour.com/en/players/stan-wawrinka/w367/titles-and-finals",
            "Cilic": "https://www.atptour.com/en/players/marin-cilic/c977/titles-and-finals"
        }

        player_url = player_url_dict[last_name]
        page = requests.get(player_url)

        soup = BeautifulSoup(page.content, 'html.parser')
        string = soup.get_text()
        first_index = string.find("Career Titles")
        sliced = string[0:first_index]
        string = string.replace(sliced, "")
        first_index = string.find("Tournaments")
        sliced = string[0:first_index]
        string = string.replace(sliced, "")
        first_index = string.find("Year")
        sliced = string[first_index:]
        string = string.replace(sliced, "")

        year_nums = []
        match = re.findall(r'[0-9]{4}', string)
        for m in match:
            if m != "1000":
                year_nums.append(m)

        wins_per_year = re.findall(r'\b\d{1}\b|\b\d{2}\b', string)

        replace_dict = {
            "Tournaments": "",
            ")": "-",
            "(": "-",
            "\r": "",
            "\t": "",
            "\n": "",
            "London / Queen's Club": "Queen's Club",
            "1000": "thousand_marker"
        }

        for key in replace_dict:
            string = string.replace(key, replace_dict[key])

        for num in year_nums:
            if num in string:
                string = string.replace(num, "")

        for num in wins_per_year:
            if int(num) != 1:
                if num in string:
                    string = string.replace(num, "")

        if "1" in wins_per_year:
            string = string.replace("1", "")

        string = string.replace("thousand_marker", "1000")

        string_list = string.split("-")

        year_list = []
        i = 0
        for wins in wins_per_year:
            j = 0
            while j < int(wins):
                year_list.append(year_nums[i])
                j += 1
            i += 1

        event_list = []
        setting_list = []
        surface_list = []

        for str in string_list:
            if "/" in str:
                slash_index = str.find("/")
                setting_list.append(str[0:slash_index])
                surface_list.append(str[slash_index+1:])
            elif str == "":
                pass
            else:
                event_list.append(str.strip())

        slam_list = ["Australian Open", "US Open", "Wimbledon", "Roland Garros"]
        new_events_list = []

        for i in range(len(event_list)):
            if Event.objects.filter(name=event_list[i]).filter(year=year_list[i]).exists():
                print(event_list[i])
                break
            else:
                if event_list[i] in slam_list:
                    ranking_type = "Slam"
                else:
                    ranking_type = "Regular"
                new_event = Event(name=event_list[i], year=year_list[i], ranking_type=ranking_type, setting=setting_list[i],
                                  court_surface=surface_list[i], player=player_id)
                new_event.save()
                new_events_list.append({
                    'name': event_list[i],
                    'year': year_list[i],
                    'ranking_type': ranking_type,
                    'setting': setting_list[i],
                    'court_surface': surface_list[i],
                    'last_name': last_name
                })

        updated_data = {
            "events": new_events_list
        }

        print(new_events_list)
        return JsonResponse(updated_data)