from django.urls import path
from .views import list_agents, trigger_data_discovery

urlpatterns = [
    path("", list_agents, name="list_agents"),
    path("data-discovery/", trigger_data_discovery, name="trigger_data_discovery"),
]
