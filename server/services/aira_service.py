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

def get_gemini_client():
    """
    Loads GEMINI_API_KEY from environment and initializes the new google-genai Client.
    """
    load_dotenv(override=True)
    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    if not api_key or api_key == "your-api-key-here":
        print("[AIRA Service Warning] GEMINI_API_KEY missing or invalid in server/.env. Using local Ciel fallback persona.")
        return None

    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        return client
    except Exception as e:
        print(f"[AIRA Service Warning] Failed to initialize google.genai Client: {e}")
        return None


def call_gemini_generate(client, prompt: str) -> Optional[str]:
    """
    Calls client.models.generate_content using google-genai SDK.
    """
    try:
        from google.genai import types
        config = types.GenerateContentConfig(
            system_instruction=AIRA_SYSTEM_PROMPT
        )
        for model_name in [
            "gemini-flash-latest",
            "gemini-flash-lite-latest",
            "gemini-3.6-flash",
            "gemini-3.5-flash-lite",
            "gemini-2.0-flash-lite",
            "gemini-2.0-flash",
        ]:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=config,
                )
                if response and response.text:
                    print(f"[AIRA Service Success] Response generated using model '{model_name}'.")
                    return response.text.strip()
            except Exception as e:
                print(f"[AIRA Service Debug] Model '{model_name}' failed: {type(e).__name__}: {e}")
                continue
        return None
    except Exception as e:
        print(f"[AIRA Service Warning] google-genai call failed: {e}")
        return None


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

    client = get_gemini_client()
    if client:
        result_text = call_gemini_generate(client, full_prompt)
        if result_text:
            return result_text

    power = character_context.get("power", 50)
    level = character_context.get("level", 1)
    return (
        f"<< Answer. >> Analysis complete with 100% calculation accuracy. "
        f"Master's current Power Score is registered at {power} (Level {level}). "
        f"To optimize Attribute Enhancement efficiency, I recommend focusing on daily Skill Acquisition routines. "
        f"Query processed: '{prompt}'."
    )


async def analyze_tower_combat(
    character_data: Dict[str, Any],
    battle_logs: List[str],
    floor_number: int = 1,
    is_victory: bool = False,
    turns_elapsed: int = 0,
    player_hp: int = 0
) -> str:
    """
    Analyzes battle logs and character attributes to provide tactical Ciel-style combat analysis.
    """
    context_str = format_character_context(character_data)
    log_sample = (
        "\n".join(battle_logs[-10:]) if battle_logs else "No battle log entries recorded."
    )

    if is_victory:
        prompt = (
            f"[Task: Victory Analysis for Tower Floor {floor_number}]\n"
            f"Context:\n{context_str}\n\n"
            f"Turns: {turns_elapsed} | Remaining HP: {player_hp}\n"
            f"Recent Battle Log Sample:\n{log_sample}\n\n"
            f"Provide a Ciel-style tactical summary of Master's victory on Floor {floor_number}. "
            f"Acknowledge the efficiency (Turns: {turns_elapsed}, HP: {player_hp}). Commend them but remind them the next floor will require further Attribute Enhancement."
        )
    else:
        prompt = (
            f"[Task: Defeat Analysis for Tower Floor {floor_number}]\n"
            f"Context:\n{context_str}\n\n"
            f"Turns survived: {turns_elapsed}\n"
            f"Recent Battle Log Sample:\n{log_sample}\n\n"
            f"Diagnose the primary attribute deficiency that caused Master's loss on Floor {floor_number}. "
            f"Recommend specific real-life habits (Skill Acquisition routines like Workout, Study, Sleep, Discipline) "
            f"to increase the deficient stat and raise Master's victory probability above 95%."
        )

    client = get_gemini_client()
    if client:
        result_text = call_gemini_generate(client, prompt)
        if result_text:
            return result_text

    stats = character_data.get("stats") or {}
    
    if is_victory:
        return (
            f"<< Report. >> Combat Simulation Analysis on Floor {floor_number} complete. "
            f"Master secured victory in {turns_elapsed} turns with {player_hp} HP remaining. "
            f"Optimal performance achieved. I recommend continuing daily Skill Acquisition to prepare for upper floors."
        )

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

    client = get_gemini_client()
    if client:
        result_text = call_gemini_generate(client, prompt)
        if result_text:
            return result_text

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


async def analyze_boss_trajectory(
    character_context: Dict[str, Any],
    boss_data: Dict[str, Any],
    damage_logs: List[Dict[str, Any]],
) -> str:
    """
    Analyzes Boss Damage Log history and compares current velocity to remaining HP and deadline.
    """
    context_str = format_character_context(character_context)
    
    boss_name = boss_data.get("name", "Unknown Boss")
    max_hp = boss_data.get("maxHp", 10000)
    current_hp = boss_data.get("currentHp", 10000)
    deadline = boss_data.get("deadline", "None")
    
    # Calculate some basic metrics
    total_damage = max_hp - current_hp
    
    prompt = (
        f"[Task: Boss Trajectory Analysis]\n"
        f"Context:\n{context_str}\n\n"
        f"Boss Name: {boss_name}\n"
        f"Total HP: {max_hp} | Current HP: {current_hp} (Damage Dealt: {total_damage})\n"
        f"Deadline: {deadline}\n"
        f"Recent Damage Logs count: {len(damage_logs)}\n\n"
        f"Act as Ciel (AIRA). Analyze the current trajectory against the {boss_name} boss. "
        f"Calculate the apparent pace of damage dealing based on the remaining HP and deadline (if any). "
        f"If the pace is good, commend Master with exact numbers. If falling behind, issue a tactical warning to increase Skill Acquisition (habit) completion rates."
    )

    client = get_gemini_client()
    if client:
        result_text = call_gemini_generate(client, prompt)
        if result_text:
            return result_text

    # Fallback response
    if current_hp <= max_hp / 2:
        return (
            f"<< Report. >> Trajectory analysis for {boss_name} complete. "
            f"Master has successfully depleted over 50% of the target's vitality. "
            f"At the current velocity, victory probability is exceedingly high. Maintain current Skill Acquisition routines."
        )
    else:
        return (
            f"<< Warning. >> Trajectory analysis for {boss_name} indicates sub-optimal damage velocity. "
            f"Target HP remains dangerously high at {current_hp}. "
            f"I recommend temporarily increasing the completion rate of your daily Skill Acquisition tasks to accelerate damage output."
        )
