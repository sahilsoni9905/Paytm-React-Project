# Intent Detection Module
# Handles AI-powered intent understanding

import json
from ..config import get_ai_client, INTENT_SYSTEM_PROMPT, AI_MODEL, INTENT_TEMPERATURE
from .fallback_intent import fallback_intent_detection

async def understand_intent(user_message: str) -> dict:
    """
    Use Gemini AI to understand what the user wants
    
    Args:
        user_message: What the user typed
        
    Returns:
        Dictionary with intent, action, confidence, tone, etc.
    """
    try:
        print(f"🧠 Sending to Gemini: '{user_message}'")
        
        client = get_ai_client()
        if not client:
            print("❌ AI client not available, using fallback")
            return fallback_intent_detection(user_message)
        
        messages = [
            {"role": "system", "content": INTENT_SYSTEM_PROMPT},
            {"role": "user", "content": f"Analyze this user message: '{user_message}'"}
        ]

        response = client.chat.completions.create(
            model=AI_MODEL,
            response_format={"type": "json_object"},
            messages=messages,
            temperature=INTENT_TEMPERATURE
        )

        raw_result = response.choices[0].message.content
        parsed_result = json.loads(raw_result)
        
        print(f"🎯 Gemini understood: {parsed_result}")
        return parsed_result
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing error: {e}")
        return fallback_intent_detection(user_message)
        
    except Exception as e:
        print(f"❌ Gemini API error: {e}")
        return fallback_intent_detection(user_message)