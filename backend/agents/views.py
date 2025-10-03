from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import os
from .state import AGENTS_STEPS
from logs.views import push_log
import time


# In-memory execution mode
EXECUTION_MODE = {"mode": None}

def list_agents(request):
    return JsonResponse(AGENTS_STEPS, safe=False)

# @api_view(["POST"])
# def set_mode(request):
#     """Set Human or Autonomous mode"""
#     mode = request.data.get("mode")
#     if mode not in ["human", "autonomous"]:
#         return Response({"error": "Invalid mode"}, status=status.HTTP_400_BAD_REQUEST)
#     EXECUTION_MODE["mode"] = mode
#     return Response({"mode": mode})

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