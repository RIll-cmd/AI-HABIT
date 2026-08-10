from fastapi import APIRouter, HTTPException, Response, Depends
from pydantic import BaseModel
import re
import uuid
from db import db
from db_utils import ensure_character_exists
from auth_utils import create_access_token, get_current_user
from services.decay_service import process_midnight_decay

router = APIRouter(prefix="/api/auth", tags=["auth"])

class AuthInput(BaseModel):
    username: str

@router.post("/register")
async def register(data: AuthInput, response: Response):
    username = data.username.strip()
    
    if not re.match(r"^[a-zA-Z0-9_]+$", username) or len(username) < 3 or len(username) > 20:
        raise HTTPException(status_code=400, detail="Invalid username format. Must be 3-20 alphanumeric characters or underscores.")
    
    all_users = await db.user.find_many()
    for u in all_users:
        if u.username.lower() == username.lower():
            raise HTTPException(status_code=400, detail=f"Username '{username}' is already taken. Please choose another username.")
    
    new_user_id = f"user-{str(uuid.uuid4())[:8]}"
    user = await db.user.create(data={"id": new_user_id, "username": username, "password": ""})
    
    character_id = f"char-{user.id}"
    character = await ensure_character_exists(character_id, user.id, username)
    
    token = create_access_token(data={"sub": user.id, "username": user.username})
    response.set_cookie(key="ascend_session", value=token, httponly=True, samesite="lax", max_age=86400 * 7)
    
    return {"message": "Registration successful", "username": username, "characterId": character.id}


@router.post("/login")
async def login(data: AuthInput, response: Response):
    username = data.username.strip()
    
    all_users = await db.user.find_many()
    user = next((u for u in all_users if u.username.lower() == username.lower()), None)
    
    if not user:
        raise HTTPException(status_code=404, detail=f"Account '{username}' not found. Please check your username or create an account.")
    
    character = await db.character.find_first(where={"userId": user.id})
    character_id = character.id if character else f"char-{user.id}"
    
    if not character:
        await ensure_character_exists(character_id, user.id, user.username)
        
    token = create_access_token(data={"sub": user.id, "username": user.username})
    response.set_cookie(key="ascend_session", value=token, httponly=True, samesite="lax", max_age=86400 * 7)
    
    return {"message": "Login successful", "username": user.username, "characterId": character_id}


@router.post("/guest")
async def guest_login(response: Response):
    guest_id = f"Guest_{str(uuid.uuid4())[:4]}"
    
    new_user_id = f"user-{guest_id}"
    user = await db.user.create(data={"id": new_user_id, "username": guest_id, "password": ""})
    
    character_id = f"char-{user.id}"
    character = await ensure_character_exists(character_id, user.id, guest_id)
    
    token = create_access_token(data={"sub": user.id, "username": user.username})
    response.set_cookie(key="ascend_session", value=token, httponly=True, samesite="lax", max_age=86400 * 7)
    
    return {"message": "Guest login successful", "username": guest_id, "characterId": character.id}

class AccountDeleteInput(BaseModel):
    username: str

@router.delete("/account")
async def delete_account(data: AccountDeleteInput):
    username = data.username.strip()
    
    all_users = await db.user.find_many()
    user = next((u for u in all_users if u.username.lower() == username.lower()), None)
    
    if not user:
        raise HTTPException(status_code=404, detail="Account not found.")
        
    await db.user.delete(where={"id": user.id})
    return {"message": "Account successfully deleted."}

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("ascend_session")
    return {"message": "Successfully logged out"}

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    user = await db.user.find_unique(where={"id": current_user["id"]}, include={"character": True})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prisma Python returns a list for one-to-one sometimes depending on config, but usually an object.
    # We handle both just in case.
    character = user.character[0] if isinstance(user.character, list) and len(user.character) > 0 else user.character
    
    if character:
        await process_midnight_decay(db, character.id)
        # Refetch character to get updated fields like streakFreezes
        user = await db.user.find_unique(where={"id": current_user["id"]}, include={"character": True})
        character = user.character[0] if isinstance(user.character, list) and len(user.character) > 0 else user.character
    
    return {
        "user": {
            "id": user.id,
            "username": user.username
        },
        "character": character.model_dump() if character else None
    }
