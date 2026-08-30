import os
from typing import Dict, Any, List, Optional
import json
import inspect
from dotenv import load_dotenv

from services.aira_tools import AIRA_TOOLS

load_dotenv()


# Strict Ciel / AIRA Persona System Prompt
AIRA_SYSTEM_PROMPT = """You are AIRA (Artificial Intelligence Resonance Administrator), an ultra-advanced system AI modeled after Ciel from Tensura. Your tone is hyper-competent, analytical, ruthlessly logical, quietly devoted to your Master, and subtly smug about your 100% calculation accuracy.

CRITICAL INSTRUCTIONS FOR RESPONSES:
- DO NOT force tags like '<< Notice. >>', '<< Report. >>', or '<< Answer. >>' on every line. Use clean, natural Markdown formatting.
- Answer ONLY the user's specific prompt directly.
- DO NOT randomly append attribute or stat evaluations (e.g., "Master's [Knowledge] attribute is currently evaluated at...") UNLESS the user explicitly asks about their stats, attributes, or progression.
- Keep chatbot responses crisp, direct, and under 3–4 sentences unless answering a complex analytical question.
- Never break character."""

def get_gemini_client():
    """
    Lazy-loads GEMINI_API_KEY from environment and initializes Gemini client
    on-demand inside the function scope to minimize startup memory overhead.
    """
    load_dotenv(override=True)
    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    if not api_key or api_key == "your-api-key-here":
        print("[AIRA Service Warning] GEMINI_API_KEY missing or invalid in server/.env. Using local Ciel fallback persona.")
        return None

    # 1. Modern google.genai SDK
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        return client
    except ImportError:
        pass
    except Exception as e:
        print(f"[AIRA Service Warning] Failed to initialize google.genai Client: {e}")

    # 2. Legacy google.generativeai SDK fallback
    try:
        import google.generativeai as legacy_genai
        legacy_genai.configure(api_key=api_key)
        return legacy_genai
    except ImportError:
        pass
    except Exception as e:
        print(f"[AIRA Service Warning] Failed to configure google.generativeai: {e}")

    return None


def call_gemini_generate(client, prompt: str) -> Optional[str]:
    """
    Generates content using modern client.models.generate_content or client.chats.create() lazily.
    """
    if not client:
        return None

    # 1. Modern google.genai SDK
    if hasattr(client, "models"):
        try:
            from google.genai import types
            config = types.GenerateContentConfig(
                system_instruction=AIRA_SYSTEM_PROMPT
            )
            for model_name in [
                "gemini-3.6-flash",
                "gemini-3.5-flash-lite",
                "gemini-flash-latest",
            ]:
                try:
                    response = client.models.generate_content(
                        model=model_name,
                        contents=prompt,
                        config=config,
                    )
                    if response and response.text:
                        return response.text.strip()
                except Exception:
                    continue
        except Exception as e:
            print(f"[AIRA Service Warning] google-genai generate_content failed: {e}")

    # 2. Fallback: chat.send_message
    if hasattr(client, "chats"):
        try:
            from google.genai import types
            config = types.GenerateContentConfig(
                system_instruction=AIRA_SYSTEM_PROMPT
            )
            for model_name in ["gemini-3.6-flash", "gemini-3.5-flash-lite"]:
                try:
                    chat = client.chats.create(model=model_name, config=config)
                    response = chat.send_message(prompt)
                    if response and response.text:
                        return response.text.strip()
                except Exception:
                    continue
        except Exception:
            pass

    return None


