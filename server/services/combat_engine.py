import random
from typing import List
from db import db
from schemas.tower import CombatLog, CombatEvent
from fastapi import HTTPException

async def simulate_combat(character_id: str, floor_number: int) -> CombatLog:
    # 1. Fetch Character Data
    character = await db.character.find_unique(
        where={"id": character_id},
        include={
            "stats": True,
            "playerItems": {
                "include": {"itemDefinition": True}
            },
            "playerSkills": {
                "include": {"skillDefinition": True}
            }
        }
    )
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    # 2. Fetch Floor and Enemy Data
    floor = await db.towerfloor.find_unique(
        where={"floorNumber": floor_number},
        include={"enemy": True}
    )
    if not floor or not floor.enemy:
        raise HTTPException(status_code=404, detail="Floor or enemy not found")

    enemy = floor.enemy

    # 3. Calculate Player Stats
    # Base Stats
    stats = character.stats
    base_strength = stats.strength if stats else 1
    base_knowledge = stats.knowledge if stats else 1
    base_endurance = stats.endurance if stats else 1
    base_recovery = stats.recovery if stats else 1
    base_focus = stats.focus if stats else 1
    base_discipline = stats.discipline if stats else 1

    # Equipment Multipliers & Combat Stats
    equip_attack = 0
    equip_defense = 0
    str_pct = 0
    knw_pct = 0
    end_pct = 0
    rec_pct = 0
    foc_pct = 0
    dis_pct = 0

    for item in character.playerItems:
        if item.isEquipped and item.itemDefinition:
            equip_attack += item.itemDefinition.attack
            equip_defense += item.itemDefinition.defense
            str_pct += item.itemDefinition.strength
            knw_pct += item.itemDefinition.knowledge
            end_pct += item.itemDefinition.endurance
            rec_pct += item.itemDefinition.recovery
            foc_pct += item.itemDefinition.focus
            dis_pct += item.itemDefinition.discipline

    # Effective stats scale organically with user's real-life base stats
    eff_strength = base_strength + int(base_strength * (str_pct / 100.0))
    eff_knowledge = base_knowledge + int(base_knowledge * (knw_pct / 100.0))
    eff_endurance = base_endurance + int(base_endurance * (end_pct / 100.0))
    eff_recovery = base_recovery + int(base_recovery * (rec_pct / 100.0))
    eff_focus = base_focus + int(base_focus * (foc_pct / 100.0))
    eff_discipline = base_discipline + int(base_discipline * (dis_pct / 100.0))

    # Final Combat Stats for Player
    player_hp = eff_endurance * 20
    player_max_hp = player_hp
    player_attack = (eff_strength * 2) + equip_attack
    player_defense = (eff_endurance * 1) + equip_defense
    player_speed = eff_focus * 2
    
    # Skills
    skills = []
    if character.playerSkills:
        for ps in character.playerSkills:
            if ps.skillDefinition:
                skills.append(ps.skillDefinition.name)

    # 4. Enemy Stats
    enemy_hp = enemy.hp
    enemy_max_hp = enemy.hp
    enemy_attack = enemy.attack
    enemy_defense = enemy.defense
    enemy_speed = enemy.speed

    # 5. Combat Loop
    events = []
    turn = 1
    total_damage_dealt = 0
    
    # Track skill usages to prevent spam
    used_heavy_strike = False
    used_berserk = False
    used_crushing_blow = False

    while player_hp > 0 and enemy_hp > 0:
        # Player Turn
        
        # Skill Checks
        skill_activated = None
        damage_multiplier = 1.0
        
        if "Berserk" in skills and (player_hp / player_max_hp) < 0.4 and not used_berserk:
            skill_activated = "Berserk"
            damage_multiplier = 1.8
            used_berserk = True
        elif "Crushing Blow" in skills and (enemy_hp / enemy_max_hp) < 0.3 and not used_crushing_blow:
            skill_activated = "Crushing Blow"
            damage_multiplier = 1.5
            used_crushing_blow = True
        elif "Heavy Strike" in skills and (player_hp / player_max_hp) > 0.7 and not used_heavy_strike:
            skill_activated = "Heavy Strike"
            damage_multiplier = 1.3
            used_heavy_strike = True

        # Calculate Stat & Elemental Weakness multipliers
        stat_weakness_hit = False
        element_weakness_hit = False

        if enemy.weaknessStat:
            ws = enemy.weaknessStat.lower()
            stat_val = getattr(stats, ws, 10) if stats else 10
            if stat_val >= 10:
                damage_multiplier *= 1.25
                stat_weakness_hit = True

        if enemy.resistanceStat: # Stores Elemental Weakness (Flame, Tempest, Tide, Earth, Ascension)
            we = enemy.resistanceStat.lower()
            if any(we in s.lower() for s in skills) or skill_activated or (base_knowledge >= 15):
                damage_multiplier *= 1.25
                element_weakness_hit = True

        raw_damage = player_attack * damage_multiplier - enemy_defense
        damage = int(max(1, raw_damage))
        
        # Critical hit
        is_crit = False
        if (base_focus * 0.1) > random.randint(1, 100):
            is_crit = True
            damage = int(damage * 1.5)

        enemy_hp -= damage
        total_damage_dealt += damage
        
        action_desc = "attacks"
        if skill_activated:
            action_desc = f"uses {skill_activated}"
        if stat_weakness_hit or element_weakness_hit:
            action_desc += " [WEAKNESS EXPLOITED]"
        if is_crit:
            action_desc += " (CRITICAL HIT)"
            
        events.append(CombatEvent(
            turn=turn,
            actor=character.name,
            action=action_desc,
            damage=damage,
            message=f"{character.name} {action_desc}, dealing {damage} damage."
        ))

        if enemy_hp <= 0:
            break

        # Enemy Turn
        enemy_raw_damage = enemy_attack - player_defense
        enemy_damage = int(max(1, enemy_raw_damage))
        
        player_hp -= enemy_damage
        events.append(CombatEvent(
            turn=turn,
            actor=enemy.name,
            action="attacks",
            damage=enemy_damage,
            message=f"{enemy.name} attacks, dealing {enemy_damage} damage."
        ))
        
        # Recovery phase
        if base_recovery > 10 and player_hp > 0:
            heal = int(base_recovery * 0.5)
            player_hp = min(player_max_hp, player_hp + heal)
            events.append(CombatEvent(
                turn=turn,
                actor=character.name,
                action="recovers",
                damage=0,
                message=f"{character.name} recovers {heal} HP."
            ))

        turn += 1
        if turn > 50: # safety break
            break

    is_victory = player_hp > 0 and enemy_hp <= 0
    
    return CombatLog(
        isVictory=is_victory,
        turnsElapsed=turn,
        playerHpRemaining=max(0, player_hp),
        enemyHpRemaining=max(0, enemy_hp),
        totalDamageDealt=total_damage_dealt,
        events=events
    )
