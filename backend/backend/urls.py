from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("logs/", include("logs.urls")),   # logs app
    path("api/agents/", include("agents.urls")), # agents app
]
