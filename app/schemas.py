# This file defines the Pydantic models for request and response schemas.
# It includes a request schema for masking text and a response schema for predictions.
# Pydantic is used for data validation and serialization.
"""from pydantic import BaseModel

class MaskRequest(BaseModel):
    text: str 
    
class MaskResponse(BaseModel):
    predictions: list[str]
    
"""
    
from pydantic import BaseModel
from typing import List


class MaskRequest(BaseModel):
    text: str
    
class MaskResponse(BaseModel):
    predictions: List[str]


class StoryRequest(BaseModel):
    theme: str
    user_id: str     
    
class StoryResponse(BaseModel):
    genre: str
    story: List[str]
    
class SignUpRequest(BaseModel):
    email: str
    password: str
class LoginRequest(BaseModel):
    
    email: str
    password: str
    
    
    