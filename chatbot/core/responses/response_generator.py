# Response Generation Module
# Handles AI-powered response generation

import json
from ..config import get_ai_client, RESPONSE_SYSTEM_PROMPT, AI_MODEL, RESPONSE_TEMPERATURE, GENERAL_RESPONSE_TEMPERATURE
from .fallback_response import get_fallback_response

async def generate_response(user_data: dict, original_message: str, intent: dict) -> str:
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
            return await generate_user_details_response(user_data, original_message, intent)
        elif intent["action"] == "get_spending_report":
            return await generate_expense_response(user_data, original_message, intent)
        elif intent["action"] == "get_income_report":
            return await generate_income_response(user_data, original_message, intent)
        elif intent["action"] == "general_chat":
            return await generate_general_response(original_message, intent)
        else:
            return f"I'm still learning how to help with that! I can help you with account details, expenses, and income tracking. Try asking 'How much did I spend this month?'"
            
    except Exception as e:
        print(f"❌ Response generation error: {e}")
        return get_fallback_response(user_data, intent)

async def generate_user_details_response(user_data: dict, original_message: str, intent: dict) -> str:
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
        client = get_ai_client()
        if not client:
            return get_fallback_response(user_data, intent)
            
        response = client.chat.completions.create(
            model=AI_MODEL,
            messages=[
                {"role": "system", "content": RESPONSE_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=RESPONSE_TEMPERATURE
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"❌ User details response error: {e}")
        return get_fallback_response(user_data, intent)

async def generate_general_response(original_message: str, intent: dict) -> str:
    """Generate response for general chat"""
    
    prompt = f"""
    User said: "{original_message}"
    Tone: {intent.get('tone', 'friendly')}
    
    This seems like general conversation. Respond naturally while mentioning that you're a Paytm assistant who can help with account details.
    
    Keep it brief, friendly, and helpful. Suggest what you can actually do.
    """
    
    try:
        client = get_ai_client()
        if not client:
            return "Hello! I'm your Paytm assistant. I can help you with your account details. Try asking 'What's my name?' or 'Show my info'."
            
        response = client.chat.completions.create(
            model=AI_MODEL,
            messages=[
                {"role": "system", "content": RESPONSE_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=GENERAL_RESPONSE_TEMPERATURE
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"❌ General response error: {e}")
        return "Hello! I'm your Paytm assistant. I can help you with your account details, expenses, and income tracking."

async def generate_expense_response(expense_data: dict, original_message: str, intent: dict) -> str:
    """Generate response for expense/spending queries"""
    
    # If AI client fails, use fallback
    client = get_ai_client()
    if not client:
        return format_expense_fallback(expense_data, intent)
    
    prompt = f"""
    Create a natural response for a user asking about their expenses/spending.
    
    User asked: "{original_message}"
    User's tone: {intent.get('tone', 'friendly')}
    
    Expense data:
    {json.dumps(expense_data, indent=2)}
    
    Instructions:
    - Match the user's {intent.get('tone', 'friendly')} tone
    - Present spending information clearly
    - Use 💸 emoji for expenses
    - Format currency as ₹ (rupees)
    - Show total, transaction count, and breakdown
    - Be helpful and insightful
    - Ask if they need more details
    
    Create a response that feels natural and informative.
    """
    
    try:
        response = client.chat.completions.create(
            model=AI_MODEL,
            messages=[
                {"role": "system", "content": RESPONSE_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=RESPONSE_TEMPERATURE
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"❌ Expense response error: {e}")
        return format_expense_fallback(expense_data, intent)

async def generate_income_response(income_data: dict, original_message: str, intent: dict) -> str:
    """Generate response for income/received money queries"""
    
    # If AI client fails, use fallback
    client = get_ai_client()
    if not client:
        return format_income_fallback(income_data, intent)
    
    prompt = f"""
    Create a natural response for a user asking about their income/received money.
    
    User asked: "{original_message}"
    User's tone: {intent.get('tone', 'friendly')}
    
    Income data:
    {json.dumps(income_data, indent=2)}
    
    Instructions:
    - Match the user's {intent.get('tone', 'friendly')} tone
    - Present income information clearly
    - Use 💰 emoji for income
    - Format currency as ₹ (rupees)
    - Show total, transaction count, and breakdown
    - Be helpful and positive
    - Ask if they need more details
    
    Create a response that feels natural and encouraging.
    """
    
    try:
        response = client.chat.completions.create(
            model=AI_MODEL,
            messages=[
                {"role": "system", "content": RESPONSE_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=RESPONSE_TEMPERATURE
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"❌ Income response error: {e}")
        return format_income_fallback(income_data, intent)

def format_expense_fallback(expense_data: dict, intent: dict) -> str:
    """Fallback expense response when AI is unavailable"""
    try:
        total = expense_data.get('totalExpenses', 0)
        count = expense_data.get('transactionCount', 0)
        period = expense_data.get('period', 'the requested period')
        breakdown = expense_data.get('expenseBreakdown', {})
        
        response = f"💸 **Expense Report for {period}**\n\n"
        response += f"Total Spent: ₹{total:,.2f}\n"
        response += f"Transactions: {count}\n\n"
        
        if breakdown:
            response += "📊 **Breakdown:**\n"
            for recipient, data in list(breakdown.items())[:5]:  # Show top 5
                response += f"• {recipient}: ₹{data['total']:,.2f} ({data['count']} transactions)\n"
        
        if count == 0:
            response = f"No expenses found for {period}. You're doing great with your spending! 😊"
        
        return response
        
    except Exception as e:
        return f"I found your expense data but had trouble formatting it. You spent ₹{expense_data.get('totalExpenses', 0)} in {expense_data.get('transactionCount', 0)} transactions."

def format_income_fallback(income_data: dict, intent: dict) -> str:
    """Fallback income response when AI is unavailable"""
    try:
        total = income_data.get('totalIncome', 0)
        count = income_data.get('transactionCount', 0)
        period = income_data.get('period', 'the requested period')
        breakdown = income_data.get('incomeBreakdown', {})
        
        response = f"💰 **Income Report for {period}**\n\n"
        response += f"Total Received: ₹{total:,.2f}\n"
        response += f"Transactions: {count}\n\n"
        
        if breakdown:
            response += "📈 **Sources:**\n"
            for sender, data in list(breakdown.items())[:5]:  # Show top 5
                response += f"• {sender}: ₹{data['total']:,.2f} ({data['count']} transactions)\n"
        
        if count == 0:
            response = f"No income found for {period}. Keep working towards your goals! 💪"
        
        return response
        
    except Exception as e:
        return f"I found your income data but had trouble formatting it. You received ₹{income_data.get('totalIncome', 0)} in {income_data.get('transactionCount', 0)} transactions."