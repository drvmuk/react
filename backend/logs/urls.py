from django.urls import path
from .views import stream_logs

urlpatterns = [
    path("stream/", stream_logs, name="stream_logs"),
]
