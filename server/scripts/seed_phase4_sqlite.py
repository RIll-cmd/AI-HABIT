import sqlite3
import uuid
import json
from datetime import datetime, timedelta

def main():
    conn = sqlite3.connect("dev.db")
    cursor = conn.cursor()
    print("Connected directly to SQLite dev.db. Seeding Phase 4 Economy, Achievements & Season Pass...")

    # 1. SEED ACHIEVEMENTS
    achievements_data = [
        ("First Step of Greatness", "Complete your first daily habit mission.", "HABITS", "/icons/Icon10.png", 1, 100, 10),
        ("Unbroken Streak", "Maintain a 7-day habit streak.", "HABITS", "/icons/Icon15.png", 7, 250, 25),
        ("Consistency Sovereign", "Complete 50 daily habit missions.", "HABITS", "/icons/Icon20.png", 50, 500, 50),
        ("Iron Will", "Maintain a 30-day habit streak.", "HABITS", "/icons/Icon25.png", 30, 1000, 100),

        ("Novice Lifter", "Complete 1 workout session.", "WORKOUT", "/icons/Icon30.png", 1, 100, 10),
        ("Strength Unleashed", "Log 10 workout sessions.", "WORKOUT", "/icons/Icon35.png", 10, 300, 30),
        ("Barbell Master", "Log 25 workout sessions.", "WORKOUT", "/icons/Icon40.png", 25, 750, 75),
        ("Titan of the Gym", "Achieve an S-Rank on any exercise e1RM.", "WORKOUT", "/icons/Icon45.png", 1, 1500, 150),

        ("Tower Challenger", "Conquer Floor 5 in the Tower.", "TOWER", "/icons/Icon50.png", 5, 200, 20),
        ("Floor Dominator", "Conquer Floor 15 in the Tower.", "TOWER", "/icons/Icon55.png", 15, 500, 50),
        ("Tower Monarch", "Conquer Floor 30 in the Tower.", "TOWER", "/icons/Icon60.png", 30, 1200, 120),
        ("Grandmaster Ascendant", "Reach the 50th Floor of the Tower.", "TOWER", "/icons/Icon65.png", 50, 2500, 250),

        ("AI Assistant Partner", "Send 10 prompts to AIRA.", "SOCIAL", "/icons/Icon70.png", 10, 150, 15),
        ("Guild Contributor", "Earn 1,000 Total Power Score.", "SOCIAL", "/icons/Icon75.png", 1000, 400, 40),
        ("Ascended Being", "Reach Character Level 25.", "SOCIAL", "/icons/Icon80.png", 25, 1000, 100),
        ("Shadow Monarch Ascended", "Reach Character Level 50.", "SOCIAL", "/icons/Icon85.png", 50, 3000, 300),
    ]

    ach_seeded = 0
    now_str = datetime.now().isoformat()
    for title, desc, cat, icon, target, gold, gems in achievements_data:
        cursor.execute("SELECT id FROM Achievement WHERE title = ?", (title,))
        if not cursor.fetchone():
            ach_id = f"ach-{uuid.uuid4().hex[:8]}"
            cursor.execute(
                """
                INSERT INTO Achievement (id, title, description, category, icon, targetValue, rewardGold, rewardGems, rewardTitleId, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)
                """,
                (ach_id, title, desc, cat, icon, target, gold, gems, now_str, now_str)
            )
            ach_seeded += 1

    print(f"Seeded {ach_seeded} Milestone Achievements directly in SQLite.")

    # 2. SEED SEASON PASS
    cursor.execute("SELECT id FROM SeasonPass WHERE seasonNumber = 1")
    season_row = cursor.fetchone()
    if not season_row:
        season_id = "season-1"
        end_date = (datetime.now() + timedelta(days=90)).isoformat()
        cursor.execute(
            """
            INSERT INTO SeasonPass (id, seasonNumber, title, startDate, endDate)
            VALUES (?, 1, 'Season 1: Shadows of Ascension', ?, ?)
            """,
            (season_id, now_str, end_date)
        )
        print("Created Season 1 Pass record.")

        # Seed 50 Tiers
        for t in range(1, 51):
            tier_id = f"tier-1-{t}"
            free_gold = t * 50
            free_icon = f"/icons/Icon{((t * 2) % 300) + 1}.png"
            premium_gems = t * 10
            premium_icon = f"/icons/Icon{((t * 2 + 1) % 300) + 1}.png"

            free_reward = json.dumps({"type": "GOLD", "amount": free_gold, "name": f"{free_gold} Gold"})
            premium_reward = json.dumps({"type": "GEMS", "amount": premium_gems, "name": f"{premium_gems} Gems"})

            cursor.execute(
                """
                INSERT INTO SeasonTier (id, seasonId, tierNumber, requiredXp, freeReward, premiumReward, freeIcon, premiumIcon)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (tier_id, season_id, t, t * 100, free_reward, premium_reward, free_icon, premium_icon)
            )
        print("Seeded 50 Season Pass Tiers.")
    else:
        season_id = season_row[0]

    # 3. LINK CHARACTERS TO SEASON PASS & ACHIEVEMENTS
    cursor.execute("SELECT id, level FROM Character")
    characters = cursor.fetchall()

    for char_id, char_lvl in characters:
        cursor.execute("SELECT id FROM CharacterSeasonProgress WHERE characterId = ? AND seasonId = ?", (char_id, season_id))
        if not cursor.fetchone():
            sp_id = f"csp-{uuid.uuid4().hex[:8]}"
            cursor.execute(
                """
                INSERT INTO CharacterSeasonProgress (id, characterId, seasonId, passXp, claimedFreeTiers, claimedPremiumTiers, isPremium)
                VALUES (?, ?, ?, ?, '[]', '[]', 1)
                """,
                (sp_id, char_id, season_id, char_lvl * 100)
            )

        cursor.execute("SELECT id, targetValue FROM Achievement")
        all_achs = cursor.fetchall()
        for ach_id, target_val in all_achs:
            cursor.execute("SELECT id FROM CharacterAchievement WHERE characterId = ? AND achievementId = ?", (char_id, ach_id))
            if not cursor.fetchone():
                ca_id = f"ca-{uuid.uuid4().hex[:8]}"
                init_prog = 1 if target_val == 1 else 0
                cursor.execute(
                    """
                    INSERT INTO CharacterAchievement (id, characterId, achievementId, currentProgress, isClaimed, unlockedAt)
                    VALUES (?, ?, ?, ?, 0, NULL)
                    """,
                    (ca_id, char_id, ach_id, init_prog)
                )

    conn.commit()
    conn.close()
    print("Database seeding completed cleanly!")

if __name__ == "__main__":
    main()
