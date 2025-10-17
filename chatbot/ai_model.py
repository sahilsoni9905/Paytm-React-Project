# Enhanced AI Model for Paytm Chatbot  
# Now with modular architecture for better maintainability!

# Import all functionality from core modules
from core.intents import understand_intent
from core.responses import generate_response
from core.utils import test_ai_integration

# Expose the main functions with original names for compatibility
async def gemini_understand_intent(user_message: str) -> dict:
    """
    Use Gemini AI to understand what the user wants
    
    Args:
        user_message: What the user typed
        
    Returns:
        Dictionary with intent, action, confidence, tone, etc.
    """
    return await understand_intent(user_message)

async def gemini_generate_response(user_data: dict, original_message: str, intent: dict) -> str:
    """
    Use Gemini to generate a natural, contextual response
    
    Args:
        user_data: Data from your backend API
        original_message: What user originally asked
        intent: What AI understood about the request
        
    Returns:
        Natural language response
    """
    return await generate_response(user_data, original_message, intent)

# Main execution for testing
if __name__ == "__main__":
    import asyncio
    asyncio.run(test_ai_integration())