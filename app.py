import os
import json
import logging
import random
from datetime import datetime, timedelta
from flask import Flask, render_template, request, jsonify

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = Flask(__name__)

try:
    from flask_cors import CORS
    CORS(app)
except ImportError:
    pass

import prompts

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai_client = None
if GEMINI_API_KEY:
    try:
        from google import genai
        genai_client = genai.Client(api_key=GEMINI_API_KEY)
        logger.info("Google Gemini Client initialized successfully.")
    except Exception as e:
        logger.warning(f"Could not initialize Google GenAI SDK: {e}. Using Stadia fallback generator.")

# In-memory Conversation Memory (Session ID -> List of turns)
CONVERSATION_SESSIONS = {}

def get_match_status():
    """Derive current match stage and time awareness based on server datetime."""
    now = datetime.now()
    schedule_path = os.path.join(os.path.dirname(__file__), 'schedule.json')
    
    match_name = "USA vs Mexico (Group Stage)"
    status = "Pre-Match (Gates Open, Fan Fest Active)"
    
    if os.path.exists(schedule_path):
        try:
            with open(schedule_path, 'r') as f:
                data = json.load(f)
                matches = data.get("matches", [])
                if matches:
                    m = matches[0]
                    match_name = f"{m['teams']} ({m['stage']})"
                    kickoff = datetime.fromisoformat(m['kickoff'])
                    if now < kickoff:
                        diff = kickoff - now
                        hours = diff.seconds // 3600
                        mins = (diff.seconds % 3600) // 60
                        status = f"Pre-Match (Kickoff in {hours}h {mins}m)"
                    elif kickoff <= now <= kickoff + timedelta(minutes=105):
                        status = "LIVE MATCH IN PROGRESS"
                    else:
                        status = "Post-Match (Egress Traffic Active)"
        except Exception as e:
            logger.warning(f"Error loading schedule.json: {e}")

    return f"Server Time: {now.strftime('%Y-%m-%d %H:%M:%S')}\nMatch: {match_name}\nStatus: {status}"


def get_conversation_history(session_id: str):
    return CONVERSATION_SESSIONS.get(session_id, [])

def save_conversation_turn(session_id: str, user_text: str, bot_text: str):
    if session_id not in CONVERSATION_SESSIONS:
        CONVERSATION_SESSIONS[session_id] = []
    sess = CONVERSATION_SESSIONS[session_id]
    sess.append({"user": user_text, "bot": bot_text})
    if len(sess) > 6:
        sess.pop(0)


def generate_ai_response(prompt: str, module: str = "general", language: str = "English", session_id: str = "default") -> str:
    time_info = get_match_status()
    history = get_conversation_history(session_id)
    
    history_str = ""
    if history:
        history_str = "\nPrevious Conversation History:\n" + "\n".join([f"User: {h['user']}\nStadia: {h['bot']}" for h in history])

    system_instruction = prompts.get_system_prompt(module, language, time_info)
    full_prompt = f"{system_instruction}\n{history_str}\n\nUser Request: {prompt}"

    logger.info(f"[AI Query] Session: '{session_id}' | Module: '{module}' | Lang: '{language}' | Prompt: '{prompt}'")

    if genai_client:
        try:
            try:
                response = genai_client.models.generate_content(
                    model="gemini-1.5-flash",
                    contents=full_prompt,
                )
            except Exception as model_err:
                logger.warning(f"gemini-1.5-flash failed ({model_err}), trying gemini-2.0-flash...")
                response = genai_client.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=full_prompt,
                )

            if response and hasattr(response, 'text') and response.text:
                bot_text = response.text.strip()
                save_conversation_turn(session_id, prompt, bot_text)
                return bot_text
        except Exception as e:
            logger.error(f"Gemini API call error: {e}. Switching to Stadia intelligent fallback engine.")

    bot_text = get_smart_fallback_response(prompt, module, language)
    save_conversation_turn(session_id, prompt, bot_text)
    return bot_text


