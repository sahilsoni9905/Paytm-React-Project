# Simple AI Client - Fixed version without proxy issues
from openai import OpenAI
import json

# Simple client initialization
def create_simple_client():
    """Create a simple OpenAI client without any proxy configurations"""
    try:
        return OpenAI(
            api_key="",
            base_url="https://generativelanguage.googleapis.com/v1beta/"
        )
    except Exception as e:
        print(f"Client creation failed: {e}")
        return None

# Test the client
if __name__ == "__main__":
    client = create_simple_client()
    if client:
        print("✅ Client created successfully!")
        
        # Test with a simple query
        try:
            response = client.chat.completions.create(
                model="gemini-2.5-flash",
                messages=[{"role": "user", "content": "Hello"}],
                response_format={"type": "json_object"}
            )
            print("✅ API call successful!")
            print(response.choices[0].message.content)
        except Exception as e:
            print(f"❌ API call failed: {e}")
    else:
        print("❌ Client creation failed!")