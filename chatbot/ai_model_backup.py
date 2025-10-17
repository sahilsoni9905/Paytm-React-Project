# Enhanced AI Model for Paytm Chatbot  
# Now with complete Gemini integration for natural language understanding!

from openai import OpenAI
import json
import asyncio

try:
    client = OpenAI(
        api_key="",
        base_url="https://generativelanguage.googleapis.com/v1beta/",
        default_headers={}
    )
except Exception as e:
    print(f"Warning: OpenAI client initialization failed: {e}")
    client = None

INTENT_SYSTEM_PROMPT = """
You are an intelligent assistant for a Paytm-like digital payment application. 

Your job is to understand user queries and classify their intent. You should respond in JSON format with:

{
    "intent": "user_details" | "balance" | "income_analysis" | "spending_analysis" | "transaction_history" | "transfer" | "general",
    "action": "get_user_details" | "get_balance" | "get_income_report" | "get_spending_report" | "get_transaction_history" | "transfer_money" | "general_chat",
    "confidence": "high" | "medium" | "low",
    "tone": "casual" | "formal" | "friendly" | "urgent",
    "specific_request": "detailed description of what user wants",
    "extracted_info": {
        "date_from": "YYYY-MM-DD or null",
        "date_to": "YYYY-MM-DD or null", 
        "time_period": "this month" | "last month" | "this week" | "last week" | "today" | "yesterday" | "last 7 days" | "last 30 days" | "custom" | null,
        "amount": "extracted amount or null",
        "transaction_type": "received" | "sent" | "all" | null,
        "recipient": "person/merchant name or null"
    }
}

Examples:

USER DETAILS:
- "hey give my detail" → {"intent": "user_details", "action": "get_user_details", "confidence": "high", "tone": "casual"}
- "What's my name?" → {"intent": "user_details", "action": "get_user_details", "confidence": "high", "tone": "formal"}

BALANCE QUERIES:
- "what's my balance?" → {"intent": "balance", "action": "get_balance", "confidence": "high", "tone": "formal"}
- "show me my wallet balance" → {"intent": "balance", "action": "get_balance", "confidence": "high", "tone": "formal"}

INCOME ANALYSIS:
- "how much did I receive from 1st Jan to 15th Jan?" → {"intent": "income_analysis", "action": "get_income_report", "confidence": "high", "tone": "formal", "extracted_info": {"date_from": "2025-01-01", "date_to": "2025-01-15", "transaction_type": "received"}}
- "show me money I got this month" → {"intent": "income_analysis", "action": "get_income_report", "confidence": "high", "tone": "casual", "extracted_info": {"time_period": "this month", "transaction_type": "received"}}
- "income report for last week" → {"intent": "income_analysis", "action": "get_income_report", "confidence": "high", "tone": "formal", "extracted_info": {"time_period": "last week", "transaction_type": "received"}}

SPENDING ANALYSIS:
- "how much did I spend this month?" → {"intent": "spending_analysis", "action": "get_spending_report", "confidence": "high", "tone": "formal", "extracted_info": {"time_period": "this month", "transaction_type": "sent"}}
- "show my expenses from 1st Oct to 31st Oct" → {"intent": "spending_analysis", "action": "get_spending_report", "confidence": "high", "tone": "formal", "extracted_info": {"date_from": "2025-10-01", "date_to": "2025-10-31", "transaction_type": "sent"}}
- "yo how much money I spent last week bro?" → {"intent": "spending_analysis", "action": "get_spending_report", "confidence": "high", "tone": "casual", "extracted_info": {"time_period": "last week", "transaction_type": "sent"}}

TRANSACTION HISTORY:
- "show me all transactions from 1st to 15th" → {"intent": "transaction_history", "action": "get_transaction_history", "confidence": "high", "tone": "formal", "extracted_info": {"date_from": "2025-10-01", "date_to": "2025-10-15", "transaction_type": "all"}}
- "my transaction history for this month" → {"intent": "transaction_history", "action": "get_transaction_history", "confidence": "high", "tone": "formal", "extracted_info": {"time_period": "this month", "transaction_type": "all"}}
- "show recent transactions" → {"intent": "transaction_history", "action": "get_transaction_history", "confidence": "high", "tone": "formal", "extracted_info": {"time_period": "last 7 days", "transaction_type": "all"}}

GENERAL CHAT:
- "Hello" → {"intent": "general", "action": "general_chat", "confidence": "high", "tone": "friendly"}
- "Hi there" → {"intent": "general", "action": "general_chat", "confidence": "high", "tone": "friendly"}

IMPORTANT: 
- Always extract dates in YYYY-MM-DD format when specific dates are mentioned
- For relative dates like "this month", "last week", use time_period field
- If user says "from X to Y", extract both date_from and date_to
- For spending queries, set transaction_type to "sent"
- For income/received queries, set transaction_type to "received"
- For general transaction history, set transaction_type to "all"
- Be smart about understanding natural language variations and slang
- Current date context: October 2025
"""

