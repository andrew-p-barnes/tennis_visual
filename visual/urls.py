from django.urls import path
from visual import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.player_list, name='player_list'),
    path('select_player', views.select_player, name='select_player'),
    path('event', views.event_charts, name='event_charts'),
    path('update_view', views.render_update_view, name='render_update_view'),
    path('add_event', views.event_creator, name='event_creator'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)