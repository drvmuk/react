from .state import AGENTS_STEPS
from logs.views import push_log  # This should send the log to your stream

def update_step(title, status, content):
    """
    Update a step in memory and push a log to the stream.
    """
    step = next((s for s in AGENTS_STEPS if s["title"] == title), None)
    if not step:
        return
    step["status"] = status
    step["content"] = content
    push_log(f"[{title}] {content}")  # Stream log to frontend


def run_data_discovery(file_info=None):
    if not file_info:
        file_info = {}

    name = file_info.get("name", "N/A")
    size = file_info.get("size", 0)
    path = file_info.get("path", "")

    push_log(f"[Data Discovery] Started processing {name} at {path} ({size} bytes)")
    # Your actual file processing logic here
    push_log(f"[Data Discovery] Completed processing {name}")


def run_metadata_management():
    update_step("Metadata Management", "running", "Collecting metadata...")
    # ---- Your actual work here ----
    update_step("Metadata Management", "completed", "Metadata management completed!")


def run_schema_evolution():
    update_step("Schema Evolution", "running", "Analyzing schema changes...")
    # ---- Your actual work here ----
    update_step("Schema Evolution", "completed", "Schema evolution completed!")


def run_data_ingestion():
    update_step("Data Ingestion", "running", "Ingesting data...")
    # ---- Your actual work here ----
    update_step("Data Ingestion", "completed", "Data ingestion completed!")


def run_data_quality():
    update_step("Data Quality", "running", "Performing data quality checks...")
    # ---- Your actual work here ----
    update_step("Data Quality", "completed", "Data quality checks completed!")


def run_data_transformation():
    update_step("Data Transformation", "running", "Transforming data...")
    # ---- Your actual work here ----
    update_step("Data Transformation", "completed", "Data transformation completed!")


def run_all_agents():
    """
    Run all steps sequentially.
    """
    run_data_discovery()
    run_metadata_management()
    run_schema_evolution()
    run_data_ingestion()
    run_data_quality()
    run_data_transformation()