RESPONSE_SYSTEM_PROMPT = """
You are a helpful, friendly assistant for a Paytm-like payment application.

Your job is to create natural, conversational responses based on:
1. What the user originally asked
2. The user's tone (casual, formal, friendly, etc.)  
3. The data you have about them

Guidelines:
- Match the user's tone and style
- Be helpful and informative
- Use appropriate emojis for casual conversations
- Format data clearly and attractively  
- Always ask if they need anything else
- Be concise but complete
- Sound natural, not robotic

Examples:
- Casual request → Casual response with emojis
- Formal request → Professional, structured response
- Friendly tone → Warm, welcoming response
"""

async def gemini_understand_intent(user_message: str) -> dict:
    """
    Use Gemini AI to understand what the user wants
    
    Args:
        user_message: What the user typed
        
    Returns:
        Dictionary with intent, action, confidence, tone, etc.
    """
    try:
        print(f"🧠 Sending to Gemini: '{user_message}'")
        
        messages = [
            {"role": "system", "content": INTENT_SYSTEM_PROMPT},
            {"role": "user", "content": f"Analyze this user message: '{user_message}'"}
        ]

        response = client.chat.completions.create(
            model="gemini-2.5-flash",
            response_format={"type": "json_object"},
            messages=messages,
            temperature=0.3  # Lower temperature for more consistent intent detection
        )

        raw_result = response.choices[0].message.content
        parsed_result = json.loads(raw_result)
        
        print(f"🎯 Gemini understood: {parsed_result}")
        return parsed_result
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing error: {e}")
        # Fallback to simple keyword matching
        return _fallback_intent_detection(user_message)
        
    except Exception as e:
        print(f"❌ Gemini API error: {e}")
        # Fallback to simple keyword matching
        return _fallback_intent_detection(user_message)

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
    try:
        # Handle different types of requests
        if intent["action"] == "get_user_details":
            return await _generate_user_details_response(user_data, original_message, intent)
        elif intent["action"] == "general_chat":
            return await _generate_general_response(original_message, intent)
        else:
            return "I'm still learning how to help with that! Try asking about your account details."
            
    except Exception as e:
        print(f"❌ Response generation error: {e}")
        # Fallback to simple response
        return _fallback_response(user_data, intent)

