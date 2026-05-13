import sys
sys.path.insert(0, ".")
from core.security import verify_password, get_password_hash

plain = "Doctor123"
hashed = get_password_hash(plain)
print(f"Hashed: {hashed}")
try:
    match = verify_password(plain, hashed)
    print(f"Match: {match}")
except Exception as e:
    print(f"Error: {e}")

# Test with long password
long_pw = "a" * 73
try:
    hashed_long = get_password_hash(long_pw)
    print("Long PW Hash success")
except Exception as e:
    print(f"Long PW Hash error: {e}")

try:
    match_long = verify_password(long_pw, hashed)
    print(f"Long PW Match: {match_long}")
except Exception as e:
    print(f"Long PW Verify error: {e}")
