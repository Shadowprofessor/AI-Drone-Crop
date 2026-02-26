import onnxruntime as ort
import numpy as np
import os
import sys
from PIL import Image

class RyzenAIInference:
    def __init__(self, model_path=None, classes_path=None):
        # Determine paths relative to this file
        base_dir = os.path.dirname(__file__)
        if model_path is None:
            model_path = os.path.join(base_dir, "plant_disease_resnet18.onnx")
        if classes_path is None:
            classes_path = os.path.join(base_dir, "classes.txt")
            
        print(f"--- RYZEN AI ENGINE STARTUP ---")
        print(f"Model Path: {model_path}")
        print(f"Classes Path: {classes_path}")

        self.classes = []
        if os.path.exists(classes_path):
            with open(classes_path, "r") as f:
                self.classes = [line.strip() for line in f.readlines()]
            print(f"Loaded {len(self.classes)} classes.")
        else:
            print(f"CRITICAL ERROR: Classes file not found at {classes_path}")
            # Use default classes as safety
            self.classes = ["Unknown"] * 20

        # Verify model file
        if not os.path.exists(model_path):
            print(f"CRITICAL ERROR: Model file not found at {model_path}")
            self.session = None
            return

        # Vitis AI / NPU setup
        config_path = os.path.join(base_dir, 'vaip_config.json')
        self.providers = [
            ('VitisAIExecutionProvider', {
                'config_file': config_path,
                'cacheDir': os.path.join(base_dir, 'cache'),
                'cacheKey': 'resnet18_v1'
            }), 
            'CPUExecutionProvider'
        ]
        
        try:
            print("Attempting to initialize ONNX Runtime with AMD Ryzen AI...")
            self.session = ort.InferenceSession(model_path, providers=self.providers)
            active_providers = self.session.get_providers()
            print(f"Active Providers: {active_providers}")
            
            if 'VitisAIExecutionProvider' in active_providers:
                self.acceleration = "AMD RYZEN™ AI NPU (Vitis AI)"
            else:
                self.acceleration = "AMD RYZEN™ AI CPU (Optimized)"
            
            print(f"STATUS: Running on {self.acceleration}")
        except Exception as e:
            print(f"NPU Initialization Failed: {e}")
            print("Falling back to standard CPU execution...")
            self.session = ort.InferenceSession(model_path, providers=['CPUExecutionProvider'])
            self.acceleration = "Standard CPU Execution"
            print(f"STATUS: Running on {self.acceleration}")

    def preprocess(self, image_path):
        try:
            img = Image.open(image_path).convert('RGB')
            img = img.resize((224, 224))
            img_array = np.array(img).astype(np.float32) / 255.0
            
            mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
            std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
            img_array = (img_array - mean) / std
            img_array = img_array.astype(np.float32)
            
            img_array = np.transpose(img_array, (2, 0, 1))
            return np.expand_dims(img_array, axis=0)
        except Exception as e:
            print(f"Preprocessing Error: {e}")
            return None

    def softmax(self, x):
        e_x = np.exp(x - np.max(x))
        return e_x / e_x.sum(axis=0)

    def run(self, image_path):
        if self.session is None:
            return {"error": "AI Engine not initialized", "disease": "Error", "confidence": 0, "provider": "NONE"}
        
        try:
            input_name = self.session.get_inputs()[0].name
            processed_data = self.preprocess(image_path)
            if processed_data is None:
                return {"error": "Invalid Image", "disease": "Error", "confidence": 0, "provider": self.acceleration}

            outputs = self.session.run(None, {input_name: processed_data})[0][0]
            probabilities = self.softmax(outputs)
            class_idx = np.argmax(probabilities)
            confidence = float(probabilities[class_idx])
            
            class_name = "Unknown"
            if class_idx < len(self.classes):
                class_name = self.classes[class_idx]
            
            # Clean up class name (replace underscores)
            class_name = class_name.replace("___", " ").replace("_", " ") if class_name else "Unknown"

            return {
                "disease": class_name,
                "confidence": confidence,
                "provider": self.acceleration
            }
        except Exception as e:
            print(f"Inference Running Error: {e}")
            return {"error": str(e), "disease": "Inference Error", "confidence": 0, "provider": self.acceleration}

if __name__ == "__main__":
    # Test block
    engine = RyzenAIInference()
    print("AI Engine initialized successfully.")
    # If a test image exists, we could run it here.
    # result = engine.run("test.jpg")
    # print(f"Result: {result}")
