"""
from transformers import AutoTokenizer, TFBertForMaskedLM
import tensorflow as tf

MODEL_NAME = "bert-base-uncased"

k = 3


tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = TFBertForMaskedLM.from_pretrained(MODEL_NAME)

def predict_masked_text(text: str) -> list[str]:
    
    print(f"[DEBUG] Input: {text}")
    
    if "[MASK]" not in text:
        raise ValueError("Input text must contain a [MASK] token.")
    
    
    inputs = tokenizer(text, return_tensors = "tf")
    print(f"[DEBUG] Tokenized inputs: {inputs}")
    
    mask_token_index = tf.where(inputs["input_ids"] == tokenizer.mask_token_id)[0][1].numpy()
    print(f"[DEBUG] Mask token index: {mask_token_index}")
    
    outputs = model(**inputs)
    mask_logits = outputs.logits[0, mask_token_index]
    top_tokens = tf.math.top_k(mask_logits, k).indices.numpy()
    #top_tokens = tf.math.top_k(mask_logits, top_k).indices.numpy() 
    
    
    #return [text.replace("[MASK]", tokenizer.decode([token]).strip()) for token in top_tokens]
    #return [text.replace("[MASK]", tokenizer.decode([token]).strip()) for token in top_tokens]
    predictions = [text.replace("[MASK]", tokenizer.decode([token]).strip()) for token in top_tokens]
    print(f"[DEBUG] Predictions: {predictions}")

    return predictions
    
"""
from dotenv import load_dotenv
load_dotenv()  # Load environment variables first

import os
import tensorflow as tf
from transformers import AutoTokenizer, TFBertForMaskedLM
import google.generativeai as genai

# Setup Gemini API key (now after load_dotenv)
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Setup BERT model for masked prediction
MODEL_NAME = "bert-base-uncased"  # ✅ FIXED
top_k = 3
tokenizer = None
model = None

def load_bert_model():
    global tokenizer, model
    if tokenizer is None:
        print(f"Loading BERT from {MODEL_NAME}")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        model = TFBertForMaskedLM.from_pretrained(MODEL_NAME)

def predict_masked_text(text: str) -> list[str]:
    load_bert_model()
    if "[MASK]" not in text:
        raise ValueError("Input text must contain a [MASK] token.")
    
    inputs = tokenizer(text, return_tensors="tf")
    mask_token_index = tf.where(inputs["input_ids"] == tokenizer.mask_token_id)[0][1].numpy()
    outputs = model(**inputs)
    mask_logits = outputs.logits[0, mask_token_index]
    top_tokens = tf.math.top_k(mask_logits, top_k).indices.numpy()
    return [text.replace("[MASK]", tokenizer.decode([token]).strip()) for token in top_tokens]

def generate_story(theme: str) -> str:
    print(f"🎯 Received request: theme='{theme}'")
    
    if not theme or not isinstance(theme, str):
        raise ValueError("Theme must be a non-empty string.")
    
    try:
        prompt = f"Write a short {theme} story in 5-7 lines."
        print(f"📥 Theme received: {theme}")
        print(f"📝 Prompt generated: {prompt}")
        
        model = genai.GenerativeModel("gemini-2.0-flash")
        chat = model.start_chat(history=[])
        print("✅ Gemini model loaded")
        
        response = chat.send_message(prompt)
        print(f"✅ Gemini response: {response.text}")
        return response.text.strip()
    except Exception as e:
        print(f"❌ ERROR in generate_story: {e}")
        raise RuntimeError(str(e))
