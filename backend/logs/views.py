import time
from django.http import StreamingHttpResponse

# simple global buffer for logs
log_buffer = []

def push_log(message: str):
    """Generic function to push logs from anywhere in the project."""
    log_buffer.append(message)

def stream_logs(request):
    """SSE endpoint that streams logs continuously."""
    def event_stream():
        while True:
            if log_buffer:
                message = log_buffer.pop(0)
                yield f"data: {message}\n\n"
            time.sleep(1)
    return StreamingHttpResponse(event_stream(), content_type="text/event-stream")
