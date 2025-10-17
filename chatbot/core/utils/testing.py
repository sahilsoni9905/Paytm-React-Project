# Testing Utilities
# Functions for testing AI integration

import asyncio
from ..intents import understand_intent
from ..responses import generate_response

async def test_ai_integration():
    """Test the complete AI flow"""
    test_messages = [
        # User details
        "hey give my detail",
        "What's my name?",
        
        # Balance queries
        "what's my balance?",
        "show me wallet balance",
        
        # Income analysis
        "how much did I receive this month?",
        "show me income from 1st Jan to 15th Jan",
        "money I got last week",
        
        # Spending analysis  
        "how much did I spend this month?",
        "yo how much money I spent last week bro?",
        "show my expenses from 1st Oct to 31st Oct",
        
        # Transaction history
        "show me transaction history for this month",
        "my recent transactions",
        "all transactions from 1st to 15th",
        
        # General chat
        "Hello there!",
    ]
    
    print("🧪 Testing Enhanced AI Integration...")
    print("=" * 60)
    
    for message in test_messages:
        print(f"\n👤 User: '{message}'")
        
        # Test intent understanding
        intent = await understand_intent(message)
        print(f"🧠 AI Intent: {intent}")
        
        # Test response generation (with dummy user data)
        dummy_user_data = {
            "username": "test_user_123",
            "firstName": "John",
            "lastName": "Doe",
            "profilePic": "https://example.com/pic.jpg"
        }
        
        if intent["action"] == "get_user_details":
            response = await generate_response(dummy_user_data, message, intent)
        else:
            response = await generate_response({}, message, intent)
            
        print(f"🤖 AI Response: {response}")
        print("-" * 60)