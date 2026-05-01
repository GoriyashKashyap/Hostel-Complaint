
from backend.core.config import settings

try:
    from supabase import create_client, Client
    supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
except ImportError:
    print("Supabase client library not found. Supabase integration will be disabled.")
    supabase = None
except Exception as e:
    print(f"Supabase client failed to initialize: {e}")
    supabase = None
