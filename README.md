# AI-Based ESP LiteWing Drone for Crop Disease Analysis and Soil Intelligence (Premium Overhaul)

## 🚀 Project Overview
This project is an end-to-end precision agriculture system combining an aerial drone (ESP LiteWing) and ground-based IoT sensors to monitor crop health and soil conditions. 

**Key Features (v2.0 Premium):**
- **AMD Ryzen AI Integration:** Real-time ONNX inference on NPU/DPU for ultra-low latency pathogen detection.
- **LLM-Based Agricultural Analysis:** Integrated with Google Gemini to provide professional, actionable reports for every detection.
- **Next-Gen UI/UX:** High-fidelity dashboard built with React + Vite + Tailwind CSS featuring Glassmorphism, real-time telemetry, and micro-animations.
- **Edge Analytics Fusion:** Combines vision-based disease detection with subsurface NPK monitoring for accurate diagnosis.

**🔗 [Read the Full Design Document](./PROJECT_DESIGN_DOCUMENT.md)**

## 📂 Repository Structure

-   **`ai_engine/`**: 
    -   `ryzen_run.py`: AMD Ryzen AI optimized inference system.
    -   `analysis.py`: LLM reasoning engine for agricultural reporting.
-   **`backend/`**: Python FastAPI server for telemetry, database management, and analysis orchestration.
-   **`frontend/`**: React dashboard with premium mission control UI.
-   **`hardware/`**: Firmware for the ESP LiteWing Drone and Soil Intelligence Nodes.

## 🛠️ Tech Stack

### AI & Edge Computing (AMD Ecosystem)
-   **Inference:** Ryzen AI Software, Vitis AI (NPU Execution Provider), ONNX Runtime.
-   **Analysis:** Gemini 1.5 Flash (LLM) for diagnosis reporting.
-   **Training:** AMD ROCm + PyTorch.

### Web & Real-Time
-   **Backend:** FastAPI (Async Python), SQLAlchemy, SQLite.
-   **Frontend:** React 18, Vite, Framer Motion, Lucide Icons, Recharts, Tailwind CSS.

## ⚡ Getting Started

### 1. Configuration
Create a `.env` file in the `backend/` directory or root and add:
```env
GEMINI_API_KEY=your_google_gemini_api_key
THINGSPEAK_CHANNEL_ID=your_id
THINGSPEAK_API_KEY=your_key
```

### 2. Backend Setup
```bash
pip install -r requirements.txt
python backend/main.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📜 License
MIT License. Developed for AMD Ryzen AI agricultural innovation.
