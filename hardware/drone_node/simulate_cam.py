import requests
import os
import time

# ESP32-CAM Simulation Script
# This mimics an ESP32-CAM capturing an image and POSTing it to the AI backend

BACKEND_URL = "http://localhost:8000/analyze/"
SAMPLE_IMAGE = "sample_leaf.jpg" # This would be a real capture on the ESP32

def simulate_capture_and_send():
    # In a real ESP32, this would be a buffer from the camera sensor
    # For simulation, we check if an image exists or tell the user to provide one
    if not os.path.exists(SAMPLE_IMAGE):
        print(f"Please place a sample image named '{SAMPLE_IMAGE}' in this directory to test.")
        return

    print(f"Capturing frame...")
    files = {'file': open(SAMPLE_IMAGE, 'rb')}
    
    print(f"Sending to AI Engine: {BACKEND_URL}")
    try:
        start_time = time.time()
        response = requests.post(BACKEND_URL, files=files)
        latency = time.time() - start_time
        
        if response.status_code == 200:
            result = response.json()
            print("\n--- AI ANALYSIS REPORT ---")
            print(f"Target: {result['disease']}")
            print(f"Confidence: {result['confidence']:.2%}")
            print(f"Severity: {result['severity']}")
            print(f"Cure: {result['cure']}")
            print(f"Infrastructure: {result['provider']}")
            print(f"Latency: {latency:.2f}s")
            print("--------------------------\n")
        else:
            print(f"Error: Backend returned {response.status_code}")
    except Exception as e:
        print(f"Failed to connect to backend: {e}")

if __name__ == "__main__":
    simulate_capture_and_send()
