# FastAPI Chatbot for Paytm Project
# Enhanced with Gemini AI Integration!

import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
import asyncio
from ai_model import gemini_understand_intent, gemini_generate_response

# Load environment variables
load_dotenv()

# Create FastAPI app (like creating an Express app in Node.js)
app = FastAPI(title="Paytm AI Chatbot", description="Intelligent chatbot with Gemini AI")

# Allow your frontend to talk to this API (like CORS in Express)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This is like defining req.body structure in Express
class ChatRequest(BaseModel):
    message: str          # What user is asking
    user_token: str       # User's JWT token for authentication

class ChatResponse(BaseModel):
    response: str         # Chatbot's reply
    action_taken: str     # What the bot did
    intent_detected: dict = None  # What AI understood (for debugging)

# Main chat endpoint - Enhanced with Gemini AI!
@app.post("/chat", response_model=ChatResponse)
async def chat_with_bot(request: ChatRequest):
    """
    Enhanced AI-powered chat endpoint!
    Now uses Gemini to understand natural language
    """
    try:
        print(f"🧠 Analyzing user message: '{request.message}'")
        
        # STEP 1: Use Gemini AI to understand user intent
        intent = await gemini_understand_intent(request.message)
        print(f"🎯 AI detected intent: {intent}")
        
        # STEP 2: Take action based on AI understanding
        if intent["action"] == "get_user_details":
            print("📞 Calling backend API for user details...")
            
            # STEP 3: Get data from your Node.js backend
            user_details = await get_user_details_from_backend(request.user_token)
            print(f"📋 Retrieved user data: {user_details}")
            
            # STEP 4: Use Gemini to generate natural response
            print("🤖 Generating natural response with AI...")
            response = await gemini_generate_response(user_details, request.message, intent)
            print(f"💬 AI generated response: {response}")
            
            return ChatResponse(
                response=response,
                action_taken="fetched_user_details_with_ai",
                intent_detected=intent
            )
        
        elif intent["action"] == "get_spending_report":
            print("💸 Calling backend API for expense data...")
            
            # STEP 3: Get expense data with date filters
            expense_data = await get_expenses_from_backend(request.user_token, intent.get("extracted_info", {}))
            print(f"📊 Retrieved expense data: {expense_data}")
            
            # STEP 4: Generate natural expense response
            print("🤖 Generating expense report response...")
            response = await gemini_generate_response(expense_data, request.message, intent)
            print(f"💬 AI generated response: {response}")
            
            return ChatResponse(
                response=response,
                action_taken="generated_expense_report",
                intent_detected=intent
            )
        
        elif intent["action"] == "get_income_report":
            print("💰 Calling backend API for income data...")
            
            # STEP 3: Get income data with date filters
            income_data = await get_income_from_backend(request.user_token, intent.get("extracted_info", {}))
            print(f"📈 Retrieved income data: {income_data}")
            
            # STEP 4: Generate natural income response
            print("🤖 Generating income report response...")
            response = await gemini_generate_response(income_data, request.message, intent)
            print(f"💬 AI generated response: {response}")
            
            return ChatResponse(
                response=response,
                action_taken="generated_income_report",
                intent_detected=intent
            )
        
        elif intent["action"] == "general_chat":
            # Handle general conversation
            response = await gemini_generate_response({}, request.message, intent)
            return ChatResponse(
                response=response,
                action_taken="general_conversation",
                intent_detected=intent
            )
        
        else:
            # AI doesn't know how to handle this yet
            response = """I understand you're asking about something, but I'm still learning! 
            
Right now I can help you with:
🔍 Your account details - Try: "what's my info?" or "show my profile"
💸 Expense tracking - Try: "how much did I spend this month?" or "show my expenses from Jan 1 to Jan 15"
💰 Income tracking - Try: "how much did I receive last week?" or "show money I got this month"

More features coming soon! 🚀"""
            
            return ChatResponse(
                response=response,
                action_taken="unknown_intent",
                intent_detected=intent
            )
            
    except Exception as e:
        print(f"❌ Error in chat processing: {e}")
        raise HTTPException(status_code=500, detail=f"Something went wrong: {str(e)}")

