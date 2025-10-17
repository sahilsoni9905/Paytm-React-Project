# AI Client Configuration
# OpenAI client setup and configuration

import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# AI Client Setup
def get_ai_client():
    """Initialize and return OpenAI client with error handling"""
    try:
        print(f"🔧 Initializing OpenAI client...")
        
        # Get configuration from environment variables
        api_key = os.getenv('GEMINI_API_KEY')
        base_url = os.getenv('GEMINI_BASE_URL')
        
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        if not base_url:
            raise ValueError("GEMINI_BASE_URL not found in environment variables")
        
        print(f"🔑 Using API key: {api_key[:10]}...{api_key[-4:]}")
        print(f"🌐 Using base URL: {base_url}")
        
        client = OpenAI(
            api_key=api_key,
            base_url=base_url
        )
        
        print(f"✅ OpenAI client initialized successfully")
        return client
        
    except Exception as e:
        print(f"❌ Error in client initialization: {e}")
        print(f"📝 Error type: {type(e).__name__}")
        return None

# AI Model Configuration from environment variables
AI_MODEL = os.getenv('AI_MODEL', 'gemini-2.5-flash')
INTENT_TEMPERATURE = float(os.getenv('INTENT_TEMPERATURE', '0.3'))
RESPONSE_TEMPERATURE = float(os.getenv('RESPONSE_TEMPERATURE', '0.7'))
GENERAL_RESPONSE_TEMPERATURE = float(os.getenv('GENERAL_RESPONSE_TEMPERATURE', '0.8'))