from dotenv import load_dotenv
load_dotenv()

import os
from supabase import create_client, Client
from datetime import datetime
from typing import List, Dict, Optional
import uuid

# ✅ FIXED: Use environment variable names, not the actual values
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("Missing Supabase credentials in environment variables")

supabase: Client = create_client(supabase_url, supabase_key)

class StoryDatabase:
    @staticmethod
    def save_story(user_id: str, theme: str, story_text: str) -> Dict:
        """Save a generated story to the database"""
        try:
            result = supabase.table("stories").insert({
                "user_id": user_id,
                "theme": theme,
                "story_text": story_text
            }).execute()
            
            if result.data:
                return {
                    "success": True,
                    "story_id": result.data[0]["id"],
                    "message": "Story saved successfully"
                }
            else:
                return {"success": False, "message": "Failed to save story"}
                
        except Exception as e:
            print(f"❌ Database error: {e}")
            return {"success": False, "message": str(e)}
    
    @staticmethod
    def get_user_stories(user_id: str, limit: int = 10) -> List[Dict]:
        """Get all stories for a specific user"""
        try:
            result = supabase.table("stories").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(limit).execute()
            
            return result.data if result.data else []
            
        except Exception as e:
            print(f"❌ Database error: {e}")
            return []
    
    @staticmethod
    def get_story_by_id(story_id: str) -> Optional[Dict]:
        """Get a specific story by ID"""
        try:
            result = supabase.table("stories").select("*").eq("id", story_id).execute()
            
            return result.data[0] if result.data else None
            
        except Exception as e:
            print(f"❌ Database error: {e}")
            return None
    
    @staticmethod
    def delete_story(story_id: str, user_id: str) -> bool:
        """Delete a story (only if it belongs to the user)"""
        try:
            result = supabase.table("stories").delete().eq("id", story_id).eq("user_id", user_id).execute()
            
            return len(result.data) > 0
            
        except Exception as e:
            print(f"❌ Database error: {e}")
            return False