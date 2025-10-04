from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import os
from .state import AGENTS_STEPS
from logs.views import push_log
import time
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
import json

# In-memory execution mode
EXECUTION_MODE = {"mode": None}
# simple in-memory decision store for demo only (not for prod)
DECISIONS = {}  # step -> "proceed" | "cancel" | None

def list_agents(request):
    return JsonResponse(AGENTS_STEPS, safe=False)

@api_view(["POST"])
def trigger_data_discovery(request):
    uploaded_file = request.FILES.get("file")
    file_path = request.data.get("file_path")  # optional metadata from React

    if not uploaded_file:
        return Response(
            {"error": "No file uploaded."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # At this point, uploaded_file is an InMemoryUploadedFile or TemporaryUploadedFile
        # You can stream it directly to Fabric, Spark, or any other backend
        # Example: read the bytes in memory
        file_content = uploaded_file.read()  # bytes
        # print(file_content)

        # Trigger your Data Discovery or streaming process here
        # Example placeholder:
        # stream_to_fabric(file_content, file_path)

        step = next(s for s in AGENTS_STEPS if s["title"] == "Data Discovery")
        step["status"] = "running"
        step["content"] = f"File '{uploaded_file.name}' received, size: {uploaded_file.size} bytes | Data discovery started!"
        push_log(f"[{step['title']}] {step['content']}")

        time.sleep(10)
        # Optionally, update your step
        step = next(s for s in AGENTS_STEPS if s["title"] == "Data Discovery")
        step["status"] = "completed"
        step["content"] = f"File '{uploaded_file.name}' received, size: {uploaded_file.size} bytes | Data discovery completed!"
        push_log(f"[{step['title']}] {step['content']}")

        return Response({
            "message": "Data discovery completed",
            "file_name": uploaded_file.name,
            "file_size": uploaded_file.size,
            "file_path": file_path
        })

    except Exception as e:
        import traceback
        return Response({
            "error": str(e),
            "trace": traceback.format_exc()
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
def metadata_management(request):
    # mock processing time
    time.sleep(0.5)
    return JsonResponse({"status": "ok", "message": "Metadata management done"})


@csrf_exempt
def schema_evolution(request):
    # mock: randomly indicate drift - for demo we'll signal drift true
    # In real: run drift detection and return details
    return JsonResponse({
        "status": "ok",
        "schema_drift": True,
        "schema_preview": {"new_columns": ["col_x"], "changed_types": {"col_a": "string->int"}}
    })


@csrf_exempt
def data_ingestion(request):
    time.sleep(0.2)
    return JsonResponse({"status": "ok", "message": "Data ingestion completed"})


@csrf_exempt
def data_quality(request):
    # return profiling and DQ rules table
    profiling = {"row_count": 1000, "null_percent": {"col_a": 0.1}}
    dq_rules = [
        {"id": 1, "rule": "col_a IS NOT NULL"},
        {"id": 2, "rule": "col_b >= 0"}
    ]
    # store default dq_rules server-side if you want to allow edits
    return JsonResponse({"status": "ok", "profiling": profiling, "dq_rules": dq_rules})


@csrf_exempt
def apply_dq_rules(request):
    # In real: apply the rules to source table and return results
    return JsonResponse({"status": "ok", "result_preview": {"passed": 980, "failed": 20}})


@csrf_exempt
def get_or_create_transform_rules(request):
    # return rules_present = False to trigger human review demo
    return JsonResponse({"status": "ok", "rules_present": False, "rules_preview": {"steps": ["trim whitespace", "coerce types"]}})


@csrf_exempt
def data_transformation(request):
    # run transform job; return status
    time.sleep(0.5)
    return JsonResponse({"status": "ok", "message": "Transformation complete"})


@csrf_exempt
def mark_completed(request):
    return JsonResponse({"status": "ok", "message": "Pipeline completed"})


@csrf_exempt
def table_ingestion(request):
    if request.method != "POST":
        return HttpResponseBadRequest("POST only")
    body = json.loads(request.body.decode())
    table = body.get("table")
    return JsonResponse({"status": "ok", "message": f"Table {table} ingested (mock)"})


# Chat endpoint that integrates with your LLM/back-end chat system.
@csrf_exempt
def chat_endpoint(request):
    # body: { message: "...", step: "...", lastMessages: [...] }
    data = json.loads(request.body.decode())
    message = data.get("message")
    step = data.get("step")
    # For demo: echo back and present actions for user
    reply = f"(LLM/mock) Received for step={step}: {message}"
    # Return possible actions meta: for human-in-loop steps we will instruct user to send decision via a separate endpoint.
    meta = {"actions": ["Proceed", "Cancel Process"], "step": step}
    return JsonResponse({"reply": reply, "meta": meta})


# Simple endpoint where frontend can set the user's decision (simulate user pressing "Proceed" or "Cancel Process" in chat).
@csrf_exempt
def set_decision(request):
    if request.method != "POST":
        return HttpResponseBadRequest("POST only")
    data = json.loads(request.body.decode())
    step = data.get("step")
    decision = data.get("decision")  # "proceed" or "cancel"
    if step not in ("schema-evolution", "data-quality", "transformation"):
        return HttpResponseBadRequest("Invalid step")
    DECISIONS[step] = decision
    return JsonResponse({"status": "ok", "step": step, "decision": decision})


def poll_decision(request):
    step = request.GET.get("step")
    return JsonResponse({"decision": DECISIONS.get(step)})  # may be null


