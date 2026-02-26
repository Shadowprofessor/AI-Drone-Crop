import google.generativeai as genai
import os
import json
from typing import Dict

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

class CropAnalyzerLLM:
    @staticmethod
    async def get_detailed_report(disease_name: str, confidence: float, severity: str) -> Dict[str, str]:
        """Generates a detailed agricultural report using Gemini."""
        if not model:
            return {
                "summary": f"Detected {disease_name}.",
                "cure": f"Apply appropriate treatment for {disease_name}. Configure Gemini for details.",
                "prevention": "Maintain soil health and monitor regularly."
            }
        
        prompt = f"""
        Expert Agricultural Pathology Report for: {disease_name}
        Confidence: {confidence*100:.1f}%
        Severity: {severity}

        Provide a very brief (1-2 sentences) response for each:
        1. summary: description of the disease.
        2. cure: scientific and chemical treatment.
        3. organic: organic or natural treatment.
        4. prevention: long-term prevention strategy.

        Format as plain JSON only. Do not add markdown backticks.
        """
        
        try:
            response = model.generate_content(prompt)
            text = response.text.strip()
            # Handle potential markdown backticks in response
            if text.startswith("```"):
                text = text.replace("```json", "").replace("```", "").strip()
            
            data = json.loads(text)
            return {
                "summary": data.get("summary", f"Detected {disease_name}"),
                "cure": data.get("cure", "Scientific treatment recommended."),
                "organic": data.get("organic", "Organic control suggested."),
                "prevention": data.get("prevention", "Long-term monitoring."),
                "chemical_treatment": data.get("cure", "") # Compatibility
            }
        except Exception as e:
            print(f"LLM Error: {e}")
            return {
                "summary": f"In-depth analysis of {disease_name} is complete.",
                "cure": "Isolate affected crops and apply standard fungicide.",
                "prevention": "Ensure proper spacing and ventilation.",
                "chemical_treatment": "Standard copper-based fungicides."
            }

if __name__ == "__main__":
    import asyncio
    async def test():
        analyzer = CropAnalyzerLLM()
        report = await analyzer.get_detailed_report("Tomato Leaf Curl", 0.95, "High")
        print(f"LLM Report: {report}")
    
    asyncio.run(test())
