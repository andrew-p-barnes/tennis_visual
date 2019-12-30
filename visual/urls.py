from django.urls import path
from visual import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.event_list, name='event_list'),
    path('select_player', views.select_player, name='select_player'),
    path('player', views.player_list, name='player_list'),
    path('event', views.event_charts, name='event_charts'),
    path('list', views.test_list, name='test_list'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)