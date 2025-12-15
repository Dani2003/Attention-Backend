from dotenv import load_dotenv
load_dotenv()

import os 
from supabase import create_client


SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")


if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

class AuthService:
    @staticmethod
    
    def signup(email:str, password: str):
        try:
            result = supabase.auth.sign_up({
                "email": email,
                "password": password
            }) 
        
            if result.userr in None and result.session is None:
                return{
                "user": None,
                "session": None,
                "message": "Please check your email to confirm your account."
            }
                
            return result
        except Exception as e:
            print(f"Signup Error: {e}")
            raise e
    
    @staticmethod
    
    def sign_in(email: str, password: str):
        
        try:
            result = supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
        
            return result
        except Exception as e:
            print(f"Sign-in Error: {e}")
            raise e


