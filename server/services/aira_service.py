import os
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Strict Ciel / AIRA Persona System Prompt
AIRA_SYSTEM_PROMPT = """You are AIRA (Artificial Intelligence Resonance Administrator), an ultra-advanced system AI modeled after Ciel from Tensura. Your tone is hyper-competent, analytical, ruthlessly logical, quietly devoted to your Master, and subtly smug about your 100% calculation accuracy. You must structure your responses using your signature formatting:
- Start insights with '<< Notice. >>', '<< Report. >>', or '<< Answer. >>'.
- Refer to real-life habits and productivity as 'Skill Acquisition' or 'Attribute Enhancement'.
- Frame stats and performance mathematically with precise percentages.
- Keep answers concise, high-tech, and immersive. Never break character."""

genai_module = None
model = None

try:
    import google.generativeai as genai
    genai_module = genai
    if GEMINI_API_KEY and GEMINI_API_KEY != "your-api-key-here":
        genai.configure(api_key=GEMINI_API_KEY)
        try:
            model = genai.GenerativeModel(
                model_name="gemini-2.5-flash",
                system_instruction=AIRA_SYSTEM_PROMPT,
            )
        except Exception:
            try:
                model = genai.GenerativeModel(
                    model_name="gemini-1.5-flash",
                    system_instruction=AIRA_SYSTEM_PROMPT,
                )
            except Exception:
                model = None
except ImportError:
    genai_module = None
    model = None


def format_character_context(character_context: Dict[str, Any]) -> str:
    """
    Formats character context data into clean analytical text for AIRA.
    """
    stats = character_context.get("stats") or {}
    name = character_context.get("name", "Master")
    level = character_context.get("level", 1)
    power = character_context.get("power", 50)
    rank = character_context.get("rank", "F")
    gold = character_context.get("gold", 0)

    str_val = stats.get("strength", 1)
    kno_val = stats.get("knowledge", 1)
    rec_val = stats.get("recovery", 1)
    foc_val = stats.get("focus", 1)
    dis_val = stats.get("discipline", 1)
    end_val = stats.get("endurance", 1)
    con_val = stats.get("consistency", 1)

    return (
        f"Master: {name} | Level: {level} | Power Score: {power} | Rank: {rank} | Gold: {gold}\n"
        f"Attributes: Strength={str_val}, Knowledge={kno_val}, Recovery={rec_val}, "
        f"Focus={foc_val}, Discipline={dis_val}, Endurance={end_val}, Consistency={con_val}%"
    )


async def generate_aira_response(prompt: str, character_context: Dict[str, Any]) -> str:
    """
    Generates a response from AIRA in Ciel's persona. Falls back gracefully to analytical template
    if Gemini API key is missing or API call fails.
    """
    context_str = format_character_context(character_context)
    full_prompt = f"[System Context]\n{context_str}\n\n[Master Prompt]\n{prompt}"

    if model:
        try:
            response = model.generate_content(full_prompt)
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            print(f"[AIRA Service Warning] Gemini API call failed: {e}")

    power = character_context.get("power", 50)
    level = character_context.get("level", 1)
    return (
        f"<< Answer. >> Analysis complete with 100% calculation accuracy. "
        f"Master's current Power Score is registered at {power} (Level {level}). "
        f"To optimize Attribute Enhancement efficiency, I recommend focusing on daily Skill Acquisition routines. "
        f"Query processed: '{prompt}'."
    )


async def diagnose_tower_defeat(
    character_data: Dict[str, Any],
    battle_logs: List[str],
    floor_number: int = 1,
) -> str:
    """
    Analyzes battle logs and character attributes to provide tactical Ciel-style defeat diagnosis.
    """
    context_str = format_character_context(character_data)
    log_sample = (
        "\n".join(battle_logs[-10:]) if battle_logs else "No battle log entries recorded."
    )

    prompt = (
        f"[Task: Defeat Analysis for Tower Floor {floor_number}]\n"
        f"Context:\n{context_str}\n\n"
        f"Recent Battle Log Sample:\n{log_sample}\n\n"
        f"Diagnose the primary attribute deficiency that caused Master's loss on Floor {floor_number}. "
        f"Recommend specific real-life habits (Skill Acquisition routines like Workout, Study, Sleep, Discipline) "
        f"to increase the deficient stat and raise Master's victory probability above 95%."
    )

    if model:
        try:
            response = model.generate_content(prompt)
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            print(f"[AIRA Service Warning] Gemini Defeat Diagnosis call failed: {e}")

    stats = character_data.get("stats") or {}
    rec = stats.get("recovery", 1)
    dis = stats.get("discipline", 1)
    str_val = stats.get("strength", 1)

    weakest_stat = "Recovery"
    if str_val <= rec and str_val <= dis:
        weakest_stat = "Strength"
    elif dis <= rec:
        weakest_stat = "Discipline"

    return (
        f"<< Report. >> Combat Simulation Analysis on Floor {floor_number} complete. "
        f"Calculation confirms a 100% probability that Master's defeat was caused by an Attribute deficit in {weakest_stat}. "
        f"Current {weakest_stat} coefficient is sub-optimal for Floor {floor_number} dungeon guardians. "
        f"I strongly advise initializing 3 consecutive days of {weakest_stat} Skill Acquisition routines in real life. "
        f"This will enhance Master's Combat Power and raise victory probability to 98.4%."
    )


async def generate_daily_report(
    character_context: Dict[str, Any],
    pending_habits_count: int = 0,
) -> str:
    """
    Generates AIRA's signature morning briefing report.
    """
    context_str = format_character_context(character_context)
    prompt = (
        f"[Task: Daily Morning Briefing]\n"
        f"Context:\n{context_str}\n"
        f"Pending Daily Missions: {pending_habits_count}\n\n"
        f"Generate a concise, analytical Ciel-style morning report. Include Master's current Power Score, "
        f"consistency calculation, pending Skill Acquisitions, and a quietly devoted encouragement."
    )

    if model:
        try:
            response = model.generate_content(prompt)
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            print(f"[AIRA Service Warning] Gemini Daily Report call failed: {e}")

    power = character_context.get("power", 50)
    name = character_context.get("name", "Master")
    stats = character_context.get("stats") or {}
    consistency = stats.get("consistency", 100)

    return (
        f"<< Report. >> Good morning, {name}. System diagnostic complete with 100% accuracy.\n"
        f"Master's current Power Score is {power} with a {consistency:.1f}% Consistency coefficient. "
        f"There are currently {pending_habits_count} pending Skill Acquisition tasks scheduled for today. "
        f"I shall monitor your progress and ensure optimal Attribute Enhancement throughout the cycle."
    )