# Function to call your Node.js backend (unchanged)
async def get_user_details_from_backend(user_token: str):
    """
    This calls your existing /get-user-details API
    """
    try:
        # Get backend URL from environment variables
        backend_base_url = os.getenv('BACKEND_URL', 'https://paytm-react-project.vercel.app/')
        backend_url = f"{backend_base_url}/api/v1/user/get-user-details"
        
        # Headers with user's token (like how you do it in frontend)
        headers = {
            "Authorization": f"Bearer {user_token}",
            "Content-Type": "application/json"
        }
        
        print(f"🌐 Making API call to: {backend_url}")
        
        # Make the API call
        response = requests.get(backend_url, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend responded successfully")
            return data
        else:
            print(f"❌ Backend error: {response.status_code}")
            raise Exception(f"Backend returned error: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        raise Exception("Cannot connect to backend. Make sure your Node.js server is running on port 3000")
    except Exception as e:
        raise Exception(f"Failed to get user details: {str(e)}")

# NEW: Function to get expense data from backend
async def get_expenses_from_backend(user_token: str, date_info: dict):
    """
    Calls the new /get-expenses API with date filtering
    """
    try:
        backend_base_url = os.getenv('BACKEND_URL', 'http://localhost:3000')
        backend_url = f"{backend_base_url}/api/v1/user/get-expenses"
        
        headers = {
            "Authorization": f"Bearer {user_token}",
            "Content-Type": "application/json"
        }
        
        # Build query parameters from AI extracted date info
        params = {}
        if date_info.get("date_from") and date_info.get("date_to"):
            params["date_from"] = date_info["date_from"]
            params["date_to"] = date_info["date_to"]
        elif date_info.get("time_period"):
            params["time_period"] = date_info["time_period"]
        
        print(f"💸 Making expense API call with params: {params}")
        
        response = requests.get(backend_url, headers=headers, params=params)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Expense data retrieved successfully")
            return data
        else:
            print(f"❌ Expense API error: {response.status_code}")
            raise Exception(f"Failed to get expense data: {response.status_code}")
            
    except Exception as e:
        raise Exception(f"Failed to get expense data: {str(e)}")

# NEW: Function to get income data from backend  
async def get_income_from_backend(user_token: str, date_info: dict):
    """
    Calls the new /get-income API with date filtering
    """
    try:
        backend_base_url = os.getenv('BACKEND_URL', 'http://localhost:3000')
        backend_url = f"{backend_base_url}/api/v1/user/get-income"
        
        headers = {
            "Authorization": f"Bearer {user_token}",
            "Content-Type": "application/json"
        }
        # hello
        
        # Build query parameters from AI extracted date info
        params = {}
        if date_info.get("date_from") and date_info.get("date_to"):
            params["date_from"] = date_info["date_from"]
            params["date_to"] = date_info["date_to"]
        elif date_info.get("time_period"):
            params["time_period"] = date_info["time_period"]
        
        print(f"💰 Making income API call with params: {params}")
        
        response = requests.get(backend_url, headers=headers, params=params)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Income data retrieved successfully")
            return data
        else:
            print(f"❌ Income API error: {response.status_code}")
            raise Exception(f"Failed to get income data: {response.status_code}")
            
    except Exception as e:
        raise Exception(f"Failed to get income data: {str(e)}")

# Health check endpoint (enhanced)
@app.get("/health")
async def health_check():
    """Check if chatbot and AI services are working"""
    try:
        # Test AI connection
        test_intent = await gemini_understand_intent("are u online")
        ai_status = "✅ Connected"
    except:
        ai_status = "❌ Disconnected"
    
    return {
        "status": "Chatbot is running!",
        "message": "Your AI-powered assistant is ready to help",
        "ai_service": ai_status,
        "features": [
            "Natural language understanding",
            "User details retrieval", 
            "Conversational responses"
        ]
    }

# Debug endpoint to test AI understanding
@app.post("/debug/intent")
async def debug_intent(request: dict):
    """Debug endpoint to see what AI understands"""
    try:
        message = request.get("message", "")
        intent = await gemini_understand_intent(message)
        return {
            "user_message": message,
            "ai_understanding": intent,
            "explanation": "This shows exactly what the AI detected from your message"
        }
    except Exception as e:
        return {"error": str(e)}

# Run the app (like app.listen() in Express)
if __name__ == "__main__":
    import uvicorn
    
    # Get server configuration from environment variables
    host = os.getenv('CHATBOT_HOST', '0.0.0.0')
    port = int(os.getenv('CHATBOT_PORT', '8000'))
    
    print("🤖 Starting Paytm AI Chatbot...")
    print("🧠 Powered by Google Gemini AI")
    print(f"🌐 Will be available at: http://{host}:{port}")
    print(f"📚 API docs at: http://{host}:{port}/docs")
    print(f"🔍 Debug AI at: http://{host}:{port}/debug/intent")
    print("🔐 Configuration loaded from .env file")
    uvicorn.run(app, host=host, port=port)