def get_smart_fallback_response(prompt: str, module: str, language: str) -> str:
    p_lower = prompt.lower()

    if module == "admin_insights":
        return """- **Gate B Congestion:** Gate B crowd density is currently high. Deploy 2 additional turnstile stewards from Gate A.
- **Parking Capacity Alert:** Parking Lot P1 is at 92% capacity. Update electronic VMS signs to redirect incoming vehicles to Lot P2.
- **Concourse Flow:** Concourse Level 1 food court queue is building up. Activate secondary beverage stations to balance demand."""

    if module == "staff_decision_support":
        if "medical" in p_lower:
            return """**ACTION:** Dispatch Medical Response Team 2 to site immediately. Establish clear perimeter.
**NOTIFY:** First Aid Command & Medical Director.
**URGENCY:** CRITICAL"""
        elif "overcrowd" in p_lower or "gate" in p_lower:
            return """**ACTION:** Open auxiliary overflow lanes at Gate C. Divert incoming queue via loudspeaker announcements.
**NOTIFY:** Crowd Operations & Security Supervisor.
**URGENCY:** HIGH"""
        elif "security" in p_lower:
            return """**ACTION:** Send Security Patrol Unit 4 to investigate quadrant. Review CCTV feed on Monitor 3.
**NOTIFY:** Stadium Security Desk & Police Liaison.
**URGENCY:** HIGH"""
        elif "weather" in p_lower:
            return """**ACTION:** Announce weather advisory over PA system. Ensure concourse drainage gates are clear.
**NOTIFY:** Operations Control Center & Safety Lead.
**URGENCY:** MEDIUM"""
        else:
            return """**ACTION:** Send Engineering Maintenance Tech to inspect reported equipment.
**NOTIFY:** Facility Management & IT Support.
**URGENCY:** LOW"""

    if language == "Spanish":
        return f"¡Hola! Soy **Stadia**, tu asistente oficial del Estadio FIFA 2026. 🏆\n\nCon respecto a **'{prompt}'**:\n- Consulta nuestro mapa 3D interactivo para ubicar tus puertas y zonas.\n- Si necesitas transporte post-partido, el Metro opera cada 2 minutos."

    if language == "French":
        return f"Bonjour ! Je suis **Stadia**, votre assistant officiel du Stade FIFA 2026. ⚽\n\nConcernant **'{prompt}'** :\n- Utilisez notre carte 3D interactive pour trouver les portes et la zone de restauration.\n- Les premiers secours se trouvent au concourse principal."

    if language == "Portuguese":
        return f"Olá! Sou **Stadia**, assistente oficial do Estádio Copa do Mundo FIFA 2026! 🏟️\n\nSobre **'{prompt}'**:\n- Clique no mapa 3D para visualizar o caminho até seu bloco.\n- Opções Halal, Veganas e estações de água gratuitas no Concourse B."

    if language == "Hindi":
        return f"नमस्ते! मैं **स्टैडिया (Stadia)** हूँ — फीफा विश्व कप 2026 स्टेडियम सहायक! ⚽\n\nआपके प्रश्न **'{prompt}'** का उत्तर:\n- 3D मैप देखें। मुफ़्त पानी पीने के स्टेशन और प्राथमिक चिकित्सा उपलब्ध हैं।"

    if module == "emergency" or "help" in p_lower or "emergency" in p_lower:
        return """🚨 **STADIA EMERGENCY SAFETY ACTION PLAN**

1. **Remain Calm & Follow Officers:** Proceed to the nearest illuminated exit or Green Emergency Sign.
2. **Nearest First Aid Bay:** Located at **Concourse B (Gate A)** & **East Annex (Gate B)**.
3. **Emergency Hotline:** Call **911** or notify stadium security staff (+1-800-FIFA-911) immediately."""

    # Dynamic keyword-based topic routing for general questions
    if any(k in p_lower for k in ["gate", "entrance", "entry", "door", "ingress"]):
        if "b" in p_lower:
            return "🚪 **Gate B (East Plaza):** Features Express Pass and General Admission lanes. Current queue wait time is estimated at ~6 minutes. Select Gate B on our 3D Map for animated navigation!"
        elif "c" in p_lower:
            return "🚪 **Gate C (South Concourse):** Direct connection from the Metro Hub. Queue flow is fast (<3 mins). Follow the green illuminated overhead signs from the station exit."
        elif "d" in p_lower:
            return "🚪 **Gate D (West Plaza):** Dedicated entry for Media, VIP Hospitality, and Team Bus Bays. Accessible ramps available."
        else:
            return "🚪 **Gate A (North Plaza):** Main entry plaza featuring VIP suites and full wheelchair accessibility ramps. Gate queues are currently running smoothly (<3 mins wait time)."

    if any(k in p_lower for k in ["match", "time", "kickoff", "schedule", "start", "game", "when"]):
        time_status = get_match_status()
        return f"⚽ **FIFA World Cup 2026 Match Schedule & Time Status:**\n\n{time_status}\n\n- Gates open 3 hours prior to kickoff. Arrive early to enjoy the Fan Zone activities on the North Plaza!"

    if any(k in p_lower for k in ["washroom", "restroom", "toilet", "bathroom", "accessible"]):
        return "🚻 **Stadium Restroom Facilities:**\n- **Men's Restrooms:** Located at Concourse Level 1 (near Block 1) & Gate B.\n- **Women's Restrooms:** Located at Concourse Level 1 (near Block 2) & Gate A.\n- **Accessible & Family Washrooms:** Available near Gate C and Block 1 with braille signage and automatic doors."

    if any(k in p_lower for k in ["food", "eat", "drink", "canteen", "snack", "halal", "vegan", "water", "hungry"]):
        return "🍔 **Stadium Dining & Refreshments:**\n- **Main Food Court (Gate B):** Serving Halal kebabs, Vegan grain bowls, Gluten-Free options, and gourmet burgers.\n- **Free Hydration Stations:** Located at Concourse A & B for refilling reusable bottles.\n- **Payment:** All stadium food stalls are 100% cashless (Cards & Mobile Pay accepted)."

    if any(k in p_lower for k in ["medical", "first aid", "doctor", "cpr", "hospital", "injury", "sick", "aed"]):
        return "🏥 **Medical & First Aid Services:**\n- **Primary Medical Room:** East Annex near Gate B (Doctor & Paramedic staff on site).\n- **First Aid Post:** Concourse A near Gate A.\n- **AED Defibrillators:** Available at all Security Desks. Call **+1-800-FIFA-911** for urgent dispatch."

    if any(k in p_lower for k in ["bag", "policy", "security", "rule", "prohibited", "allowed", "item", "camera"]):
        return "🛡️ **Stadium Security & Clear Bag Policy:**\n- **Permitted Bags:** Clear plastic bags up to 12\" x 6\" x 12\" or small clutch bags (A4 size).\n- **Prohibited Items:** Professional camera lenses (>6\"), weapons, glass bottles, umbrellas, and pyrotechnics.\n- **Locker Storage:** Temporary bag storage available outside Gate A & C."

    if any(k in p_lower for k in ["metro", "bus", "parking", "car", "transit", "transport", "uber", "ride"]):
        return "🚍 **Transport & Exit Guidance:**\n- **Metro Direct:** Station connects directly to Gate C. Trains run every 2 minutes post-match.\n- **Parking (P1/P2):** Located East of Gate B. EV Charging stations available on Level 1.\n- **Rideshare / Taxi Zone:** West Lawn pickup zone near Gate D."

    if any(k in p_lower for k in ["lost", "child", "found", "missing", "item"]):
        return "🔍 **Lost & Found / Missing Persons:**\n- **Information Desk 3:** Located near Gate B for all lost items and guest assistance.\n- **Child Safety:** Free wristbands with parent phone numbers are available at all entrance gates."

    if any(k in p_lower for k in ["merchandise", "shop", "jersey", "shirt", "souvenir", "store"]):
        return "🛍️ **Official Fan Merchandise Store:**\n- Located on the Main Concourse between Gate A and Gate D. Open throughout matchday!"

    return f"""⚽ **Hello! I am Stadia, your World Cup 2026 AI Assistant.**

Regarding **'{prompt}'**:
- **3D Navigation:** Use our 3D Map to click and fly to any of our 25+ stadium POIs.
- **Facility Support:** Food courts, washrooms, first aid, ATMs, and prayer rooms are open.
- **Need Directions?** Select your destination above to generate a 3D animated route line!"""


