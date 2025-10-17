# AI Agent - The Brain of Your Chatbot
# This file contains the AI logic to understand user queries

import json
import re
from typing import Dict, Any

class ChatbotAgent:
    """
    This is your AI agent - think of it as the brain that understands what users want
    """
    
    def __init__(self):
        # Keywords that indicate user wants their details
        self.user_detail_keywords = [
            "my name", "my username", "who am i", "my details", "my info",
            "my full name", "my first name", "my last name", "about me",
            "user details", "account details", "profile", "my profile"
        ]
        
        # General greeting responses
        self.greetings = [
            "Hello! I'm your Paytm assistant. I can help you with your account details.",
            "Hi there! Ask me about your account information.",
            "Welcome! I can help you find your user details. Just ask!"
        ]
    
    def understand_user_intent(self, user_message: str) -> Dict[str, Any]:
        """
        This function understands what the user wants
        Returns: {"action": "what_to_do", "query": "original_message"}
        """
        # Convert to lowercase for easier matching
        message_lower = user_message.lower().strip()
        
        # Check if user is asking about their details
        if self._is_asking_for_user_details(message_lower):
            return {
                "action": "get_user_details",
                "query": user_message,
                "confidence": "high"
            }
        
        # Check if it's a greeting
        elif self._is_greeting(message_lower):
            return {
                "action": "greeting",
                "query": user_message,
                "confidence": "high"
            }
        
        # If we don't understand, it's general chat
        else:
            return {
                "action": "general_chat",
                "query": user_message,
                "confidence": "low"
            }
    
    def _is_asking_for_user_details(self, message: str) -> bool:
        """
        Check if user is asking for their details using simple keyword matching
        """
        for keyword in self.user_detail_keywords:
            if keyword in message:
                return True
        return False
    
    def _is_greeting(self, message: str) -> bool:
        """
        Check if user is just greeting
        """
        greetings = ["hi", "hello", "hey", "good morning", "good evening"]
        return any(greeting in message for greeting in greetings)
    
    def create_user_details_response(self, user_data: Dict, original_query: str) -> str:
        """
        Create a nice response with user details
        """
        try:
            username = user_data.get("username", "Not available")
            first_name = user_data.get("firstName", "Not available")
            last_name = user_data.get("lastName", "Not available")
            
            # Create different responses based on what user asked
            query_lower = original_query.lower()
            
            if "username" in query_lower:
                return f"Your username is: {username}"
            
            elif "first name" in query_lower:
                return f"Your first name is: {first_name}"
            
            elif "last name" in query_lower:
                return f"Your last name is: {last_name}"
            
            elif "full name" in query_lower or "name" in query_lower:
                return f"Your full name is: {first_name} {last_name}"
            
            else:
                # Give all details
                return f"""Here are your account details:
                
👤 Username: {username}
📝 Full Name: {first_name} {last_name}
✅ Account Status: Active

Is there anything specific you'd like to know more about?"""
        
        except Exception as e:
            return "Sorry, I couldn't retrieve your details right now. Please try again."
    
    def general_response(self, message: str) -> str:
        """
        Handle general chat when we don't understand
        """
        message_lower = message.lower()
        
        if self._is_greeting(message_lower):
            return "Hello! I'm your Paytm assistant. I can help you with your account details. Try asking 'What's my name?' or 'Show my profile'."
        
        else:
            return """I'm still learning! Right now I can help you with:
            
🔍 Your account details - Try asking:
   • "What's my name?"
   • "Show my username"
   • "What are my details?"
   • "Who am I?"
   
More features coming soon! 🚀"""
    
    def is_confident_about_intent(self, intent: Dict) -> bool:
        """
        Check if we're confident about what user wants
        """
        return intent.get("confidence") == "high"