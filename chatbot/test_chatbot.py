# Test your AI-powered chatbot easily!
# Enhanced to show the complete Gemini AI flow

import requests
import json
import asyncio

# Configuration
CHATBOT_URL = "http://localhost:8000/chat"
DEBUG_URL = "http://localhost:8000/debug/intent"
TEST_TOKEN = "your_jwt_token_here"  # Replace with real token from your frontend

def test_chatbot(message, token=TEST_TOKEN):
    """Test the chatbot with a message"""
    try:
        print(f"🧪 Testing: '{message}'")
        print("-" * 60)
        
        response = requests.post(
            CHATBOT_URL,
            json={
                "message": message,
                "user_token": token
            },
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"👤 User: {message}")
            print(f"🤖 Bot: {result['response']}")
            print(f"📝 Action: {result['action_taken']}")
            
            # Show AI understanding if available
            if result.get('intent_detected'):
                intent = result['intent_detected']
                print(f"🧠 AI Intent: {intent.get('intent', 'N/A')}")
                print(f"🎯 Confidence: {intent.get('confidence', 'N/A')}")
                print(f"😊 Tone: {intent.get('tone', 'N/A')}")
            
            print("=" * 60)
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure chatbot is running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_debug_intent(message):
    """Test just the AI understanding (without calling backend)"""
    try:
        response = requests.post(
            DEBUG_URL,
            json={"message": message},
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"🔍 Debug Intent for: '{message}'")
            print(f"🧠 AI Understanding: {json.dumps(result['ai_understanding'], indent=2)}")
            print("-" * 40)
        else:
            print(f"❌ Debug Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Debug Error: {e}")

if __name__ == "__main__":
    print("🤖 Testing Paytm AI Chatbot with Gemini Integration!")
    print("Make sure your backend (port 3000) and chatbot (port 8000) are running!")
    print("=" * 80)
    
    # Test 1: Debug AI Understanding (No backend needed)
    print("🔍 STEP 1: Testing AI Understanding (Debug Mode)")
    print("This tests ONLY the Gemini AI understanding, no backend calls")
    print("-" * 80)
    
    debug_messages = [
        "hey give my detail",
        "What's my name?", 
        "yo what's my info bro?",
        "Could you please provide my account details?",
        "how much did I spend this month?",
        "show me money I received from Oct 1 to Oct 15",
        "yo how much I got last week bro?",
        "expenses yesterday",
        "Hello there!"
    ]
    
    for message in debug_messages:
        test_debug_intent(message)
    
    print("\n" + "=" * 80)
    print("🚀 STEP 2: Testing Complete Flow (Requires Backend + Valid Token)")
    print("This tests the FULL flow: AI Understanding → Backend Call → AI Response")
    print("-" * 80)
    
    # Test 2: Complete flow (needs backend and valid token)
    full_test_messages = [
        "hey give my detail",
        "What's my username?",
        "Who am I?", 
        "Show my profile",
        "how much did I spend this month?",
        "show me money I received last week",
        "expenses from October 1st to 15th",
        "yo how much I got yesterday bro?",
        "Hello!",
        "I want to transfer money",  # Should show "I don't understand"
    ]
    
    for message in full_test_messages:
        test_chatbot(message)
    
    print("🎉 Testing completed!")
    print("\n📋 SUMMARY:")
    print("✅ Step 1 showed how Gemini AI understands different user inputs")
    print("✅ Step 2 showed the complete chatbot flow with backend integration")
    print("\n🔧 To test with a real token:")
    print("1. Login to your frontend") 
    print("2. Get the JWT token from browser dev tools (localStorage/cookies)")
    print("3. Replace TEST_TOKEN in this file")
    print("4. Run this script again")
    print("\n📚 Check info.txt for detailed flow explanation!")