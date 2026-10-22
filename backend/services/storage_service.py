
import os

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise ValueError(
        "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured"
    )

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
)

BUCKET_NAME = "resumes"


def upload_file(file_path: str, file_bytes: bytes, content_type: str) -> str:
    """
    Upload resume bytes to Supabase Storage.

    Returns the stored object path.
    """
    supabase.storage.from_(BUCKET_NAME).upload(
        path=file_path,
        file=file_bytes,
        file_options={
            "content-type": content_type,
            "upsert": "false",
        },
    )

    return file_path


def delete_resume(file_path: str) -> None:
    """Delete a resume object from Supabase Storage."""
    supabase.storage.from_(BUCKET_NAME).remove([file_path])