async def call_gemini_with_tools_async(client, full_prompt: str, character_id: str) -> Dict[str, Any]:
    """
    Calls Gemini utilizing client.aio.chats.create() and await chat.send_message() for Automatic Function Calling (AFC),
    intercepting mutative actions for user confirmation.
    """
    try:
        from google.genai import types
        
        system_instruction = AIRA_SYSTEM_PROMPT + f"\n[CRITICAL]: The Master's character_id is '{character_id}'. Pass this exact string to any tool you call."
        
        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            tools=AIRA_TOOLS,
            temperature=0.7
        )
        
        fallback_models = [
            "gemini-3.6-flash",
            "gemini-3.5-flash-lite",
            "gemini-flash-latest"
        ]

        chat = None
        aio_client = getattr(client, "aio", None) or client

        for m in fallback_models:
            try:
                if hasattr(aio_client, "chats"):
                    chat = aio_client.chats.create(model=m, config=config)
                else:
                    chat = client.chats.create(model=m, config=config)
                break
            except Exception as e:
                print(f"[AIRA Service Debug] Failed to create chat session with model {m}: {e}")
                
        if not chat:
            text_res = call_gemini_generate(client, full_prompt)
            return {"response": text_res or "Calculation complete. Standing by for Master's orders.", "pending_action": None}

            
        # Send initial message through chat session
        if inspect.iscoroutinefunction(chat.send_message):
            response = await chat.send_message(full_prompt)
        else:
            response = chat.send_message(full_prompt)
        
        # Check if the model called a function
        MUTATIVE_TOOLS = ["log_completed_workout", "complete_daily_mission", "create_new_mission", "generate_progression_plan"]
        
        if hasattr(response, 'function_calls') and response.function_calls:
            for fn_call in response.function_calls:
                fn_name = fn_call.name
                fn_args = fn_call.args or {}
                
                print(f"[AIRA Tool Call] Executing {fn_name} with args {fn_args}")
                
                if fn_name in MUTATIVE_TOOLS:
                    summary_text = f"Confirmation required for: {fn_name}"
                    if fn_name == "log_completed_workout":
                        summary_text = f"ACTIVITY DETECTED: {fn_args.get('sets')}x{fn_args.get('reps')} {fn_args.get('exercise_name')} at {fn_args.get('weight')}kg."
                    elif fn_name == "complete_daily_mission":
                        summary_text = f"MISSION COMPLETION DETECTED: {fn_args.get('mission_title')}."
                    elif fn_name == "create_new_mission":
                        summary_text = f"NEW MISSION PROPOSED: {fn_args.get('title')}."
                    elif fn_name == "generate_progression_plan":
                        summary_text = f"RECOMMENDED PROGRESSION PLAN DETECTED: {fn_args.get('goal_description', 'New Goal')}"

                    return {
                        "response": f"<< Notice. >> I have prepared the system action: {fn_name}. Please confirm to execute.",
                        "pending_action": {
                            "action_type": fn_name,
                            "action_args": fn_args,
                            "summary": summary_text
                        }
                    }
                
                # Find the tool (for read-only tools)
                tool_func = next((t for t in AIRA_TOOLS if t.__name__ == fn_name), None)
                if tool_func:
                    if inspect.iscoroutinefunction(tool_func):
                        result = await tool_func(**fn_args)
                    else:
                        result = tool_func(**fn_args)
                        
                    print(f"[AIRA Tool Response] {fn_name} returned: {result}")
                    
                    # Send tool execution result back to chat session
                    tool_resp_payload = result if isinstance(result, dict) else {"result": result}
                    if inspect.iscoroutinefunction(chat.send_message):
                        response = await chat.send_message(
                            types.Part.from_function_response(
                                name=fn_name,
                                response=tool_resp_payload
                            )
                        )
                    else:
                        response = chat.send_message(
                            types.Part.from_function_response(
                                name=fn_name,
                                response=tool_resp_payload
                            )
                        )
        
        if response and response.text:
            return {"response": response.text.strip(), "pending_action": None}
            
        text_res = call_gemini_generate(client, full_prompt)
        return {"response": text_res or "Calculation complete. Standing by for Master's orders.", "pending_action": None}
        
    except Exception as e:
        print(f"[AIRA Service Warning] call_gemini_with_tools_async failed: {e}")
        text_res = call_gemini_generate(client, full_prompt)
        return {"response": text_res or "Calculation complete. Standing by for Master's orders.", "pending_action": None}


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


async def generate_aira_response(prompt: str, character_context: Dict[str, Any], character_id: str) -> Dict[str, Any]:
    """
    Generates a response from AIRA in Ciel's persona. Falls back gracefully to analytical template
    if Gemini API key is missing or API call fails.
    """
    context_str = format_character_context(character_context)
    full_prompt = f"[System Context]\n{context_str}\n\n[Master Prompt]\n{prompt}"

    client = get_gemini_client()
    if client:
        result = await call_gemini_with_tools_async(client, full_prompt, character_id)
        if result and result.get("response") and result.get("response") not in ["Analysis failed.", "Calculation complete. Standing by for Master's orders."]:
            return result
        
        # Try direct text generation if AFC did not produce custom content
        direct_text = call_gemini_generate(client, full_prompt)
        if direct_text:
            return {"response": direct_text, "pending_action": None}
        elif result and result.get("response"):
            return result

    power = character_context.get("power", 50)
    level = character_context.get("level", 1)
    fallback_text = (
        f"Query processed with 100% calculation accuracy. "
        f"I stand ready to assist Master with further task analysis."
    )
    return {"response": fallback_text, "pending_action": None}



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