def generate_follow_up_chips(prompt: str, module: str) -> list:
    p_lower = prompt.lower()
    if module == "emergency" or "help" in p_lower or "medical" in p_lower:
        return ["Show nearest Medical Room on 3D Map", "Call Emergency Hotline", "Where is Lost & Found?"]
    elif "food" in p_lower or "drink" in p_lower:
        return ["Show Food Court on 3D Map", "Where are Free Water Stations?", "Are concessions cashless?"]
    else:
        return ["Show 3D Navigation Route", "Check Gate Wait Times", "What is the Bag Policy?"]


# --- REST API ENDPOINTS ---

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    prompt = (data.get("prompt") or data.get("message") or "").strip()
    language = data.get("language", "English")
    module = data.get("module", "general")
    session_id = data.get("session_id", "default")

    if not prompt:
        return jsonify({"error": "Prompt cannot be empty"}), 400

    response_text = generate_ai_response(prompt, module, language, session_id)
    follow_ups = generate_follow_up_chips(prompt, module)

    return jsonify({
        "status": "success",
        "prompt": prompt,
        "language": language,
        "module": module,
        "response": response_text,
        "follow_ups": follow_ups,
        "timestamp": datetime.now().isoformat()
    })


@app.route("/api/navigate", methods=["POST"])
def navigate():
    data = request.get_json() or {}
    origin = data.get("origin", "Gate A").strip()
    destination = data.get("destination", "Food Court").strip()
    language = data.get("language", "English")
    session_id = data.get("session_id", "default")

    prompt = f"Give step-by-step walking directions from '{origin}' to '{destination}' inside the stadium."
    ai_directions = generate_ai_response(prompt, module="navigation", language=language, session_id=session_id)

    return jsonify({
        "status": "success",
        "origin": origin,
        "destination": destination,
        "estimated_time": "3-5 mins",
        "directions": ai_directions,
        "follow_ups": ["Show on 3D Map", "Find nearest Restroom along route", "Check crowd at destination"]
    })


