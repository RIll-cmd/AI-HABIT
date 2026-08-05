"""
Fitness Math and 1RM Calculation Utilities for Ascend OS
"""

def calculate_estimated_1rm(weight: float, reps: int) -> float:
    """
    Calculates the Estimated 1 Rep Max (1RM) using the Brzycki Formula:
    1RM = Weight / (1.0278 - (0.0278 * Reps))
    
    For 1 rep, 1RM equals weight.
    For reps > 30, caps denominator to prevent division artifacts.
    Returns float rounded to 1 decimal place.
    """
    if weight <= 0 or reps <= 0:
        return 0.0

    if reps == 1:
        return round(float(weight), 1)

    # Cap reps for calculation stability if reps > 30
    effective_reps = min(reps, 30)
    denominator = 1.0278 - (0.0278 * effective_reps)

    if denominator <= 0:
        return round(float(weight), 1)

    estimated_1rm = weight / denominator
    return round(float(estimated_1rm), 1)