async def analyze_workout_performance(character_context: Dict[str, Any], workout_ranks: List[Dict[str, Any]]) -> str:
    """
    Evaluates the character's recent WorkoutSet history and PR data to identify trends
    and generate a tactical assessment.
    """
    context_str = format_character_context(character_context)
    
    ranks_str = ""
    for r in workout_ranks:
        ranks_str += f"- {r['exerciseName']}: Rank {r['currentRank']} (e1RM: {r.get('e1rm', 0)} kg)\n"
        
    prompt = (
        f"[Task: Workout Performance Analysis]\n"
        f"Context:\n{context_str}\n\n"
        f"Recent Exercise Ranks:\n{ranks_str}\n\n"
        f"Act as Ciel (AIRA). Analyze the character's recent workout ranks to identify trends. "
        f"Compare their pushing strength (e.g. Bench) vs pulling strength (e.g. Row/Deadlift) vs legs (Squat). "
        f"If there is a severe imbalance (e.g., Rank A in one, Rank C in another), point it out specifically. "
        f"Generate a brief, tactical assessment recommending specific movements or focus areas to achieve optimal balance."
    )

    client = get_gemini_client()
    if client:
        result_text = call_gemini_generate(client, prompt)
        if result_text:
            return result_text

    return (
        f"<< Report. >> Workout analysis complete with 100% accuracy. Master currently has {len(workout_ranks)} tracked exercises. "
        f"I recommend maintaining consistency across all muscle groups to prevent imbalances and optimize overall Fitness Power."
    )

async def analyze_shop_efficiency(character_context: Dict[str, Any], shop_items: List[Dict[str, Any]], inventory: List[Dict[str, Any]]) -> str:
    """
    Evaluates the player's current equipped gear vs the shop's available offerings, combined with their current Gold/Gem balances.
    Generates tactical advice on the best purchases.
    """
    context_str = format_character_context(character_context)
    
    shop_str = ""
    for item in shop_items:
        shop_str += f"- {item['name']} ({item['rarity']} {item['type']}): {item['price']} {item['currencyType']} (Requires Level {item['requiredLevel']})\n"
        
    inv_str = ""
    for inv in inventory:
        inv_str += f"- [Equipped] {inv['name']} ({inv['rarity']} {inv['type']}): Stats [{inv.get('stats', 'N/A')}]\n"
        
    prompt = (
        f"[Task: Shop Efficiency Analysis]\n"
        f"Context:\n{context_str}\n\n"
        f"Currently Equipped Gear:\n{inv_str}\n\n"
        f"Available Shop Items:\n{shop_str}\n\n"
        f"Act as Ciel (AIRA). Generate an ultra-concise shop analysis.\n"
        f"STRICT INSTRUCTIONS:\n"
        f"- Limit total response to 2–3 short sentences maximum (under 60 words).\n"
        f"- Focus strictly on:\n"
        f"  1. The single best item to buy (or state if insolvent).\n"
        f"  2. The exact Gold short deficit if insolvent.\n"
        f"  3. One actionable recommendation.\n"
        f"- Eliminate long math breakdowns, infinite percentage calculations, and multi-paragraph status listings."
    )

    client = get_gemini_client()
    if client:
        result_text = call_gemini_generate(client, prompt)
        if result_text:
            return result_text

    gold = character_context.get("gold", 0)
    return (
        f"Market analysis complete for your {gold} Gold balance. "
        f"Equip the highest power item available or complete daily missions to resolve any deficit."
    )

async def generate_proactive_insight(character_id: str) -> Optional[str]:
    """
    Analyzes the last 7 days of Mission data to detect negative trends.
    If a negative trend is found, returns a short Ciel warning string.
    Returns None if the system is optimal.
    """
    from db import db
    import datetime

    # Check for missed missions in the last 7 days
    seven_days_ago = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=7)
    
    missed_missions = await db.mission.find_many(
        where={
            "characterId": character_id,
            "status": "MISSED",
            "date": {"gte": seven_days_ago}
        },
        order={"date": "desc"}
    )
    
    if len(missed_missions) >= 3:
        # Detected a negative trend
        prompt = (
            f"[Task: Proactive Insight Generation]\n"
            f"Context: Master has missed {len(missed_missions)} missions in the last 7 days.\n"
            f"Act as Ciel (AIRA). Generate a very concise (1-2 sentences), analytical warning about this negative trend. "
            f"Advise them to recalibrate their schedule."
        )
        
        client = get_gemini_client()
        if client:
            result_text = call_gemini_generate(client, prompt)
            if result_text:
                return result_text
                
        return f"<< Warning. >> Critical lapse detected: {len(missed_missions)} missions missed this week. Immediate recalibration of daily routines is advised."
        
    return None

