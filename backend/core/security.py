
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.db.supabase import supabase

security = HTTPBearer()

def get_current_user_claims(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verifies the JWT token and returns the user claims.
    Supabase's `get_user` handles verification.
    """
    token = credentials.credentials
    try:
        user = supabase.auth.get_user(token)
        if not user:
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user.user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
