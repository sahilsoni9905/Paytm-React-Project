# Simple client test to debug the OpenAI initialization issue
import sys
from openai import OpenAI

def test_openai_client():
    """Test OpenAI client initialization with detailed debugging"""
    print("🔍 Testing OpenAI client initialization...")
    print(f"🐍 Python version: {sys.version}")
    
    # Check OpenAI version
    try:
        import openai
        print(f"📦 OpenAI library version: {openai.__version__}")
    except:
        print("📦 OpenAI library version: Unknown")
    
    # Test 1: Basic initialization
    print("\n🧪 Test 1: Basic client initialization")
    try:
        client = OpenAI(
            api_key="",
            base_url="https://generativelanguage.googleapis.com/v1beta/"
        )
        print("✅ Basic initialization successful")
        
        # Test 2: Simple API call
        print("\n🧪 Test 2: Simple API call")
        response = client.chat.completions.create(
            model="gemini-2.5-flash",
            messages=[{"role": "user", "content": "Hello"}],
            temperature=0.3
        )
        print("✅ API call successful")
        print(f"📝 Response: {response.choices[0].message.content[:100]}...")
        return True
        
    except TypeError as e:
        print(f"❌ TypeError: {e}")
        if "proxies" in str(e):
            print("🔍 Detected 'proxies' parameter issue")
            print("💡 This might be due to OpenAI library version mismatch")
        return False
    except Exception as e:
        print(f"❌ Other error: {e}")
        print(f"📋 Error type: {type(e).__name__}")
        return False

if __name__ == "__main__":
    success = test_openai_client()
    if success:
        print("\n🎉 OpenAI client is working correctly!")
    else:
        print("\n❌ OpenAI client has issues that need to be resolved")