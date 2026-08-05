import re
from typing import Dict, Any, Optional
from db import db


def fuzzy_match_exercise_name(search_term: str, exercises: list) -> Optional[Any]:
    """
    Fuzzy matches a search term against a list of Exercise objects.
    Returns the best matching Exercise or None.
    """
    search = search_term.lower().strip()
    if not search:
        return None

    best_match = None
    best_score = -1

    search_words = set(search.split())

    for ex in exercises:
        ex_name_lower = ex.name.lower()
        ex_words = set(ex_name_lower.split())

        # Exact match check
        if search == ex_name_lower:
            return ex

        # Substring match
        if search in ex_name_lower or ex_name_lower in search:
            score = 80 + len(ex_name_lower)
            if score > best_score:
                best_score = score
                best_match = ex
            continue

        # Token intersection score
        common_words = search_words.intersection(ex_words)
        if common_words:
            score = len(common_words) * 20
            if score > best_score:
                best_score = score
                best_match = ex

    return best_match


async def parse_workout_text(input_text: str) -> Dict[str, Any]:
    """
    Parses natural language workout text like:
    - "Bench Press 60 for 8"
    - "Squat 100 5"
    - "barbell bench press 80kg 10 reps rpe 8"
    
    Extracts: exerciseId, exercise, weight, reps, rpe, restTime.
    """
    clean_text = input_text.strip()
    if not clean_text:
        return {"error": "Input text is empty"}

    # Extract optional RPE if present (e.g., "rpe 8" or "rpe 8.5")
    rpe_val: Optional[float] = None
    rpe_match = re.search(r'\brpe\s*([0-9]+(?:\.[0-9]+)?)\b', clean_text, re.IGNORECASE)
    if rpe_match:
        rpe_val = float(rpe_match.group(1))
        # Remove RPE substring for cleaner number parsing
        clean_text = re.sub(r'\brpe\s*[0-9]+(?:\.[0-9]+)?\b', '', clean_text, flags=re.IGNORECASE).strip()

    # Extract numbers for weight and reps
    # Patterns like: "60 for 8", "60kg 8 reps", "60 8", "60x8", "60 * 8"
    pattern = r'(\d+(?:\.\d+)?)\s*(?:kg|lbs)?\s*(?:for|x|\*|\s+)\s*(\d+)\s*(?:reps)?'
    match = re.search(pattern, clean_text, re.IGNORECASE)

    weight = 0.0
    reps = 0

    if match:
        weight = float(match.group(1))
        reps = int(match.group(2))
        # Exercise name is everything before the match
        name_part = clean_text[:match.start()].strip()
        if not name_part:
            # Fallback if exercise name is after numbers
            name_part = clean_text[match.end():].strip()
    else:
        # Fallback regex to find all numbers in sequence
        numbers = re.findall(r'\b\d+(?:\.\d+)?\b', clean_text)
        if len(numbers) >= 2:
            weight = float(numbers[0])
            reps = int(numbers[1])
            name_part = re.sub(r'\b\d+(?:\.\d+)?\b', '', clean_text).strip()
        elif len(numbers) == 1:
            weight = float(numbers[0])
            reps = 10  # default fallback reps
            name_part = re.sub(r'\b\d+(?:\.\d+)?\b', '', clean_text).strip()
        else:
            return {"error": "Could not identify weight and reps in input text"}

    # Fetch exercises to perform fuzzy match
    all_exercises = await db.exercise.find_many()
    matched_exercise = fuzzy_match_exercise_name(name_part, all_exercises)

    if not matched_exercise:
        # Fallback: if no match found, pick first exercise or bench press
        matched_exercise = all_exercises[0] if all_exercises else None

    if not matched_exercise:
        return {"error": "No exercise found in database"}

    return {
        "exercise": matched_exercise,
        "exerciseId": matched_exercise.id,
        "weight": weight,
        "reps": reps,
        "rpe": rpe_val,
        "parsedText": input_text,
    }
