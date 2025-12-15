"""
from fastapi import FastAPI, HTTPException
from app.schemas import MaskRequest, MaskResponse
from app.model import predict_masked_text

app = FastAPI()


@app.get('/')
def root():
    return {"Message":"Word Prediction API is working." }

@app.post("/predict", response_model = MaskResponse)
def predict_mask(mask_req: MaskRequest):
    try:
        #results = predict_masked_words(mask_req.text)
        #return MaskResponse(predictions= results)
        
        results = predict_masked_text(mask_req.text)
        return MaskResponse(predictions=results)
    except ValueError as e:
        print("❌ VALUE ERROR:", e)  # <-- Add this line to log the error
        raise HTTPException(status_code = 400, detail = str(e))
    except Exception as e:
        print("❌ GENERAL ERROR:", e)  # <-- Add this to catch unexpected errors
        raise HTTPException(status_code=500, detail="Internal Server Error")
"""
import os
os.environ["TRANSFORMERS_CACHE"] = "/tmp/huggingface"
os.makedirs("/tmp/huggingface", exist_ok=True)
from fastapi import FastAPI, HTTPException
from app.schemas import MaskRequest, MaskResponse, StoryRequest, StoryResponse, LoginRequest, SignUpRequest
from app.model import predict_masked_text, generate_story
from app.database import StoryDatabase
from app.auth import AuthService
from fastapi import Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()



app = FastAPI()

@app.get('/')
def root():
    return {"Message": "Word Prediction & Story Generator API is working."}


@app.post("/signup")
def signup(data: SignUpRequest):
    try: 
        res = AuthService.signup(data.email, data.password)
        
        if hasattr(res, 'user') and res.user is None:
            return{
                "message": "Please Check your email to confirm your account.",
                "user": None,
                "confirmation_required": True
            }
            
        return {
            "message": "User Created", 
            "user": res.user,
            "session": res.session
            }
    except Exception as e:
        print(f"Signup error: {e}")
        raise HTTPException(status_code = 400, detail = str(e))
    
    
@app.post("/login")
def login(data: LoginRequest):
    try:
        #res= AuthService.sign_in(data.email, data.password)
        res = AuthService.sign_in(data.email, data.password)
        if res.session is None:
            raise HTTPException(
                status_code = 401,
                detail = "Login failed. Please check if your email is confirmed."
            )
            
        return {
            "access_token": res.session.access_token,
            "refresh_token": res.session.refresh_token,
            "user": res.user
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        error_msg = str(e)
        
        if "email not confirmed" in error_msg.lower():
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )
        else:
            raise HTTPException(status_code=401, detail=f"login failed: {error_msg}")
         

@app.post("/predict", response_model=MaskResponse)
def predict_mask(mask_req: MaskRequest):
    try:
        results = predict_masked_text(mask_req.text)
        return MaskResponse(predictions=results)
    except ValueError as e:
        print("❌ VALUE ERROR:", e)
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print("❌ GENERAL ERROR:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/generate", response_model=StoryResponse)
def generate(story_req: StoryRequest):
    try:
        print(f"🎯 Received request: {story_req}")
        result = generate_story(story_req.theme)

        # Save story to Supabase
        db_response = StoryDatabase.save_story(
            user_id=story_req.user_id,
            theme=story_req.theme,
            story_text=result
        )
        print("📦 Supabase Save Result:", db_response)

        # Format response
        story_lines = [line.strip() for line in result.split('\n') if line.strip()]
        return StoryResponse(
            genre=story_req.theme,
            story=story_lines
        )
    except ValueError as e:
        print(f"❌ VALUE ERROR: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"❌ GENERAL ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
    
    
handler = Mangum(app)