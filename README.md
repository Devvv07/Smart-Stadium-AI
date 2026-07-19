# 🏟️ Smart Stadium AI — FIFA World Cup 2026

An intelligent, full-stack, GenAI-powered web application built for **FIFA World Cup 2026**, featuring an immersive **3D interactive stadium map**, real-time AI assistant ("Stadia"), crowd density analytics, emergency safety dispatch, staff operational decision support, and multi-language speech AI.

---

## 1. Project Overview

**Smart Stadium AI** is a modern stadium operations and fan experience platform designed for high-capacity sporting venues like the FIFA World Cup 2026. Powered by **Flask**, **Google Gemini 1.5 Flash**, and **Three.js**, it bridges the gap between spectator navigation and real-time operational staff command. The app provides fans with interactive 3D wayfinding, food & service locators, and voice AI assistance while giving stadium staff real-time telemetry, crowd balancing recommendations, and structured incident management tools.

---

## 2. Features

- **🤖 AI Stadium Assistant ("Stadia"):** Context-aware conversational AI persona trained on stadium rules, seating blocks, dining, and live match schedule context.
- **🗺️ Interactive 3D Stadium Map:** Built with Three.js (r128), featuring 25+ clickable Points of Interest (POIs), category filter chips, search bar, and camera fly-to animations.
- **🛣️ Animated 3D Route Navigation:** Generates step-by-step walking instructions and draws a glowing 3D Catmull-Rom route path connecting selected POIs.
- **👥 Crowd Density & Intelligence:** Evaluates live gate congestion levels (Low, Medium, High) and recommends alternate gates to balance crowd flow.
- **🚨 Emergency SOS Safety Action Plan:** Instant safety guidance for Medical, Lost Child, Fire, or Security incidents with direct hotline details (+1-800-FIFA-911).
- **♿ Accessibility Assistant:** Specialized assistance for wheelchair access, visually/hearing impaired visitors, seniors, and family facilities.
- **🌱 Transport & Sustainability Hub:** Transit schedules (Metro, Bus, Parking), eco-friendly tips, zero single-use plastic guidelines, and free hydration point maps.
- **❓ Tournament FAQ Hub:** Searchable preset Q&A database for official FIFA World Cup 2026 stadium policies (bags, gates, cashless payment).
- **📊 Real-Time Admin Telemetry Dashboard:** Live telemetry stats including stadium capacity, occupancy rates, active alerts, and AI query counters.
- **💡 AI Operational Insights:** Grounded staff recommendations (`POST /api/admin/insights`) based on live visitor numbers and gate congestion.
- **🛠️ Staff Decision Support Console:** Command-style incident action plans (`POST /api/staff/incident`) with target department dispatch and urgency classification (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
- **🔀 Fan / Staff Role Switcher:** Navbar mode toggle to switch views between Fan navigation and Staff Operator view with `localStorage` state persistence.
- **🌐 Multi-Language Speech & UI:** Full UI translation and Gemini voice responses for 5 languages (English, Spanish, French, Portuguese, Hindi) with Web Speech API integration.

---

## 3. Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JS (ES6+) | UI structure, custom dark theme, dynamic DOM updates |
| **Styling & UI** | Bootstrap 5, FontAwesome | Responsive grid, icons, modals, and control panels |
| **3D Graphics** | Three.js (r128) | WebGL rendering, 3D mesh building, lighting, POI markers & route animation |
| **Backend** | Python 3.10+, Flask | REST API endpoints, routing, and conversation memory sessions |
| **WSGI Server** | Gunicorn | Production web server for Render deployment |
| **AI Engine** | Google Gemini API (`google-genai`) | LLM model (`gemini-1.5-flash`) with custom persona grounding |
| **Voice / Audio** | Web Speech API | SpeechRecognition for voice input and SpeechSynthesis for Text-to-Speech |
| **Testing** | Pytest / Unittest | Automated test suite for backend routes and fallback handlers |
| **Hosting** | Render | Cloud deployment platform using Web Service runtime |

---

## 4. Project Structure

```text
Smart_Stadium_AI/
├── app.py                  # Core Flask backend server handling REST API endpoints & Gemini integration
├── prompts.py              # Persona engine ("Stadia"), grounding knowledge base JSON & system prompts
├── schedule.json           # Match schedule database used for time-aware responses and kickoff countdowns
├── requirements.txt        # Python package dependencies with pinned versions for Render deployment
├── Procfile                # Web process configuration for Gunicorn server on Render/Heroku
├── render.yaml             # Render Infrastructure-as-Code (Blueprint) configuration file
├── .env.example            # Environment variables template for API keys and configuration
├── .gitignore              # Specifies intentional untracked files to exclude from Git
├── README.md               # Complete project documentation and Render deployment guide
├── static/                 # Static web assets
│   ├── css/
│   │   └── style.css       # Main stylesheet for dark theme styling, glassmorphism, and UI animations
│   └── js/
│       ├── main.js         # Core frontend orchestration, navigation forms, language & role handling
│       ├── chat.js         # AI Chat logic, conversation history management, and voice speech synthesis
│       ├── dashboard.js    # Admin telemetry stats, staff console handlers, and AI insights integration
│       └── three-scene.js  # Three.js 3D stadium scene setup, POI 3D markers, camera fly, and route drawing
├── templates/
│   └── index.html          # Main HTML single-page web app template containing all sections & modals
└── tests/
    ├── test_api.py         # Pytest API test suite verifying all Flask REST endpoints
    └── test_api_unittest.py # Standard Python unittest suite for backend logic
```

---

## 5. Run Locally

Follow these step-by-step instructions to run Smart Stadium AI on your local machine:

### Step 1: Clone the repository
Downloads a copy of the project source code from GitHub to your computer.
```bash
git clone https://github.com/<your-username>/Smart_Stadium_AI.git
cd Smart_Stadium_AI
```

### Step 2: Create and activate a virtual environment
Creates an isolated Python environment so dependencies do not interfere with your global Python installation.
```bash
# Create virtual environment named 'venv'
python -m venv venv

# Activate on Windows (PowerShell or Command Prompt):
venv\Scripts\activate

# Activate on macOS / Linux:
source venv/bin/activate
```

### Step 3: Install project dependencies
Installs all required Python libraries (Flask, Gunicorn, google-genai, etc.) listed in `requirements.txt`.
```bash
pip install -r requirements.txt
```

### Step 4: Set up environment variables
Creates your local configuration file from the template.
```bash
# Copy template to .env
cp .env.example .env     # Linux/Mac
copy .env.example .env   # Windows Command Prompt
```
Open `.env` in any text editor and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### Step 5: Start the Flask application
Launches the local development server.
```bash
python app.py
```
Open your web browser and navigate to: **`http://localhost:5000`**

---

## 6. Environment Variables

| Variable | Description | Required | Default | Where to Get |
|---|---|---|---|---|
| `GEMINI_API_KEY` | API Key for Google Gemini LLM API | **Yes** (optional for mock fallbacks) | *None* | [Google AI Studio](https://aistudio.google.com/) |
| `FLASK_ENV` | Environment mode (`development` or `production`) | No | `development` | Self-defined |
| `PORT` | HTTP port on which the Flask web server listens | No | `5000` | Defined by host / Render |

---

## 7. Gemini API Key Setup

Smart Stadium AI uses Google's Gemini 1.5 Flash model for natural language understanding and responses. Follow these simple steps to obtain your free key:

1. **Visit Google AI Studio:** Open your browser and go to [https://aistudio.google.com/](https://aistudio.google.com/).
2. **Sign In:** Log in with your Google account.
3. **Generate API Key:** Click **"Get API key"** in the top navigation, then click **"Create API key in new project"**.
4. **Copy Key:** Copy the generated secret key string.
5. **Paste into `.env`:** Open your local `.env` file and replace `your_gemini_api_key_here` with your key:
   ```env
   GEMINI_API_KEY=AIzaSyD...your_copied_key_here
   ```

*(Note: If no API key is provided, the application automatically falls back to built-in smart mock responses so the app remains fully functional.)*

---

## 8. Deploy on Render — FULL STEP-BY-STEP

Render is a cloud hosting platform that lets you host web applications for free. Follow this complete beginner-friendly walkthrough to deploy Smart Stadium AI:

### Step 1: Push project code to GitHub
Make sure your project repository is uploaded to your GitHub account:
```bash
git add .
git commit -m "Prepare Smart Stadium AI for Render deployment"
git push origin main
```

### Step 2: Sign in to Render
1. Go to [https://render.com](https://render.com).
2. Click **"GET STARTED FOR FREE"** or **"Sign In"**.
3. Choose **"Continue with GitHub"** to grant Render access to your repository.

### Step 3: Create a new Web Service
1. On your Render Dashboard, click the blue **"New +"** button in the top-right corner.
2. Select **"Web Service"** from the drop-down menu.
3. Select **"Build and deploy from a Git repository"** and click **Next**.
4. Find `Smart_Stadium_AI` in your repository list and click **"Connect"**.

### Step 4: Configure Web Service settings
Fill in the deployment settings on the configuration form exactly as shown in this table:

| Setting | Value to Enter | Explanation |
|---|---|---|
| **Name** | `smart-stadium-ai` | The name of your service (becomes part of your URL) |
| **Language / Environment** | `Python 3` | Tells Render to use a Python container |
| **Region** | `Oregon (US West)` | Choose the region closest to you or your audience |
| **Branch** | `main` | The Git branch Render pulls your code from |
| **Root Directory** | *(Leave blank)* | Uses project root directory |
| **Build Command** | `pip install -r requirements.txt` | Command Render runs to install dependencies |
| **Start Command** | `gunicorn app:app` | Command Render runs to launch the production server |
| **Instance Type** | `Free` | Free tier ($0/month) |

### Step 5: Add Environment Variable (`GEMINI_API_KEY`)
Before clicking create, scroll down to the **"Environment Variables"** section:
1. Click **"Add Environment Variable"**.
2. Set **Key:** `GEMINI_API_KEY`
3. Set **Value:** `your_copied_gemini_api_key` *(paste your key from Google AI Studio)*.
4. *(Optional)* Add a second variable: Key = `PYTHON_VERSION`, Value = `3.10.12`.

### Step 6: Create Web Service & monitor build
1. Click the blue **"Create Web Service"** button at the bottom of the page.
2. Render will begin building your container. You will see live terminal logs streaming on your screen:
   - Installing Python packages from `requirements.txt`
   - Setting up Gunicorn WSGI server
3. Build typically takes **2 to 4 minutes**. Wait until you see the log message:
   `==> Your service is live 🎉`

### Step 7: Access your live website
At the top-left of your Render service page, find your live website URL (e.g., `https://smart-stadium-ai.onrender.com`). Click the URL to open your deployed application live on the web!

---

### 🛠️ Render Troubleshooting Guide

| Issue / Error | Cause | How to Fix |
|---|---|---|
| **Build Error: `No module named ...`** | Missing package in `requirements.txt` | Ensure all imported libraries are listed in `requirements.txt` and push changes to GitHub. |
| **Deploy Error: `Port already in use` or timeout** | Flask dev server started instead of Gunicorn | Double check that **Start Command** is set to `gunicorn app:app`, not `python app.py`. |
| **Gemini API Error: `API key not found`** | Environment variable missing in Render dashboard | Go to Render Service -> **Environment** tab -> Add `GEMINI_API_KEY` and click **Save Changes** (triggers re-deploy). |
| **First page load takes 30-50 seconds** | Render Free Tier "Spin Down" | Free tier web services go to sleep after 15 minutes of inactivity. The first request wakes up the service (cold start). This is normal behavior. |
| **500 Internal Server Error** | Missing configuration or crash in code | Check the **Logs** tab in your Render dashboard to read exact Python tracebacks. |

---

## 9. Screenshots

*(Drop your application screenshots into a `screenshots/` directory to display them here)*

![Smart Stadium AI Hero & 3D Map](screenshots/hero_3d_map.png)
*Figure 1: 3D Interactive Stadium Map with POI Markers and Route Path*

![Admin Dashboard & AI Operational Insights](screenshots/admin_dashboard.png)
*Figure 2: Real-time Telemetry Dashboard and Staff Decision Support Console*

---

## 10. Future Scope

While Smart Stadium AI currently features a comprehensive suite of 3D and AI operational capabilities, future planned enhancements include:

- **📱 AR Indoor Wayfinding:** Augmented Reality overlay for mobile browser camera navigation inside concourses.
- **📡 IoT Hardware Sensor Integration:** Live MQTT connections to turnstile counters and parking occupancy sensors for real-time telemetry feed.
- **🎟️ QR Ticket Scanner Integration:** Mobile QR scanner module for digital ticket verification and seat directional guidance.
- **🚗 Predictive Parking Slot Reservation:** AI forecasting model for parking slot allocation based on pre-game traffic ingress patterns.
- **🔊 Multi-Speaker Spatial Audio:** Directional stadium crowd noise simulation for interactive 3D venue previews.

---

## 11. License

This project is licensed under the **MIT License**.

```text
MIT License

Copyright (c) 2026 Smart Stadium AI Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