async def _generate_user_details_response(user_data: dict, original_message: str, intent: dict) -> str:
    """Generate response for user details requests"""
    
    prompt = f"""
    Create a natural response for a user asking about their account details.
    
    User asked: "{original_message}"
    User's tone: {intent.get('tone', 'friendly')}
    User's confidence level: {intent.get('confidence', 'high')}
    
    User data available:
    {json.dumps(user_data, indent=2)}
    
    Instructions:
    - Match the user's {intent.get('tone', 'friendly')} tone
    - Present the information clearly
    - Use emojis if tone is casual
    - Be professional if tone is formal
    - Always end by asking if they need anything else
    - Make it feel personal and helpful
    
    Create a response that feels natural and conversational.
    """
    
    try:
        response = client.chat.completions.create(
            model="gemini-2.5-flash",
            messages=[
                {"role": "system", "content": RESPONSE_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7  # Higher temperature for more creative responses
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"❌ User details response error: {e}")
        return _fallback_response(user_data, intent)

async def _generate_general_response(original_message: str, intent: dict) -> str:
    """Generate response for general chat"""
    
    prompt = f"""
    User said: "{original_message}"
    Tone: {intent.get('tone', 'friendly')}
    
    This seems like general conversation. Respond naturally while mentioning that you're a Paytm assistant who can help with account details.
    
    Keep it brief, friendly, and helpful. Suggest what you can actually do.
    """
    
    try:
        response = client.chat.completions.create(
            model="gemini-2.5-flash",
            messages=[
                {"role": "system", "content": RESPONSE_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"❌ General response error: {e}")
        return "Hello! I'm your Paytm assistant. I can help you with your account details. Try asking 'What's my name?' or 'Show my info'."

def _fallback_intent_detection(user_message: str) -> dict:
    """Fallback intent detection using simple keywords"""
    message_lower = user_message.lower()
    
    # Keywords for different intents
    user_detail_keywords = ["name", "detail", "info", "username", "profile", "who am i", "my detail"]
    balance_keywords = ["balance", "wallet", "money left", "how much money"]
    income_keywords = ["receive", "received", "income", "got", "earned", "credit"]
    spending_keywords = ["spend", "spent", "expense", "expenses", "paid", "payment", "debit"]
    transaction_keywords = ["transaction", "history", "statement", "activity"]
    
    # Check for user details
    if any(keyword in message_lower for keyword in user_detail_keywords):
        return {
            "intent": "user_details",
            "action": "get_user_details",
            "confidence": "medium",
            "tone": "casual" if any(word in message_lower for word in ["hey", "yo", "bro"]) else "formal",
            "specific_request": "user details",
            "extracted_info": {},
            "fallback": True
        }
    
    # Check for balance queries
    elif any(keyword in message_lower for keyword in balance_keywords) and not any(keyword in message_lower for keyword in spending_keywords + income_keywords):
        return {
            "intent": "balance",
            "action": "get_balance",
            "confidence": "medium",
            "tone": "casual" if any(word in message_lower for word in ["hey", "yo", "bro"]) else "formal",
            "specific_request": "account balance",
            "extracted_info": {},
            "fallback": True
        }
    
    # Check for income analysis
    elif any(keyword in message_lower for keyword in income_keywords):
        extracted_info = {"transaction_type": "received"}
        
        # Simple time period detection
        if "this month" in message_lower:
            extracted_info["time_period"] = "this month"
        elif "last month" in message_lower:
            extracted_info["time_period"] = "last month"
        elif "this week" in message_lower:
            extracted_info["time_period"] = "this week"
        elif "last week" in message_lower:
            extracted_info["time_period"] = "last week"
        elif "today" in message_lower:
            extracted_info["time_period"] = "today"
        elif "yesterday" in message_lower:
            extracted_info["time_period"] = "yesterday"
        
        return {
            "intent": "income_analysis",
            "action": "get_income_report",
            "confidence": "medium",
            "tone": "casual" if any(word in message_lower for word in ["hey", "yo", "bro"]) else "formal",
            "specific_request": "income analysis",
            "extracted_info": extracted_info,
            "fallback": True
        }
    
    # Check for spending analysis
    elif any(keyword in message_lower for keyword in spending_keywords):
        extracted_info = {"transaction_type": "sent"}
        
        # Simple time period detection
        if "this month" in message_lower:
            extracted_info["time_period"] = "this month"
        elif "last month" in message_lower:
            extracted_info["time_period"] = "last month"
        elif "this week" in message_lower:
            extracted_info["time_period"] = "this week"
        elif "last week" in message_lower:
            extracted_info["time_period"] = "last week"
        elif "today" in message_lower:
            extracted_info["time_period"] = "today"
        elif "yesterday" in message_lower:
            extracted_info["time_period"] = "yesterday"
        
        return {
            "intent": "spending_analysis",
            "action": "get_spending_report",
            "confidence": "medium",
            "tone": "casual" if any(word in message_lower for word in ["hey", "yo", "bro"]) else "formal",
            "specific_request": "spending analysis",
            "extracted_info": extracted_info,
            "fallback": True
        }
    
    # Check for transaction history
    elif any(keyword in message_lower for keyword in transaction_keywords):
        extracted_info = {"transaction_type": "all"}
        
        # Simple time period detection
        if "this month" in message_lower:
            extracted_info["time_period"] = "this month"
        elif "last month" in message_lower:
            extracted_info["time_period"] = "last month"
        elif "recent" in message_lower or "last 7" in message_lower:
            extracted_info["time_period"] = "last 7 days"
        
        return {
            "intent": "transaction_history",
            "action": "get_transaction_history",
            "confidence": "medium",
            "tone": "casual" if any(word in message_lower for word in ["hey", "yo", "bro"]) else "formal",
            "specific_request": "transaction history",
            "extracted_info": extracted_info,
            "fallback": True
        }
    
    # Default to general chat
    else:
        return {
            "intent": "general",
            "action": "general_chat", 
            "confidence": "low",
            "tone": "friendly",
            "specific_request": "general conversation",
            "extracted_info": {},
            "fallback": True
        }

def _fallback_response(user_data: dict, intent: dict) -> str:
    """Fallback response if AI generation fails"""
    if intent["action"] == "get_user_details" and user_data:
        username = user_data.get("username", "N/A")
        first_name = user_data.get("firstName", "N/A") 
        last_name = user_data.get("lastName", "N/A")
        
        return f"""Here are your account details:

👤 Full Name: {first_name} {last_name}
📧 Username: {username}
✅ Account Status: Active

Is there anything else you'd like to know?"""
    else:
        return "I'm here to help! Try asking about your account details."

# Test function to verify AI integration
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
        intent = await gemini_understand_intent(message)
        print(f"🧠 AI Intent: {intent}")
        
        # Test response generation (with dummy user data)
        dummy_user_data = {
            "username": "test_user_123",
            "firstName": "John",
            "lastName": "Doe",
            "profilePic": "https://example.com/pic.jpg"
        }
        
        if intent["action"] == "get_user_details":
            response = await gemini_generate_response(dummy_user_data, message, intent)
        else:
            response = await gemini_generate_response({}, message, intent)
            
        print(f"🤖 AI Response: {response}")
        print("-" * 60)

if __name__ == "__main__":
    # Test the AI integration
    asyncio.run(test_ai_integration())