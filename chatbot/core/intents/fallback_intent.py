# Fallback Intent Detection
# Simple keyword-based fallback when AI is unavailable

def fallback_intent_detection(user_message: str) -> dict:
    """Fallback intent detection using simple keywords"""
    message_lower = user_message.lower()
    
    # Keywords for different intents
    user_detail_keywords = ["name", "detail", "info", "username", "profile", "who am i", "my detail"]
    balance_keywords = ["balance", "wallet", "money left", "how much money"]
    income_keywords = ["receive", "received", "income", "got", "earned", "credit"]
    spending_keywords = ["spend", "spent", "expense", "expenses", "expend", "expended", "paid", "payment", "debit", "cost", "costs"]
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