@app.route("/api/crowd", methods=["POST"])
def crowd():
    data = request.get_json() or {}
    density = data.get("density", "Medium")
    zone = data.get("zone", "Gate A")
    language = data.get("language", "English")
    session_id = data.get("session_id", "default")

    prompt = f"Crowd density at {zone} is {density}. What is the recommended entrance route and wait time estimate?"
    response_text = generate_ai_response(prompt, module="general", language=language, session_id=session_id)

    return jsonify({
        "status": "success",
        "density": density,
        "zone": zone,
        "recommendation": response_text,
        "suggested_alternate_gate": "Gate A" if density == "High" else "Gate B"
    })


@app.route("/api/emergency", methods=["POST"])
def emergency():
    data = request.get_json() or {}
    emergency_type = data.get("type", "Medical").strip()
    location = data.get("location", "Concourse A").strip()
    language = data.get("language", "English")
    session_id = data.get("session_id", "default")

    prompt = f"EMERGENCY ALERT: Type '{emergency_type}' at location '{location}'. Provide urgent safety steps and nearest help point."
    response_text = generate_ai_response(prompt, module="emergency", language=language, session_id=session_id)

    return jsonify({
        "status": "emergency_logged",
        "type": emergency_type,
        "location": location,
        "instructions": response_text,
        "hotline": "+1-800-FIFA-911"
    })


@app.route("/api/accessibility", methods=["POST"])
def accessibility():
    data = request.get_json() or {}
    category = data.get("category", "Wheelchair").strip()
    language = data.get("language", "English")
    session_id = data.get("session_id", "default")

    prompt = f"Provide accessibility assistance for a visitor needing {category} support at the stadium."
    response_text = generate_ai_response(prompt, module="accessibility", language=language, session_id=session_id)

    return jsonify({
        "status": "success",
        "category": category,
        "guide": response_text
    })


@app.route("/api/transport", methods=["POST"])
def transport():
    data = request.get_json() or {}
    mode = data.get("mode", "Metro").strip()
    language = data.get("language", "English")

    prompt = f"Provide transit instructions and schedule details for visitors taking the {mode}."
    response_text = generate_ai_response(prompt, module="transport", language=language)

    return jsonify({
        "status": "success",
        "mode": mode,
        "advice": response_text
    })


@app.route("/api/sustainability", methods=["GET", "POST"])
def sustainability():
    language = request.args.get("language", "English") if request.method == "GET" else (request.get_json() or {}).get("language", "English")
    prompt = "Give 3 quick eco tips for stadium visitors to reduce waste and carbon footprint today."
    response_text = generate_ai_response(prompt, module="sustainability", language=language)

    return jsonify({
        "status": "success",
        "tips": response_text
    })


@app.route("/api/ticket-lookup", methods=["POST"])
def ticket_lookup():
    """Validates scanned QR code ticket ID against mock ticket database tickets.json."""
    data = request.get_json() or {}
    ticket_id = (data.get("ticket_id") or data.get("ticketId") or "").strip().upper()

    if not ticket_id:
        return jsonify({"status": "error", "message": "No ticket ID provided."}), 400

    tickets_path = os.path.join(os.path.dirname(__file__), 'tickets.json')
    tickets_db = {}

    if os.path.exists(tickets_path):
        try:
            with open(tickets_path, 'r') as f:
                tickets_db = json.load(f)
        except Exception as e:
            logger.error(f"Error reading tickets.json: {e}")

    if ticket_id in tickets_db:
        ticket = tickets_db[ticket_id]
        return jsonify({
            "status": "success",
            "found": True,
            "ticket": ticket,
            "match_status": get_match_status(),
            "timestamp": datetime.now().isoformat()
        })
    else:
        return jsonify({
            "status": "not_found",
            "found": False,
            "ticket_id": ticket_id,
            "message": f"Ticket ID '{ticket_id}' not found in World Cup 2026 database."
        }), 444 if False else 200


