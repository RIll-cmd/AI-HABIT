import asyncio
import os
from prisma import Prisma

# Ensure environment variables are loaded
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

async def main():
    print("Starting shop seed...")
    db = Prisma()
    await db.connect()
    
    try:
        # We need to find some items to seed.
        # "Iron Sword", "EXP Potion", "Guardian's Blade"
        # Since exact names might vary or be absent, let's try to query some standard types.
        print("Querying for some items to populate the shop...")
        
        # 1. Look for a common weapon
        common_weapon = await db.itemdefinition.find_first(
            where={
                "type": "WEAPON",
                "rarity": "COMMON"
            }
        )
        
        # 2. Look for an Epic item (Guardian's Blade or similar)
        epic_weapon = await db.itemdefinition.find_first(
            where={
                "type": "WEAPON",
                "rarity": "EPIC"
            }
        )
        
        # 3. Look for a consumable
        consumable = await db.itemdefinition.find_first(
            where={
                "type": "CONSUMABLE"
            }
        )

        # 4. Look for a Rare item
        rare_item = await db.itemdefinition.find_first(
            where={
                "rarity": "RARE"
            }
        )
        
        items_to_add = []
        
        if common_weapon:
            items_to_add.append({
                "itemId": common_weapon.id,
                "currencyType": "GOLD",
                "price": 250,
                "stock": None,
                "requiredLevel": 1
            })
            
        if epic_weapon:
            items_to_add.append({
                "itemId": epic_weapon.id,
                "currencyType": "GOLD",
                "price": 4500,
                "stock": 1,
                "requiredLevel": 20
            })
            
        if consumable:
            items_to_add.append({
                "itemId": consumable.id,
                "currencyType": "GOLD",
                "price": 500,
                "stock": 10,
                "requiredLevel": 1
            })
            
        if rare_item and rare_item.id not in [i["itemId"] for i in items_to_add]:
            items_to_add.append({
                "itemId": rare_item.id,
                "currencyType": "TOWER_TOKENS",
                "price": 100,
                "stock": 3,
                "requiredLevel": 10
            })
            
        if not items_to_add:
            print("No items found in ItemDefinition to add to shop! Run seed_items.py first.")
            return
            
        # Clean existing shop items first (optional, but good for MVP seeding)
        await db.shopitem.delete_many()
        
        for item_data in items_to_add:
            shop_item = await db.shopitem.create(data=item_data)
            print(f"Created Shop Item for ItemDef ID {item_data['itemId']} with price {item_data['price']} {item_data['currencyType']}")
            
        print("Shop seeding complete!")
        
    except Exception as e:
        print(f"Error seeding shop: {e}")
    finally:
        await db.disconnect()

if __name__ == '__main__':
    asyncio.run(main())
