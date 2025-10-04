from django.urls import path
from .views import list_agents, trigger_data_discovery, metadata_management, schema_evolution, data_ingestion, data_quality, apply_dq_rules, get_or_create_transform_rules, data_transformation, mark_completed, table_ingestion, chat_endpoint, set_decision, poll_decision

urlpatterns = [
    path("", list_agents, name="list_agents"),
    path("data-discovery/", trigger_data_discovery, name="trigger_data_discovery"),
    path("metadata-management/", metadata_management, name="metadata_management"),
    path("schema-evolution/", schema_evolution, name="schema_evolution"),
    path("data-ingestion/", data_ingestion, name="data_ingestion"),
    path("data-quality/", data_quality, name="data_quality"),
    path("apply-dq-rules/", apply_dq_rules, name="apply_dq_rules"),
    path("get-or-create-transform-rules/", get_or_create_transform_rules, name="get_or_create_transform_rules"),
    path("data-transformation/", data_transformation, name="data_transformation"),
    path("mark-completed/", mark_completed, name="mark_completed"),
    path("table-ingestion/", table_ingestion, name="table_ingestion"),
    path("chat/", chat_endpoint, name="chat_endpoint"),
    path("set-decision/", set_decision, name="set_decision"),
    path("poll-decision/", poll_decision, name="poll_decision"),
]