# Fallback Response Generation
# Simple fallback responses when AI is unavailable

def get_fallback_response(user_data: dict, intent: dict) -> str:
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