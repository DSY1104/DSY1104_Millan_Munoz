/**
 * Quick Start Guide for User Mockup System
 */

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║           USER MOCKUP SYSTEM - QUICK START GUIDE             ║
╔═══════════════════════════════════════════════════════════════╗

📦 4 Mock Users Available:

  1️⃣  Alex Rodriguez (alexgamer95)
     Level: Gold (7,500 points)
     Style: Casual RPG/Strategy gamer
     Location: Santiago, RM
     Discount: NO
     
  2️⃣  María González (mariagamer)  
     Level: Platinum (15,420 points)
     Style: Pro FPS/Competitive & Streamer
     Location: Valparaíso
     Discount: NO
     
  3️⃣  Carlos Silva (carloslevel)
     Level: Silver (3,200 points)
     Style: Indie/Retro collector
     Location: Concepción, Biobío
     Discount: NO

  4️⃣  Pedro Martínez (pedro.duoc@duoc.cl) �
     Level: Bronze (850 points)
     Style: Student FPS gamer
     Location: Santiago, RM
     Discount: YES - 20% DUOC LIFETIME DISCOUNT

�🎮 CONSOLE COMMANDS:

  Switch to User 1 (Alex - No discount):
    > switchToUser(1)
    
  Switch to User 2 (María - No discount):
    > switchToUser(2)
    
  Switch to User 3 (Carlos - No discount):
    > switchToUser(3)

  Switch to User 4 (Pedro - DUOC 20% discount):
    > switchToUser(4)
    
  Who am I?:
    > whoAmI()
    
  Logout current user:
    > logoutUser()

📍 TEST THE PROFILE PAGE:
  
  1. Navigate to /profile
  2. Open browser console (F12)
  3. Run: switchToUser(2)
  4. See María's data load
  5. Edit some fields and save
  6. Switch users to see different data

🛒 TEST THE DISCOUNT FEATURE:
  
  1. Add products to cart (/cart)
  2. Login with User 4 (DUOC email)
  3. See 20% discount applied automatically!
  4. Compare with non-DUOC users (1, 2, 3)

📚 DOCUMENTATION:
  
  See USER_MOCKUP_README.md for complete details

🔑 Default Password: demo123 (all users)

╚═══════════════════════════════════════════════════════════════╝
`);
