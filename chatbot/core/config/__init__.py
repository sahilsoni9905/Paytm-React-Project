# Core configuration init
# Makes config modules importable

from .prompts import INTENT_SYSTEM_PROMPT, RESPONSE_SYSTEM_PROMPT
from .ai_config import get_ai_client, AI_MODEL, INTENT_TEMPERATURE, RESPONSE_TEMPERATURE, GENERAL_RESPONSE_TEMPERATURE

__all__ = [
    'INTENT_SYSTEM_PROMPT',
    'RESPONSE_SYSTEM_PROMPT', 
    'get_ai_client',
    'AI_MODEL',
    'INTENT_TEMPERATURE',
    'RESPONSE_TEMPERATURE',
    'GENERAL_RESPONSE_TEMPERATURE'
]