@app.route("/api/faq", methods=["GET"])
def faq():
    faqs = [
        {"q": "What items are prohibited inside the stadium?", "a": "Large bags (>12x6x12 in), weapons, glass containers, professional cameras, and pyrotechnics."},
        {"q": "How early do stadium gates open before kickoff?", "a": "Gates open exactly 3 hours prior to match kickoff. We recommend arriving at least 90 minutes early."},
        {"q": "Is re-entry allowed if I leave the stadium?", "a": "No re-entry is permitted once your digital ticket is scanned at entry gates."},
        {"q": "Where are the lost and found booths?", "a": "Lost & Found is located at Information Desk 3 near Gate B."},
        {"q": "Is food and beverage payment cashless?", "a": "Yes, all stadium concessions and fan shops are 100% cashless (Visa/Mastercard/Apple Pay/Google Pay accepted)."}
    ]
    return jsonify({"status": "success", "faqs": faqs})


@app.route("/api/dashboard-stats", methods=["GET"])
def dashboard_stats():
    visitor_count = random.randint(64500, 68000)
    gate_densities = {
        "Gate A": random.choice(["Low", "Medium"]),
        "Gate B": random.choice(["Medium", "High"]),
        "Gate C": random.choice(["Low", "Medium"]),
        "Gate D": random.choice(["Low", "Medium"])
    }
    return jsonify({
        "status": "success",
        "total_capacity": 70000,
        "current_visitors": visitor_count,
        "occupancy_rate": round((visitor_count / 70000) * 100, 1),
        "gate_densities": gate_densities,
        "active_emergency_alerts": random.randint(0, 2),
        "ai_queries_processed": random.randint(1420, 2100),
        "match_status": get_match_status(),
        "timestamp": datetime.now().strftime("%H:%M:%S")
    })


# --- NEW ADD-ON ROUTE 1: AI OPERATIONAL INTELLIGENCE INSIGHTS ---
@app.route("/api/admin/insights", methods=["POST"])
def admin_insights():
    """Generates 2-4 actionable staff recommendations grounded in live telemetry metrics."""
    data = request.get_json() or {}
    metrics = data.get("metrics", {
        "current_visitors": 66240,
        "occupancy_rate": 94.6,
        "gate_densities": {"Gate A": "Low", "Gate B": "High", "Gate C": "Medium", "Gate D": "Low"},
        "active_emergency_alerts": 0
    })

    prompt = f"Live Telemetry Metrics: Visitors={metrics.get('current_visitors')}, Occupancy={metrics.get('occupancy_rate')}%, Gate Densities={metrics.get('gate_densities')}, Active Alerts={metrics.get('active_emergency_alerts')}. Generate 2-4 short, specific, actionable recommendations for stadium staff."
    insights_text = generate_ai_response(prompt, module="admin_insights", language="English")

    return jsonify({
        "status": "success",
        "metrics_evaluated": metrics,
        "recommendations": insights_text,
        "timestamp": datetime.now().strftime("%H:%M:%S")
    })


# --- NEW ADD-ON ROUTE 2: REAL-TIME DECISION SUPPORT (STAFF CONSOLE) ---
@app.route("/api/staff/incident", methods=["POST"])
def staff_incident():
    """Generates structured command-style action steps, target department, and urgency level for staff."""
    data = request.get_json() or {}
    incident_type = data.get("type", "Overcrowding").strip()
    details = data.get("details", "").strip()

    prompt = f"STAFF INCIDENT REPORT: Type '{incident_type}'. Details: '{details if details else 'Standard operational dispatch request.'}' Provide immediate staff action, department to notify, and urgency level."
    response_text = generate_ai_response(prompt, module="staff_decision_support", language="English")

    # Determine urgency classification
    urgency = "HIGH"
    if "medical" in incident_type.lower() or "critical" in response_text.lower():
        urgency = "CRITICAL"
    elif "weather" in incident_type.lower() or "equipment" in incident_type.lower():
        urgency = "MEDIUM"
    elif "low" in response_text.lower():
        urgency = "LOW"

    return jsonify({
        "status": "incident_logged",
        "type": incident_type,
        "details": details,
        "action_plan": response_text,
        "urgency": urgency,
        "timestamp": datetime.now().strftime("%H:%M:%S")
    })


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "gemini_connected": genai_client is not None,
        "app": "Smart Stadium AI",
        "persona": "Stadia",
        "version": "2.1.0"
    })


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
