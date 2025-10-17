# Core module init
# Makes all core modules importable

from .config import *
from .intents import *
from .responses import *
from .utils import *

__all__ = [
    # Config
    'INTENT_SYSTEM_PROMPT',
    'RESPONSE_SYSTEM_PROMPT', 
    'get_ai_client',
    'AI_MODEL',
    'INTENT_TEMPERATURE',
    'RESPONSE_TEMPERATURE',
    'GENERAL_RESPONSE_TEMPERATURE',
    
    # Intents
    'understand_intent',
    'fallback_intent_detection',
    
    # Responses
    'generate_response', 
    'generate_user_details_response', 
    'generate_general_response',
    'get_fallback_response',
    
    # Utils
    'test_ai_integration'
]